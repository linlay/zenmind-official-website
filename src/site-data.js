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
    documents: '/documents',
    news: '/news',
    market: '/market',
    login: '/login',
  },
  en: {
    home: '/en',
    documents: '/en/documents',
    news: '/en/news',
    market: '/en/market',
    login: '/en/login',
  },
};

export const installEntries = [
  {
    key: 'mac',
    name: 'macOS',
    command: 'curl -fsSL https://www.zenmind.cc/install/mac.sh | bash',
    docsHref: deployRepoUrl,
    zh: {
      label: 'macOS',
      summary: '适合个人开发者的桌面入口',
      requirement: 'Docker Desktop',
    },
    en: {
      label: 'macOS',
      summary: 'Desktop entry for individual developers',
      requirement: 'Docker Desktop',
    },
  },
  {
    key: 'linux',
    name: 'Linux',
    command: 'curl -fsSL https://www.zenmind.cc/install/linux.sh | bash',
    docsHref: deployRepoUrl,
    zh: {
      label: 'Linux',
      summary: '适合服务器与长期运行环境',
      requirement: 'Docker Engine + Compose',
    },
    en: {
      label: 'Linux',
      summary: 'For servers and long-running workspaces',
      requirement: 'Docker Engine + Compose',
    },
  },
  {
    key: 'windows',
    name: 'Windows (WSL)',
    command: 'curl -fsSL https://www.zenmind.cc/install/win-wsl.sh | bash',
    docsHref: deployRepoUrl,
    zh: {
      label: 'Windows',
      summary: '通过 WSL 进入 Linux Shell 安装',
      requirement: 'WSL 2 + Docker Desktop',
    },
    en: {
      label: 'Windows',
      summary: 'Install from a Linux shell through WSL',
      requirement: 'WSL 2 + Docker Desktop',
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
    },
    home: {
      eyebrow: 'Desktop-first AI Agent Platform',
      headline: '把家里的电脑\n变成 AI Agent 工作站',
      subtitle:
        'ZenMind 以 Desktop 为入口，把本地服务、Web 客户端、移动端方向、国产模型生态和本地沙箱串成同一套 Agent 体验。',
      installTitle: '先安装，再进入工作台',
      installBody: '选择你的平台，复制命令，在终端中启动 ZenMind Desktop 与核心服务。',
      primaryCta: '查看文档',
      secondaryCta: '源代码',
      commandCaption: '官方安装入口',
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
      featuresTitle: '滚轮向下，是 ZenMind 的完整工作流',
      featuresIntro:
        '不是单一聊天窗口，而是一套从桌面控制中心到本地沙箱、模型注册、交互协议的 Agent 平台。',
      featureSections: [
        {
          key: 'desktop',
          title: '一个 Desktop 应用管理整套运行时',
          body:
            'ZenMind Desktop 负责安装、初始化、启动、停止、服务健康监控和嵌入式 Web 表面，让用户从一个控制中心进入所有能力。',
          points: ['服务生命周期', '日志与设置', '身份令牌桥接'],
        },
        {
          key: 'models',
          title: '面向国产模型生态的运行时注册表',
          body:
            '优先支持 DeepSeek V4、MiMo、MiniMax M3、Qwen/百炼等模型方向，并保留 provider registry、模型能力和用量字段的扩展空间。',
          points: ['模型切换', 'reasoning 与 vision 标记', 'token/cache/cost usage'],
        },
        {
          key: 'agw',
          title: 'AGW UI 协议承载真实 Agent 交互',
          body:
            'AGW UI 结合 HTTP、SSE 与可选 WebSocket，支持流式输出、attach 续接、HITL、交互视图、usage 快照和子智能体调用。',
          points: ['H2A streaming', 'question / approval / form / plan', 'agent_invoke'],
        },
        {
          key: 'sandbox',
          title: '本地沙箱让工具和办公任务长期运行',
          body:
            'agent-container-hub 提供本地沙箱会话、环境模板和容器工具运行时，为文档、表格、PDF、PPT 等办公自动化保留稳定执行层。',
          points: ['长生命周期会话', '工具环境模板', 'Office 技能链路'],
        },
        {
          key: 'clients',
          title: '同一套 Agent 体验服务 Desktop、Web 与移动端',
          body:
            'Desktop 是入口，Web Client 渲染对话、Timeline、模型切换和 viewport；移动端方向复用同一 AGW UI 协议，而不是另起一套契约。',
          points: ['Desktop first', 'Web timeline', 'Mobile direction'],
        },
      ],
      finalCtaTitle: '从安装入口进入 ZenMind',
      finalCtaBody: '官网只负责展示与引导；安装脚本、发布产物和部署编排仍由 zenmind-deploy 维护。',
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
      title: '登录入口预留',
      intro:
        'ZenMind 官网不承载登录态。登录能力属于 ZenMind App Server 与 Desktop/Web Client 的产品入口，第一版官网只保留说明页。',
      panels: [
        {
          title: '官网保持静态',
          body: '这里不会收集账号、密码或会话信息，也不会接入后端 API。',
        },
        {
          title: '产品登录由运行时提供',
          body: '完成本地安装后，通过 ZenMind Desktop 或部署后的 Web Client 进入真实登录流程。',
        },
      ],
      cta: '返回首页安装',
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
    },
    home: {
      eyebrow: 'Desktop-first AI Agent Platform',
      headline: 'Turn your home computer\ninto an AI agent workstation',
      subtitle:
        'ZenMind starts from Desktop and connects local services, web clients, mobile direction, Chinese model ecosystems, and local sandboxes into one agent experience.',
      installTitle: 'Install first, then open the workspace',
      installBody: 'Pick your platform, copy the command, and start ZenMind Desktop with the core services.',
      primaryCta: 'Read docs',
      secondaryCta: 'Source code',
      commandCaption: 'Official install entry',
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
      featuresTitle: 'Scroll into the ZenMind workflow',
      featuresIntro:
        'ZenMind is not a single chat window. It is an agent platform that spans Desktop control, local sandboxing, model registry, and an interaction protocol.',
      featureSections: [
        {
          key: 'desktop',
          title: 'One Desktop app manages the runtime',
          body:
            'ZenMind Desktop installs, initializes, starts, stops, monitors service health, and embeds web surfaces so users enter every capability from one control center.',
          points: ['Service lifecycle', 'Logs and settings', 'Token bridge'],
        },
        {
          key: 'models',
          title: 'Runtime registry for Chinese model ecosystems',
          body:
            'ZenMind prioritizes DeepSeek V4, MiMo, MiniMax M3, Qwen/Bailian, and keeps providers, model capabilities, and usage fields extensible.',
          points: ['Model switching', 'Reasoning and vision flags', 'token/cache/cost usage'],
        },
        {
          key: 'agw',
          title: 'AGW UI carries real agent interaction',
          body:
            'AGW UI combines HTTP, SSE, and optional WebSocket transport for streaming output, attach recovery, HITL, viewports, usage snapshots, and sub-agent invocation.',
          points: ['H2A streaming', 'question / approval / form / plan', 'agent_invoke'],
        },
        {
          key: 'sandbox',
          title: 'Local sandboxes keep tools and office work running',
          body:
            'agent-container-hub provides local sandbox sessions, environment templates, and container-backed tool runtimes for documents, sheets, PDFs, and slides.',
          points: ['Long-lived sessions', 'Tool environment templates', 'Office skill paths'],
        },
        {
          key: 'clients',
          title: 'One agent experience across Desktop, Web, and Mobile',
          body:
            'Desktop is the entry point. Web Client renders chat, timeline, model switching, and viewports. Mobile direction reuses AGW UI instead of a separate agent contract.',
          points: ['Desktop first', 'Web timeline', 'Mobile direction'],
        },
      ],
      finalCtaTitle: 'Start from the ZenMind install entry',
      finalCtaBody:
        'This website only presents and routes. Install scripts, release artifacts, and deployment orchestration remain in zenmind-deploy.',
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
      title: 'Login entry reserved',
      intro:
        'The public website does not carry authentication state. Login belongs to ZenMind App Server and the Desktop/Web Client product surfaces, so v1 keeps this as an information page.',
      panels: [
        {
          title: 'The website stays static',
          body: 'This page does not collect accounts, passwords, sessions, or call backend APIs.',
        },
        {
          title: 'Product login comes from the runtime',
          body: 'After local installation, use ZenMind Desktop or the deployed Web Client to enter the actual login flow.',
        },
      ],
      cta: 'Back to install',
    },
    footer: {
      rights: 'All rights reserved.',
      source: 'Source repo',
    },
  },
};

export { githubUrl, siteUrl };
