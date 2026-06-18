import { Link } from 'react-router-dom';
import { languages } from '../../content';
import { apiBase } from '../../shared/api';
import { Icon } from '../../shared/components/Icon';
import { pathFor } from '../../shared/routing';

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

export function LoginPage({ lang, auth }) {
  const copy = languages[lang];

  const user = auth.user;
  const loading = auth.loading;
  const disabled = loading || Boolean(user);

  const handleSsoLogin = () => {
    window.location.assign(`${apiBase}/auth/sso/session?rd=${encodeURIComponent(pathFor(lang, 'profile'))}`);
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
            <p className="sso-login-note">{copy.login.sessionBody}</p>
            <button className="button button-primary login-submit" disabled={disabled} type="button" onClick={handleSsoLogin}>
              <span>{loading ? copy.login.checking : copy.login.ssoSubmit}</span>
              <Icon type="external" />
            </button>
          </article>
        )}
      </div>
    </section>
  );
}
