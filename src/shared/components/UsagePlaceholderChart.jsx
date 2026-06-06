export function UsagePlaceholderChart({ title, copy }) {
  return (
    <article className="usage-chart-card content-card">
      <h2>{title}</h2>
      <div className="usage-bars" aria-hidden="true">
        {[42, 68, 36, 74, 52, 60, 46].map((height, index) => (
          <span key={`${title}-${index}`} style={{ '--bar-height': `${height}%` }} />
        ))}
      </div>
      <p>{copy.shared.usagePreparing}</p>
    </article>
  );
}
