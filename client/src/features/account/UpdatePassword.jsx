import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { updatePassword } from '../../services/users';
import SpinnerMini from '../../ui/SpinnerMini';
import Button from '../../ui/Button';

function UpdatePassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.success('Password updated successfully');
      queryClient.invalidateQueries({ queryKey: ['user'] });
      reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  const inputClass =
    'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ' +
    'text-gray-900 placeholder-gray-400 ' +
    'focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-black/10 transition';

  const labelClass = 'text-sm font-medium text-gray-700';

  const errorClass = 'text-xs text-red-500 mt-1';

  return (
    <div className="max-w-md mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-gray-900">Update Password</h2>

        {/* Current Password */}
        <div>
          <label className={labelClass}>Current Password</label>
          <input
            type="password"
            {...register('currentPassword', {
              required: 'Current password is required',
            })}
            className={inputClass}
          />
          {errors.currentPassword && (
            <p className={errorClass}>{errors.currentPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className={labelClass}>New Password</label>
          <input
            type="password"
            {...register('newPassword', {
              required: 'New password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
            className={inputClass}
          />
          {errors.newPassword && (
            <p className={errorClass}>{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className={labelClass}>Confirm New Password</label>
          <input
            type="password"
            {...register('passwordConfirm', {
              required: 'Please confirm your new password',
              validate: (value) =>
                value === watch('newPassword') || 'Passwords do not match',
            })}
            className={inputClass}
          />
          {errors.passwordConfirm && (
            <p className={errorClass}>{errors.passwordConfirm.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" loading={isPending} disabled={isSubmitting}>
          Update Password
        </Button>
      </form>
    </div>
  );
}

export default UpdatePassword;
