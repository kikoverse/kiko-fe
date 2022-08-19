import utilsTools from "@utils/tool";
/* eslint-disable */
export default (app) => {
  app.directive("unsold-nft-url", {
    mounted(el, binding) {
      if (binding.value.isUnSoldNft && binding.value.url) {
        utilsTools.getImgTruePath(binding.value.url).then((res) => {
          el.src = res;
        });
      }
    },
  });
  app.directive("img-lazy-load", {
    mounted(el, binding) {},
  });
  app.directive("image", {
    mounted(el, binding) {
      let placeholderImage = el.getAttribute("default-img");
      let defaultImage = el.getAttribute("default-img");
      let errorImage = el.getAttribute("error-img");

      el.setAttribute("src", defaultImage || placeholderImage);

      let realImageUrl = binding.value;
      if (realImageUrl) {
        utilsTools
          .imageisExist(realImageUrl)
          .then(() => {
            el.setAttribute("src", realImageUrl);
          })
          .catch(() => {
            el.setAttribute("src", errorImage || placeholderImage);
          });
      }
    },
  });
};
