import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { languages } from '../../content';
import { pathFor } from '../routing';

function accountInitial(user) {
  const source = user?.email || user?.name || 'Z';
  return source.trim().slice(0, 1).toUpperCase();
}

export function AccountMenu({ lang, auth }) {
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
