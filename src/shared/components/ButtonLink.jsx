import { Link } from 'react-router-dom';
import { Icon } from './Icon';

export function ButtonLink({ href, label, variant = 'primary', external = false, showIcon = true }) {
  const className = `button button-${variant}`;

  if (external) {
    return (
      <a className={className} href={href} rel="noreferrer" target="_blank">
        <span>{label}</span>
        {showIcon ? <Icon type="external" /> : null}
      </a>
    );
  }

  return (
    <Link className={className} to={href}>
      <span>{label}</span>
      {showIcon ? <Icon type="arrow" /> : null}
    </Link>
  );
}
