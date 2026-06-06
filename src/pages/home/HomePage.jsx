import { useId, useRef, useState } from 'react';
import { desktopInstallers, languages } from '../../content';
import { hasCountedDownload, markDownloadCounted, recordDownloadEvent, useDownloadTotals } from '../../shared/download-tracking';
import { useDetectedDesktopPlatform } from '../../shared/platform';
import { pathFor } from '../../shared/routing';
import { ButtonLink } from '../../shared/components/ButtonLink';

function DesktopDownloadDropdown({ lang }) {
  const detectedPlatform = useDetectedDesktopPlatform();
  const copy = languages[lang];
  const { incrementLocalTotal } = useDownloadTotals();
  const popoverId = useId();
  const titleId = `${popoverId}-title`;
  const [isOpen, setIsOpen] = useState(false);
  const pointerInteractionRef = useRef(false);

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      pointerInteractionRef.current = false;
      setIsOpen(false);
    }
  };

  const handleFocus = () => {
    if (pointerInteractionRef.current) {
      return;
    }
    setIsOpen(true);
  };

  const handleTriggerClick = () => {
    if (pointerInteractionRef.current) {
      setIsOpen((current) => !current);
      pointerInteractionRef.current = false;
      return;
    }
    setIsOpen(true);
  };

  const handleTriggerKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      setIsOpen(true);
    }
  };

  const handleDownloadClick = (installer) => {
    if (!installer.available || hasCountedDownload(installer.key)) {
      return;
    }
    markDownloadCounted(installer.key);
    incrementLocalTotal(installer.key);
    recordDownloadEvent(installer.key);
  };

  return (
    <div
      className={`desktop-download-menu${isOpen ? ' is-open' : ''}`}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleTriggerKeyDown}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        aria-controls={popoverId}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="button button-primary desktop-download-trigger"
        onClick={handleTriggerClick}
        onPointerDown={() => {
          pointerInteractionRef.current = true;
        }}
        onPointerCancel={() => {
          pointerInteractionRef.current = false;
        }}
        type="button"
      >
        <span>{copy.shared.downloadDesktop}</span>
      </button>
      <div className="desktop-download-popover" hidden={!isOpen} id={popoverId} aria-labelledby={titleId}>
        <p id={titleId}>{copy.home.downloadMenuTitle}</p>
        <div className="desktop-download-options">
          {desktopInstallers.map((installer) => {
            const localized = installer[lang];
            const isCurrent = installer.key === detectedPlatform && installer.available;

            return installer.available ? (
              <a
                className={`desktop-download-option${isCurrent ? ' is-current' : ''}`}
                download
                href={installer.href}
                key={installer.key}
                onClick={() => handleDownloadClick(installer)}
              >
                <span>{localized.label}</span>
                {isCurrent ? <strong>{copy.home.currentDeviceBadge}</strong> : null}
              </a>
            ) : (
              <span className="desktop-download-option is-disabled" key={installer.key}>
                <span>{localized.label}</span>
                <strong>{copy.home.plannedBadge}</strong>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DirectDesktopDownloadButton({ lang }) {
  const detectedPlatform = useDetectedDesktopPlatform();
  const copy = languages[lang];
  const { incrementLocalTotal } = useDownloadTotals();
  const installer = desktopInstallers.find((entry) => entry.key === detectedPlatform);
  const localized = installer?.[lang];

  const handleClick = () => {
    if (!installer?.available || hasCountedDownload(installer.key)) {
      return;
    }
    markDownloadCounted(installer.key);
    incrementLocalTotal(installer.key);
    recordDownloadEvent(installer.key);
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
    <a className="button button-primary" download href={installer.href} onClick={handleClick}>
      <span>{localized.button}</span>
    </a>
  );
}

function HeroProductPreview({ lang }) {
  const copy = languages[lang].home;
  const previewItems = copy.capabilityCards.slice(0, 3);

  return (
    <aside className="hero-product-preview" data-reveal aria-label={copy.featuresTitle}>
      <div className="desktop-preview-window">
        <div className="visual-window-top">
          <span />
          <span />
          <span />
          <strong>ZenMind Desktop</strong>
        </div>
        <div className="desktop-code-preview">
          <div className="code-editor-panel" aria-hidden="true">
            <div className="code-editor-meta">
              <span>agent.task.ts</span>
              <strong>running</strong>
            </div>
            <pre>
              <code>
                <span style={{ '--code-line': 0 }}>
                  <em>const</em> task = <strong>&quot;prepare release notes&quot;</strong>;
                </span>
                <span style={{ '--code-line': 1 }}>
                  <em>await</em> desktop.openWorkspace(task);
                </span>
                <span style={{ '--code-line': 2 }}>
                  agent.use([<strong>&quot;docs&quot;</strong>, <strong>&quot;models&quot;</strong>, <strong>&quot;sandbox&quot;</strong>]);
                </span>
                <span style={{ '--code-line': 3 }}>
                  <em>return</em> agent.run({`{`} visible: <strong>true</strong> {`}`});
                </span>
              </code>
            </pre>
          </div>
          <div className="terminal-panel" aria-hidden="true">
            <div className="terminal-toolbar">
              <span>agent output</span>
              <strong>live</strong>
            </div>
            <div className="terminal-log">
              {previewItems.map((item, index) => (
                <p key={item.key} style={{ '--code-line': index }}>
                  <span>$</span> {item.title}: {item.body}
                </p>
              ))}
              <p className="terminal-cursor">
                <span>$</span> waiting for confirmation
              </p>
            </div>
          </div>
        </div>
        <div className="desktop-preview-status" aria-hidden="true">
          <span>Desktop</span>
          <span>Agent UI</span>
          <span>Models</span>
          <span>Sandbox</span>
        </div>
        <div className="desktop-preview-body is-legacy-preview" aria-hidden="true">
          <div className="desktop-preview-nav">
            {previewItems.map((item, index) => (
              <span key={item.key} style={{ '--preview-step': index }}>
                {item.title}
              </span>
            ))}
          </div>
          <div className="desktop-preview-main">
            {previewItems.map((item, index) => (
              <article className={index === 0 ? 'is-active' : ''} key={item.key} style={{ '--preview-step': index }}>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function HeroSection({ lang }) {
  const copy = languages[lang];

  return (
    <section className="hero home-hero">
      <div className="hero-copy" data-reveal>
        <p className="eyebrow">{copy.home.eyebrow}</p>
        <h1>{copy.home.headline}</h1>
        <p>{copy.home.heroIntro}</p>
      </div>
      <div className="hero-actions" data-reveal>
        <DesktopDownloadDropdown lang={lang} />
        <ButtonLink href={pathFor(lang, 'documents')} label={copy.home.primaryCta} showIcon={false} variant="secondary" />
      </div>
      <HeroProductPreview lang={lang} />
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
