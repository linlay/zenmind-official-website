import { languages } from '../../content';
import { hasCountedDownload, markDownloadCounted, recordDownloadEvent } from '../../shared/download-tracking';
import { useDesktopInstallers } from '../../shared/installers';
import { Icon } from '../../shared/components/Icon';
import { PageHeader } from '../../shared/components/PageHeader';

const platformLogoSrc = {
  mac: '/platform-logos/macos.png',
  windows: '/platform-logos/windows.png',
};

const platformOrder = ['windows', 'mac'];

const platformSupport = {
  zh: {
    mac: '支持 macOS 10.12 及以上设备',
    windows: '支持 Windows 11 / 10 / 8 / 7 等系统',
  },
  en: {
    mac: 'Supports macOS 10.12 and later',
    windows: 'Supports Windows 11 / 10 / 8 / 7',
  },
};

function PlatformDownloadCard({ platform, lang, onDownload }) {
  const copy = languages[lang];
  const localized = platform[lang];
  const status = platform.available ? 'ready' : platform.loading ? 'loading' : 'unavailable';
  const unavailableLabel = platform.loading ? copy.download.loadingBadge : copy.download.maintenanceBadge;
  const supportText = platform.loading
    ? copy.download.loadingBody
    : platform.maintenance
      ? copy.download.maintenanceBody
      : platformSupport[lang][platform.key];
  const content = (
    <>
      <div className="platform-card-default">
        <div className="platform-card-download-icon">
          {platform.available ? <Icon type="download" /> : null}
        </div>
        {!platform.available ? <span className="platform-status-badge">{unavailableLabel}</span> : null}
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
        {!platform.available ? <strong>{unavailableLabel}</strong> : null}
      </div>
    </>
  );

  return platform.available ? (
    <a
      className="platform-card is-available"
      data-reveal
      download
      href={platform.href}
      onClick={() => onDownload(platform.key, platform.version)}
    >
      {content}
    </a>
  ) : (
    <article className={`platform-card is-unavailable status-${status}`} data-reveal>
      {content}
    </article>
  );
}

export function DownloadPage({ lang }) {
  const copy = languages[lang];
  const downloadCopy = copy.download;
  const { installers, loading, error: installerError } = useDesktopInstallers();
  const catalogUnavailable = Boolean(installerError);
  const downloadPlatforms = installers.map((installer) => ({
    ...installer,
    loading,
    maintenance: !loading && (catalogUnavailable || !installer.available),
  })).sort(
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
                onDownload={handleInstallerDownload}
              />
            ))}
          </div>
          {catalogUnavailable ? <p className="download-maintenance-message">{downloadCopy.maintenanceBody}</p> : null}
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
