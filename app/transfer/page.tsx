import { redirect } from 'next/navigation';
import PageTitle from '@/components/PageTitle';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export default async function TransferPage() {
  const supabase = createSupabaseServerClient();
  const [{ data: assets }, { data: stores }] = await Promise.all([
    supabase.from('assets').select('id, asset_code, name').eq('status', 'at_store'),
    supabase.from('locations').select('id, name').eq('location_type', 'store')
  ]);

  async function transferAction(formData: FormData) {
    'use server';
    const supabase = createSupabaseServerClient();

    await supabase.from('movements').insert({
      asset_id: formData.get('asset_id'),
      movement_type: 'transfer',
      from_location_id: formData.get('from_location_id'),
      to_location_id: formData.get('to_location_id'),
      dispatched_by: formData.get('dispatched_by'),
      dispatch_date: formData.get('dispatch_date'),
      received_by: formData.get('received_by'),
      receive_date: formData.get('receive_date'),
      condition_on_receive: formData.get('condition_on_receive'),
      notes: formData.get('notes')
    });

    await supabase
      .from('assets')
      .update({
        current_location_id: formData.get('to_location_id'),
        status: 'at_store',
        condition: formData.get('condition_on_receive')
      })
      .eq('id', formData.get('asset_id'));

    redirect('/history');
  }

  return (
    <>
      <PageTitle title="Transfer Asset" subtitle="Move assets between stores" />
      <form action={transferAction} className="card grid" style={{ maxWidth: 620 }}>
        <label>
          Asset
          <select name="asset_id" required>
            {assets?.map((asset: any) => (
              <option key={asset.id} value={asset.id}>{asset.asset_code} - {asset.name}</option>
            ))}
          </select>
        </label>
        <label>
          From Store ID
          <input name="from_location_id" required />
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
          Received By (user id)
          <input name="received_by" required />
        </label>
        <label>
          Receive Date
          <input type="date" name="receive_date" required />
        </label>
        <label>
          Condition on Receive
          <input name="condition_on_receive" required />
        </label>
        <label>
          Notes
          <textarea name="notes" rows={2} />
        </label>
        <button type="submit">Transfer</button>
      </form>
    </>
  );
}
