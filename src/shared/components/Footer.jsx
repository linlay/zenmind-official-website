import { externalLinks, languages } from '../../content';
import { pathFor } from '../routing';

const footerSiteLinks = ['documents', 'download', 'news', 'market'];

export function Footer({ lang }) {
  const copy = languages[lang];

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-block">
          <p className="footer-brand">ZenMind</p>
          <p>{copy.home.footerTagline}</p>
        </div>
        <nav className="footer-group" aria-label={copy.footer.siteLinks}>
          <p>{copy.footer.siteLinks}</p>
          <div className="footer-link-list">
            {footerSiteLinks.map((key) => (
              <a href={pathFor(lang, key)} key={key}>
                {copy.nav[key]}
              </a>
            ))}
          </div>
        </nav>
        <nav className="footer-group" aria-label={copy.footer.resources}>
          <p>{copy.footer.resources}</p>
          <div className="footer-link-list">
            <a href={externalLinks.github} rel="noreferrer" target="_blank">
              {copy.footer.source}
            </a>
            <a href={externalLinks.deployRepo} rel="noreferrer" target="_blank">
              {copy.shared.deployDocs}
            </a>
          </div>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>&copy; 2026 ZenMind. {copy.footer.rights}</span>
      </div>
    </footer>
  );
}
