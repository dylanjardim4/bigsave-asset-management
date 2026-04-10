import PageTitle from '@/components/PageTitle';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

const statuses = ['available', 'in_transit', 'at_store', 'overdue', 'damaged', 'missing'];

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();

  const counts = await Promise.all(
    statuses.map(async (status) => {
      const { count } = await supabase
        .from('assets')
        .select('*', { count: 'exact', head: true })
        .eq('status', status);

      return { status, count: count ?? 0 };
    })
  );

  return (
    <>
      <PageTitle title="Dashboard" subtitle="Live snapshot of your promotional assets" />
      <div className="grid grid-3">
        {counts.map((item) => (
          <div className="card" key={item.status}>
            <div style={{ textTransform: 'capitalize' }}>{item.status.replace('_', ' ')}</div>
            <h2 style={{ marginBottom: 0 }}>{item.count}</h2>
          </div>
        ))}
      </div>
    </>
  );
}
