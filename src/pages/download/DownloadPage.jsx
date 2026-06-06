import { Link } from 'react-router-dom';
import { desktopInstallers, externalLinks, languages } from '../../content';
import { hasCountedDownload, markDownloadCounted, recordDownloadEvent } from '../../shared/download-tracking';
import { useDetectedDesktopPlatform } from '../../shared/platform';
import { pathFor } from '../../shared/routing';
import { Icon } from '../../shared/components/Icon';
import { PageHeader } from '../../shared/components/PageHeader';

function PlatformDownloadCard({ installer, lang, recommended = false, onDownload }) {
  const copy = languages[lang];
  const localized = installer[lang];
  const status = installer.available ? 'ready' : 'soon';

  return (
    <article className={`platform-card content-card${recommended ? ' is-recommended' : ''}`} data-reveal>
      <div className="platform-card-top">
        <div>
          <span className="card-kicker">{localized.label}</span>
          <h2>{installer.name}</h2>
        </div>
        <div className="platform-badges">
          {recommended ? <span className="status-pill status-preview">{copy.download.recommendedBadge}</span> : null}
          <span className={`status-pill status-${status}`}>{installer.available ? copy.shared.statusReady : copy.shared.statusSoon}</span>
        </div>
      </div>
      <p>{localized.summary}</p>
      <div className="platform-meta">
        {installer.version ? <span>v{installer.version}</span> : null}
        {localized.meta.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="platform-note">
        <strong>{copy.download.detailsLabel}</strong>
        <p>{localized.note}</p>
      </div>
      {installer.available ? (
        <a className="button button-primary platform-action" download href={installer.href} onClick={() => onDownload(installer.key)}>
          <Icon type="download" />
          <span>{localized.button}</span>
        </a>
      ) : (
        <Link className="button button-secondary platform-action" to={pathFor(lang, 'documents')}>
          <span>{copy.shared.downloadFallback}</span>
          <Icon type="arrow" />
        </Link>
      )}
    </article>
  );
}

function DownloadRecommendation({ lang, installer, onDownload }) {
  const copy = languages[lang];
  const localized = installer?.[lang];

  if (!installer || !localized || !installer.available) {
    return (
      <article className="download-recommendation content-card" data-reveal>
        <div>
          <span className="card-kicker">{copy.download.recommendation.eyebrow}</span>
          <h2>{copy.download.recommendation.unavailableTitle}</h2>
          <p>{copy.download.recommendation.unavailableBody}</p>
        </div>
        <div className="download-recommendation-actions">
          <Link className="button button-primary" to={pathFor(lang, 'documents')}>
            <span>{copy.download.docsCta}</span>
            <Icon type="arrow" />
          </Link>
          <a className="button button-secondary" href={externalLinks.github} rel="noreferrer" target="_blank">
            <span>{copy.download.sourceCta}</span>
            <Icon type="external" />
          </a>
        </div>
      </article>
    );
  }

  return (
    <article className="download-recommendation content-card" data-reveal>
      <div>
        <span className="card-kicker">{copy.download.recommendation.eyebrow}</span>
        <h2>
          {copy.download.recommendation.titlePrefix} {localized.label}
        </h2>
        <p>{localized.summary}</p>
      </div>
      <a className="button button-primary" download href={installer.href} onClick={() => onDownload(installer.key)}>
        <Icon type="download" />
        <span>{localized.button}</span>
      </a>
    </article>
  );
}

export function DownloadPage({ lang }) {
  const copy = languages[lang];
  const downloadCopy = copy.download;
  const detectedPlatform = useDetectedDesktopPlatform();
  const recommendedInstaller = desktopInstallers.find((installer) => installer.key === detectedPlatform);

  const handleInstallerDownload = (installerKey) => {
    if (hasCountedDownload(installerKey)) {
      return;
    }
    markDownloadCounted(installerKey);
    recordDownloadEvent(installerKey);
  };

  return (
    <section className="page-section download-page">
      <PageHeader eyebrow={downloadCopy.eyebrow} title={downloadCopy.title} intro={downloadCopy.intro} />

      <div className="download-stack">
        <DownloadRecommendation installer={recommendedInstaller} lang={lang} onDownload={handleInstallerDownload} />

        <section className="download-platforms" data-reveal>
          <div className="download-section-heading">
            <span className="card-kicker">{downloadCopy.desktop.eyebrow}</span>
            <h2>{downloadCopy.platformsTitle}</h2>
          </div>
          <div className="platform-download-grid">
            {desktopInstallers.map((installer) => (
              <PlatformDownloadCard
                installer={installer}
                key={installer.key}
                lang={lang}
                recommended={installer.key === recommendedInstaller?.key}
                onDownload={handleInstallerDownload}
              />
            ))}
          </div>
        </section>

        <article className="download-mobile-note content-card" data-reveal>
          <div>
            <span className="card-kicker">{downloadCopy.mobile.eyebrow}</span>
            <div className="download-title-row">
              <h2>{downloadCopy.mobile.title}</h2>
              <span className="status-pill status-soon">{downloadCopy.mobile.status}</span>
            </div>
            <p>{downloadCopy.mobile.intro}</p>
          </div>
          <div className="download-recommendation-actions">
            <Link className="button button-secondary" to={pathFor(lang, 'documents')}>
              <span>{copy.download.docsCta}</span>
              <Icon type="arrow" />
            </Link>
            <a className="button button-secondary" href={externalLinks.github} rel="noreferrer" target="_blank">
              <span>{copy.download.sourceCta}</span>
              <Icon type="external" />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
