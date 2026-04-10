import Image from 'next/image';
import PageTitle from '@/components/PageTitle';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export default async function AssetDetailPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();

  const [{ data: asset }, { data: history }] = await Promise.all([
    supabase
      .from('assets')
      .select('*, locations(name)')
      .eq('id', params.id)
      .single(),
    supabase
      .from('movements')
      .select('*')
      .eq('asset_id', params.id)
      .order('created_at', { ascending: false })
  ]);

  if (!asset) return <p>Asset not found.</p>;

  return (
    <>
      <PageTitle title={`${asset.asset_code} · ${asset.name}`} subtitle="Asset profile and full movement log" />
      <div className="card grid" style={{ gridTemplateColumns: '140px 1fr' }}>
        <div>
          {/* QR route generates code at request time so the URL always points to latest record. */}
          <Image src={`/api/qr/${asset.id}`} alt="Asset QR" width={120} height={120} />
        </div>
        <div>
          <p><strong>Category:</strong> {asset.category}</p>
          <p><strong>Status:</strong> {asset.status}</p>
          <p><strong>Condition:</strong> {asset.condition}</p>
          <p><strong>Current Location:</strong> {asset.locations?.name ?? '-'}</p>
          <p><strong>Notes:</strong> {asset.notes || '-'}</p>
        </div>
      </div>
      <div className="card">
        <h3>Movement History</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Dispatch Date</th>
              <th>Receive Date</th>
              <th>Condition</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {history?.map((item: any) => (
              <tr key={item.id}>
                <td>{item.movement_type}</td>
                <td>{new Date(item.dispatch_date).toLocaleDateString()}</td>
                <td>{item.receive_date ? new Date(item.receive_date).toLocaleDateString() : '-'}</td>
                <td>{item.condition_on_receive ?? '-'}</td>
                <td>{item.notes ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
