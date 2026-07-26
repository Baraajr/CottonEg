import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { addVariant } from '../../../services/products';
import toast from 'react-hot-toast';

function AddVariantForm({ productId, onCloseModal }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    size: 'M',
    colorName: '',
    colorHex: '#000000',
    quantity: 0,
    sku: '',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (body) => addVariant({ id: productId, data: body }),
    onSuccess: () => {
      queryClient.invalidateQueries(['product', productId]);
      toast.success('Variant added successfully');
      onCloseModal?.();
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to add variant');
    },
  });

  const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  const handleSubmit = () => {
    if (!form.colorName.trim()) return;

    mutate({
      size: form.size,
      color: {
        name: form.colorName.trim(),
        hex: form.colorHex,
      },
      quantity: Number(form.quantity),
      sku: form.sku.trim() || undefined,
    });
  };

  const field = (label, input) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
        {label}
      </label>
      {input}
    </div>
  );

  return (
    <div className="p-6 w-80 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Add Variant</h2>

      {field(
        'Size',
        <select
          value={form.size}
          onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {SIZES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>,
      )}

      {field(
        'Color name',
        <input
          type="text"
          value={form.colorName}
          onChange={(e) =>
            setForm((f) => ({ ...f, colorName: e.target.value }))
          }
          placeholder="e.g. Midnight Blue"
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />,
      )}

      {field(
        'Color hex',
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={form.colorHex}
            onChange={(e) =>
              setForm((f) => ({ ...f, colorHex: e.target.value }))
            }
            className="w-10 h-10 rounded cursor-pointer border border-gray-300"
          />
          <span className="text-sm text-gray-500 font-mono">
            {form.colorHex}
          </span>
        </div>,
      )}

      {field(
        'Quantity',
        <input
          type="number"
          min={0}
          value={form.quantity}
          onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />,
      )}

      {field(
        'SKU (optional)',
        <input
          type="text"
          value={form.sku}
          onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />,
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={handleSubmit}
          disabled={!form.colorName.trim() || isPending}
          className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
        >
          {isPending ? 'Adding…' : 'Add Variant'}
        </button>
        <button
          onClick={onCloseModal}
          className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AddVariantForm;
