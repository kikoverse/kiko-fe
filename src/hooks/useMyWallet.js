import { computed, reactive, h } from "vue";
import Wallet from "../wallet/index";
import { isNil } from "lodash";
import { ElNotification } from "element-plus";
import utilsTool from "@utils/tool";
import CONSTANTS_STAR_MASK from "@constants/starmask";
import FlyButton from "@FlyUI/FlyButton.vue";
// import utilsRouter from "@utils/router.js";
import CONSTANTS_TOKENS from "@constants/token";
import utilsFormat from "@utils/format";

export default function connectLogic(store) {
  let state = reactive({
    accounts: computed(() => store.state.StoreWallet.accounts),
    walletStatus: computed(() => store.state.StoreWallet.walletStatus),
    provider: computed(() => store.state.StoreWallet.stcProvider),
    balances: computed(() => store.state.StoreWallet.balances),
    walletTimer: computed(() => store.state.StoreWallet.walletTimer),
  });
  // 网络切换
  const handleChainIdChange = (id) => {
    store.commit("StoreWallet/SET_WALLET_NET_WORK_ID", id);
  };
  // 账户切换
  const handleAccountsChange = (account) => {
    clearInterval(state.walletTimer);
    store.commit("StoreWallet/CHANGE_WALLET_TIMER_STATUS", null);
    window.location.reload();
    // account为空数组则认为是断开链接
    if (account.length === 0) {
      store.commit("StoreWallet/SET_WALLET_CONNECT_STATUS", "unConnected");
      // utilsRouter.push("/");
    } else {
      console.log("====handleAccountsChange====", state.accounts);
      store.dispatch("StoreWallet/setAccounts", []);
      store.dispatch("StoreWallet/setAccounts", account);
      getSTCBalance(state.provider);
      let timer = setInterval(() => getSTCBalance(state.provider), 10000);
      store.commit("StoreWallet/CHANGE_WALLET_TIMER_STATUS", timer);
      // 为啥不重刷页面

      // utilsRouter.push("/");
    }
  };

  const getSTCBalance = async (provider) => {
    const params = {
      provider: provider || state.provider,
      account: state.accounts[0],
    };
    const balance = await Wallet.getAccountBalance(params);
    if (!isNil(balance)) {
      store.commit("StoreWallet/SET_WALLET_BALANCE", {
        [CONSTANTS_TOKENS.STC]: balance,
      });
    }
  };
  /* eslint-disable */
  const renderAccount = computed(() => {
    const accounts = state.accounts;
    if (accounts && accounts.length > 0) {
      const account = accounts[0];
      return `${account.slice(0, 3)}...${account.slice(-3)}`;
    }
  });

  const isStarMaskInstalled = () => Wallet.checkStarMaskInstalled();

  const walletInit = async () => {
    const onboarding = computed(() => store.state.StoreWallet.onboarding);
    /* eslint-disable */
    if (!onboarding) {
      const onboard = Wallet.createStarMaskOnboarding();
      if (onboard) {
        store.dispatch("StoreWallet/setOnboarding", onboard);
      }
    }
    const stcProvider = Wallet.createStcProvider();
    store.dispatch("StoreWallet/setStcProvider", stcProvider);
    if (isStarMaskInstalled) {
      const chaind = await Wallet.getNetworkChainId();
      handleChainIdChange(chaind);
      window.starcoin &&
        window.starcoin.on("accountsChanged", (account) => {
          handleAccountsChange(account);
        });
      window.starcoin &&
        window.starcoin.on("chainChanged", (id) => {
          handleChainIdChange(id);
        });
    }
  };

  const connectWallet = async () => {
    const isStalled = isStarMaskInstalled();
    if (!isStalled) {
      unInstalled();
      return;
    }
    if (isStalled && state.walletStatus === "connected") {
      // 防止重复链接
      // 以免导致网站连接多个account
      // 出现余额和账户的变化跳动
      return;
    }
    const accounts = await Wallet.connect();
    store.dispatch("StoreWallet/setAccounts", accounts);
    const isStarMaskConnected = accounts && accounts.length > 0;
    if (isStarMaskConnected) {
      const permissions = await Wallet.getPermissions();
      const stcProvider = Wallet.createStcProvider();
      store.dispatch("StoreWallet/setStcProvider", stcProvider);
      getSTCBalance(stcProvider);
      clearInterval(state.walletTimer);
      store.commit("StoreWallet/CHANGE_WALLET_TIMER_STATUS", null);
      let timer = setInterval(() => getSTCBalance(state.provider), 10000);
      store.commit("StoreWallet/CHANGE_WALLET_TIMER_STATUS", timer);
      // 由于某些操作会导致账户余额发生改变，且变化不是及时的
      // 但目前starmask没有提供监听的方法
      // 只能前端去定时去查询
      store.commit("StoreWallet/SET_WALLET_CONNECT_STATUS", "connected");
    }
  };

  const unInstalled = () => {
    ElNotification({
      message: h(
        "div",
        {
          style: {
            position: "relative",
            "font-size": "14px",
            // color: "#FFFFFF",
          },
        },
        [
          h(
            "p",
            {
              style: {
                color: "#fba800",
                "font-weight": "500",
              },
            },
            "Install StarMask Please"
          ),
          // h(
          //   "p",
          //   {
          //     style: {
          //       color: "#fb8000",
          //       cursor: "pointer",
          //       "word-break": "break-all",
          //       "margin-top": "8px",
          //     },
          //     onClick: () => {
          //       utilsTool.openNewWindow(CONSTANTS_STAR_MASK.PLUGIN_URL);
          //     },
          //   },
          //   CONSTANTS_STAR_MASK.PLUGIN_URL
          // ),
          h(
            FlyButton,
            {
              type: "success_ghost",
              style: {
                padding: "10px 35px",
                // "margin-left": "200px",
                "margin-top": "20px",
                width: "auto",
              },
              onClick: () => {
                utilsTool.openNewWindow(CONSTANTS_STAR_MASK.PLUGIN_URL);
              },
            },
            () => utilsFormat.computedLangCtx("下载").value
          ),
        ]
      ),
      duration: 5000,
      offset: 100,
      showClose: false,
    });
    return;
  };

  return {
    connectWallet,
    handleAccountsChange,
    getSTCBalance,
    renderAccount,
    walletInit,
    isStarMaskInstalled,
    unInstalled,
  };
}
