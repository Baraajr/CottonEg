import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { addVariant } from '../../../services/products';
import toast from 'react-hot-toast';
import Button from '../../../ui/Button';

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

  const inputClass =
    'w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground';

  const field = (label, input) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {input}
    </div>
  );

  return (
    <div className="flex w-full min-w-70 flex-col gap-4 bg-background p-5 text-foreground sm:w-90">
      <div className="border-b border-border pb-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Product inventory
        </span>
        <h2 className="mt-1 font-display text-2xl">Add Variant</h2>
      </div>

      {field(
        'Size',
        <select
          value={form.size}
          onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
          className={inputClass}
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
          placeholder="e.g. Midnight Blue"
          className={inputClass}
        />,
      )}

      {field(
        'Color hex',
        <div className="flex items-center gap-3 border border-border bg-surface px-3 py-2">
          <input
            type="color"
            value={form.colorHex}
            onChange={(e) =>
              setForm((f) => ({ ...f, colorHex: e.target.value }))
            }
            className="h-8 w-10 cursor-pointer border-0 bg-transparent"
          />
          <span className="font-mono text-sm text-muted-foreground">
            {form.colorHex.toUpperCase()}
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
          className={inputClass}
        />,
      )}

      {field(
        'SKU (optional)',
        <input
          type="text"
          value={form.sku}
          onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
          placeholder="Enter SKU"
          className={inputClass}
        />,
      )}

      <div className="flex gap-2 border-t border-border pt-4">
        <Button
          onClick={handleSubmit}
          loading={isPending}
          disabled={!form.colorName.trim()}
        >
          Add Variant
        </Button>

        <Button variant="secondary" onClick={onCloseModal} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default AddVariantForm;
