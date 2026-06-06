import { Link } from 'react-router-dom';
import { languages } from '../../content';
import { Icon } from '../../shared/components/Icon';
import { PageHeader } from '../../shared/components/PageHeader';
import { UsageMetricCard } from '../../shared/components/UsageMetricCard';
import { UsagePlaceholderChart } from '../../shared/components/UsagePlaceholderChart';
import { pathFor } from '../../shared/routing';

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

export function ProfilePage({ lang, auth }) {
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
