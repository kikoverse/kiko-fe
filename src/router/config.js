import Layout from "../layout/Index.vue";
const routes = [
  {
    component: Layout,
    redirect: () => {
      return {
        name: "home",
      };
    },
    children: [
      {
        path: "/",
        component: () => import("@views/Home/Index.vue"),
        name: "home",
        meta: { title: "首页", url: "/" },
      },
      {
        path: "/swap",
        component: () => import("@views/Swap/Index.vue"),
        name: "swap",
        meta: { title: "兑换", url: "/swap", bg: "swap" },
      },
      {
        path: "/liquidity",
        component: () => import("@views/Liquidity/Index.vue"),
        name: "liquidity",
        meta: {
          title: "流动性",
          url: "/liquidity",
          bg: "liquidity",
        },
      },
      {
        path: "/nftblindbox",
        component: () => import("@views/NFT/BlindBox/Index.vue"),
        name: "nftblindbox",
        meta: {
          title: "盲盒",
          url: "/nftblindbox",
          bg: "nft",
        },
      },
      {
        path: "/createNFT",
        component: () => import("@views/NFT/CreateNft/nftCeate.vue"),
        name: "createNft",
        meta: {
          title: "createNft",
          url: "/createNft",
          bg: "nft",
        },
      },
      {
        path: "/createCollection",
        component: () => import("@views/NFT/CreateNft/Index.vue"),
        name: "createCollection",
        meta: {
          title: "createCollection",
          url: "/createCollection",
          bg: "nft",
        },
      },
      {
        path: "/nftgallery",
        component: () => import("@views/NFT/BlindBox/Gallery.vue"),
        name: "nftgallery",
        meta: {
          title: "陈列室",
          url: "/nftgallery",
        },
      },
      {
        path: "/PersonalGallery",
        component: () => import("@views/NFT/BlindBox/PersonalGallery.vue"),
        name: "PersonalGallery",
        meta: {
          title: "陈列室",
          url: "/PersonalGallery",
        },
      },
      {
        path: "/GalleryDetail",
        component: () => import("@views/NFT/BlindBox/GalleryDetail.vue"),
        name: "GalleryDetail",
        meta: {
          title: "陈列室详情",
          url: "/GalleryDetail",
        },
      },
      {
        path: "/nftblindbox/:id",
        component: () => import("@views/NFT/BlindBox/Detail.vue"),
        name: "nftblindboxdetail",
        meta: {
          title: "盲盒",
          url: "/nftblindbox/:id",
          bg: "nft",
        },
      },
      {
        path: "/nftbuyback",
        component: () => import("@views/NFT/BuyBack/Index.vue"),
        name: "nftbuyback",
        meta: { title: "平台回购", url: "/nftbuyback", bg: "nft" },
      },
      {
        path: "/nftcollection/:tabIndex",
        component: () => import("@views/NFT/Collection/Index.vue"),
        name: "nftcollection",
        meta: {
          title: "我的NFT",
          affix: true,
          url: "/nftcollection",
          bg: "nft",
        },
      },
      {
        path: "/nftmarket",
        component: () => import("@views/NFT/Market/Index.vue"),
        name: "nftmarket",
        meta: { title: "市场", url: "/nftmarket", bg: "nft" },
      },
      {
        path: "/nftcollectiondetail",
        component: () => import("@views/NFT/Collection/Detail.vue"),
        name: "nftcollectiondetail",
        meta: {
          title: "我的NFT详情",
          url: "/nftcollectiondetail",
          bg: "nft",
        },
      },
      {
        path: "/myCollectionDetail",
        component: () => import("@views/NFT/Collection/myCollectionDetail.vue"),
        name: "myCollectionDetail",
        meta: {
          title: "我的NFT详情",
          url: "/myCollectionDetail",
          bg: "nft",
        },
      },
      {
        path: "/nftmarketdetail",
        component: () => import("@views/NFT/Market/Detail.vue"),
        name: "nftmarketdetail",
        meta: {
          title: "市场详情",
          url: "/nftmarketdetail",
          bg: "nft",
        },
      },
      {
        path: "/nftbuybackdetail",
        component: () => import("@views/NFT/BuyBack/Detail.vue"),
        name: "nftbuybackdetail",
        meta: {
          title: "平台回购详情",
          bg: "nft",
          url: "/nftbuybackdetail",
        },
      },
      {
        path: "/nftmining",
        component: () => import("@views/NFT/Mining/Index.vue"),
        name: "nftmining",
        meta: {
          title: "挖矿",
          url: "/nftmining",
        },
      },
      {
        path: "/info",
        component: () => import("@views/Info/Index.vue"),
        name: "info",
        meta: {
          title: "行情",
          bg: "nft",
          url: "/info",
        },
      },
      {
        path: "/kgstarter",
        component: () => import("@views/KgStarter/Index.vue"),
        name: "kgstarter",
        meta: {
          title: "KGStarter",
          url: "/kgstarter",
        },
      },
      {
        path: "/metaverse",
        component: () => import("@views/Metaverse/Index.vue"),
        name: "metaverse",
        meta: {
          title: "K-Avatar",
          url: "/metaverse",
        },
      },
      {
        path: "/aptosPreheat",
        component: () => import("@views/AptosPreheat/Index.vue"),
        name: "aptosPreheat",
        meta: {
          title: "aptosPreheat",
          url: "/aptosPreheat",
        },
      },
    ],
  },
];
export default routes;
