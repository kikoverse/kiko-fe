<script>
/* eslint-disable*/
import { h } from "vue";
import CONSTANTS_NFT from "@constants/nft.js";
// import loadGif from "../assets/nft/loading-c.gif";
// import loadGifWhiteBg from "../assets/nft/loading-c-w.gif";
export default {
  props: {
    gifType: {
      type: String,
      default: "light",
    },
  },
  setup(props) {
    // const gifImg = (type) => {
    //   if (type === "light") {
    //     return loadGif;
    //   } else if (type === "white") {
    //     return loadGifWhiteBg;
    //   }
    // };
    return () => {
      return h(
        "div",
        {
          style: {
            display: "flex",
            "justify-content": "center",
            "align-items": "center",
            "margin-top": "-20px",
          },
        },
        [
          h("img", {
            src: CONSTANTS_NFT.LOADING,
            style: {
              width: "130px",
            },
          }),
        ]
      );
    };
  },
};
</script>
