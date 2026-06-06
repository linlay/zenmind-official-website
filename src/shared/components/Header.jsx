import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { githubUrl, languages } from '../../content';
import { alternatePath, pathFor } from '../routing';
import { AccountMenu } from './AccountMenu';
import { Icon } from './Icon';
import { ThemeSegment } from './ThemeSegment';

const pageOrder = ['home', 'documents', 'news', 'market', 'download'];

export function Header({ lang, pageKey, theme, auth }) {
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
