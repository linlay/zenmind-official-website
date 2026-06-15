import { externalLinks, languages } from '../../content';
import { marketHrefFor, pathFor } from '../routing';

const footerSiteLinks = ['documents', 'download', 'news'];

export function Footer({ lang }) {
  const copy = languages[lang];
  const footerLinks = [
    ...footerSiteLinks.map((key) => ({
      href: pathFor(lang, key),
      label: copy.nav[key],
    })),
    {
      href: marketHrefFor(lang),
      label: copy.nav.market,
      external: true,
    },
    {
      href: externalLinks.github,
      label: copy.nav.github,
      external: true,
    },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-bar">
        <a className="footer-brand" href={pathFor(lang, 'home')}>
          ZenMind
        </a>
        <nav className="footer-links" aria-label={copy.footer.siteLinks}>
          {footerLinks.map((link) => (
            <a
              href={link.href}
              key={`${link.href}-${link.label}`}
              rel={link.external ? 'noreferrer' : undefined}
              target={link.external ? '_blank' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className="footer-copyright">&copy; 2026 ZenMind</p>
      </div>
    </footer>
  );
}
