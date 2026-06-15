import { Link } from 'react-router-dom';

function isExternalHref(href) {
  return /^https?:\/\//.test(href);
}

export function CardActionLink({ href, children, className = 'card-link', external = false }) {
  if (external || isExternalHref(href)) {
    return (
      <a className={className} href={href} rel="noreferrer" target="_blank">
        {children}
      </a>
    );
  }

  return (
    <Link className={className} to={href}>
      {children}
    </Link>
  );
}
