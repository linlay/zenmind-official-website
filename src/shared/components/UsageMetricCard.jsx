export function UsageMetricCard({ label, value, note }) {
  return (
    <article className="usage-metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {note ? <small>{note}</small> : null}
    </article>
  );
}
