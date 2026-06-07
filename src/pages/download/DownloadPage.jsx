import { desktopInstallers, languages } from '../../content';
import { hasCountedDownload, markDownloadCounted, recordDownloadEvent } from '../../shared/download-tracking';
import { useDetectedDesktopPlatform } from '../../shared/platform';
import { Icon } from '../../shared/components/Icon';
import { PageHeader } from '../../shared/components/PageHeader';

const platformLogoSrc = {
  mac: '/platform-logos/macos.png',
  windows: '/platform-logos/windows.png',
  linux: '/platform-logos/linux.png',
  ios: '/platform-logos/ios.png',
  android: '/platform-logos/android.png',
};

const platformOrder = ['windows', 'mac', 'linux', 'ios', 'android'];

const platformSupport = {
  zh: {
    mac: '支持 macOS 10.12 及以上设备',
    windows: '支持 Windows 11 / 10 / 8 / 7 等系统',
    linux: 'Linux 桌面端开发中',
    ios: 'iOS 移动端开发中',
    android: 'Android 移动端开发中',
  },
  en: {
    mac: 'Supports macOS 10.12 and later',
    windows: 'Supports Windows 11 / 10 / 8 / 7',
    linux: 'Linux desktop is in development',
    ios: 'iOS app is in development',
    android: 'Android app is in development',
  },
};

const plannedPlatforms = [
  {
    key: 'ios',
    name: 'iOS',
    available: false,
    version: null,
    zh: {
      label: 'iOS',
      summary: '移动端安装包正在开发中',
      button: '开发中',
    },
    en: {
      label: 'iOS',
      summary: 'Mobile installer is in development.',
      button: 'In development',
    },
  },
  {
    key: 'android',
    name: 'Android',
    available: false,
    version: null,
    zh: {
      label: 'Android',
      summary: '移动端安装包正在开发中',
      button: '开发中',
    },
    en: {
      label: 'Android',
      summary: 'Mobile installer is in development.',
      button: 'In development',
    },
  },
];

function PlatformDownloadCard({ platform, lang, recommended = false, onDownload }) {
  const copy = languages[lang];
  const localized = platform[lang];
  const status = platform.available ? 'ready' : 'soon';
  const supportText = platformSupport[lang][platform.key];
  const content = (
    <>
      <div className="platform-card-default">
        <div className="platform-card-download-icon">
          {platform.available ? <Icon type="download" /> : null}
        </div>
        {recommended ? <span className="platform-current-badge">{copy.download.recommendedBadge}</span> : null}
        {!platform.available ? <span className="platform-planned-badge">{copy.shared.statusSoon}</span> : null}
        <img
          alt=""
          className={`platform-logo platform-logo-${platform.key}`}
          src={platformLogoSrc[platform.key]}
        />
        <h2>{localized.label}</h2>
      </div>
      <div className="platform-card-hover" aria-hidden="true">
        <span className="platform-hover-icon">
          {platform.available ? (
            <img
              alt=""
              className="platform-hover-icon-svg"
              src="/download-hover-icon.svg"
            />
          ) : null}
        </span>
        <h2>{localized.label}</h2>
        <p>{supportText}</p>
        {!platform.available ? <strong>{copy.shared.statusSoon}</strong> : null}
      </div>
    </>
  );

  return platform.available ? (
    <a
      className={`platform-card is-available${recommended ? ' is-recommended' : ''}`}
      data-reveal
      download
      href={platform.href}
      onClick={() => onDownload(platform.key, platform.version)}
    >
      {content}
    </a>
  ) : (
    <article className={`platform-card is-planned status-${status}`} data-reveal>
      {content}
    </article>
  );
}

export function DownloadPage({ lang }) {
  const copy = languages[lang];
  const downloadCopy = copy.download;
  const detectedPlatform = useDetectedDesktopPlatform();
  const recommendedInstaller = desktopInstallers.find((installer) => installer.key === detectedPlatform);
  const downloadPlatforms = [...desktopInstallers, ...plannedPlatforms].sort(
    (left, right) => platformOrder.indexOf(left.key) - platformOrder.indexOf(right.key),
  );

  const handleInstallerDownload = (installerKey, version) => {
    if (hasCountedDownload(installerKey, version)) {
      return;
    }
    markDownloadCounted(installerKey, version);
    recordDownloadEvent(installerKey, version);
  };

  return (
    <section className="page-section download-page">
      <PageHeader eyebrow={downloadCopy.eyebrow} title={downloadCopy.title} intro={downloadCopy.intro} />

      <div className="download-stack">
        <section className="download-platforms" data-reveal>
          <div className="platform-download-grid">
            {downloadPlatforms.map((platform) => (
              <PlatformDownloadCard
                key={platform.key}
                lang={lang}
                platform={platform}
                recommended={platform.key === recommendedInstaller?.key}
                onDownload={handleInstallerDownload}
              />
            ))}
          </div>
        </section>

        <section className="download-product-preview" data-reveal>
          <div className="download-preview-frame" aria-label={downloadCopy.desktop.visualTitle}>
            <div className="download-preview-window">
              <div className="download-preview-sidebar">
                <span />
                <span />
                <span />
              </div>
              <div className="download-preview-main">
                <div className="download-preview-toolbar">
                  <span />
                  <span />
                </div>
                <div className="download-preview-panel">
                  <strong>{downloadCopy.desktop.visualTitle}</strong>
                  <p>{downloadCopy.desktop.intro}</p>
                </div>
                <div className="download-preview-grid">
                  {downloadCopy.desktop.visualRows.map((row) => (
                    <span key={row}>{row}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}