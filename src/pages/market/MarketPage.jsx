import { languages } from '../../content';
import { CardActionLink } from '../../shared/components/CardActionLink';
import { Icon } from '../../shared/components/Icon';
import { PageHeader } from '../../shared/components/PageHeader';
import { statusLabel } from '../../shared/status';

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

export function MarketPage({ lang }) {
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
