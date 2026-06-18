# ZenMind Website

ZenMind 官网前端仓库，用于构建并发布 `www.zenmind.cc` 的双语官网。

## 1. 项目定位

`website` 只负责官网前端展示和登录 UI。真实认证 API 由同级 `../server` 项目提供。

当前职责边界：

- 官网首页与 Desktop 下载入口展示
- 中英文双语路由
- 文档、新闻、市场页面
- GitHub 与官方 deploy 入口引导
- `/login` 统一认证入口 UI

不负责的内容：

- `/install/*.sh` 脚本源码维护
- release manifest / index 生成
- 服务器发布脚本与 release 编排
- Go App Server 认证实现
- MySQL 用户与会话存储
- 后端与 MySQL 的 Compose 编排

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

登录页默认通过 `VITE_API_BASE=/api` 调用后端。容器部署时，项目内的 nginx 会把普通 `/api` 代理到共享 Docker 网络里的 `zenmind-official-server:8080`，并只对 `/api/auth/sso/session` 启用 authentik forward auth。

生产 canonical host 是 `www.zenmind.cc`。裸域 `zenmind.cc` 只作为入口保留，nginx 会用 `308` 跳转到 `https://www.zenmind.cc$request_uri`，确保 SSO 只匹配 authentik 的 `https://www.zenmind.cc` Provider。

### 容器部署

官网容器使用项目内 `compose.yml` 部署。它会加入外部专用网络 `zenmind-official-net`，需要先创建一次：

```bash
docker network create zenmind-official-net
docker compose up --build
```

默认暴露 `80:80`，可通过 `WEBSITE_PORT` 覆盖宿主机端口：

```bash
WEBSITE_PORT=8081 docker compose up --build
```

生产部署需要设置 `SSO_BRIDGE_TOKEN`，并与后端服务的同名变量保持一致。如果 authentik outpost 不在默认的 `http://authentik-server:9000`，通过 `AUTHENTIK_OUTPOST_UPSTREAM` 覆盖：

```bash
SSO_BRIDGE_TOKEN=<shared-secret> AUTHENTIK_OUTPOST_UPSTREAM=http://authentik-server:9000 docker compose up --build
```

## 3. 当前路由

中文：

- `/`
- `/download`
- `/documents`
- `/news`
- `/login`

English:

- `/en`
- `/en/download`
- `/en/documents`
- `/en/news`
- `/en/login`

市场入口由官网 Nginx 挂载到独立市场站：

- `/market/`
- `/market/?lang=en`

## 4. 内容与数据维护

当前前端事实源集中在以下文件：

- `src/site-data.js`
  - 维护路由映射
  - 维护官网文案
- 维护 `externalLinks` 与 Desktop 平台静态文案
- `src/App.jsx`
  - 维护页面结构、路由映射与复用组件
- `src/styles.css`
  - 维护字体、配色、布局、响应式与动效

安装入口策略：

- 官网仍展示 macOS、Windows 与 Linux 的 Desktop 安装入口状态
- macOS 与 Windows 的当前版本、下载地址、文件大小和校验值来自后端 `GET /api/installers`
- 首页与下载页复用同一份动态 installer catalog
- 官网只展示下载入口与说明，不再把安装脚本作为仓库产物维护

## 5. 与 zenmind-deploy 的关系

官网与部署仓库的协作方式如下：

- `website` 负责公开页面、品牌表达和登录 UI
- `server` 负责认证 API、用户与会话存储
- `website` 与 `server` 各自提供项目内 `compose.yml`，并通过 `zenmind-official-net` 联通
- `zenmind-deploy` 负责安装脚本生成、release 产物和更上层的发布编排
- 当安装入口或 deploy 流程变化时，官网只需要更新文案与链接常量

当前代码中为 deploy 预留了统一入口：

- `externalLinks.deployDocs`
- `externalLinks.deployRepo`

如果后续 deploy 的公开入口地址变化，只需修改 `src/site-data.js` 中对应常量。

## 6. 开发约定

- 新增或修改官网文案时，优先更新 `src/site-data.js`
- 保持首页主导的信息结构，不再恢复独立 `Architecture` 页面
- 官网只负责说明、引导、登录 UI 与官网容器入口；后端与发布脚本不要带回本仓库
- 动效需兼容 `prefers-reduced-motion`
- 修改页面后至少执行一次 `npm run build`

## 7. 验证建议

发布前建议检查：

```bash
npm run build
docker compose config
```

确认：

- 中英文 10 个页面入口可构建
- 首页首屏能直接看到 Desktop 下载入口
- `/login` 登录 UI 构建通过，并只依赖 `VITE_API_BASE`

# zenmind-website
