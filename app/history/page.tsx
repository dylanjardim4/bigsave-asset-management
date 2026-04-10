import PageTitle from '@/components/PageTitle';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export default async function MovementHistoryPage() {
  const supabase = createSupabaseServerClient();
  const { data: movements } = await supabase
    .from('movements')
    .select('*, assets(asset_code, name), from_location:locations!movements_from_location_id_fkey(name), to_location:locations!movements_to_location_id_fkey(name)')
    .order('created_at', { ascending: false });

  return (
    <>
      <PageTitle title="Movement History" subtitle="Every movement recorded for audit and accountability" />
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Dispatched By</th>
              <th>Received By</th>
              <th>Dispatch Date</th>
              <th>Receive Date</th>
              <th>Condition</th>
            </tr>
          </thead>
          <tbody>
            {movements?.map((movement: any) => (
              <tr key={movement.id}>
                <td>{movement.assets?.asset_code} - {movement.assets?.name}</td>
                <td>{movement.movement_type}</td>
                <td>{movement.from_location?.name ?? '-'}</td>
                <td>{movement.to_location?.name ?? '-'}</td>
                <td>{movement.dispatched_by}</td>
                <td>{movement.received_by ?? '-'}</td>
                <td>{new Date(movement.dispatch_date).toLocaleDateString()}</td>
                <td>{movement.receive_date ? new Date(movement.receive_date).toLocaleDateString() : '-'}</td>
                <td>{movement.condition_on_receive ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
