<template>
  <el-form
    :model="form"
    label-width="120px"
    class="formBox"
    label-position="top"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item :label="$t('系列封面')" prop="avatar">
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
              $t(
                "File types supported:{extension}，Max size:{size},aspect ratio:{ratio}",
                {
                  extension: "JPG, PNG, GIF, JPEG",
                  size: "5 MB",
                  ratio: "7/5-13/8",
                }
              )
            }}
          </div>
        </template>
      </el-upload>
    </el-form-item>
    <el-form-item :label="$t('名称')" prop="seriesName">
      <el-input
        v-model="form.seriesName"
        :placeholder="$t('请输入')"
        maxlength="32"
      />
    </el-form-item>
    <el-form-item :label="$t('描述')" prop="description">
      <el-input
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        v-model="form.description"
        :placeholder="$t('请输入')"
        maxlength="500"
      />
    </el-form-item>
    <el-form-item :label="$t('类别')" prop="contentType">
      <div class="select">
        <el-select
          v-model="form.contentType"
          :placeholder="$t('请选择')"
          popper-class="select-custom"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          />
        </el-select>
      </div>
    </el-form-item>
    <el-form-item :label="$t('相关连接')" prop="seriesUrl">
      <el-input
        :placeholder="$t('请输入')"
        v-model="form.seriesUrl"
        maxlength="500"
      />
    </el-form-item>
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
import {
  ElForm,
  ElFormItem,
  ElUpload,
  ElIcon,
  ElInput,
  ElMessage,
  ElSelect,
  ElOption,
} from "element-plus";
// import { ElMessage } from "element-plus";
import FlyButton from "../../../../FlyUI/FlyButton.vue";
import FlyWalletDialog from "@FlyUI/FlyWalletDialog.vue";
import { useRouter } from "vue-router";
import { Plus } from "@element-plus/icons-vue";
import {
  createAssetsList,
  getVerifycode,
} from "../../../../api/createcollection";
import { useStore } from "vuex";
import { WALLET_DIALOG_PARAMS } from "../../../../constants/dialog";
import { getSign } from "../../../../walletUtils/starMask";
import format from "@utils/format";
// do not use same name with ref
const form = reactive({
  seriesName: "",
  description: "",
  contentType: "",
  seriesUrl: "",
  avatar: "",
});
const dialogSetting = reactive({
  ...WALLET_DIALOG_PARAMS,
  dialogText: `正在创建`,
  successText: `创建成功`,
  failedText: `创建失败`,
  isShowClose: false,
});
const router = useRouter();
const store = useStore();
const imageUrl = ref("");
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
  seriesName: [
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
  contentType: [
    {
      required: true,
      message: format.computedLangCtx("此处必填"),
      trigger: "change",
    },
  ],
  seriesUrl: [
    {
      type: "url",
      message: format.computedLangCtx("请添加正确链接"),
      trigger: "change",
    },
  ],
});
const options = [
  {
    value: "Art",
    label: "Art",
  },
  {
    value: "Music",
    label: "Music",
  },
  {
    value: "Photography",
    label: "Photography",
  },
  {
    value: "Sports",
    label: "Sports",
  },
  {
    value: "Collectibles",
    label: "Collectibles",
  },
  {
    value: "Virtual worlds",
    label: "Virtual worlds",
  },
];
const ruleFormRef = ref();

const submit = async () => {
  if (!ruleFormRef.value) return;
  await ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        dialogSetting.dialogVisible = true;
        dialogSetting.dialogStatus = "ongoing";
        const resVerify = await getVerifycode({});
        let verifycode;
        if (resVerify.code == 200) {
          verifycode = await getSign(
            store.state.StoreWallet.accounts[0],
            resVerify.data
          );
        } else {
          throw resVerify.code;
        }
        const data = new FormData();
        const json = { chain: 1 };
        for (const name in form) {
          if (name !== "avatar") {
            json[name] = form[name];
          }
        }
        data.append("creatorAddress", store.state.StoreWallet.accounts[0]);
        data.append("seriesInfo", JSON.stringify(json));
        data.append("logoImage", form.avatar);
        data.append("verifyCode", verifycode);
        const res = await createAssetsList(data);
        if (res.code == 200) {
          dialogSetting.phase1 = "succeed";
          dialogSetting.phase2 = "succeed";
          setTimeout(() => {
            dialogSetting.isShowClose = true;
            dialogSetting.dialogStatus = "succeed";
          }, 5000);
        } else {
          dialogSetting.isShowClose = true;
          dialogSetting.dialogStatus = "failed";
        }
      } catch (error) {
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
    path: "/nftcollection/0",
  });
};
const handleFailed = () => {
  dialogSetting.dialogVisible = false;
};
const handleAvatarSuccess = (response, uploadFile) => {
  console.log(uploadFile);
  form.avatar = uploadFile.raw;
  imageUrl.value = URL.createObjectURL(uploadFile.raw);
};
const getFileWidthAndHeight = (file) => {
  return new Promise((resolve) => {
    let _URL = window.URL || window.webkitURL;
    let img = new Image();
    img.src = _URL.createObjectURL(file);
    img.onload = function () {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
  });
};
const beforeAvatarUpload = async (rawFile) => {
  const { width, height } = await getFileWidthAndHeight(rawFile);
  console.log(width / height);
  console.log(width / height < 1.62 && width / height > 1.42);
  if (
    !(
      rawFile.type == "image/jpeg" ||
      rawFile.type == "image/png" ||
      rawFile.type == "image/gif" ||
      rawFile.type == "image/jpg"
    )
  ) {
    ElMessage.error("Picture must be JPEG/JPG/PNG/GIF format!");
    setTimeout(() => {
      form.avatar = "";
      imageUrl.value = "";
    });

    return false;
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error("Avatar picture size can not exceed 5MB!");
    setTimeout(() => {
      form.avatar = "";
      imageUrl.value = "";
    });
    return false;
  } else if (width / height > 1.625 || width / height < 1.4) {
    setTimeout(() => {
      form.avatar = "";
      imageUrl.value = "";
    });
    ElMessage.error(
      "Avatar picture aspect ratio can not higher than 13/8 and not be lower than 7/5"
    );
    return false;
  }
  return true;
};
const HttpRequest = (data) => {
  form.avatar = data.file;
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
.select-custom {
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    color: $white;
    background: rgba(255, 255, 255, 0.1);
  }
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
</style>
