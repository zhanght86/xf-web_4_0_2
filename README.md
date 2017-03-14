
# webpack-avalon2_xf #


- 然后请手动打开浏览器，在地址栏里输入`http://localhost:10086`，Duang！页面就出来了！

- 如果是端口号问题，请直接在package.json中修改所想要的端口号即可

- 如果想改变avalon引入（avalon.js替换为avalon.modern.js），请在webpack.config.js的159行处理

## CLI命令(npm scripts)
| 命令            | 作用&效果          |
| --------------- | ------------- |
| npm run clean-build     | 清空build代码 |
| npm run clean-node_modules     | 清空项目依赖 |
| npm run build     | 执行清空操作并build出一份生产环境的代码 |
| npm run build-dev     | 执行清空操作并build出一份开发环境的代码 |
| npm run dev-hrm   | 执行清空操作并运行项目（热更新） |

## 目录结构说明
```
├─dist # 编译后生成的所有代码、资源（虽然只是简单的从源目录迁移过来）
├─node_modules # 利用npm管理的所有包及其依赖
├─libs # 所有不能用npm管理的第三方库
├─package.json # npm的配置文件
├─webpack.config.js # 开发环境的webpack配置文件
├─npm-scripts # 开发环境的webpack辅助配置文件（包含清空dist和node_modules目录的配置文件）
└─src # 当前项目的源码
    ├─components # avalon组件存放地（只能有js）
    ├─html # 各个页面独有的部分（只有该页面的html）
    │  ├─aa # 业务模块
    │  │  └─first.html # 具体页面
    │  ├─bb # 业务模块
    │  │  ├─second.html # 具体页面
    │  └─cc # 业务模块
    │      ├─third.html # 具体页面
    ├─js # 各个页面独有的部分（入口js文件）
    │  ├─aa # 业务模块
    │  │  └─first.js # 具体js
    │  ├─bb # 业务模块
    │  │  ├─second.js # 具体js
    │  └─cc # 业务模块
    │      ├─third.js # 具体js
    ├─index.html # 单页面应用主页（模版）
    └─index.js # 单页面应用入口js文件（包括路由设置）
```
