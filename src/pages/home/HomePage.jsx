import { desktopInstallers, languages } from '../../content';
import { hasCountedDownload, markDownloadCounted, recordDownloadEvent, useDownloadTotals } from '../../shared/download-tracking';
import { useDetectedDesktopPlatform } from '../../shared/platform';
import { pathFor } from '../../shared/routing';
import { ButtonLink } from '../../shared/components/ButtonLink';

function DirectDesktopDownloadButton({ lang }) {
  const detectedPlatform = useDetectedDesktopPlatform();
  const copy = languages[lang];
  const { incrementLocalTotal } = useDownloadTotals();
  const installer = desktopInstallers.find((entry) => entry.key === detectedPlatform);
  const localized = installer?.[lang];

  const handleClick = () => {
    if (!installer?.available || hasCountedDownload(installer.key, installer.version)) {
      return;
    }
    markDownloadCounted(installer.key, installer.version);
    incrementLocalTotal(installer.key);
    recordDownloadEvent(installer.key, installer.version);
  };

  if (!installer?.available || !installer.href) {
    return (
      <ButtonLink
        href={pathFor(lang, 'download')}
        label={localized?.button || copy.shared.downloadDesktop}
        showIcon={false}
        variant="primary"
      />
    );
  }

  return (
    <a className="button button-primary hero-download-button" download href={installer.href} onClick={handleClick}>
      <span>{localized.button}</span>
    </a>
  );
}

function HeroSection({ lang }) {
  const copy = languages[lang];

  return (
    <section className="hero home-hero">
      <div className="hero-copy" data-reveal>
        <img className="hero-brand-logo" src="/zenmind-logo.svg" alt="" aria-hidden="true" />
        <h1>{copy.home.headline}</h1>
      </div>
      <div className="hero-actions" data-reveal>
        <DirectDesktopDownloadButton lang={lang} />
      </div>
    </section>
  );
}

function WorkflowSection({ lang }) {
  const copy = languages[lang].home;

  return (
    <section className="home-workflow-section">
      <div className="home-section-heading workflow-heading" data-reveal>
        <p className="eyebrow">{copy.workflow.eyebrow}</p>
        <h2>{copy.workflow.title}</h2>
        <p>{copy.workflow.intro}</p>
      </div>
      <article className="workflow-panel" data-reveal>
        <div className="workflow-panel-copy">
          <h3>{copy.workflow.panelTitle}</h3>
          <p>{copy.workflow.panelIntro}</p>
          <div className="workflow-tags">
            {copy.workflow.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <div className="workflow-steps">
          {copy.workflow.steps.map((step) => (
            <article className="workflow-step" key={step.title}>
              <span className="workflow-step-dot" />
              <div>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </div>
              <strong>{step.status}</strong>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}

function CapabilityStrip({ lang }) {
  const copy = languages[lang].home;

  return (
    <section className="home-capability-strip" data-reveal>
      <div className="capability-strip-heading">
        <h2>{copy.featuresTitle}</h2>
        <p>{copy.featuresIntro}</p>
      </div>
      <div className="capability-strip-list">
        {copy.capabilityCards.map((card, index) => (
          <article className="capability-strip-item" key={card.key}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ShowcaseVisual({ lang, mediaType }) {
  const showcaseLabels = {
    zh: {
      video: '视频占位',
      image: '产品图片占位',
    },
    en: {
      video: 'Video placeholder',
      image: 'Product image placeholder',
    },
  };
  const labels = showcaseLabels[lang] || showcaseLabels.en;

  if (mediaType === 'video') {
    return (
      <div className="showcase-visual is-video" aria-label={labels.video} role="img">
        <span />
      </div>
    );
  }

  return (
    <div className="showcase-visual is-image" aria-label={labels.image} role="img">
      <div className="showcase-window-top" />
      <div className="showcase-window-body">
        <div />
        <div />
      </div>
    </div>
  );
}

function ProductShowcases({ lang }) {
  const copy = languages[lang].home;

  return (
    <section className="home-showcase-section">
      {copy.showcases.map((showcase, index) => (
        <article className={`home-showcase${index % 2 === 1 ? ' is-reversed' : ''}`} data-reveal key={showcase.key}>
          <div className="showcase-copy">
            <h2>{showcase.title}</h2>
            <p>{showcase.body}</p>
          </div>
          <ShowcaseVisual lang={lang} mediaType={showcase.mediaType} />
        </article>
      ))}
    </section>
  );
}

function HomeFinalCta({ lang }) {
  const copy = languages[lang];

  return (
    <section className="home-final-cta" data-reveal-no-blur>
      <div>
        <h2>{copy.home.finalCtaTitle}</h2>
        <p>{copy.home.finalCtaBody}</p>
      </div>
      <div className="home-final-actions">
        <DirectDesktopDownloadButton lang={lang} />
        <ButtonLink href={pathFor(lang, 'documents')} label={copy.home.primaryCta} showIcon={false} variant="secondary" />
      </div>
    </section>
  );
}

export function HomePage({ lang }) {
  return (
    <>
      <HeroSection lang={lang} />
      <WorkflowSection lang={lang} />
      <CapabilityStrip lang={lang} />
      <ProductShowcases lang={lang} />
      <HomeFinalCta lang={lang} />
    </>
  );
}
