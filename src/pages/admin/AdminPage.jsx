import { Link } from 'react-router-dom';
import { languages } from '../../content';
import { isAdminUser } from '../../shared/auth';
import { Icon } from '../../shared/components/Icon';
import { PageHeader } from '../../shared/components/PageHeader';
import { UsageMetricCard } from '../../shared/components/UsageMetricCard';
import { UsagePlaceholderChart } from '../../shared/components/UsagePlaceholderChart';
import { pathFor } from '../../shared/routing';

export function AdminPage({ lang, auth }) {
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
