/* eslint-disable */
import * as types from "../../types/NFT/mining";
import miningAPI from "@api/nft/mining.js";
import Wallet from "@wallet";
import utilsNumber from "@utils/number";
import utilsTool from "@utils/tool.js";
import utilsFormat from "@utils/format";
import {
  WALLET_DIALOG_PARAMS,
  SECOND_DIALOG_PARAMS,
} from "@constants/dialog.js";
const INIT_SELECTOR_DIALOG_PARAMS = {
  dialogVisible: false,
  data: [],
};

const MY_SECOND_DIALOG_PARAMS = Object.assign({}, SECOND_DIALOG_PARAMS, {
  isShowTitle: true,
  nftName: null,
  dataParams: {
    draw: 0,
    gas: 0,
  },
});

const handleWalletCloseEvent = (commit) => {
  commit(types.SET_WALLET_DIALOG_PARAMS, {
    dialogVisible: false,
  });
  setTimeout(
    () => commit(types.SET_WALLET_DIALOG_PARAMS, WALLET_DIALOG_PARAMS),
    200
  );
};

const handleSecondCloseEvent = (commit) => {
  commit(types.SET_SECOND_DIALOG_PARAMS, {
    dialogVisible: false,
  });
  setTimeout(() => {
    commit(types.SET_SECOND_DIALOG_PARAMS, MY_SECOND_DIALOG_PARAMS);
  }, 300);
};

const listRender = new Array(5).fill("").map(() => {
  return {
    hasNFT: false,
  };
});

const StoreNFTMining = {
  namespaced: true,
  moduleName: "StoreNFTMining",
  state: {
    selectorDialogParams: INIT_SELECTOR_DIALOG_PARAMS,
    walletDialogParams: {
      ...WALLET_DIALOG_PARAMS,
    },
    secondDialogParams: MY_SECOND_DIALOG_PARAMS,
    nftStakeList: listRender,
    gasData: null,
    miningData: {},
    nftList: null,
    currOrder: null,
  },
  mutations: {
    [types.CLEAR_DATA](state) {
      state.selectorDialogParams = INIT_SELECTOR_DIALOG_PARAMS;
      state.walletDialogParams = WALLET_DIALOG_PARAMS;
      state.secondDialogParams = MY_SECOND_DIALOG_PARAMS;
      state.nftStakeList = listRender;
      state.gasData = null;
      state.miningData = {};
      state.nftList = null;
      state.currOrder = null;
    },
    [types.SET_CURRENT_NFT_ORDER](state, payload) {
      state.currOrder = payload;
    },
    [types.SET_MINING_DATA](state, payload) {
      state.miningData = Object.assign({}, state.miningData, payload);
    },
    [types.SET_SELECTOR_DIALOG_PARAMS](state, payload) {
      state.selectorDialogParams = Object.assign(
        {},
        state.selectorDialogParams,
        payload
      );
    },
    [types.SET_WALLET_DIALOG_PARAMS](state, payload) {
      state.walletDialogParams = Object.assign(
        {},
        state.walletDialogParams,
        payload
      );
    },
    [types.SET_SECOND_DIALOG_PARAMS](state, payload) {
      state.secondDialogParams = Object.assign(
        {},
        state.secondDialogParams,
        payload
      );
    },
    [types.SET_NFT_STAKE_LIST](state, list) {
      state.nftStakeList = list;
    },
    [types.SET_USER_NFT_LIST](state, list) {
      state.nftList = list;
    },
    [types.SET_GAS_DATA](state, data) {
      state.gasData = data;
    },
  },
  actions: {
    async drawMiningReward({ commit, state, rootState }) {
      const canDraw =
        state.miningData.currentReward &&
        utilsNumber.bigNum(state.miningData.currentReward).gt(0) &&
        state.gasData &&
        utilsNumber.bigNum(state.miningData.currentReward).gt(state.gasData);
      if (!canDraw) {
        commit(types.SET_WALLET_DIALOG_PARAMS, {
          dialogVisible: true,
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("操作失败"),
          failedBtnText: utilsFormat.computedLangCtx("确认"),
          isShowClose: true,
          successText: utilsFormat.computedLangCtx("nftmining.harvest-ok"),
          failedText: utilsFormat.computedLangCtx("nftmining.harvest-failed"),
          handleFailed: () => handleWalletCloseEvent(commit),
          handleClose: () => handleWalletCloseEvent(commit),
        });
        return;
      }
      try {
        commit(types.SET_WALLET_DIALOG_PARAMS, {
          dialogVisible: true,
          dialogText: utilsFormat.computedLangCtx("提取中"),
          isShowClose: false,
          successText: utilsFormat.computedLangCtx("nftmining.harvest-ok"),
          failedText: utilsFormat.computedLangCtx("nftmining.harvest-failed"),
        });
        const account = rootState.StoreWallet.accounts[0];
        const signHash = await Wallet.starMaskSign({
          account,
        });
        if (signHash === "error") {
          throw new Error("draw-error");
        }
        commit(types.SET_WALLET_DIALOG_PARAMS, {
          phase1: "succeed",
        });
        const res = await miningAPI.drawMiningReward(signHash);
        if (res.code === 200) {
          const txnHash = res.data;
          const handlerFunc = (list) => {
            return {
              data: list.filter(
                (d) => d.type_tag.indexOf("NFTHarvestEvent") > -1
              )[0].decode_event_data,
              status: "Executed",
            };
          };
          utilsTool
            .getChainEventsByTxnHash({ txnHash, handlerFunc })
            .then((res) => {
              console.log("====res=====", res);
              if (res.status === "Executed") {
                commit(types.SET_WALLET_DIALOG_PARAMS, {
                  phase2: "succeed",
                });
                setTimeout(() => {
                  commit(types.SET_WALLET_DIALOG_PARAMS, {
                    dialogStatus: "succeed",
                    dialogText: utilsFormat.computedLangCtx("操作成功"),
                    successBtnText: utilsFormat.computedLangCtx("确认"),
                    isShowClose: true,
                    miningData: {
                      draw: utilsNumber
                        .bigNum(utilsFormat.formatBalance(res.data.amount, 9))
                        .minus(utilsFormat.formatBalance(res.data.fee, 9))
                        .toString(),
                    },
                    handleSucceed: () => window.location.reload(),
                    handleClose: () => window.location.reload(),
                  });
                }, 1500);
              } else {
                throw new Error("draw-error");
              }
            });
        } else {
          throw new Error("draw-error");
        }
      } catch {
        commit(types.SET_WALLET_DIALOG_PARAMS, {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("提取收益失败"),
          failedBtnText: utilsFormat.computedLangCtx("确认"),
          isShowClose: true,
          handleFailed: () => handleWalletCloseEvent(commit),
          handleClose: () => handleWalletCloseEvent(commit),
        });
      }
      // try {
      //   const account = rootState.StoreWallet.accounts[0];
      //   commit(types.SET_WALLET_DIALOG_PARAMS, {
      //     dialogVisible: true,
      //     dialogText: utilsFormat.computedLangCtx("提取中"),
      //     isShowClose: false,
      //     phase1: null,
      //   });
      //   const res = await miningAPI.drawMiningReward(account);
      //   if (res.code === 200) {
      //     const txnHash = res.data;
      //     const resolveFunc = (list) => {
      //       return list.filter(
      //         (d) => d.type_tag.indexOf("NFTHarvestEvent") > -1
      //       )[0].decode_event_data;
      //     };
      //     utilsTool
      //       .getChainEventsByTxnHash({ txnHash, resolveFunc })
      //       .then((res) => {
      //         if (res.status === "Executed") {
      //           commit(types.SET_WALLET_DIALOG_PARAMS, {
      //             phase2: "succeed",
      //           });
      //           setTimeout(() => {
      //             commit(types.SET_WALLET_DIALOG_PARAMS, {
      //               dialogStatus: "succeed",
      //               dialogText: utilsFormat.computedLangCtx("操作成功"),
      //               successBtnText: utilsFormat.computedLangCtx("确认"),
      //               isShowClose: true,
      //               miningData: {
      //                 draw: utilsNumber
      //                   .bigNum(utilsFormat.formatBalance(res.data.amount, 9))
      //                   .minus(utilsFormat.formatBalance(res.data.fee, 9))
      //                   .toString(),
      //               },
      //               handleSucceed: () => window.location.reload(),
      //               handleClose: () => window.location.reload(),
      //             });
      //           }, 1500);
      //         } else {
      //           throw new Error("draw-error");
      //         }
      //       });
      //   }
      // } catch {
      // commit(types.SET_WALLET_DIALOG_PARAMS, {
      //   dialogStatus: "failed",
      //   dialogText: utilsFormat.computedLangCtx("提取收益失败"),
      //   failedBtnText: utilsFormat.computedLangCtx("确认"),
      //   isShowClose: true,
      //   handleFailed: () => handleWalletCloseEvent(commit),
      //   handleClose: () => handleWalletCloseEvent(commit),
      // });
      // }
    },
    // 放置NFT卡片
    async stakeNFT({ commit, rootState, state }, payload) {
      commit(types.SET_SELECTOR_DIALOG_PARAMS, {
        dialogVisible: false,
      });
      commit(types.SET_WALLET_DIALOG_PARAMS, {
        dialogVisible: true,
        dialogText: utilsFormat.computedLangCtx("nftmining.add-nft"),
        successText: utilsFormat.computedLangCtx("nftmining.add-nft-ok"),
        failedText: utilsFormat.computedLangCtx("nftmining.add-nft-failed"),
        isShowClose: false,
      });
      const params = {
        provider: rootState.StoreWallet.stcProvider,
        order: state.currOrder,
        ...payload,
      };
      try {
        const transactionHash = await Wallet.stakeNFT(params);
        if (transactionHash === "error") {
          throw new Error("stakeNFT-error");
        }
        commit(types.SET_WALLET_DIALOG_PARAMS, {
          phase1: "succeed",
        });
        utilsTool
          .getChainTransactionInfo({ txnHash: transactionHash })
          .then((res) => {
            if (res?.status === "Executed") {
              commit(types.SET_WALLET_DIALOG_PARAMS, {
                phase2: "succeed",
              });
              const handleSucceed = () => {
                window.location.reload();
              };
              setTimeout(() => {
                commit(types.SET_WALLET_DIALOG_PARAMS, {
                  dialogStatus: "succeed",
                  dialogText: utilsFormat.computedLangCtx(
                    "nftmining.add-nft-ok"
                  ),
                  successBtnText: utilsFormat.computedLangCtx("确认"),
                  isShowClose: true,
                  handleSucceed: handleSucceed,
                  handleClose: handleSucceed,
                });
              }, 1500);
            } else {
              throw new Error("stakeNFT-error");
            }
          });
      } catch {
        commit(types.SET_WALLET_DIALOG_PARAMS, {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("nftmining.add-nft-failed"),
          failedBtnText: utilsFormat.computedLangCtx("确认"),
          isShowClose: true,
          handleFailed: () => handleWalletCloseEvent(commit),
          handleClose: () => handleWalletCloseEvent(commit),
        });
      }
    },

    // 解押NFT
    async unStakeNFT({ commit, rootState }, payload) {
      commit(types.SET_WALLET_DIALOG_PARAMS, {
        dialogVisible: true,
        isShowClose: false,
        successText: utilsFormat.computedLangCtx("nftmining.remove-nft-ok"),
        failedText: utilsFormat.computedLangCtx("nftmining.remove-nft-failed"),
        dialogText: utilsFormat.computedLangCtx("nftmining.remove-nft"),
      });
      let params = {
        provider: rootState.StoreWallet.stcProvider,
        ...payload,
      };
      try {
        const transactionHash = await Wallet.unStakeNFT(params);
        if (transactionHash === "error") {
          throw new Error("unStakeNFT-error");
        }
        commit(types.SET_WALLET_DIALOG_PARAMS, {
          phase1: "succeed",
        });
        utilsTool
          .getChainTransactionInfo({ txnHash: transactionHash })
          .then((res) => {
            if (res?.status === "Executed") {
              commit(types.SET_WALLET_DIALOG_PARAMS, {
                phase2: "succeed",
              });
              const handleSucceed = () => {
                window.location.reload();
              };
              setTimeout(() => {
                commit(types.SET_WALLET_DIALOG_PARAMS, {
                  dialogStatus: "succeed",
                  dialogText: utilsFormat.computedLangCtx(
                    "nftmining.remove-nft-ok"
                  ),
                  successBtnText: utilsFormat.computedLangCtx("确认"),
                  isShowClose: true,
                  handleSucceed: handleSucceed,
                  handleClose: handleSucceed,
                });
              }, 1500);
            } else {
              throw new Error("unStakeNFT-error");
            }
          });
      } catch {
        commit(types.SET_WALLET_DIALOG_PARAMS, {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx(
            "nftmining.remove-nft-failed"
          ),
          failedBtnText: utilsFormat.computedLangCtx("确认"),
          isShowClose: true,
          handleFailed: () => handleWalletCloseEvent(commit),
          handleClose: () => handleWalletCloseEvent(commit),
        });
      }
    },

    async getStakeNFTList({ commit }, payload) {
      const res = await miningAPI.getStakeNFTList(payload);
      let data = new Array(5).fill("").map(() => {
        return {
          hasNFT: false,
        };
      });
      if (res.code === 200) {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].imageLink) {
            res.data[i].hasNFT = true;
          }
          data[res.data[i].order - 1] = Object.assign(
            {},
            { ...data[i] },
            { ...res.data[i] }
          );
        }
        commit(types.SET_NFT_STAKE_LIST, data);
      } else {
        commit(types.SET_NFT_STAKE_LIST, data);
      }
    },

    // 移除NFT
    removeNFT({ commit, dispatch }, payload) {
      commit(types.SET_SECOND_DIALOG_PARAMS, {
        imgParams: {
          url: payload.imageLink,
          width: "180px",
          height: "180px",
        },
        dialogVisible: true,
        confirmText: utilsFormat.computedLangCtx("确认"),
        cancelText: utilsFormat.computedLangCtx("取消"),
        isShowTitle: false,
        nftName: payload.nftName,
        handleClose: () => handleSecondCloseEvent(commit),
        handleCancel: () => handleSecondCloseEvent(commit),
        handleConfirm: () => {
          handleSecondCloseEvent(commit);
          dispatch("unStakeNFT", {
            order: payload.order,
            meta: payload.meta,
            body: payload.body,
          });
        },
      });
    },

    // 是否可提取收益
    canDrawReward({ commit, state, dispatch }) {
      commit(types.SET_SECOND_DIALOG_PARAMS, {
        dialogVisible: true,
        confirmText: utilsFormat.computedLangCtx("确认"),
        isShowClose: true,
        dataParams: {
          draw: state.miningData.currentReward,
          gas: state.gasData,
        },
        handleClose: () => handleSecondCloseEvent(commit),
        handleConfirm: () => {
          handleSecondCloseEvent(commit);
          dispatch("drawMiningReward");
        },
      });
    },

    async getMiningData({ commit }, userAddress) {
      const res = await miningAPI.getMiningData(userAddress);
      if (res.code === 200) {
        if (!userAddress) {
          commit(types.SET_MINING_DATA, {
            totalScore: res.data.totalScore,
            avgApr: res.data.avgApr,
            dailyTotalOutput: res.data.dailyTotalOutput,
          });
        } else {
          commit(types.SET_MINING_DATA, res.data);
        }
        return "ok";
      }
    },

    async getUserNFTList({ commit }, userAddress) {
      const res = await miningAPI.getUserNFTList(userAddress);
      if (res.code === 200) {
        commit(types.SET_USER_NFT_LIST, res.data);
      }
    },

    async getNFTfee({ commit }) {
      const res = await miningAPI.getNFTfee();
      if (res.code === 200) {
        commit(types.SET_GAS_DATA, res.data);
      }
    },
  },
};

export default StoreNFTMining;
