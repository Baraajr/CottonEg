import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { editVariant } from '../../../services/products';
import toast from 'react-hot-toast';
import Button from '../../../ui/Button';

const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

function EditVariantForm({ productId, variant, onCloseModal }) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    size: variant.size,
    colorName: variant.color?.name || '',
    colorHex: variant.color?.hex || '#000000',
    quantity: variant.quantity,
    sku: variant.sku || '',
  });

  const hasChanges =
    form.size !== variant.size ||
    form.colorName.trim() !== (variant.color?.name || '') ||
    form.colorHex !== (variant.color?.hex || '#000000') ||
    Number(form.quantity) !== Number(variant.quantity) ||
    form.sku.trim() !== (variant.sku || '');

  const { mutate, isPending } = useMutation({
    mutationFn: (body) =>
      editVariant({
        id: productId,
        variantId: variant._id,
        data: body,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      toast.success('Variant updated successfully');
      onCloseModal?.();
    },

    onError: (error) => {
      toast.error(error?.message || 'Failed to update variant');
    },
  });

  const handleSubmit = () => {
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
      <label className="text-xs font-medium uppercase tracking-wide text-gray-600">
        {label}
      </label>
      {input}
    </div>
  );

  return (
    <div className="flex w-80 flex-col gap-4 p-6">
      <h2 className="text-lg font-semibold">Edit Variant</h2>

      {field(
        'Size',
        <select
          value={form.size}
          onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
          className="rounded border border-gray-300 px-3 py-2 text-sm"
        >
          {SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
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
          className="rounded border border-gray-300 px-3 py-2 text-sm"
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
          />
          <span className="font-mono text-sm">{form.colorHex}</span>
        </div>,
      )}

      {field(
        'Quantity',
        <input
          type="number"
          min={0}
          value={form.quantity}
          onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
          className="rounded border border-gray-300 px-3 py-2 text-sm"
        />,
      )}

      {field(
        'SKU (optional)',
        <input
          type="text"
          value={form.sku}
          onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
          className="rounded border border-gray-300 px-3 py-2 text-sm"
        />,
      )}

      <div className="flex gap-2 pt-1">
        <Button
          onClick={handleSubmit}
          loading={isPending}
          disabled={!hasChanges || !form.colorName.trim()}
        >
          Save Changes
        </Button>

        <Button variant="secondary" onClick={onCloseModal} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default EditVariantForm;
