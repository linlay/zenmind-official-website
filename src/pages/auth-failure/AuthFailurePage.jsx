import { Link, useLocation } from 'react-router-dom';
import { languages } from '../../content';
import { Icon } from '../../shared/components/Icon';
import { PageHeader } from '../../shared/components/PageHeader';
import { pathFor } from '../../shared/routing';

export function AuthFailurePage({ lang }) {
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
