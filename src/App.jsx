import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { desktopInstallers, externalLinks, githubUrl, languages, routeMap, siteUrl } from './site-data';

const pageOrder = ['home', 'documents', 'news', 'market'];
const routeOrder = ['home', 'documents', 'news', 'market', 'login'];
const themeModes = ['auto', 'light', 'dark'];
const themeStorageKey = 'zenmind:theme';
const supportedPlatforms = ['mac', 'windows', 'linux', 'unknown'];

function normalizePlatform(value) {
  const source = String(value || '').toLowerCase();

  if (source.includes('mac') || source.includes('darwin')) {
    return 'mac';
  }

  if (source.includes('win')) {
    return 'windows';
  }

  if (source.includes('linux')) {
    return 'linux';
  }

  if (source.includes('unknown') || source.includes('other')) {
    return 'unknown';
  }

  return null;
}

function detectDesktopPlatform() {
  const params = new URLSearchParams(window.location.search);
  const platformOverride = params.get('platform') || window.__ZENMIND_PLATFORM_OVERRIDE__;
  if (platformOverride) {
    return normalizePlatform(platformOverride) || 'unknown';
  }

  const userAgentDataPlatform = navigator.userAgentData?.platform;
  const platform = normalizePlatform(userAgentDataPlatform || navigator.platform);
  if (platform) {
    return platform;
  }

  return normalizePlatform(navigator.userAgent) || 'mac';
}

function useDetectedDesktopPlatform() {
  const [platform, setPlatform] = useState('mac');

  useEffect(() => {
    setPlatform(detectDesktopPlatform());
  }, []);

  return platform;
}

function resolveTheme(mode) {
  if (mode === 'light' || mode === 'dark') {
    return mode;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeMode(mode) {
  const nextMode = themeModes.includes(mode) ? mode : 'auto';
  const resolvedTheme = resolveTheme(nextMode);
  const root = document.documentElement;
  root.dataset.themeMode = nextMode;
  root.dataset.theme = resolvedTheme;
  root.style.colorScheme = resolvedTheme;

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.setAttribute('content', resolvedTheme === 'dark' ? '#08090c' : '#f7f7f4');
  }
}

function readStoredThemeMode() {
  try {
    const stored = window.localStorage.getItem(themeStorageKey);
    const current = document.documentElement.dataset.themeMode || stored;
    return themeModes.includes(current) ? current : 'auto';
  } catch {
    const current = document.documentElement.dataset.themeMode;
    return themeModes.includes(current) ? current : 'auto';
  }
}

function writeStoredThemeMode(mode) {
  try {
    window.localStorage.setItem(themeStorageKey, mode);
  } catch {
    // Theme still applies through documentElement dataset when storage is unavailable.
  }
}

function useThemeMode() {
  const [mode, setModeState] = useState(readStoredThemeMode);

  useEffect(() => {
    applyThemeMode(mode);
    writeStoredThemeMode(mode);
  }, [mode]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      if (mode === 'auto') {
        applyThemeMode('auto');
      }
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [mode]);

  return { mode, setMode: setModeState };
}

function useRevealOnScroll() {
  const location = useLocation();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!elements.length) {
      return undefined;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [location.pathname]);
}

function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState(null);

  const copy = useCallback(async (text) => {
    try {
      let copied = false;

      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          copied = true;
        } catch {
          copied = false;
        }
      }

      if (!copied) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.opacity = '0';
        textarea.setAttribute('readonly', '');
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        copied = document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      if (!copied) {
        throw new Error('Copy failed');
      }

      setCopiedText(text);
      window.setTimeout(() => setCopiedText(null), 1600);
    } catch {
      setCopiedText(null);
    }
  }, []);

  return { copiedText, copy };
}

function pathFor(lang, key) {
  return routeMap[lang][key];
}

function alternatePath(lang, key) {
  return lang === 'zh' ? routeMap.en[key] : routeMap.zh[key];
}

function usePageMeta(lang, key) {
  useEffect(() => {
    const data = languages[lang];
    const suffix = key === 'home' ? '' : ` | ${data.nav[key]}`;
    document.documentElement.lang = data.code;
    document.title = `${data.seo.title}${suffix}`;

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', data.seo.description);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', document.title);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', data.seo.description);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', key === 'home' ? data.seo.url : `${siteUrl}${pathFor(lang, key)}`);
    }
  }, [key, lang]);
}

function Icon({ type }) {
  const paths = {
    copy: (
      <>
        <rect x="8" y="8" width="11" height="11" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
      </>
    ),
    external: (
      <>
        <path d="M7 17 17 7" />
        <path d="M9 7h8v8" />
        <path d="M19 19H5V5h6" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="M6 6l12 12" />
        <path d="M18 6 6 18" />
      </>
    ),
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    download: (
      <>
        <path d="M12 3v11" />
        <path d="m7 9 5 5 5-5" />
        <path d="M5 21h14" />
      </>
    ),
  };

  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {paths[type]}
    </svg>
  );
}

function CopyButton({ text, lang }) {
  const { copiedText, copy } = useCopyToClipboard();
  const copyText = languages[lang].shared;
  const isCopied = copiedText === text;

  return (
    <button
      className={`copy-button${isCopied ? ' is-copied' : ''}`}
      type="button"
      aria-label={isCopied ? copyText.copiedLabel : copyText.copyLabel}
      onClick={() => copy(text)}
    >
      <Icon type="copy" />
      <span>{isCopied ? copyText.copiedLabel : copyText.copyLabel}</span>
    </button>
  );
}

function ButtonLink({ href, label, variant = 'primary', external = false }) {
  const className = `button button-${variant}`;

  if (external) {
    return (
      <a className={className} href={href} rel="noreferrer" target="_blank">
        <span>{label}</span>
        <Icon type="external" />
      </a>
    );
  }

  return (
    <Link className={className} to={href}>
      <span>{label}</span>
      <Icon type="arrow" />
    </Link>
  );
}

function ThemeSegment({ lang, mode, setMode, compact = false }) {
  const labels = languages[lang].theme;

  return (
    <div className={`theme-segment${compact ? ' is-compact' : ''}`} role="group" aria-label={labels.label}>
      {themeModes.map((themeMode) => (
        <button
          key={themeMode}
          className={`theme-option${mode === themeMode ? ' is-active' : ''}`}
          type="button"
          aria-pressed={mode === themeMode}
          onClick={() => setMode(themeMode)}
        >
          {labels[themeMode]}
        </button>
      ))}
    </div>
  );
}

function Header({ lang, pageKey, theme }) {
  const copy = languages[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="site-header">
      <NavLink className="brand" to={pathFor(lang, 'home')}>
        <img className="brand-logo" src="/zenmind-logo.svg" alt="" />
        <span>{copy.brandMark}</span>
      </NavLink>

      <nav className="site-nav" aria-label="Primary navigation">
        {pageOrder.map((key) => (
          <NavLink
            key={key}
            className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
            end={key === 'home'}
            to={pathFor(lang, key)}
          >
            {copy.nav[key]}
          </NavLink>
        ))}
      </nav>

      <div className="header-actions">
        <ThemeSegment lang={lang} mode={theme.mode} setMode={theme.setMode} />
        <NavLink className="language-switch" to={alternatePath(lang, pageKey)}>
          {copy.switchLabel}
        </NavLink>
        <NavLink className="login-link" to={pathFor(lang, 'login')}>
          {copy.nav.login}
        </NavLink>
        <button
          className="menu-button"
          type="button"
          aria-controls="mobile-menu"
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <Icon type={menuOpen ? 'close' : 'menu'} />
        </button>
      </div>

      <div className={`mobile-nav${menuOpen ? ' is-open' : ''}`} id="mobile-menu" hidden={!menuOpen}>
        {pageOrder.map((key) => (
          <NavLink
            key={key}
            className={({ isActive }) => `mobile-link${isActive ? ' is-active' : ''}`}
            end={key === 'home'}
            to={pathFor(lang, key)}
          >
            {copy.nav[key]}
          </NavLink>
        ))}
        <NavLink className="mobile-link" to={pathFor(lang, 'login')}>
          {copy.nav.login}
        </NavLink>
        <a className="mobile-link" href={githubUrl} rel="noreferrer" target="_blank">
          {copy.nav.github}
        </a>
        <NavLink className="mobile-link" to={alternatePath(lang, pageKey)}>
          {copy.switchLabel}
        </NavLink>
        <ThemeSegment compact lang={lang} mode={theme.mode} setMode={theme.setMode} />
      </div>
    </header>
  );
}

function DesktopDownload({ lang }) {
  const detectedPlatform = useDetectedDesktopPlatform();
  const [selectedKey, setSelectedKey] = useState('mac');
  const copy = languages[lang];

  useEffect(() => {
    setSelectedKey(supportedPlatforms.includes(detectedPlatform) ? detectedPlatform : 'mac');
  }, [detectedPlatform]);

  const linuxFallback = desktopInstallers.find((entry) => entry.key === 'linux');
  const unknownInstaller = {
    key: 'unknown',
    name: 'Unknown',
    href: null,
    available: false,
    [lang]: {
      label: copy.home.downloadUnavailableTitle,
      button: copy.home.downloadUnavailableTitle,
      summary: copy.home.downloadUnavailableBody,
      meta: linuxFallback[lang].meta,
      note: linuxFallback[lang].note,
    },
  };
  const selectedInstaller = desktopInstallers.find((entry) => entry.key === selectedKey) || unknownInstaller;
  const availableInstallers = desktopInstallers.filter((entry) => entry.available);
  const localized = selectedInstaller[lang];
  const isDetected = selectedInstaller.key === detectedPlatform;

  return (
    <div className="download-panel" data-reveal>
      <div className="download-panel-copy">
        <p className="eyebrow">{copy.home.commandCaption}</p>
        <h2>{copy.home.installTitle}</h2>
        <p>{copy.home.installBody}</p>
      </div>

      <div className={`download-card${selectedInstaller.available ? '' : ' is-unavailable'}`}>
        <div className="download-card-top">
          <img className="download-logo" src="/zenmind-logo.svg" alt="" />
          <div>
            <p className="download-kicker">{isDetected ? copy.home.downloadDetected : copy.home.downloadManual}</p>
            <h3>{localized.button}</h3>
            <p>{localized.summary}</p>
          </div>
        </div>

        {selectedInstaller.available ? (
          <a className="download-primary" href={selectedInstaller.href} download>
            <Icon type="download" />
            <span>{localized.button}</span>
          </a>
        ) : (
          <div className="download-unavailable">
            <strong>{copy.home.downloadUnavailableTitle}</strong>
            <p>{copy.home.downloadUnavailableBody}</p>
            <div className="download-fallbacks">
              <Link className="button button-primary" to={pathFor(lang, 'documents')}>
                <span>{copy.shared.downloadFallback}</span>
                <Icon type="arrow" />
              </Link>
              <a className="button button-secondary" href={externalLinks.github} rel="noreferrer" target="_blank">
                <span>{copy.shared.openGithub}</span>
                <Icon type="external" />
              </a>
            </div>
          </div>
        )}

        <div className="download-meta">
          {localized.meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <p className="download-note">{localized.note}</p>
      </div>

      <div className="download-choices" aria-label={copy.home.downloadManual}>
        {availableInstallers.map((entry) => (
          <button
            className={`download-choice${selectedKey === entry.key ? ' is-active' : ''}`}
            key={entry.key}
            type="button"
            aria-pressed={selectedKey === entry.key}
            onClick={() => setSelectedKey(entry.key)}
          >
            <strong>{entry[lang].label}</strong>
            <span>{entry[lang].summary}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function FeatureVisual({ feature }) {
  return (
    <div className={`feature-visual feature-visual-${feature.key}`}>
      <div className="visual-window">
        <div className="visual-window-top">
          <span />
          <span />
          <span />
          <strong>{feature.visualTitle}</strong>
        </div>
        <div className="visual-window-body">
          {feature.visualRows.map((row, index) => (
            <div className="visual-row" key={row}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{row}</strong>
            </div>
          ))}
        </div>
      </div>
      <div className="visual-mini-grid">
        {feature.points.map((point) => (
          <span key={point}>{point}</span>
        ))}
      </div>
    </div>
  );
}

function RuntimeConsole({ lang }) {
  const copy = languages[lang].home;

  return (
    <aside className="runtime-console" data-reveal>
      <div className="console-top">
        <span />
        <span />
        <span />
        <strong>{copy.consoleTitle}</strong>
      </div>
      <div className="console-body">
        {copy.consoleLines.map((line) => (
          <p key={line}>
            <span>$</span> {line}
          </p>
        ))}
      </div>
    </aside>
  );
}

function HeroStats({ lang }) {
  const stats = languages[lang].home.heroStats;

  return (
    <div className="hero-stats" data-reveal>
      {stats.map((stat) => (
        <article key={stat.value}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
        </article>
      ))}
    </div>
  );
}

function FeatureStory({ lang }) {
  const copy = languages[lang].home;

  return (
    <section className="feature-story">
      <div className="section-heading feature-heading" data-reveal>
        <p className="eyebrow">{copy.featuresEyebrow}</p>
        <h2>{copy.featuresTitle}</h2>
        <p>{copy.featuresIntro}</p>
      </div>

      {copy.featureSections.map((feature, index) => (
        <article className={`feature-row${index % 2 === 1 ? ' is-reversed' : ''}`} key={feature.key} data-reveal>
          <FeatureVisual feature={feature} />
          <div className="feature-copy">
            <span className="story-index">{String(index + 1).padStart(2, '0')}</span>
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
            <ul>
              {feature.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </section>
  );
}

function HomePage({ lang }) {
  const copy = languages[lang];

  return (
    <>
      <section className="hero">
        <div className="hero-copy" data-reveal>
          <p className="eyebrow">{copy.home.eyebrow}</p>
          <h1>{copy.home.headline}</h1>
          <p className="hero-subtitle">{copy.home.subtitle}</p>
        </div>

        <DesktopDownload lang={lang} />

        <div className="hero-actions" data-reveal>
          <ButtonLink href={pathFor(lang, 'documents')} label={copy.home.primaryCta} />
          <ButtonLink href={externalLinks.github} label={copy.home.secondaryCta} variant="secondary" external />
        </div>

        <div className="hero-lower">
          <HeroStats lang={lang} />
          <RuntimeConsole lang={lang} />
        </div>
      </section>

      <FeatureStory lang={lang} />

      <section className="final-cta" data-reveal>
        <div>
          <p className="eyebrow">{copy.shared.deployDocs}</p>
          <h2>{copy.home.finalCtaTitle}</h2>
          <p>{copy.home.finalCtaBody}</p>
        </div>
        <ButtonLink href={externalLinks.deployDocs} label={copy.shared.deployDocs} external />
      </section>
    </>
  );
}

function PageHeader({ eyebrow, title, intro }) {
  return (
    <header className="page-header" data-reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{intro}</p>
    </header>
  );
}

function DocumentsPage({ lang }) {
  const copy = languages[lang];

  return (
    <section className="page-section">
      <PageHeader eyebrow={copy.documents.eyebrow} title={copy.documents.title} intro={copy.documents.intro} />
      <div className="card-grid">
        {copy.documents.cards.map((card) => (
          <a className="content-card doc-card" href={card.href} key={card.title} rel="noreferrer" target="_blank" data-reveal>
            <span className="card-kicker">{copy.shared.readDocs}</span>
            <h2>{card.title}</h2>
            <p>{card.body}</p>
            <span className="card-link">
              {copy.shared.externalLabel}
              <Icon type="external" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function NewsPage({ lang }) {
  const copy = languages[lang];

  return (
    <section className="page-section">
      <PageHeader eyebrow={copy.news.eyebrow} title={copy.news.title} intro={copy.news.intro} />
      <div className="timeline">
        {copy.news.entries.map((entry) => (
          <article className="timeline-item" key={entry.title} data-reveal>
            <span>{entry.phase}</span>
            <div>
              <h2>{entry.title}</h2>
              <p>{entry.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function statusLabel(status, copy) {
  if (status === 'preview') {
    return copy.shared.statusPreview;
  }

  if (status === 'ready') {
    return copy.shared.statusReady;
  }

  return copy.shared.statusSoon;
}

function MarketPage({ lang }) {
  const copy = languages[lang];

  return (
    <section className="page-section">
      <PageHeader eyebrow={copy.market.eyebrow} title={copy.market.title} intro={copy.market.intro} />
      <div className="market-grid">
        {copy.market.categories.map((category) => (
          <article className="content-card market-card" key={category.title} data-reveal>
            <div className="market-card-top">
              <h2>{category.title}</h2>
              <span className={`status-pill status-${category.status}`}>{statusLabel(category.status, copy)}</span>
            </div>
            <p>{category.body}</p>
            <ul>
              {category.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function LoginPage({ lang }) {
  const copy = languages[lang];

  return (
    <section className="page-section login-page">
      <PageHeader eyebrow={copy.login.eyebrow} title={copy.login.title} intro={copy.login.intro} />
      <div className="login-panels">
        {copy.login.panels.map((panel) => (
          <article className="content-card" key={panel.title} data-reveal>
            <h2>{panel.title}</h2>
            <p>{panel.body}</p>
          </article>
        ))}
      </div>
      <div className="login-actions" data-reveal>
        <ButtonLink href={pathFor(lang, 'home')} label={copy.login.cta} />
        <ButtonLink href={externalLinks.github} label={copy.shared.openGithub} variant="secondary" external />
      </div>
    </section>
  );
}

function Footer({ lang }) {
  const copy = languages[lang];

  return (
    <footer className="site-footer">
      <div>
        <p className="footer-brand">ZenMind</p>
        <p>{copy.home.footerTagline}</p>
      </div>
      <div className="footer-links">
        <a href={externalLinks.github} rel="noreferrer" target="_blank">
          {copy.footer.source}
        </a>
        <a href={externalLinks.deployRepo} rel="noreferrer" target="_blank">
          {copy.shared.deployDocs}
        </a>
        <span>&copy; 2026 ZenMind. {copy.footer.rights}</span>
      </div>
    </footer>
  );
}

function PageLayout({ lang, pageKey, theme, children }) {
  useRevealOnScroll();
  usePageMeta(lang, pageKey);

  return (
    <div className="app-shell">
      <Header lang={lang} pageKey={pageKey} theme={theme} />
      <main className="content-shell">{children}</main>
      <Footer lang={lang} />
    </div>
  );
}

function RoutedPage({ lang, pageKey, theme }) {
  const pages = {
    home: <HomePage lang={lang} />,
    documents: <DocumentsPage lang={lang} />,
    news: <NewsPage lang={lang} />,
    market: <MarketPage lang={lang} />,
    login: <LoginPage lang={lang} />,
  };

  return (
    <PageLayout lang={lang} pageKey={pageKey} theme={theme}>
      {pages[pageKey]}
    </PageLayout>
  );
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function App() {
  const theme = useThemeMode();
  const routes = useMemo(
    () =>
      ['zh', 'en'].flatMap((lang) =>
        routeOrder.map((key) => ({
          path: routeMap[lang][key],
          lang,
          key,
        })),
      ),
    [],
  );

  return (
    <>
      <ScrollToTop />
      <Routes>
        {routes.map((route) => (
          <Route
            key={`${route.lang}-${route.key}`}
            path={route.path}
            element={<RoutedPage lang={route.lang} pageKey={route.key} theme={theme} />}
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
