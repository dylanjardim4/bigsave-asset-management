import { redirect } from 'next/navigation';
import AssetForm from '@/components/AssetForm';
import PageTitle from '@/components/PageTitle';
import { HEAD_OFFICE_LOCATION_CODE } from '@/lib/constants';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export default async function CreateAssetPage() {
  async function createAssetAction(formData: FormData) {
    'use server';
    const supabase = createSupabaseServerClient();

    const { data: ho } = await supabase
      .from('locations')
      .select('id')
      .eq('code', HEAD_OFFICE_LOCATION_CODE)
      .single();

    if (!ho) throw new Error('Head office location missing. Seed locations first.');

    // New assets always start at head office, as required by the business process.
    await supabase.from('assets').insert({
      asset_code: formData.get('asset_code'),
      name: formData.get('name'),
      category: formData.get('category'),
      status: 'available',
      current_location_id: ho.id,
      condition: formData.get('condition'),
      notes: formData.get('notes')
    });

    redirect('/assets');
  }

  return (
    <>
      <PageTitle title="Create Asset" subtitle="Register a new promotional asset" />
      <AssetForm onSubmitAction={createAssetAction} />
    </>
  );
}
