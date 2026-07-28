import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { addAddress as addAddressApi } from '../../services/address';
import SpinnerMini from '../../ui/SpinnerMini';
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
    'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ' +
    'text-gray-900 placeholder-gray-400 ' +
    'focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-black/10 transition';

  const labelClass = 'text-sm font-medium text-gray-700';

  const errorClass = 'text-xs text-red-500 mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Top grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Alias</label>
          <input
            {...register('alias', { required: 'Alias is required' })}
            className={inputClass}
            placeholder="Home / Office"
          />
          {errors.alias && <p className={errorClass}>{errors.alias.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Phone</label>
          <input
            {...register('phone', { required: 'Phone is required' })}
            className={inputClass}
            placeholder="+20..."
          />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>
      </div>

      {/* Details */}
      <div>
        <label className={labelClass}>Details</label>
        <input
          {...register('details', { required: 'Details is required' })}
          className={inputClass}
          placeholder="Street, building, floor..."
        />
        {errors.details && (
          <p className={errorClass}>{errors.details.message}</p>
        )}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>City</label>
          <input
            {...register('city', { required: 'City is required' })}
            className={inputClass}
          />
          {errors.city && <p className={errorClass}>{errors.city.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Postal Code</label>
          <input
            {...register('postalCode', {
              required: 'Postal code is required',
            })}
            className={inputClass}
          />
          {errors.postalCode && (
            <p className={errorClass}>{errors.postalCode.message}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCloseModal} disabled={isPending}>
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
