export function PageHeader({ eyebrow, title, intro }) {
  return (
    <header className="page-header" data-reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{intro}</p>
    </header>
  );
}
