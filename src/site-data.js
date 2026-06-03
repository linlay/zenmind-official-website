const siteUrl = 'https://www.zenmind.cc';
const githubUrl = 'https://github.com/linlay/zenmind';
const deployRepoUrl = 'https://github.com/linlay/zenmind-deploy';
const docsBaseUrl = 'https://github.com/linlay/zenmind/blob/main/docs';

export const externalLinks = {
  github: githubUrl,
  deployDocs: deployRepoUrl,
  deployRepo: deployRepoUrl,
  architecture: `${docsBaseUrl}/architecture.md`,
  agwui: `${docsBaseUrl}/agwui.md`,
  models: `${docsBaseUrl}/models.md`,
  mobile: `${docsBaseUrl}/mobile.md`,
};

export const routeMap = {
  zh: {
    home: '/',
    download: '/download',
    documents: '/documents',
    news: '/news',
    market: '/market',
    login: '/login',
    authFailure: '/auth/failure',
  },
  en: {
    home: '/en',
    download: '/en/download',
    documents: '/en/documents',
    news: '/en/news',
    market: '/en/market',
    login: '/en/login',
    authFailure: '/en/auth/failure',
  },
};

export const desktopInstallers = [
  {
    key: 'mac',
    name: 'macOS',
    href: '/install/releases/desktop/ZenMind-macOS-arm64.dmg',
    available: true,
    version: '0.2.4',
    zh: {
      label: 'macOS',
      button: '下载 macOS 版',
      summary: '适用于 Apple Silicon Mac 的 DMG 安装包',
      meta: ['DMG 安装包', 'arm64', '约 160 MB'],
      note: '打开 .dmg 后将 ZenMind 拖入“应用程序”文件夹。',
    },
    en: {
      label: 'macOS',
      button: 'Download for macOS',
      summary: 'DMG installer for Apple Silicon Macs.',
      meta: ['DMG installer', 'arm64', 'about 160 MB'],
      note: 'Open the .dmg and drag ZenMind into Applications.',
    },
  },
  {
    key: 'windows',
    name: 'Windows',
    href: '/downloads/ZenMind-0.2.3-x64.exe',
    available: true,
    version: '0.2.3',
    zh: {
      label: 'Windows',
      button: '下载 Windows 版',
      summary: '适用于 Windows x64 的 NSIS 安装包',
      meta: ['NSIS 安装包', 'x64', '保留用户数据卸载'],
      note: '运行安装包并按提示完成安装。',
    },
    en: {
      label: 'Windows',
      button: 'Download for Windows',
      summary: 'NSIS installer for Windows x64.',
      meta: ['NSIS installer', 'x64', 'data-safe uninstall'],
      note: 'Run the installer and follow the setup guide.',
    },
  },
  {
    key: 'linux',
    name: 'Linux',
    href: null,
    available: false,
    version: null,
    zh: {
      label: 'Linux',
      button: 'Linux 版暂未开放',
      summary: 'Desktop 安装包暂未提供 Linux 版本',
      meta: ['Desktop 包规划中', '可查看文档', '可访问源码'],
      note: '当前 Desktop 打包目标为 macOS DMG 与 Windows NSIS。',
    },
    en: {
      label: 'Linux',
      button: 'Linux build not available yet',
      summary: 'A Linux Desktop installer is not available yet.',
      meta: ['Desktop package planned', 'docs available', 'source available'],
      note: 'Current Desktop packaging targets are macOS DMG and Windows NSIS.',
    },
  },
];

export const languages = {
  zh: {
    code: 'zh-CN',
    switchLabel: 'EN',
    brandMark: 'ZenMind',
    seo: {
      title: 'ZenMind | Desktop-first AI Agent 平台',
      description:
        'ZenMind 是以 Desktop 为入口的 AI Agent 平台，连接本地服务、Web/移动端工作流、国产模型生态与本地沙箱。',
      url: siteUrl,
    },
    nav: {
      home: '首页',
      download: '下载',
      documents: '文档',
      news: '新闻',
      market: '市场',
      login: '登录',
      github: 'GitHub',
    },
    theme: {
      label: '主题',
      auto: '自动',
      light: '白天',
      dark: '黑夜',
    },
    shared: {
      copyLabel: '复制',
      copiedLabel: '已复制',
      openGithub: 'GitHub',
      readDocs: '阅读文档',
      deployDocs: '部署入口',
      statusReady: '可用',
      statusSoon: '规划中',
      statusPreview: '预览',
      externalLabel: '打开外链',
      downloadFallback: '查看文档',
    },
    home: {
      eyebrow: 'Desktop-first AI Agent Platform',
      headline: '让你的电脑\n变为智能体工作站',
      primaryCta: '查看文档',
      secondaryCta: '源代码',
      downloadUnavailableTitle: '当前环境暂未提供 Desktop 安装包',
      downloadUnavailableBody: '你仍然可以查看文档或源码，了解 ZenMind Desktop、核心服务和本地沙箱的运行方式。',
      heroStats: [
        { value: 'Desktop', label: '统一安装、启动、监控' },
        { value: 'AGW UI', label: '流式输出、HITL、viewport' },
        { value: 'Sandbox', label: '长生命周期工具环境' },
      ],
      consoleTitle: 'ZenMind runtime',
      consoleLines: [
        'desktop: service center ready',
        'app-server: token bridge online',
        'agent-platform: AGW stream attached',
        'container-hub: sandbox session prepared',
      ],
      featuresEyebrow: '核心功能',
      featuresTitle: '更高效完成工作',
      featuresIntro:
        '把真实工作材料交给 ZenMind：服务、模型、工具环境、交互视图和跨端入口都在同一套 Agent 工作流里协同。',
      featureSections: [
        {
          key: 'desktop',
          title: '一个 Desktop 应用管理整套运行时',
          body:
            'ZenMind Desktop 负责安装、初始化、启动、停止、服务健康监控和嵌入式 Web 表面，让用户从一个控制中心进入所有能力。',
          points: ['服务生命周期', '日志与设置', '身份令牌桥接'],
          visualTitle: 'Desktop 控制中心',
          visualRows: ['安装内置服务', '启动 Agent 运行时', '查看日志与健康状态'],
        },
        {
          key: 'models',
          title: '面向国产模型生态的运行时注册表',
          body:
            '优先支持 DeepSeek V4、MiMo、MiniMax M3、Qwen/百炼等模型方向，并保留 provider registry、模型能力和用量字段的扩展空间。',
          points: ['模型切换', 'reasoning 与 vision 标记', 'token/cache/cost usage'],
          visualTitle: '模型运行时注册表',
          visualRows: ['DeepSeek V4', 'MiMo', 'MiniMax M3', 'Qwen / Bailian'],
        },
        {
          key: 'agw',
          title: 'AGW UI 协议承载真实 Agent 交互',
          body:
            'AGW UI 结合 HTTP、SSE 与可选 WebSocket，支持流式输出、attach 续接、HITL、交互视图、usage 快照和子智能体调用。',
          points: ['H2A streaming', 'question / approval / form / plan', 'agent_invoke'],
          visualTitle: 'AGW UI 事件流',
          visualRows: ['流式增量输出', '等待人工确认', '渲染交互视图', '记录用量快照'],
        },
        {
          key: 'sandbox',
          title: '本地沙箱让工具和办公任务长期运行',
          body:
            'agent-container-hub 提供本地沙箱会话、环境模板和容器工具运行时，为文档、表格、PDF、PPT 等办公自动化保留稳定执行层。',
          points: ['长生命周期会话', '工具环境模板', 'Office 技能链路'],
          visualTitle: '本地沙箱',
          visualRows: ['容器会话', '工具运行时', 'DOCX / XLSX / PDF / PPT'],
        },
        {
          key: 'clients',
          title: '同一套 Agent 体验服务 Desktop、Web 与移动端',
          body:
            'Desktop 是入口，Web Client 渲染对话、Timeline、模型切换和 viewport；移动端方向复用同一 AGW UI 协议，而不是另起一套契约。',
          points: ['Desktop first', 'Web timeline', 'Mobile direction'],
          visualTitle: '同一套 Agent 契约',
          visualRows: ['Desktop 入口', 'Web Client', '移动端方向'],
        },
      ],
      finalCtaTitle: '从 Desktop 进入 ZenMind',
      finalCtaBody: '官网声明公开下载入口；实际安装包、发布产物和部署编排由发布流程提供。',
      footerTagline: 'Desktop-first AI Agent platform for local, web, and mobile workflows.',
    },
    documents: {
      eyebrow: 'Documents',
      title: '文档入口',
      intro: '第一版官网提供核心文档索引，详细内容继续以主仓库文档为事实源。',
      cards: [
        {
          title: '架构说明',
          body: 'Desktop shell、App Server、Agent Platform、Web Client 与 Container Hub 的职责边界。',
          href: externalLinks.architecture,
        },
        {
          title: 'AGW UI 协议',
          body: '客户端与 Agent Platform 之间的事件模型、流式传输、HITL 与 viewport 契约。',
          href: externalLinks.agwui,
        },
        {
          title: '模型支持',
          body: 'provider registry、模型能力、用量映射和国产模型生态优先级。',
          href: externalLinks.models,
        },
        {
          title: '移动端方向',
          body: '移动端如何复用 AGW UI 协议并与 Desktop/Web 共享 Agent 体验。',
          href: externalLinks.mobile,
        },
      ],
    },
    download: {
      eyebrow: 'Download',
      title: '下载 ZenMind',
      intro: '从桌面版开始进入 ZenMind。移动版正在准备中，会复用同一套 Agent 体验。',
      desktop: {
        eyebrow: 'Desktop',
        title: '下载 ZenMind 桌面版',
        intro: '安装桌面版后统一管理本地服务、Agent 运行时、日志与健康状态。',
        visualTitle: 'ZenMind Desktop',
        visualRows: ['服务中心', 'Agent 运行时', '本地沙箱', '跨端入口'],
      },
      mobile: {
        eyebrow: 'Mobile',
        title: '下载 ZenMind 移动版',
        intro: '移动端正在规划中，将继续复用 AGW UI 协议与 Desktop-first 工作流。',
        status: '敬请期待',
        visualTitle: 'ZenMind Mobile',
        visualRows: ['对话续接', '任务状态', '移动工作流'],
      },
    },
    news: {
      eyebrow: 'News',
      title: '更新记录',
      intro: '这里记录产品叙事和公开能力的阶段性变化。没有权威发布日期的条目不写具体日期。',
      entries: [
        {
          phase: '当前重点',
          title: '官网改版为 Desktop-first 产品叙事',
          body: '首屏聚焦安装入口，后续区块介绍 Desktop、模型生态、AGW UI、本地沙箱与跨端体验。',
        },
        {
          phase: '基础架构',
          title: 'ZenMind Desktop 包裹四个核心服务',
          body: 'Desktop shell 统一管理 app-server、agent-platform、agent-webclient 和 agent-container-hub。',
        },
        {
          phase: '协议方向',
          title: 'AGW UI 成为客户端和 Agent Platform 的交互协议',
          body: '协议覆盖流式输出、attach 续接、HITL、viewport、usage 快照和子智能体调用。',
        },
        {
          phase: '模型方向',
          title: '模型支持转向 registry-driven',
          body: 'DeepSeek、MiMo、MiniMax、Qwen/百炼等生态通过 provider 与 model 定义进入运行时。',
        },
      ],
    },
    market: {
      eyebrow: 'Market',
      title: '市场',
      intro: 'ZenMind 市场第一版展示能力分类：技能、沙箱和插件。这里是静态公开展示，不执行安装。',
      categories: [
        {
          title: '技能',
          status: 'preview',
          body: '面向文档、表格、PDF、PPT 与开发任务的能力包，按需进入 Agent 上下文。',
          items: ['Office 自动化', '项目说明加载', '长文档处理'],
        },
        {
          title: '沙箱',
          status: 'soon',
          body: '为长期任务和工具执行准备隔离环境模板，服务本地 agent-container-hub。',
          items: ['容器工具运行时', '会话模板', '资源边界'],
        },
        {
          title: '插件',
          status: 'soon',
          body: '扩展 Desktop、Web Client 或 Agent Platform 的工具、面板与工作流入口。',
          items: ['服务面板', '快捷工作流', '第三方工具桥接'],
        },
      ],
    },
    login: {
      eyebrow: 'Login',
      title: '登录 ZenMind',
      intro: '使用初始化管理员账号进入 ZenMind。会话由后端签发并保存在 HttpOnly Cookie 中。',
      formTitle: '账号登录',
      emailLabel: '邮箱',
      passwordLabel: '密码',
      submit: '登录',
      googleSubmit: '使用 Google 登录',
      submitting: '处理中',
      checking: '检查会话',
      signedIn: '已登录',
      signedOut: '未登录',
      welcome: '当前账号',
      accountLabel: '账号',
      roleLabel: '角色',
      logout: '退出登录',
      sessionTitle: '真实后端会话',
      sessionBody: '登录请求会发送到 Go App Server，支持账号密码与 Google OAuth，服务端 session 存储在 MySQL。',
      errorFallback: '请求失败，请稍后重试。',
    },
    authFailure: {
      eyebrow: 'OAuth Failure',
      title: 'Google 登录未完成',
      intro: '这次 Google 授权没有成功建立 ZenMind 会话。你可以重新登录，或先返回首页。',
      status: '登录失败',
      reasonLabel: '错误码',
      unknownReason: 'unknown',
      reasonHelp: '如果连续出现同一个错误码，请联系管理员检查 Google OAuth 配置和服务端日志。',
      loginCta: '返回登录',
      homeCta: '返回首页',
    },
    footer: {
      rights: 'All rights reserved.',
      source: '主仓库',
    },
  },
  en: {
    code: 'en',
    switchLabel: '中',
    brandMark: 'ZenMind',
    seo: {
      title: 'ZenMind | Desktop-first AI Agent Platform',
      description:
        'ZenMind is a Desktop-first AI agent platform for local services, web and mobile workflows, Chinese model ecosystems, and local sandboxes.',
      url: `${siteUrl}/en`,
    },
    nav: {
      home: 'Home',
      download: 'Download',
      documents: 'Documents',
      news: 'News',
      market: 'Market',
      login: 'Login',
      github: 'GitHub',
    },
    theme: {
      label: 'Theme',
      auto: 'Auto',
      light: 'Light',
      dark: 'Dark',
    },
    shared: {
      copyLabel: 'Copy',
      copiedLabel: 'Copied',
      openGithub: 'GitHub',
      readDocs: 'Read docs',
      deployDocs: 'Deploy entry',
      statusReady: 'Available',
      statusSoon: 'Planned',
      statusPreview: 'Preview',
      externalLabel: 'Open external link',
      downloadFallback: 'Read docs',
    },
    home: {
      eyebrow: 'Desktop-first AI Agent Platform',
      headline: 'Turn your computer\ninto an agent workstation',
      primaryCta: 'Read docs',
      secondaryCta: 'Source code',
      downloadUnavailableTitle: 'No Desktop installer for this environment yet',
      downloadUnavailableBody: 'You can still read the docs or browse the source to understand ZenMind Desktop, core services, and local sandboxing.',
      heroStats: [
        { value: 'Desktop', label: 'Install, start, and monitor' },
        { value: 'AGW UI', label: 'Streaming, HITL, viewport' },
        { value: 'Sandbox', label: 'Long-lived tool environments' },
      ],
      consoleTitle: 'ZenMind runtime',
      consoleLines: [
        'desktop: service center ready',
        'app-server: token bridge online',
        'agent-platform: AGW stream attached',
        'container-hub: sandbox session prepared',
      ],
      featuresEyebrow: 'Core features',
      featuresTitle: 'Get work done faster',
      featuresIntro:
        'Give ZenMind the real materials behind your work: services, models, tool environments, interactive views, and cross-client entry points cooperate in one agent workflow.',
      featureSections: [
        {
          key: 'desktop',
          title: 'One Desktop app manages the runtime',
          body:
            'ZenMind Desktop installs, initializes, starts, stops, monitors service health, and embeds web surfaces so users enter every capability from one control center.',
          points: ['Service lifecycle', 'Logs and settings', 'Token bridge'],
          visualTitle: 'Desktop Control Center',
          visualRows: ['Install bundled services', 'Start agent runtime', 'Watch logs and health'],
        },
        {
          key: 'models',
          title: 'Runtime registry for Chinese model ecosystems',
          body:
            'ZenMind prioritizes DeepSeek V4, MiMo, MiniMax M3, Qwen/Bailian, and keeps providers, model capabilities, and usage fields extensible.',
          points: ['Model switching', 'Reasoning and vision flags', 'token/cache/cost usage'],
          visualTitle: 'Model Registry',
          visualRows: ['DeepSeek V4', 'MiMo', 'MiniMax M3', 'Qwen / Bailian'],
        },
        {
          key: 'agw',
          title: 'AGW UI carries real agent interaction',
          body:
            'AGW UI combines HTTP, SSE, and optional WebSocket transport for streaming output, attach recovery, HITL, viewports, usage snapshots, and sub-agent invocation.',
          points: ['H2A streaming', 'question / approval / form / plan', 'agent_invoke'],
          visualTitle: 'AGW UI Stream',
          visualRows: ['stream delta', 'await approval', 'render viewport', 'usage snapshot'],
        },
        {
          key: 'sandbox',
          title: 'Local sandboxes keep tools and office work running',
          body:
            'agent-container-hub provides local sandbox sessions, environment templates, and container-backed tool runtimes for documents, sheets, PDFs, and slides.',
          points: ['Long-lived sessions', 'Tool environment templates', 'Office skill paths'],
          visualTitle: 'Local Sandbox',
          visualRows: ['container session', 'tool runtime', 'DOCX / XLSX / PDF / PPT'],
        },
        {
          key: 'clients',
          title: 'One agent experience across Desktop, Web, and Mobile',
          body:
            'Desktop is the entry point. Web Client renders chat, timeline, model switching, and viewports. Mobile direction reuses AGW UI instead of a separate agent contract.',
          points: ['Desktop first', 'Web timeline', 'Mobile direction'],
          visualTitle: 'One Agent Contract',
          visualRows: ['Desktop', 'Web Client', 'Mobile direction'],
        },
      ],
      finalCtaTitle: 'Start from ZenMind Desktop',
      finalCtaBody:
        'This website declares public download entries. Installer files, release artifacts, and deployment orchestration are supplied by the release pipeline.',
      footerTagline: 'Desktop-first AI Agent platform for local, web, and mobile workflows.',
    },
    documents: {
      eyebrow: 'Documents',
      title: 'Documentation entry',
      intro: 'The first website version provides a concise docs index while the main repository remains the source of truth.',
      cards: [
        {
          title: 'Architecture',
          body: 'Responsibilities across Desktop shell, App Server, Agent Platform, Web Client, and Container Hub.',
          href: externalLinks.architecture,
        },
        {
          title: 'AGW UI Protocol',
          body: 'The event model, streaming transport, HITL states, and viewport contract between clients and Agent Platform.',
          href: externalLinks.agwui,
        },
        {
          title: 'Model Support',
          body: 'Provider registry, model capabilities, usage mapping, and model ecosystem priorities.',
          href: externalLinks.models,
        },
        {
          title: 'Mobile Direction',
          body: 'How mobile clients reuse AGW UI and share the same agent experience with Desktop and Web.',
          href: externalLinks.mobile,
        },
      ],
    },
    download: {
      eyebrow: 'Download',
      title: 'Download ZenMind',
      intro: 'Start with ZenMind Desktop. Mobile is being prepared and will reuse the same agent experience.',
      desktop: {
        eyebrow: 'Desktop',
        title: 'Download ZenMind Desktop',
        intro: 'Install the desktop app to manage local services, agent runtime, logs, and health from one place.',
        visualTitle: 'ZenMind Desktop',
        visualRows: ['Service center', 'Agent runtime', 'Local sandbox', 'Cross-client entry'],
      },
      mobile: {
        eyebrow: 'Mobile',
        title: 'Download ZenMind Mobile',
        intro: 'Mobile is planned and will continue to reuse AGW UI and the Desktop-first workflow.',
        status: 'Coming soon',
        visualTitle: 'ZenMind Mobile',
        visualRows: ['Chat continuity', 'Task status', 'Mobile workflow'],
      },
    },
    news: {
      eyebrow: 'News',
      title: 'Update log',
      intro:
        'This page tracks public product narrative and capability milestones. Entries without authoritative dates are intentionally undated.',
      entries: [
        {
          phase: 'Current focus',
          title: 'Website relaunched around Desktop-first product narrative',
          body: 'The first viewport focuses on install, followed by Desktop, model ecosystem, AGW UI, local sandbox, and cross-client sections.',
        },
        {
          phase: 'Foundation',
          title: 'ZenMind Desktop wraps four core services',
          body: 'The Desktop shell manages app-server, agent-platform, agent-webclient, and agent-container-hub.',
        },
        {
          phase: 'Protocol direction',
          title: 'AGW UI becomes the client-to-Agent-Platform protocol',
          body: 'The protocol covers streaming output, attach recovery, HITL, viewports, usage snapshots, and sub-agent invocation.',
        },
        {
          phase: 'Model direction',
          title: 'Model support moves toward registry-driven configuration',
          body: 'DeepSeek, MiMo, MiniMax, Qwen/Bailian, and adjacent ecosystems enter the runtime through provider and model definitions.',
        },
      ],
    },
    market: {
      eyebrow: 'Market',
      title: 'Market',
      intro:
        'The first ZenMind Market page presents capability categories: skills, sandboxes, and plugins. This is a static showcase, not an installer.',
      categories: [
        {
          title: 'Skills',
          status: 'preview',
          body: 'Capability packages for documents, sheets, PDFs, slides, and development tasks that can enter agent context on demand.',
          items: ['Office automation', 'Project instructions', 'Long-document processing'],
        },
        {
          title: 'Sandboxes',
          status: 'soon',
          body: 'Isolated environment templates for long-running tasks and tool execution through the local Container Hub.',
          items: ['Container runtimes', 'Session templates', 'Resource boundaries'],
        },
        {
          title: 'Plugins',
          status: 'soon',
          body: 'Extensions for Desktop, Web Client, or Agent Platform surfaces: tools, panels, and workflow entry points.',
          items: ['Service panels', 'Workflow shortcuts', 'Third-party tool bridges'],
        },
      ],
    },
    login: {
      eyebrow: 'Login',
      title: 'Login to ZenMind',
      intro: 'Use the initialized administrator account to enter ZenMind. The backend issues an HttpOnly cookie session.',
      formTitle: 'Account login',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      submit: 'Login',
      googleSubmit: 'Continue with Google',
      submitting: 'Working',
      checking: 'Checking session',
      signedIn: 'Signed in',
      signedOut: 'Signed out',
      welcome: 'Current account',
      accountLabel: 'Account',
      roleLabel: 'Role',
      logout: 'Log out',
      sessionTitle: 'Real backend session',
      sessionBody: 'Login requests go to the Go App Server. Password and Google OAuth sessions are stored in MySQL.',
      errorFallback: 'Request failed. Please try again.',
    },
    authFailure: {
      eyebrow: 'OAuth Failure',
      title: 'Google sign-in did not finish',
      intro: 'Google authorization did not create a ZenMind session this time. You can try signing in again or return home.',
      status: 'Sign-in failed',
      reasonLabel: 'Error code',
      unknownReason: 'unknown',
      reasonHelp: 'If the same error code keeps appearing, ask an administrator to check Google OAuth settings and server logs.',
      loginCta: 'Back to login',
      homeCta: 'Back home',
    },
    footer: {
      rights: 'All rights reserved.',
      source: 'Source repo',
    },
  },
};

export { githubUrl, siteUrl };
