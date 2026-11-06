import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { addAddress as addAddressApi } from '../../services/address';
import Button from '../../ui/Button';

function AddAddressForm({ onCloseModal }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: addAddressApi,

    onSuccess: () => {
      toast.success('Address added successfully');
      onCloseModal?.();
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },

    onError: (err) => {
      toast.error(err.message || 'Failed to add address');
    },
  });

  function onSubmit(data) {
    mutate(data);
  }

  const inputClass =
    'w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground disabled:opacity-50';

  const labelClass =
    'mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground';

  const errorClass = 'mt-1 text-xs text-foreground';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Alias</label>
          <input
            {...register('alias', { required: 'Alias is required' })}
            className={inputClass}
            placeholder="Home / Office"
            disabled={isPending}
          />
          {errors.alias && <p className={errorClass}>{errors.alias.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Phone</label>
          <input
            {...register('phone', { required: 'Phone is required' })}
            className={inputClass}
            placeholder="+20..."
            disabled={isPending}
          />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Address details</label>
        <input
          {...register('details', { required: 'Details is required' })}
          className={inputClass}
          placeholder="Street, building, floor..."
          disabled={isPending}
        />
        {errors.details && (
          <p className={errorClass}>{errors.details.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>City</label>
          <input
            {...register('city', { required: 'City is required' })}
            className={inputClass}
            placeholder="City"
            disabled={isPending}
          />
          {errors.city && <p className={errorClass}>{errors.city.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Postal code</label>
          <input
            {...register('postalCode', {
              required: 'Postal code is required',
            })}
            className={inputClass}
            placeholder="Postal code"
            disabled={isPending}
          />
          {errors.postalCode && (
            <p className={errorClass}>{errors.postalCode.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCloseModal}
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button type="submit" loading={isPending}>
          Save Address
        </Button>
      </div>
    </form>
  );
}

export default AddAddressForm;
