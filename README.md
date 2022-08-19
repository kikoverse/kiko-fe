# 开始

- node 环境
- chrome + starmask 插件
- 安装依赖 yarn
- 本地 yarn serve(dev) 或 yarn serve stage(测试)

# 打包

- bulid-stage 测试环境
- build 生产环境

# 分支

- master 主网
- test 测试分支

# 配置文件

.env 文件修改一定要慎重

- .env 所有环境公用变量
- .env.development 本地开发环境变量
- .env.production 生产环境打包（一定要慎重修改！！！）
- .env-stagedev 本地开发使用， 测试环境数据
- .env-stageprod 测试环境使用，生产数据和生产环境变量打包

# Note

---

#### 钱包交互成功数据状态对不上

链上交互会存在区块高度不一致、丢区块等问题。排查问题时，优先查看是否区块请求是否正常。

#### CI/CD

**暂无**。多个项目开发，如国际化、钱包链接等逻辑是复用的，考虑搭建脚手架提高开发效率。

#### 代码部署

**暂无**。项目打 tag 去发布，自动化部署，无论是发版还是回滚代码都会更安全和高效。

#### 页面白屏 控制台报错 unpected token : <

比对请求文件，发现报错的机器请求的 js 文件并不是最新的 build 文件。
js 本身已带 hash 保持唯一性，大概率是 cdn(couldflare)缓存导致。

#### 控制台报错找不某个 hash.js。

先去线上服务器查找是否有该 js 文件，存在 js 是 cdn 缓存问题，清掉所有缓存。

#### build 后 Loading chunk {n} failed

原因同上。可用以下方法捕获错误监控，单纯的刷页面没用。

```js
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  if (isChunkLoadFailed) {
    window.location.reload();
    // router.replace(router.history.pending.fullPath);
  } else {
    console.log(error);
  }
});
```

#### lodash build 后报错

lodash-webpack-plugin 插件 build 问题先不用了。

```js
// https://zhuanlan.zhihu.com/p/349260482
// config.plugin("loadshReplace").use(new LodashModuleReplacementPlugin());
// 使用lodash-webpack-plugin会出问题
```

#### 中英文问题

目前 NFT 的 property 在前端也维护了一份字典，一旦属性有更新前端也要更改，会导致以下问题。

- 维护成本过大，链路太长。
- 不符合规范，动态配置的项，应该都由接口去处理
- 这些属性也用在 NFT 秀里面，接口的 key 匹配也很繁琐
- 另外国际化时建议都用英文、定义大模块 namespace 作为去前端去匹配词条的 key(目前早些功能都是中文)

#### swap 和 liquidity 问题

- 弹窗样式与 NFT 不搭配
- 没有去轮询查找上链的逻辑和交互，钱包交互后，只能被动等待结果手动刷新页面
