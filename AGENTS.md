# AGENTS.md

## 1. 项目概览

`zenmind-website` 是 ZenMind 的公网官网仓库，负责官网品牌展示、下载入口说明以及公开 FAQ / 隐私页面。

当前业务边界：

- 承载 `www.zenmind.cc` 官网
- 输出中英文静态页面
- 展示安装入口与官方链接
- 提供 FAQ 与隐私页
- 不承载业务 API
- 不承载登录态和产品后台
- 不维护安装脚本、发布脚本和服务器部署配置

安装、release、网站发布与服务器部署统一由 `zenmind-deploy` 负责。

## 2. 技术栈

- React 19
- React Router DOM 6
- Vite 7
- 原生 CSS
- 静态托管

## 3. 架构设计

项目采用“单前端应用 + 静态内容模型”的结构。

核心分层：

1. 页面与路由层
   - `src/App.jsx`
   - 定义页面结构、路由、导航、复制命令与 FAQ 等交互
2. 内容与站点契约层
   - `src/site-data.js`
   - 维护中英文文案、路由映射、外链与安装入口数据
3. 视觉系统层
   - `src/styles.css`
   - 维护字体、配色、布局、响应式与 reveal 动效
4. 静态公开资源层
   - `public/`
   - 包含 favicon 与静态错误页

系统边界：

- 官网根域名只做静态公开页面
- 官网负责安装入口展示，但不负责安装脚本源码
- 部署与发布资产不应重新放回本仓库

## 4. 目录结构

```text
zenmind-website/
  README.md
  AGENTS.md
  package.json
  vite.config.js
  index.html

  src/
    main.jsx
    App.jsx
    site-data.js
    styles.css

  public/
    favicon.svg
    404.html
    50x.html
```

目录职责：

- `src/`：站点源码与内容模型
- `public/`：原样拷贝到构建产物的公开静态文件
- `dist/`：构建产物目录，不作为事实源

## 5. 内容数据结构

本项目无数据库和后端 API。

当前核心静态数据定义在 `src/site-data.js`：

1. `routeMap`
   - 定义中英文页面路径
2. `externalLinks`
   - 维护官网使用的 GitHub 与 deploy 外链
3. `installEntries`
   - 维护三个平台的安装命令、平台说明与说明页链接
4. `languages`
   - 维护中英文 SEO、导航、首页、下载页、FAQ、隐私页文案

首页与下载页必须复用同一份 `installEntries`，避免命令分散维护。

## 6. 页面公开面

页面路由：

- `/`
- `/download`
- `/faq`
- `/privacy`
- `/en`
- `/en/download`
- `/en/faq`
- `/en/privacy`

本仓库不再定义 `Architecture` 页面，也不再维护 `/install/*.sh` 源码文件。

## 7. 开发要点

1. 文案与链接统一维护
   - 新增文案优先修改 `src/site-data.js`
   - 避免在组件内部散落硬编码链接与命令
2. 官网首页保持主导结构
   - 首屏优先展示价值主张与安装入口
   - 不要重新加入大量口号、架构页式内容或 Demo 占位
3. 官网与 deploy 明确分离
   - 安装脚本、release manifest、Nginx、Docker、Compose 不属于本仓库
   - 若 deploy 入口变化，只更新链接与说明，不在本仓库复制 deploy 逻辑
4. 可访问性
   - 兼容 `prefers-reduced-motion`
   - 确保导航、FAQ、复制按钮可通过键盘使用
5. 静态部署兼容性
   - 页面仍需兼容 SPA 刷新场景

## 8. 开发流程

本地开发：

```bash
npm install
npm run dev
```

构建验证：

```bash
npm run build
```

修改安装入口时的建议流程：

1. 更新 `src/site-data.js` 中的 `installEntries` 或 `externalLinks`
2. 检查首页与下载页是否同步反映变化
3. 重新执行 `npm run build`

## 9. 已知约束

1. 官网当前为纯静态站，不支持 SSR
2. `externalLinks.deployDocs` 与 `externalLinks.deployRepo` 是 deploy 入口单一事实源
3. 若 deploy 的公开地址后续调整，应直接更新 `src/site-data.js`
4. `dist/` 是构建结果，不应手工维护
5. `node_modules/` 不是事实源
