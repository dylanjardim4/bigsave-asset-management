export type UserRole = 'admin' | 'store_user';

export type AssetStatus =
  | 'available'
  | 'in_transit'
  | 'at_store'
  | 'overdue'
  | 'damaged'
  | 'missing';

export type Asset = {
  id: string;
  asset_code: string;
  name: string;
  category: string;
  status: AssetStatus;
  current_location_id: string;
  condition: string;
  notes: string | null;
  created_at: string;
};

export type Movement = {
  id: string;
  asset_id: string;
  movement_type: 'dispatch' | 'receive' | 'transfer' | 'return_to_ho';
  from_location_id: string | null;
  to_location_id: string | null;
  dispatched_by: string;
  received_by: string | null;
  dispatch_date: string;
  receive_date: string | null;
  condition_on_receive: string | null;
  notes: string | null;
  created_at: string;
};
