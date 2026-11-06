import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { FiLock, FiShield, FiCheckCircle } from 'react-icons/fi';

import { updatePassword } from '../../services/users';
import Button from '../../ui/Button';

function UpdatePassword() {
  const {
    register,
    handleSubmit,
    getValues,
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

  return (
    <div className="mx-auto w-full max-w-xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft"
      >
        {/* Header */}
        <div className="border-b border-border px-5 py-4 sm:px-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-accent">
              <FiLock size={21} />
            </div>

            <div>
              <span className="section-label">Account security</span>

              <h2 className="section-heading mt-1 text-2xl">Change password</h2>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Keep your account protected by using a strong, unique password.
              </p>
            </div>
          </div>
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-3 px-5 py-4 sm:px-7">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="label">
              Current password
            </label>

            <input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your current password"
              {...register('currentPassword', {
                required: 'Current password is required',
              })}
              className="input"
            />

            {errors.currentPassword && (
              <p className="error">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="border-t border-border" />

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="label">
              New password
            </label>

            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Enter your new password"
              {...register('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
              className="input"
            />

            {errors.newPassword && (
              <p className="error">{errors.newPassword.message}</p>
            )}

            <p className="mt-2 text-xs text-muted-foreground">
              Use at least 8 characters for your new password.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="passwordConfirm" className="label">
              Confirm new password
            </label>

            <input
              id="passwordConfirm"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your new password"
              {...register('passwordConfirm', {
                required: 'Please confirm your new password',
                validate: (value) =>
                  value === getValues('newPassword') ||
                  'Passwords do not match',
              })}
              className="input"
            />

            {errors.passwordConfirm && (
              <p className="error">{errors.passwordConfirm.message}</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="border-t border-border px-5 py-5 sm:px-7">
          <Button
            type="submit"
            fullWidth
            loading={isPending}
            disabled={isSubmitting || isPending}
          >
            <span className="flex items-center justify-center gap-2">
              <FiCheckCircle size={16} />
              Update password
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UpdatePassword;
