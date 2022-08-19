<template>
  <el-form
    :model="form"
    label-width="120px"
    class="formBox"
    label-position="top"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item :label="$t('图片')" prop="avatar">
      <el-upload
        class="avatar-uploader"
        action="#"
        :http-request="HttpRequest"
        :show-file-list="false"
        drag
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        <template #tip>
          <div class="el-upload__tip">
            {{
              $t("File types supported:{extension}，Max size:{size}", {
                extension: "JPG, PNG, GIF, JPEG",
                size: "5 MB",
              })
            }}
          </div>
        </template>
      </el-upload>
    </el-form-item>
    <el-form-item :label="$t('名称')" prop="name">
      <el-input
        v-model="form.name"
        :placeholder="$t('请输入')"
        maxlength="32"
      />
    </el-form-item>
    <el-form-item :label="$t('描述')" prop="description">
      <el-input
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        :placeholder="$t('请输入')"
        maxlength="500"
        v-model="form.description"
      />
    </el-form-item>
    <el-form-item :label="$t('属性')" prop="attributes">
      <el-row
        :gutter="20"
        v-for="(item, index) in form.attributes"
        :key="item.key"
        class="properties"
      >
        <el-col :span="10">
          <el-input
            label="Type"
            :placeholder="$t('请输入属性名')"
            maxlength="50"
            v-model="item.attribute"
        /></el-col>
        <el-col :span="10">
          <el-input
            label="Name"
            :placeholder="$t('请输入属性值')"
            maxlength="50"
            v-model="item.value"
          />
        </el-col>
        <el-col :span="4">
          <el-button :disabled="form.attributes.length == 1" @click="Min(index)"
            >x</el-button
          >
        </el-col>
      </el-row>
    </el-form-item>
    <FlyButton @click="Add" type="dark">{{ $t("添加属性") }}</FlyButton>
    <div class="submit">
      <FlyButton @click="submit">{{ $t("创建") }}</FlyButton>
    </div>
  </el-form>
  <Fly-wallet-dialog
    :dialogParams="dialogSetting"
    @handleFailed="handleFailed"
    @handleClose="handleSucceed"
    @handleSucceed="handleSucceed"
  >
  </Fly-wallet-dialog>
</template>

<script setup>
import { reactive, ref } from "vue";
import FlyWalletDialog from "@FlyUI/FlyWalletDialog.vue";
import {
  ElForm,
  ElFormItem,
  ElUpload,
  ElIcon,
  ElInput,
  ElRow,
  ElCol,
  ElButton,
} from "element-plus";
// import { ElMessage } from "element-plus";
import FlyButton from "../../../../FlyUI/FlyButton.vue";
import { Plus } from "@element-plus/icons-vue";
import { createNft, getVerifycode } from "../../../../api/createcollection";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { getContractWidthSinger } from "../../../../walletUtils/stcContract";
import { WALLET_DIALOG_PARAMS } from "@constants/dialog.js";
import { getSign } from "../../../../walletUtils/starMask";
import format from "@utils/format";
// do not use same name with ref
const form = reactive({
  name: "",
  description: "",
  attributes: [{ attribute: "", value: "" }],
  nftImage: null,
});
const ruleFormRef = ref();
const dialogSetting = reactive({
  ...WALLET_DIALOG_PARAMS,
  dialogText: `正在铸造`,
  successText: `铸造成功`,
  failedText: `铸造失败`,
  isShowClose: false,
});
const route = useRoute();
const router = useRouter();
console.log(router);
const store = useStore();
const submit = async () => {
  if (!ruleFormRef.value) return;
  await ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        dialogSetting.dialogVisible = true;
        dialogSetting.dialogStatus = "ongoing";
        const res = await getVerifycode({});
        let verifycode;
        if (res.code == 200) {
          verifycode = await getSign(
            store.state.StoreWallet.accounts[0],
            res.data
          );
        } else {
          throw res.code;
        }
        const data = new FormData();
        const json = {
          chain: 1,
          name: form.name,
          groupId: route.query.groupId,
        };
        data.append("nftInfo", JSON.stringify(json));
        data.append("creatorAddress", store.state.StoreWallet.accounts[0]);
        data.append("nftImage", form.nftImage);
        data.append("attributes", JSON.stringify(form.attributes));
        data.append("verifyCode", verifycode);
        const resCreate = await createNft(data);

        if (resCreate.code == 200) {
          await getContractWidthSinger(
            store.state.StoreWallet.stcProvider,
            resCreate.data.contractAddress + "::" + resCreate.data.moduleName,
            "mint_with_image",
            [],
            () => {
              dialogSetting.phase1 = "succeed";
            },
            form.name,
            resCreate.data.imageUrl,
            form.description,
            resCreate.data.nftInfoId
          );

          dialogSetting.phase2 = "succeed";
          setTimeout(() => {
            dialogSetting.isShowClose = true;
            dialogSetting.dialogStatus = "succeed";
          }, 1500);
        } else {
          dialogSetting.isShowClose = true;
          dialogSetting.dialogStatus = "failed";
        }
      } catch (err) {
        dialogSetting.isShowClose = true;
        dialogSetting.dialogStatus = "failed";
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
const handleSucceed = () => {
  router.push({
    path: "/myCollectionDetail",
    query: { groupId: route.query.groupId },
  });
};
const handleFailed = () => {
  dialogSetting.dialogVisible = false;
};
const fileMustUpload = (rule, value, callback) => {
  if (imageUrl.value == "") {
    // 未上传文件
    callback(format.computedLangCtx("请上传文件"));
  }
  callback();
};
const rules = reactive({
  avatar: [
    {
      required: true,
      trigger: "change",
      validator: fileMustUpload,
    },
  ],
  name: [
    {
      required: true,
      message: format.computedLangCtx("此处必填"),
      trigger: "change",
    },
  ],
  description: [
    {
      required: true,
      message: format.computedLangCtx("此处必填"),
      trigger: "change",
    },
  ],
});
const imageUrl = ref("");

const handleAvatarSuccess = (response, uploadFile) => {
  form.nftImage = uploadFile.raw;
  imageUrl.value = URL.createObjectURL(uploadFile.raw);
};

const beforeAvatarUpload = () => {
  // if (rawFile.type !== 'image/jpeg') {
  //   ElMessage.error('Avatar picture must be JPG format!')
  //   return false
  // } else if (rawFile.size / 1024 / 1024 > 2) {
  //   ElMessage.error('Avatar picture size can not exceed 2MB!')
  //   return false
  // }
  return true;
};
const Add = () => {
  form.attributes.push({ attribute: "", value: "" });
};
const Min = (index) => {
  form.attributes.splice(index, 1);
};
const HttpRequest = (data) => {
  // // new 一个formdata 对象 将我们的参数和文件赋值进去
  // const formdata = new FormData();
  // formdata.append("file", data.file);
  // formdata.append("type", "img");
  form.nftImage = data.file;
  imageUrl.value = URL.createObjectURL(data.file);
};
</script>

<style lang="scss" scoped>
.formBox {
  width: 800px;
  margin: 0 auto;
  ::v-deep(.el-input__inner) {
    background-color: transparent;
  }
  ::v-deep(.el-textarea__inner) {
    background-color: transparent;
  }
  .submit {
    display: flex;
    justify-content: center;
  }
  .tip {
    color: #fff;
  }
}
.avatar {
  max-width: 400px;
}
.avatar-uploader {
  ::v-deep(.el-upload) {
    border: 1px dashed #fff;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    &:hover {
      border-color: var(--el-color-primary);
    }
  }
  ::v-deep(.el-icon) {
    &.avatar-uploader-icon {
      font-size: 28px;
      color: #fff;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.properties {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
