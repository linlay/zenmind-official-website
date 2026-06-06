import { useState } from 'react';
import { languages } from '../../content';
import { apiRequest } from '../../shared/api';
import { Icon } from '../../shared/components/Icon';
import { pathFor } from '../../shared/routing';

export function AdminLoginPage({ lang, auth }) {
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
