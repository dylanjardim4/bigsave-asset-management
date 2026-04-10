export default function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ margin: '1rem 0 1.2rem' }}>
      <h1 style={{ marginBottom: '0.2rem' }}>{title}</h1>
      {subtitle && <p style={{ marginTop: 0, color: '#4b5563' }}>{subtitle}</p>}
    </div>
  );
}
