import Link from 'next/link';
import PageTitle from '@/components/PageTitle';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export default async function AssetsListPage() {
  const supabase = createSupabaseServerClient();
  const { data: assets } = await supabase
    .from('assets')
    .select('id, asset_code, name, category, status, condition, locations(name)')
    .order('created_at', { ascending: false });

  return (
    <>
      <PageTitle title="Assets" subtitle="All registered marketing assets" />
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Condition</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {assets?.map((asset: any) => (
              <tr key={asset.id}>
                <td>
                  <Link href={`/assets/${asset.id}`}>{asset.asset_code}</Link>
                </td>
                <td>{asset.name}</td>
                <td>{asset.category}</td>
                <td>
                  <span className="badge">{asset.status}</span>
                </td>
                <td>{asset.condition}</td>
                <td>{asset.locations?.name ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
