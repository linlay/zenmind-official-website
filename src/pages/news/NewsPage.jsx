import { languages } from '../../content';
import { Icon } from '../../shared/components/Icon';
import { PageHeader } from '../../shared/components/PageHeader';
import { statusLabel } from '../../shared/status';

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

export function NewsPage({ lang }) {
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
