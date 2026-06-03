# ZenMind Website

ZenMind 官网前端仓库，用于构建并发布 `www.zenmind.cc` 的双语官网。

## 1. 项目定位

`website` 只负责官网前端展示和登录 UI。真实认证 API 由同级 `../server` 项目提供。

当前职责边界：

- 官网首页与 Desktop 下载入口展示
- 中英文双语路由
- 文档、新闻、市场页面
- GitHub 与官方 deploy 入口引导
- `/login` 账号密码登录 UI

不负责的内容：

- `/install/*.sh` 脚本源码维护
- release manifest / index 生成
- 服务器发布与部署
- Go App Server 认证实现
- MySQL 用户与会话存储
- 跨项目 Docker Compose 编排

后端实现位于同级 `../server` 项目。

## 2. 本地开发

### 前置要求

- Node.js 20+
- npm 10+

### 启动开发环境

```bash
npm install
npm run dev
```

### 生产构建

```bash
npm run build
```

构建产物输出到 `dist/`。

登录页默认通过 `VITE_API_BASE=/api` 调用后端。生产环境需要由外部网关或部署平台把 `/api` 转发到 `server` 服务。

## 3. 当前路由

中文：

- `/`
- `/documents`
- `/news`
- `/market`
- `/login`

English:

- `/en`
- `/en/documents`
- `/en/news`
- `/en/market`
- `/en/login`

## 4. 内容与数据维护

当前前端事实源集中在以下文件：

- `src/site-data.js`
  - 维护路由映射
  - 维护官网文案
- 维护 `externalLinks` 与 `desktopInstallers`
- `src/App.jsx`
  - 维护页面结构、路由映射与复用组件
- `src/styles.css`
  - 维护字体、配色、布局、响应式与动效

安装入口策略：

- 官网仍展示 macOS、Windows 与 Linux 的 Desktop 安装入口状态
- 首页复用同一份 `desktopInstallers`
- 官网只展示下载入口与说明，不再把安装脚本作为仓库产物维护

## 5. 与 zenmind-deploy 的关系

官网与部署仓库的协作方式如下：

- `website` 负责公开页面、品牌表达和登录 UI
- `server` 负责认证 API、用户与会话存储
- `zenmind-deploy` 负责安装脚本生成、release 产物、官网静态发布和服务器部署
- 当安装入口或 deploy 流程变化时，官网只需要更新文案与链接常量

当前代码中为 deploy 预留了统一入口：

- `externalLinks.deployDocs`
- `externalLinks.deployRepo`

如果后续 deploy 的公开入口地址变化，只需修改 `src/site-data.js` 中对应常量。

## 6. 开发约定

- 新增或修改官网文案时，优先更新 `src/site-data.js`
- 保持首页主导的信息结构，不再恢复独立 `Architecture` 页面
- 官网只负责说明、引导和登录 UI；后端与发布编排不要带回本仓库
- 动效需兼容 `prefers-reduced-motion`
- 修改页面后至少执行一次 `npm run build`

## 7. 验证建议

发布前建议检查：

```bash
npm run build
```

确认：

- 中英文 10 个页面入口可构建
- 首页首屏能直接看到 Desktop 下载入口
- `/login` 登录 UI 构建通过，并只依赖 `VITE_API_BASE`

# zenmind-website
