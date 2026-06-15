import { languages } from '../../content';
import { CardActionLink } from '../../shared/components/CardActionLink';
import { Icon } from '../../shared/components/Icon';
import { PageHeader } from '../../shared/components/PageHeader';
import { statusLabel } from '../../shared/status';

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
            <CardActionLink external={card.external} href={card.href}>
              {copy.documents.actionLabel}
              <Icon type="arrow" />
            </CardActionLink>
          </article>
        ))}
      </div>
    </section>
  );
}

export function DocumentsPage({ lang }) {
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
