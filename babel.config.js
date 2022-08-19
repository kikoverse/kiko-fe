module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    "lodash",
    //https://github.com/vuejs/jsx-next/blob/dev/packages/babel-plugin-jsx/README-zh_CN.md
    "@vue/babel-plugin-jsx",
    // [
    //   "component",
    //   {
    //     libraryName: "element-plus",
    //     styleLibraryName: "theme-chalk",
    //   },
    // ],
    // [
    // "import",
    // {
    //   libraryName: "element-plus",
    //   styleLibraryName: "theme-chalk",
    // customStyleName: (name) => {
    //   name = name.slice(3);
    //   return `element-plus/packages/theme-chalk/src/${name}.scss`;
    // },
    //   },
    // ],
  ],
};
