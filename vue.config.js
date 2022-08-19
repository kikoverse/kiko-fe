const path = require("path");
const devServer = require("./src/scripts/devServer");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
// const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
// const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// https://github.com/antfu/unplugin-vue-components#readme
const unpluginVueComponents = require("unplugin-vue-components/webpack");

// https://staven630.github.io/vue-cli4-config/
function resolve(dir) {
  return path.join(__dirname, dir);
}

const isProduction = process.env.NODE_ENV === "production";

const plugins = isProduction
  ? [
      new CompressionWebpackPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240, // 只有大小大于该值的资源会被处理 10240
        minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
      }),
      new UglifyJsPlugin({
        uglifyOptions: {
          //生产环境自动删除console
          // compress: {
          //   drop_debugger: true,
          //   drop_console: true,
          //   dead_code: true,
          //   pure_funcs: ["console.log"], //移除console
          // },
        },
        sourceMap: false,
        parallel: true,
      }),
      unpluginVueComponents,
    ]
  : [
      // new ImageminWebpWebpackPlugin(),
      unpluginVueComponents,
    ];

const cssConfig = isProduction
  ? {
      modules: {
        mode: "local",
        localIdentName: "kiko__[hash:base64:8]",
      },
    }
  : {};

module.exports = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  productionSourceMap: true,
  devServer: {
    ...devServer(),
  },

  chainWebpack: (config) => {
    // alias
    config.resolve.alias
      .set("@src", resolve("src"))
      .set("@utils", resolve("src/utils"))
      .set("@components", resolve("src/components"))
      .set("@FlyUI", resolve("src/FlyUI"))
      .set("@api", resolve("src/api"))
      .set("@router", resolve("src/router"))
      .set("@utils", resolve("src/utils"))
      .set("@views", resolve("src/views"))
      .set("@store", resolve("src/store"))
      .set("@styles", resolve("src/styles"))
      .set("@wallet", resolve("src/wallet"))
      .set("@i18n", resolve("src/i18n"))
      .set("@hooks", resolve("src/hooks"))
      .set("@constants", resolve("src/constants"));

    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
    // image
    // if (isProduction) {
    // config.module
    //   .rule("images")
    //   .exclude.add(resolve("src/icons"))
    //   .end()
    //   .use("image-webpack-loader")
    //   .loader("image-webpack-loader")
    //   .options({
    //     mozjpeg: { progressive: true, quality: 65 },
    //     optipng: { enabled: true },
    //     pngquant: { quality: [0.65, 0.9], speed: 4 },
    //     gifsicle: { interlaced: false },
    //     webp: { quality: 75 },
    //   });
    // }

    // webpack-bundle-analyzer
    if (isProduction) {
      // config
      //   .plugin("webpack-bundle-analyzer")
      //   .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
      // lodash 这里build后出问题
      // t is not a function 怀疑是和vue-i18n冲突
      // config.plugin("loadshReplace").use(new LodashModuleReplacementPlugin());
    }
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto",
        },
      ],
    },
    plugins: plugins,
  },
  css: {
    extract: false,
    sourceMap: false,
    loaderOptions: {
      scss: {
        prependData: `
        @import "@styles/variables.scss";
        @import "@styles/_vars.scss";
        `,
      },
      css: cssConfig,
    },
    requireModuleExtension: true,
  },
};
