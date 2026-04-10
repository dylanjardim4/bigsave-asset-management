'use client';

import { ASSET_CATEGORIES, CONDITIONS } from '@/lib/constants';

type Props = {
  onSubmitAction: (formData: FormData) => Promise<void>;
};

export default function AssetForm({ onSubmitAction }: Props) {
  return (
    <form action={onSubmitAction} className="card grid" style={{ maxWidth: 620 }}>
      <label>
        Asset Code
        <input name="asset_code" required placeholder="e.g. GAZ-0001" />
      </label>
      <label>
        Asset Name
        <input name="name" required placeholder="Branded Gazebo 3x3m" />
      </label>
      <label>
        Category
        <select name="category" required>
          {ASSET_CATEGORIES.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </label>
      <label>
        Condition
        <select name="condition" required>
          {CONDITIONS.map((condition) => (
            <option key={condition}>{condition}</option>
          ))}
        </select>
      </label>
      <label>
        Notes
        <textarea name="notes" rows={4} placeholder="Optional details" />
      </label>
      <button type="submit">Create Asset</button>
    </form>
  );
}
