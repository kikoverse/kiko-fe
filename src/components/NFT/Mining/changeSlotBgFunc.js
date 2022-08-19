import NORMAL_IMG from "../../../assets/nft/mining-nft-slot.png";
import HOVER_IMG from "../../../assets/nft/mining-nft-slot-hover.png";
import NFT_IMG from "../../../assets/nft/mining-nft-slot-hasnft.png";
import NORMAL_IMG_EN from "../../../assets/nft/mining-nft-slot-en.png";
import HOVER_IMG_EN from "../../../assets/nft/mining-nft-slot-hover-en.png";

const changeSlotBgFunc = (state) => {
  const enterNFTSlot = (index, hasNFT, flag) => {
    if (hasNFT && flag) {
      state.slotDOMs[index].style.backgroundImage = `url(${HOVER_IMG})`;
      state.shadowDOMs[index].style.display = "block";
      return;
    }
    if (!hasNFT && flag) {
      if (state.currLang === "en") {
        state.slotDOMs[index].style.backgroundImage = `url(${HOVER_IMG_EN})`;
        return;
      }
      state.slotDOMs[index].style.backgroundImage = `url(${HOVER_IMG})`;
      return;
    }
    if (!hasNFT && !flag) {
      if (state.currLang === "en") {
        state.slotDOMs[index].style.backgroundImage = `url(${NORMAL_IMG_EN})`;
        return;
      }
      state.slotDOMs[index].style.backgroundImage = `url(${NORMAL_IMG})`;
      return;
    }
    if (hasNFT && !flag) {
      state.slotDOMs[index].style.backgroundImage = `url(${NFT_IMG})`;
      state.shadowDOMs[index].style.display = "none";
      return;
    }
  };

  const setSlotBg = (hasNFT) => {
    if (hasNFT) {
      return {
        "background-image": `url(${NFT_IMG})`,
      };
    }
    if (state.currLang === "en") {
      return {
        "background-image": `url(${NORMAL_IMG_EN})`,
      };
    } else {
      return {
        "background-image": `url(${NORMAL_IMG})`,
      };
    }
  };

  return {
    enterNFTSlot,
    setSlotBg,
  };
};

export default changeSlotBgFunc;
