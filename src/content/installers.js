export const desktopInstallerPlatforms = [
  {
    key: 'mac',
    name: 'macOS',
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
];

export const desktopInstallers = desktopInstallerPlatforms.map((platform) => ({
  ...platform,
  available: false,
  version: null,
  href: null,
}));
