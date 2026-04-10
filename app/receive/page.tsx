import { redirect } from 'next/navigation';
import { CONDITIONS } from '@/lib/constants';
import PageTitle from '@/components/PageTitle';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export default async function ReceivePage() {
  const supabase = createSupabaseServerClient();
  const { data: pending } = await supabase
    .from('movements')
    .select('id, asset_id, to_location_id, assets(asset_code, name)')
    .eq('movement_type', 'dispatch')
    .is('receive_date', null)
    .order('dispatch_date', { ascending: false });

  async function receiveAction(formData: FormData) {
    'use server';
    const supabase = createSupabaseServerClient();

    const movementId = String(formData.get('movement_id'));
    const receivedBy = String(formData.get('received_by'));
    const receiveDate = String(formData.get('receive_date'));
    const condition = String(formData.get('condition_on_receive'));

    const { data: movement } = await supabase
      .from('movements')
      .select('asset_id, to_location_id')
      .eq('id', movementId)
      .single();

    await supabase
      .from('movements')
      .update({ received_by: receivedBy, receive_date: receiveDate, condition_on_receive: condition })
      .eq('id', movementId);

    if (movement) {
      await supabase
        .from('assets')
        .update({ current_location_id: movement.to_location_id, status: 'at_store', condition })
        .eq('id', movement.asset_id);
    }

    redirect('/history');
  }

  return (
    <>
      <PageTitle title="Receive Asset" subtitle="Store confirms delivery and condition" />
      <form action={receiveAction} className="card grid" style={{ maxWidth: 620 }}>
        <label>
          Pending Dispatch
          <select name="movement_id" required>
            {pending?.map((movement: any) => (
              <option key={movement.id} value={movement.id}>
                {movement.assets?.asset_code} - {movement.assets?.name}
              </option>
            ))}
          </select>
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
          <select name="condition_on_receive" required>
            {CONDITIONS.map((condition) => (
              <option key={condition}>{condition}</option>
            ))}
          </select>
        </label>
        <button type="submit">Confirm Receipt</button>
      </form>
    </>
  );
}
