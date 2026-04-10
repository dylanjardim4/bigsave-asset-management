import { redirect } from 'next/navigation';
import PageTitle from '@/components/PageTitle';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export default async function DispatchPage() {
  const supabase = createSupabaseServerClient();
  const [{ data: assets }, { data: stores }] = await Promise.all([
    supabase.from('assets').select('id, asset_code, name').in('status', ['available', 'at_store']),
    supabase.from('locations').select('id, name').eq('location_type', 'store')
  ]);

  async function dispatchAction(formData: FormData) {
    'use server';
    const supabase = createSupabaseServerClient();

    await supabase.from('movements').insert({
      asset_id: formData.get('asset_id'),
      movement_type: 'dispatch',
      from_location_id: formData.get('from_location_id'),
      to_location_id: formData.get('to_location_id'),
      dispatched_by: formData.get('dispatched_by'),
      dispatch_date: formData.get('dispatch_date'),
      notes: formData.get('notes')
    });

    await supabase
      .from('assets')
      .update({ status: 'in_transit' })
      .eq('id', formData.get('asset_id'));

    redirect('/history');
  }

  return (
    <>
      <PageTitle title="Dispatch Asset" subtitle="Send assets from head office to stores" />
      <form action={dispatchAction} className="card grid" style={{ maxWidth: 620 }}>
        <label>
          Asset
          <select name="asset_id" required>
            {assets?.map((asset: any) => (
              <option key={asset.id} value={asset.id}>{asset.asset_code} - {asset.name}</option>
            ))}
          </select>
        </label>
        <label>
          From Location ID
          <input name="from_location_id" required placeholder="Usually Head Office ID" />
        </label>
        <label>
          To Store
          <select name="to_location_id" required>
            {stores?.map((store: any) => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>
        </label>
        <label>
          Dispatched By (user id)
          <input name="dispatched_by" required />
        </label>
        <label>
          Dispatch Date
          <input type="date" name="dispatch_date" required />
        </label>
        <label>
          Notes
          <textarea name="notes" rows={3} />
        </label>
        <button type="submit">Dispatch</button>
      </form>
    </>
  );
}
