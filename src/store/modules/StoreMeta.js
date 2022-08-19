/* eslint-disable */
import * as types from "../types/meta.js";
import metaApi from "@api/meta.js";
import utilsFormat from "@utils/format";
import utilsNumber from "@utils/number";
import utilsTool from "@utils/tool.js";
import Wallet from "@wallet/meta";
import collectionApi from "@api/nft/collection.js";
import CONSTANTS_TOKEN from "@constants/token.js";
import { WALLET_DIALOG_PARAMS } from "@constants/dialog.js";

const INIT_SELECTOR_DIALOG_PARAMS = {
  dialogVisible: false,
  data: [],
};

const INIT_CALL_BACK_DIALOG_PARAMS = {
  dialogVisible: false,
  text: "",
};

const INIT_CREAT_NFT_DIALOG_PARAMS = {
  dialogVisible: false,
};

const handleWalletCloseEvent = (commit) => {
  commit(types.SET_WALLET_DIALOG_PARAMS_STATUS, {
    dialogVisible: false,
  });
  setTimeout(
    () => commit(types.SET_WALLET_DIALOG_PARAMS_STATUS, WALLET_DIALOG_PARAMS),
    200
  );
};
const handleReload = () => {
  window.location.reload();
};

const StoreMeta = {
  namespaced: true,
  moduleName: "StoreMeta",
  state: {
    heroInfo: null,
    metaData: null,
    selectorDialogParams: INIT_SELECTOR_DIALOG_PARAMS,
    createNFTDialogParams: INIT_CREAT_NFT_DIALOG_PARAMS,
    dialogParams: WALLET_DIALOG_PARAMS,
    callBackDialogParams: INIT_CALL_BACK_DIALOG_PARAMS,
    selectedElementList: [],
    type: "not-generated", // generated not-generated
    composeNFT: [],
    allSplitNFT: [],
    allElements: null,
    loadingStatus: true,
    activeProperty: 0,
    module: "",
  },
  getters: {
    elementList: (state) => {
      if (state.currProto && state.allElements) {
        return state.allElements[state.currProto.desc.toLowerCase()];
      }
    },
    canGenerated: (state) => {
      if (state.selectedElementList.length > 0) {
        return true;
      }
      return false;
    },
    totalScore: (state) => {
      if (state.selectedElementList.length > 0) {
        return state.selectedElementList.reduce((prev, curr) => {
          return prev + curr.score;
        }, 0);
      }
      return 0;
    },
  },
  mutations: {
    [types.CLEAR_DATA](state) {
      state.heroInfo = null;
      state.metaData = null;
      state.selectorDialogParams = INIT_SELECTOR_DIALOG_PARAMS;
      state.dialogParams = WALLET_DIALOG_PARAMS;
      state.callBackDialogParams = INIT_CALL_BACK_DIALOG_PARAMS;
      state.selectedElementList = [];
      state.type = "not-generated";
      state.composeNFT = [];
      state.allSplitNFT = [];
      state.allElements = null;
      state.loadingStatus = true;
      state.createNFTDialogParams = INIT_CREAT_NFT_DIALOG_PARAMS;
      state.activeProperty = 0;
    },
    [types.SET_CREATE_DIALOG_PARAMS](state, payload) {
      state.createNFTDialogParams = Object.assign(
        {},
        INIT_CREAT_NFT_DIALOG_PARAMS,
        payload
      );
    },
    [types.SET_CURR_NFT_PROPERTY](state, payload) {
      state.currProto = payload;
    },
    [types.SET_USER_DATA](state, payload) {
      state[payload.key] = payload.data;
      // state.loadingStatus = [state.loadingStatus[0], true];
    },
    [types.SET_META_DATA](state, payload) {
      state.metaData = payload;
      state.loadingStatus = false;
      // state.loadingStatus = [true, state.loadingStatus[1]];
    },
    [types.SET_SELECTED_ELEMENT_LIST](state, payload) {
      state.selectedElementList = payload;
    },
    [types.CHANGE_MAIN_STATUS](state, payload) {
      const { type, data } = payload;
      state.type = type;
      if (payload.type === "generated") {
        state.heroInfo = data;
      } else {
        state.heroInfo = null;
        window.location.reload();
      }
    },
    [types.CHANGE_OPERATE_STATUS](state, payload) {
      state.type = payload;
    },
    [types.SET_SELECTOR_DIALOG_PARAMS](state, payload) {
      state.selectorDialogParams = Object.assign(
        {},
        state.selectorDialogParams,
        payload
      );
    },
    [types.SET_WALLET_DIALOG_PARAMS_STATUS](state, payload) {
      state.dialogParams = Object.assign({}, state.dialogParams, payload);
    },
    [types.SET_CALLBACK_DIALOG_PARAMS_STATUS](state, payload) {
      state.callBackDialogParams = Object.assign(
        {},
        state.callBackDialogParams,
        payload
      );
    },
    [types.SET_ACTIVE_PROPERTY](state, payload) {
      state.activeProperty = payload;
    },
    [types.SET_MODULE_NAME](state, payload) {
      state.module = payload;
    },
  },
  actions: {
    setSelectedElementList({ commit, state }, payload) {
      // 一个属性下只能选择一个;
      const { type, data } = payload;
      if (type === "add") {
        let list = state.selectedElementList;
        if (state.selectedElementList && state.selectedElementList.length > 0) {
          list = state.selectedElementList.filter((d) => d.type !== data.type);
        }
        commit(types.SET_SELECTED_ELEMENT_LIST, [
          ...list,
          Object.assign({}, payload.data, {
            maskOrder: state.currProto.maskOrder,
          }),
        ]);
      }
      if (type === "delete") {
        const list = state.selectedElementList.filter(
          (d) => d.type !== data.type
        );
        commit(types.SET_SELECTED_ELEMENT_LIST, list);
      }
    },
    async getNFTMeatInfo({ commit }) {
      const res = await metaApi.getNFTMeatInfo();
      if (res.code === 200) {
        let { elements, occupations, compositeFee } = res.data;
        occupations = occupations.map((d, i) => {
          return {
            ...d,
            value: d.desc,
          };
        });
        commit(types.SET_META_DATA, {
          occupations,
          property: elements,
          compositeFee,
        });
        commit(types.SET_CURR_NFT_PROPERTY, elements[0]);
      }
    },
    changeOperateStatus({ commit }, payload) {
      commit(types.CHANGE_OPERATE_STATUS, payload);
    },

    // 生成
    async generateNFTRole({ rootState, commit, state, dispatch }, payload) {
      commit(types.SET_WALLET_DIALOG_PARAMS_STATUS, {
        dialogVisible: true,
        isShowClose: false,
        dialogText: utilsFormat.computedLangCtx(
          "metaverse.generating character cards"
        ),
        successText: utilsFormat.computedLangCtx(
          "metaverse.generating character cards succeed"
        ),
        failedText: utilsFormat.computedLangCtx(
          "metaverse.generating character cards failed"
        ),
      });
      // 钱包账户不够
      const balances = rootState.StoreWallet.balances;
      if (
        !balances?.[CONSTANTS_TOKEN.STC] ||
        utilsNumber
          .bigNum(utilsFormat.formatBalance(balances[CONSTANTS_TOKEN.STC], 9))
          .lte(state.metaData.compositeFee)
      ) {
        commit(types.SET_WALLET_DIALOG_PARAMS_STATUS, {
          dialogText: utilsFormat.computedLangCtx(
            "metaverse.generating character cards failed"
          ),
          dialogStatus: "failed",
          failedBtnText: utilsFormat.computedLangCtx("确认"),
          handleFailed: () => handleWalletCloseEvent(commit),
          handleClose: () => handleWalletCloseEvent(commit),
        });
      }
      try {
        const composeData = await metaApi.compositeCard(
          Object.assign({}, payload, {
            elementList: payload.elementList.map((d) => {
              const id = Object.values(d.chainNftIds)[0];
              return {
                // 生成图片所需id
                id,
                eleName: d.eleName,
              };
            }),
          })
        );
        if (composeData.code === 200) {
          const { nftInfoId, image, description, name } = composeData.data;
          const { elementList, occupation, sex, customName } = payload;
          const { property } = state.metaData;
          const selectedElementList = elementList.map((d) => {
            const chainId = Object.keys(d.chainNftIds)[0];
            return {
              chainId,
              eleName: d.eleName,
            };
          });
          // 在所有的元素里获取所选择的并获取到位置key
          // 在从个人elementmap里获取chaind，value
          // {index:key, chainId: value}
          let filterElements = [];
          for (let i = 0; i < selectedElementList.length; i++) {
            // 挑选所选择素材的index 合约使用
            const t = property.filter(
              (d) => d.desc === selectedElementList[i].eleName
            )[0];
            filterElements.push(
              Object.assign({}, t, { ...selectedElementList[i] })
            );
          }
          const selectedIds = filterElements.map((d) => {
            return {
              chainId: d.chainId,
              index: d.id,
            };
          });
          const provider = rootState.StoreWallet.stcProvider;
          const moduleName = state.module;
          const params = {
            provider,
            info: {
              name,
              image,
              description,
              occupation,
              custom_name: customName,
              sex,
              selectedIds,
            },
            moduleName,
          };
          const txnHash = await Wallet.composeNFT(params);
          if (txnHash === "error") {
            throw new Error();
          }
          commit(types.SET_WALLET_DIALOG_PARAMS_STATUS, {
            phase1: "succeed",
          });
          utilsTool.getChainTransactionInfo({ txnHash }).then((res) => {
            if (res?.status === "Executed") {
              commit(types.SET_WALLET_DIALOG_PARAMS_STATUS, {
                phase2: "succeed",
              });
              const account = rootState.StoreWallet.accounts[0];
              dispatch("getNFTDataByType", {
                userAddress: account,
                nftType: "split",
              });
              const handleSucceed = () => {
                dispatch("getNFTMeatInfo");
                commit(
                  types.SET_WALLET_DIALOG_PARAMS_STATUS,
                  WALLET_DIALOG_PARAMS
                );
                commit(types.CHANGE_MAIN_STATUS, {
                  data: Object.assign({}, payload, {
                    imageUrl: image,
                  }),
                  type: "generated",
                });
                commit(types.SET_CREATE_DIALOG_PARAMS, {
                  dialogVisible: false,
                });
              };
              setTimeout(() => {
                commit(types.SET_WALLET_DIALOG_PARAMS_STATUS, {
                  dialogStatus: "succeed",
                  successBtnText: utilsFormat.computedLangCtx("确认"),
                  dialogText: utilsFormat.computedLangCtx(
                    "metaverse.generating character cards succeed"
                  ),
                  handleSucceed: handleSucceed,
                  handleClose: handleSucceed,
                  isUseCustomContent: false,
                  isShowClose: true,
                });
              }, 1500);
            } else {
              throw new Error(composeData);
            }
          });
        } else {
          throw new Error(composeData);
        }
      } catch (error) {
        console.log(error);
        commit(types.SET_WALLET_DIALOG_PARAMS_STATUS, {
          isShowClose: true,
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx(
            "metaverse.generating character cards failed"
          ),
          isUseCustomContent: false,
          failedBtnText: utilsFormat.computedLangCtx("确认"),
          handleFailed: () => handleWalletCloseEvent(commit),
          handleClose: () => handleWalletCloseEvent(commit),
        });
      }
    },

    // 获取NFT
    async getNFTDataByType({ commit }, payload) {
      const res = await metaApi.getNFTDataByType(payload);
      if (res.code === 200) {
        const { cardList, elementMap } = res.data;
        if (payload.nftType === "split") {
          let composeNFT = [];
          let totalNFT = [];
          if (cardList && cardList.length > 0) {
            composeNFT = cardList.filter((d) => d.original === false);
            totalNFT = cardList.map((d) => {
              return {
                ...d,
                isShow: false,
              };
            });
          }
          commit(types.SET_USER_DATA, {
            key: "composeNFT",
            data: composeNFT,
          });
          commit(types.SET_USER_DATA, {
            key: "allSplitNFT",
            data: totalNFT,
          });
        }
        if (payload.nftType === "element") {
          commit(types.SET_USER_DATA, {
            key: "allElements",
            data: elementMap,
          });
        }
      }
    },

    // 分解
    async breakDownNFTRole({ commit, rootState }, payload) {
      commit(types.SET_SELECTOR_DIALOG_PARAMS, { dialogVisible: false });
      commit(types.SET_WALLET_DIALOG_PARAMS_STATUS, {
        dialogVisible: true,
        isShowClose: false,
        dialogText: utilsFormat.computedLangCtx(
          "metaverse.disassembling character NFT"
        ),
        successText: utilsFormat.computedLangCtx(
          "disassembling character NFT succeeded"
        ),
        failedText: utilsFormat.computedLangCtx(
          "disassembling character NFT failed"
        ),
      });
      try {
        const nftDetail = await collectionApi.getNftDetail(
          payload.nftMeta,
          payload.nftBody,
          payload.chainId,
          payload.payToken
        );
        const metaArr = payload.nftMeta.split("::");
        const functionId = metaArr[0] + "::" + metaArr[1] + "::resolve_card";
        if (nftDetail.code === 200) {
          let { compositeElements } = nftDetail.data;
          compositeElements = compositeElements.map((d) => {
            return {
              key: utilsFormat.computedLangCtx(`nftproperty.${d.type}`),
              value: d.property,
            };
          });
          const params = {
            provider: rootState.StoreWallet.stcProvider,
            nftId: payload.chainId,
            functionId,
          };

          const txnHash = await Wallet.breakDownNFT(params);
          if (txnHash === "error") {
            throw new Error();
          }
          commit(types.SET_WALLET_DIALOG_PARAMS_STATUS, {
            phase1: "succeed",
          });
          utilsTool.getChainTransactionInfo({ txnHash }).then((res) => {
            if (res?.status === "Executed") {
              commit(types.SET_WALLET_DIALOG_PARAMS_STATUS, {
                phase2: "succeed",
              });

              setTimeout(() => {
                commit(types.SET_WALLET_DIALOG_PARAMS_STATUS, {
                  dialogStatus: "succeed",
                  successBtnText: utilsFormat.computedLangCtx("确认"),
                  isShowClose: true,
                  dialogText: utilsFormat.computedLangCtx(
                    "metaverse.disassembling character NFT succeeded"
                  ),
                  handleSucceed: handleReload,
                  handleClose: handleReload,
                  isUseCustomContent: true,
                  isUseStatusImg: false,
                  customContent: compositeElements,
                });
              }, 1500);
            } else {
              throw new Error();
            }
          });
        }
      } catch {
        commit(types.SET_WALLET_DIALOG_PARAMS_STATUS, {
          dialogVisible: true,
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx(
            "metaverse.disassembling character NFT failed"
          ),
          isUseCustomContent: false,
          failedBtnText: utilsFormat.computedLangCtx("确认"),
          handleFailed: () => handleWalletCloseEvent(commit),
          handleClose: () => handleWalletCloseEvent(commit),
        });
      }
    },
  },
};

export default StoreMeta;
