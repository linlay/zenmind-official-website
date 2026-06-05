import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { desktopInstallers, externalLinks, githubUrl, languages, routeMap, siteUrl } from './site-data';

const pageOrder = ['home', 'documents', 'news', 'market', 'download'];
const routeOrder = [
  'home',
  'download',
  'documents',
  'news',
  'market',
  'login',
  'profile',
  'adminLogin',
  'admin',
  'authFailure',
];
const themeModes = ['auto', 'light', 'dark'];
const themeStorageKey = 'zenmind:theme';
const downloadCountStoragePrefix = 'zenmind:download-counted:';
const apiBase = import.meta.env.VITE_API_BASE || '/api';

async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error?.message || data.message || 'Request failed.';
    throw new Error(message);
  }

  return data;
}

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

function downloadCountedStorageKey(installerKey) {
  return `${downloadCountStoragePrefix}${installerKey}`;
}

function hasCountedDownload(installerKey) {
  try {
    return window.localStorage.getItem(downloadCountedStorageKey(installerKey)) === '1';
  } catch {
    return false;
  }
}

function markDownloadCounted(installerKey) {
  try {
    window.localStorage.setItem(downloadCountedStorageKey(installerKey), '1');
  } catch {
    // The download should continue even when browser storage is unavailable.
  }
}

function recordDownloadEvent(installerKey) {
  fetch(`${apiBase}/downloads/events`, {
    method: 'POST',
    credentials: 'include',
    keepalive: true,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ installerKey }),
  }).catch(() => {});
}

function useDownloadTotals() {
  const [totals, setTotals] = useState({});

  useEffect(() => {
    let cancelled = false;

    apiRequest('/downloads/stats')
      .then((data) => {
        if (!cancelled) {
          setTotals(data.totals || {});
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTotals({});
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const incrementLocalTotal = useCallback((installerKey) => {
    setTotals((current) => ({
      ...current,
      [installerKey]: Number(current[installerKey] || 0) + 1,
    }));
  }, []);

  return { totals, incrementLocalTotal };
}

function useAuthSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/auth/me');
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setError('');
    try {
      await apiRequest('/auth/logout', { method: 'POST', body: '{}' });
      setUser(null);
      return true;
    } catch (err) {
      setError(err.message || 'Logout failed.');
      return false;
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { user, setUser, loading, error, refresh, logout };
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
    monitor: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </>
    ),
    moon: <path d="M20 14.5A7.2 7.2 0 0 1 9.5 4a7.8 7.8 0 1 0 10.5 10.5Z" />,
  };

  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {paths[type]}
    </svg>
  );
}

function accountInitial(user) {
  const source = user?.email || user?.name || 'Z';
  return source.trim().slice(0, 1).toUpperCase();
}

function isAdminUser(user) {
  return user?.role === 'admin' || user?.role === 'administrator';
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

function isExternalHref(href) {
  return /^https?:\/\//.test(href);
}

function CardActionLink({ href, children, className = 'card-link' }) {
  if (isExternalHref(href)) {
    return (
      <a className={className} href={href} rel="noreferrer" target="_blank">
        {children}
      </a>
    );
  }

  return (
    <Link className={className} to={href}>
      {children}
    </Link>
  );
}

function ThemeSegment({ lang, mode, setMode, compact = false }) {
  const labels = languages[lang].theme;
  const icons = {
    auto: 'monitor',
    light: 'sun',
    dark: 'moon',
  };

  return (
    <div className={`theme-segment${compact ? ' is-compact' : ''}`} role="group" aria-label={labels.label}>
      {themeModes.map((themeMode) => (
        <button
          key={themeMode}
          className={`theme-option${mode === themeMode ? ' is-active' : ''}`}
          type="button"
          aria-label={labels[themeMode]}
          aria-pressed={mode === themeMode}
          title={labels[themeMode]}
          onClick={() => setMode(themeMode)}
        >
          <Icon type={icons[themeMode]} />
        </button>
      ))}
    </div>
  );
}

function AccountMenu({ lang, auth }) {
  const copy = languages[lang];
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!auth.user) {
      setOpen(false);
    }
  }, [auth.user]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (!auth.user) {
    return (
      <NavLink className="login-link" to={pathFor(lang, 'login')}>
        {copy.nav.login}
      </NavLink>
    );
  }

  const initial = accountInitial(auth.user);
  const accountLabel = auth.user.email || auth.user.name || copy.shared.currentAccount;

  return (
    <div className="account-menu" ref={menuRef}>
      <button
        className="account-trigger"
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={copy.shared.currentAccount}
        onClick={() => setOpen((value) => !value)}
      >
        {initial}
      </button>
      {open ? (
        <div className="account-popover" role="menu">
          <div className="account-summary">
            <span>{copy.shared.currentAccount}</span>
            <strong>{accountLabel}</strong>
          </div>
          <a
            className="account-menu-item"
            href={pathFor(lang, 'profile')}
            rel="noopener noreferrer"
            role="menuitem"
            target="_blank"
          >
            {copy.shared.openProfile}
          </a>
          <button
            className="account-menu-item"
            role="menuitem"
            type="button"
            onClick={async () => {
              const loggedOut = await auth.logout();
              if (loggedOut) {
                setOpen(false);
              }
            }}
          >
            {copy.shared.logout}
          </button>
          {auth.error ? <p className="account-error">{auth.error}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function Header({ lang, pageKey, theme, auth }) {
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
        <AccountMenu auth={auth} lang={lang} />
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
        {auth.user ? (
          <>
            <a
              className="mobile-link"
              href={pathFor(lang, 'profile')}
              rel="noopener noreferrer"
              target="_blank"
            >
              {copy.shared.openProfile}
            </a>
            <button className="mobile-link mobile-action" type="button" onClick={auth.logout}>
              {copy.shared.logout}
            </button>
            {auth.error ? <p className="mobile-menu-error">{auth.error}</p> : null}
          </>
        ) : (
          <NavLink className="mobile-link" to={pathFor(lang, 'login')}>
            {copy.nav.login}
          </NavLink>
        )}
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

function DesktopDownload({ lang, compact = false }) {
  const detectedPlatform = useDetectedDesktopPlatform();
  const copy = languages[lang];
  const { totals, incrementLocalTotal } = useDownloadTotals();
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
  const selectedInstaller = desktopInstallers.find((entry) => entry.key === detectedPlatform) || unknownInstaller;
  const localized = selectedInstaller[lang];
  const selectedTotal = Number(totals[selectedInstaller.key] || 0);

  const handleDownloadClick = () => {
    if (!selectedInstaller.available || hasCountedDownload(selectedInstaller.key)) {
      return;
    }
    markDownloadCounted(selectedInstaller.key);
    incrementLocalTotal(selectedInstaller.key);
    recordDownloadEvent(selectedInstaller.key);
  };

  return (
    <div className={`download-panel${compact ? ' is-compact' : ''}${selectedInstaller.available ? '' : ' is-unavailable'}`} data-reveal>
      {selectedInstaller.available ? (
        <>
          <a className="download-primary" href={selectedInstaller.href} download onClick={handleDownloadClick}>
            <Icon type="download" />
            <span>{localized.button}</span>
          </a>
          <span className="download-count">
            {copy.shared.downloadTotalPrefix}
            <strong>{selectedTotal.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}</strong>
            {copy.shared.downloadTotalSuffix}
          </span>
        </>
      ) : (
        <div className="download-unavailable">
          <strong>{copy.home.downloadUnavailableTitle}</strong>
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

function HeroProductPreview({ lang }) {
  const copy = languages[lang].home;
  const previewItems = copy.capabilityCards.slice(0, 4);

  return (
    <aside className="hero-product-preview" data-reveal aria-label={copy.featuresTitle}>
      <div className="desktop-preview-window">
        <div className="visual-window-top">
          <span />
          <span />
          <span />
          <strong>ZenMind Desktop</strong>
        </div>
        <div className="desktop-preview-body">
          <div className="desktop-preview-nav" aria-hidden="true">
            {previewItems.map((item) => (
              <span key={item.key}>{item.title}</span>
            ))}
          </div>
          <div className="desktop-preview-main">
            {previewItems.map((item, index) => (
              <article className={index === 0 ? 'is-active' : ''} key={item.key}>
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

function HomePortalSection({ lang, auth }) {
  const copy = languages[lang].home;
  const entries = copy.portalEntries.map((entry) => {
    if (entry.key !== 'profile') {
      return entry;
    }

    return {
      ...entry,
      href: auth.user ? pathFor(lang, 'profile') : pathFor(lang, 'login'),
      title: auth.user ? entry.title : languages[lang].nav.login,
    };
  });

  return (
    <section className="home-portal-section">
      <div className="section-heading home-section-heading" data-reveal>
        <p className="eyebrow">{copy.portalEyebrow}</p>
        <h2>{copy.portalTitle}</h2>
        <p>{copy.portalIntro}</p>
      </div>
      <div className="home-portal-grid">
        {entries.map((entry) => (
          <article className="content-card home-portal-card" data-reveal key={entry.key}>
            <span className="card-kicker">{entry.key}</span>
            <h3>{entry.title}</h3>
            <p>{entry.body}</p>
            <CardActionLink href={entry.href}>
              {entry.title}
              <Icon type="arrow" />
            </CardActionLink>
          </article>
        ))}
      </div>
    </section>
  );
}

function HomeCapabilitySection({ lang }) {
  const copy = languages[lang].home;

  return (
    <section className="home-capability-section">
      <div className="section-heading home-section-heading" data-reveal>
        <p className="eyebrow">{copy.featuresEyebrow}</p>
        <h2>{copy.featuresTitle}</h2>
        <p>{copy.featuresIntro}</p>
      </div>
      <div className="home-capability-grid">
        {copy.capabilityCards.map((card, index) => (
          <article className="content-card home-capability-card" data-reveal key={card.key}>
            <span className="story-index">{String(index + 1).padStart(2, '0')}</span>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </article>
        ))}
      </div>
    </section>
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

function HomePage({ lang, auth }) {
  const copy = languages[lang];
  const authHref = auth.user ? pathFor(lang, 'profile') : pathFor(lang, 'login');
  const authLabel = auth.user ? copy.shared.openProfile : copy.home.secondaryCta;

  return (
    <>
      <section className="hero">
        <div className="hero-main">
          <div className="hero-copy" data-reveal>
            <p className="eyebrow">{copy.home.eyebrow}</p>
            <h1>{copy.home.headline}</h1>
            <p>{copy.home.heroIntro}</p>
          </div>

          <div className="hero-actions" data-reveal>
            <DesktopDownload compact lang={lang} />
            <ButtonLink href={pathFor(lang, 'documents')} label={copy.home.primaryCta} variant="secondary" />
            <ButtonLink href={authHref} label={authLabel} variant="secondary" />
          </div>

          <HeroStats lang={lang} />
        </div>

        <HeroProductPreview lang={lang} />
      </section>

      <HomePortalSection auth={auth} lang={lang} />

      <HomeCapabilitySection lang={lang} />

      <section className="final-cta" data-reveal>
        <div>
          <p className="eyebrow">{copy.shared.downloadDesktop}</p>
          <h2>{copy.home.finalCtaTitle}</h2>
          <p>{copy.home.finalCtaBody}</p>
        </div>
        <div className="final-cta-actions">
          <ButtonLink href={pathFor(lang, 'download')} label={copy.shared.downloadDesktop} />
          <ButtonLink href={pathFor(lang, 'documents')} label={copy.nav.documents} variant="secondary" />
          <ButtonLink href={pathFor(lang, 'market')} label={copy.nav.market} variant="secondary" />
        </div>
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

function PlaceholderPage({ lang, pageKey }) {
  const copy = languages[lang];
  const pageCopy = copy[pageKey] || {};
  const fallbackLabel = copy.nav[pageKey] || pageKey;
  const eyebrow = pageCopy.eyebrow || fallbackLabel;
  const title = pageCopy.title || fallbackLabel;
  const intro = pageCopy.intro || fallbackLabel;

  return (
    <section className="page-section">
      <PageHeader eyebrow={eyebrow} title={title} intro={intro} />
    </section>
  );
}

function UsageMetricCard({ label, value, note }) {
  return (
    <article className="usage-metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {note ? <small>{note}</small> : null}
    </article>
  );
}

function UsagePlaceholderChart({ title, copy }) {
  return (
    <article className="usage-chart-card content-card">
      <h2>{title}</h2>
      <div className="usage-bars" aria-hidden="true">
        {[42, 68, 36, 74, 52, 60, 46].map((height, index) => (
          <span key={`${title}-${index}`} style={{ '--bar-height': `${height}%` }} />
        ))}
      </div>
      <p>{copy.shared.usagePreparing}</p>
    </article>
  );
}

function AccountOverview({ lang, user }) {
  const copy = languages[lang];

  return (
    <article className="content-card account-overview-card">
      <h2>{copy.profile.accountTitle}</h2>
      <dl>
        <div>
          <dt>{copy.profile.fields.email}</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>{copy.profile.fields.provider}</dt>
          <dd>{user.authProvider || '-'}</dd>
        </div>
        <div>
          <dt>{copy.profile.fields.role}</dt>
          <dd>{user.role || '-'}</dd>
        </div>
        <div>
          <dt>{copy.profile.fields.status}</dt>
          <dd>{copy.login.signedIn}</dd>
        </div>
      </dl>
    </article>
  );
}

function DocSection({ section, copy }) {
  return (
    <section className="docs-section" data-reveal>
      <div className="subsection-heading">
        <span className="card-kicker">{copy.documents.sectionLabel}</span>
        <h2>{section.title}</h2>
        <p>{section.intro}</p>
      </div>
      <div className="docs-section-grid">
        {section.cards.map((card) => (
          <article className="content-card doc-card" key={card.title}>
            <div className="doc-card-top">
              <span className="card-kicker">{card.audience}</span>
              <span className={`status-pill status-${card.status}`}>{statusLabel(card.status, copy)}</span>
            </div>
            <h2>{card.title}</h2>
            <p>{card.body}</p>
            <CardActionLink href={card.href}>
              {copy.documents.actionLabel}
              <Icon type="arrow" />
            </CardActionLink>
          </article>
        ))}
      </div>
    </section>
  );
}

function DocumentsPage({ lang }) {
  const copy = languages[lang];

  return (
    <section className="page-section docs-page">
      <PageHeader eyebrow={copy.documents.eyebrow} title={copy.documents.title} intro={copy.documents.intro} />
      <div className="docs-stack">
        {copy.documents.docSections.map((section) => (
          <DocSection copy={copy} key={section.title} section={section} />
        ))}
      </div>
    </section>
  );
}

function NewsSection({ title, intro, entries, copy, variant }) {
  return (
    <section className={`news-section news-section-${variant}`} data-reveal>
      <div className="subsection-heading">
        <span className="card-kicker">{copy.news.eyebrow}</span>
        <h2>{title}</h2>
        <p>{intro}</p>
      </div>
      <div className="news-section-grid">
        {entries.map((entry) => (
          <article className="content-card news-card" key={entry.title}>
            <div className="news-card-top">
              <span className="card-kicker">{entry.phase}</span>
              {entry.status ? <span className={`status-pill status-${entry.status}`}>{statusLabel(entry.status, copy)}</span> : null}
            </div>
            <h2>{entry.title}</h2>
            <p>{entry.body}</p>
            {entry.href ? (
              <a className="card-link" href={entry.href} rel="noreferrer" target="_blank">
                {copy.news.sourceLabel}: {entry.source}
                <Icon type="external" />
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function NewsPage({ lang }) {
  const copy = languages[lang];

  return (
    <section className="page-section news-page">
      <PageHeader eyebrow={copy.news.eyebrow} title={copy.news.title} intro={copy.news.intro} />
      <div className="news-stack">
        <NewsSection
          copy={copy}
          entries={copy.news.productUpdates}
          intro={copy.news.productIntro}
          title={copy.news.productTitle}
          variant="product"
        />
        <NewsSection
          copy={copy}
          entries={copy.news.industryTrends}
          intro={copy.news.industryIntro}
          title={copy.news.industryTitle}
          variant="industry"
        />
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

function MarketCategorySection({ category, copy }) {
  return (
    <article className="content-card market-card" data-reveal>
      <div className="market-card-top">
        <div>
          <span className="card-kicker">{category.key}</span>
          <h2>{category.title}</h2>
        </div>
        <span className={`status-pill status-${category.status}`}>{statusLabel(category.status, copy)}</span>
      </div>
      <p>{category.body}</p>
      <div className="market-tag-list" aria-label={copy.market.taskLabel}>
        {category.taskTags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <ul>
        {category.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <CardActionLink className="button button-secondary market-action" href={category.href}>
        <span>{copy.market.actionLabel}</span>
        <Icon type="arrow" />
      </CardActionLink>
    </article>
  );
}

function MarketPage({ lang }) {
  const copy = languages[lang];

  return (
    <section className="page-section market-page">
      <PageHeader eyebrow={copy.market.eyebrow} title={copy.market.title} intro={copy.market.intro} />
      <div className="subsection-heading market-overview-heading" data-reveal>
        <span className="card-kicker">{copy.market.sectionLabel}</span>
        <h2>{copy.market.title}</h2>
      </div>
      <div className="market-grid">
        {copy.market.categories.map((category) => (
          <MarketCategorySection category={category} copy={copy} key={category.key} />
        ))}
      </div>
    </section>
  );
}

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

function DownloadPage({ lang }) {
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

function SignedInPanel({ lang, auth }) {
  const copy = languages[lang];
  const user = auth.user;

  return (
    <article className="login-form content-card login-minimal-card signed-in-panel">
      <span className="status-pill status-ready">{copy.login.signedIn}</span>
      <h2>{copy.login.welcome}</h2>
      <dl>
        <div>
          <dt>{copy.login.accountLabel}</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>{copy.login.roleLabel}</dt>
          <dd>{user.role}</dd>
        </div>
        <div>
          <dt>{copy.login.providerLabel}</dt>
          <dd>{user.authProvider}</dd>
        </div>
      </dl>
      {auth.error ? <p className="login-error">{auth.error}</p> : null}
      <div className="login-panel-actions">
        <a className="button button-primary" href={pathFor(lang, 'profile')} rel="noopener noreferrer" target="_blank">
          <span>{copy.login.profileCta}</span>
          <Icon type="external" />
        </a>
        <Link className="button button-secondary" to={pathFor(lang, 'home')}>
          <span>{copy.login.homeCta}</span>
          <Icon type="arrow" />
        </Link>
        <button className="button button-secondary" type="button" onClick={auth.logout}>
          <span>{copy.login.logout}</span>
        </button>
      </div>
    </article>
  );
}

function ProfilePage({ lang, auth }) {
  const copy = languages[lang];
  const user = auth.user;

  if (auth.loading) {
    return (
      <section className="page-section profile-page">
        <PageHeader eyebrow={copy.profile.eyebrow} title={copy.profile.title} intro={copy.login.checking} />
      </section>
    );
  }

  if (!user) {
    return (
      <section className="page-section profile-page">
        <PageHeader eyebrow={copy.profile.eyebrow} title={copy.profile.loginPromptTitle} intro={copy.profile.loginPromptBody} />
        <Link className="button button-primary" to={pathFor(lang, 'login')}>
          <span>{copy.profile.signInCta}</span>
          <Icon type="arrow" />
        </Link>
      </section>
    );
  }

  return (
    <section className="page-section profile-page">
      <PageHeader eyebrow={copy.profile.eyebrow} title={copy.profile.title} intro={copy.profile.intro} />
      <div className="profile-dashboard" data-reveal>
        <AccountOverview lang={lang} user={user} />

        <article className="content-card usage-summary-card">
          <div className="profile-section-top">
            <div>
              <h2>{copy.profile.usageTitle}</h2>
              <p>{copy.shared.usagePreparing}</p>
            </div>
            <span className="status-pill status-preview">{copy.shared.statusPreview}</span>
          </div>
          <div className="usage-metric-grid">
            <UsageMetricCard label={copy.profile.metrics.calls} value={copy.profile.emptyMetric} />
            <UsageMetricCard label={copy.profile.metrics.tokens} value={copy.profile.emptyMetric} />
            <UsageMetricCard label={copy.profile.metrics.cost} value={copy.profile.emptyMetric} />
            <UsageMetricCard label={copy.profile.metrics.recentModel} value={copy.profile.emptyMetric} />
          </div>
        </article>

        <UsagePlaceholderChart title={copy.profile.trendsTitle} copy={copy} />
        <UsagePlaceholderChart title={copy.profile.providersTitle} copy={copy} />

        <article className="content-card profile-settings-card">
          <h2>{copy.profile.settingsTitle}</h2>
          <p>{copy.profile.settingsBody}</p>
          <div className="profile-actions">
            <Link className="button button-primary" to={pathFor(lang, 'download')}>
              <Icon type="download" />
              <span>{copy.shared.downloadDesktop}</span>
            </Link>
            <Link className="button button-secondary" to={pathFor(lang, 'documents')}>
              <span>{copy.shared.readDocs}</span>
              <Icon type="arrow" />
            </Link>
            <button className="button button-secondary" type="button" onClick={auth.logout}>
              <span>{copy.shared.logout}</span>
            </button>
          </div>
          {auth.error ? <p className="profile-error">{auth.error}</p> : null}
        </article>
      </div>
    </section>
  );
}

function AdminPage({ lang, auth }) {
  const copy = languages[lang];
  const empty = copy.profile.emptyMetric;

  if (auth.loading) {
    return (
      <section className="page-section admin-page">
        <PageHeader eyebrow={copy.admin.eyebrow} title={copy.admin.title} intro={copy.login.checking} />
      </section>
    );
  }

  if (!auth.user) {
    return (
      <section className="page-section admin-page">
        <PageHeader eyebrow={copy.admin.loginRequiredTitle} title={copy.admin.loginRequiredTitle} intro={copy.admin.loginRequiredBody} />
        <Link className="button button-primary" to={pathFor(lang, 'adminLogin')}>
          <span>{copy.admin.loginCta}</span>
          <Icon type="arrow" />
        </Link>
      </section>
    );
  }

  if (!isAdminUser(auth.user)) {
    return (
      <section className="page-section admin-page">
        <PageHeader eyebrow={copy.admin.noPermissionTitle} title={copy.admin.noPermissionTitle} intro={copy.admin.noPermissionBody} />
      </section>
    );
  }

  return (
    <section className="page-section admin-page">
      <PageHeader eyebrow={copy.admin.eyebrow} title={copy.admin.title} intro={copy.admin.intro} />
      <div className="admin-dashboard" data-reveal>
        <article className="content-card admin-overview-card">
          <div className="profile-section-top">
            <div>
              <h2>{copy.admin.overviewTitle}</h2>
            </div>
            <span className="status-pill status-preview">{copy.shared.usagePreparing}</span>
          </div>
          <div className="usage-metric-grid admin-metric-grid">
            <UsageMetricCard label={copy.admin.metrics.calls} value={empty} />
            <UsageMetricCard label={copy.admin.metrics.tokens} value={empty} />
            <UsageMetricCard label={copy.admin.metrics.cost} value={empty} />
            <UsageMetricCard label={copy.admin.metrics.users} value={empty} />
            <UsageMetricCard label={copy.admin.metrics.downloads} value={empty} />
            <UsageMetricCard label={copy.admin.metrics.providers} value={empty} />
          </div>
        </article>

        <UsagePlaceholderChart title={copy.admin.trendsTitle} copy={copy} />
        <UsagePlaceholderChart title={copy.admin.metrics.providers} copy={copy} />

        <article className="content-card admin-activity-card">
          <h2>{copy.admin.activityTitle}</h2>
          <p>{copy.shared.usagePreparing}</p>
        </article>
      </div>
    </section>
  );
}

function LoginPage({ lang, auth }) {
  const copy = languages[lang];
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState('');

  const user = auth.user;
  const loading = auth.loading;

  const disabled = loading || submitting || sendingCode || Boolean(user);

  const handleSendCode = async () => {
    setError('');
    setSendingCode(true);

    try {
      await apiRequest('/auth/email-code/start', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setCodeSent(true);
    } catch (err) {
      setError(err.message || copy.login.errorFallback);
    } finally {
      setSendingCode(false);
    }
  };

  const handleEmailCodeSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const data = await apiRequest('/auth/email-code/verify', {
        method: 'POST',
        body: JSON.stringify({ email, code }),
      });
      auth.setUser(data.user);
      setCode('');
    } catch (err) {
      setError(err.message || copy.login.errorFallback);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.assign(`${apiBase}/auth/google/start`);
  };

  return (
    <section className="page-section login-page auth-page login-atmosphere">
      <div className="login-minimal-shell" data-reveal>
        {user ? (
          <SignedInPanel auth={auth} lang={lang} />
        ) : (
          <article className="login-form content-card login-entry-panel login-minimal-card">
            <div>
              <span className="card-kicker">{copy.login.eyebrow}</span>
              <h1>{copy.login.title}</h1>
              <p>{copy.login.intro}</p>
            </div>
            <form className="email-code-form" onSubmit={handleEmailCodeSubmit}>
              <label>
                <span>{copy.login.emailLabel}</span>
                <input
                  autoComplete="email"
                  disabled={disabled}
                  inputMode="email"
                  name="email"
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
              <div className="login-code-row">
                <label>
                  <span>{copy.login.codeLabel}</span>
                  <input
                    autoComplete="one-time-code"
                    disabled={disabled}
                    inputMode="numeric"
                    maxLength={6}
                    name="code"
                    pattern="[0-9]{6}"
                    placeholder={copy.login.codePlaceholder}
                    required
                    type="text"
                    value={code}
                    onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                </label>
                <button className="button button-secondary login-code-button" disabled={disabled || !email} type="button" onClick={handleSendCode}>
                  <span>{sendingCode ? copy.login.sendingCode : codeSent ? copy.login.resendCode : copy.login.sendCode}</span>
                </button>
              </div>
              {codeSent ? <p className="login-hint">{copy.login.codeSent}</p> : null}
              {error ? <p className="login-error">{error}</p> : null}
              <button className="button button-primary login-submit" disabled={disabled || code.length !== 6} type="submit">
                <span>{submitting ? copy.login.verifyingCode : copy.login.verifySubmit}</span>
                <Icon type="arrow" />
              </button>
            </form>
            <div className="login-divider">
              <span />
              <strong>{copy.login.separator}</strong>
              <span />
            </div>
            <button className="button button-secondary login-submit google-submit" disabled={disabled} type="button" onClick={handleGoogleLogin}>
              <span>{copy.login.googleSubmit}</span>
              <Icon type="external" />
            </button>
          </article>
        )}
      </div>
    </section>
  );
}

function AdminLoginPage({ lang, auth }) {
  const copy = languages[lang];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      auth.setUser(data.user);
      window.location.assign(pathFor(lang, 'admin'));
    } catch (err) {
      setError(err.message || copy.adminLogin.errorFallback);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-section login-page auth-page admin-login-page login-atmosphere">
      <div className="login-minimal-shell admin-login-minimal-shell" data-reveal>
        <article className="login-form content-card login-entry-panel login-minimal-card admin-login-minimal-card">
          <div>
            <span className="card-kicker">{copy.adminLogin.eyebrow}</span>
            <h1>{copy.adminLogin.title}</h1>
            <p>{copy.adminLogin.intro}</p>
          </div>
          <form className="email-code-form" onSubmit={handleSubmit}>
            <label>
              <span>{copy.adminLogin.emailLabel}</span>
              <input
                autoComplete="email"
                disabled={submitting}
                inputMode="email"
                name="email"
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label>
              <span>{copy.adminLogin.passwordLabel}</span>
              <input
                autoComplete="current-password"
                disabled={submitting}
                name="password"
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {error ? <p className="login-error">{error}</p> : null}
            <button className="button button-primary login-submit" disabled={submitting || !email || !password} type="submit">
              <span>{submitting ? copy.adminLogin.submitting : copy.adminLogin.submit}</span>
              <Icon type="arrow" />
            </button>
          </form>
          <p className="admin-security-note">{copy.adminLogin.securityNote}</p>
        </article>
      </div>
    </section>
  );
}

function AuthFailurePage({ lang }) {
  const copy = languages[lang];
  const location = useLocation();
  const reason = new URLSearchParams(location.search).get('error') || copy.authFailure.unknownReason;

  return (
    <section className="page-section auth-failure-page">
      <PageHeader eyebrow={copy.authFailure.eyebrow} title={copy.authFailure.title} intro={copy.authFailure.intro} />
      <article className="content-card auth-failure-card" data-reveal>
        <span className="status-pill status-soon">{copy.authFailure.status}</span>
        <dl className="auth-failure-reason">
          <div>
            <dt>{copy.authFailure.reasonLabel}</dt>
            <dd>{reason}</dd>
          </div>
        </dl>
        <p>{copy.authFailure.reasonHelp}</p>
        <div className="auth-failure-actions">
          <Link className="button button-primary" to={pathFor(lang, 'login')}>
            <span>{copy.authFailure.loginCta}</span>
            <Icon type="arrow" />
          </Link>
          <Link className="button button-secondary" to={pathFor(lang, 'home')}>
            <span>{copy.authFailure.homeCta}</span>
            <Icon type="arrow" />
          </Link>
        </div>
      </article>
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

function PageLayout({ lang, pageKey, theme, auth, children }) {
  useRevealOnScroll();
  usePageMeta(lang, pageKey);

  return (
    <div className="app-shell">
      <Header auth={auth} lang={lang} pageKey={pageKey} theme={theme} />
      <main className="content-shell">{children}</main>
      <Footer lang={lang} />
    </div>
  );
}

function RoutedPage({ lang, pageKey, theme, auth }) {
  const pages = {
    home: <HomePage lang={lang} auth={auth} />,
    download: <DownloadPage lang={lang} />,
    documents: <DocumentsPage lang={lang} />,
    news: <NewsPage lang={lang} />,
    market: <MarketPage lang={lang} />,
    login: <LoginPage lang={lang} auth={auth} />,
    profile: <ProfilePage lang={lang} auth={auth} />,
    adminLogin: <AdminLoginPage lang={lang} auth={auth} />,
    admin: <AdminPage lang={lang} auth={auth} />,
    authFailure: <AuthFailurePage lang={lang} />,
  };

  return (
    <PageLayout auth={auth} lang={lang} pageKey={pageKey} theme={theme}>
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
  const auth = useAuthSession();
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
            element={<RoutedPage auth={auth} lang={route.lang} pageKey={route.key} theme={theme} />}
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
