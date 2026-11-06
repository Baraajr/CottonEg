import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

import { resetPassword } from '../../services/auth';
import Button from '../../ui/Button';

function ResetPassword() {
  const [show, setShow] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,

    onSuccess: () => {
      toast.success('Password reset successfully');
      navigate('/login');
    },

    onError: (err) => {
      toast.error(err?.message || 'Something went wrong');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      toast.error('Email is missing. Restart reset flow.');
      return;
    }

    if (!newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    mutate({
      email,
      newPassword,
      confirmPassword,
    });
  }

  const isDisabled = isPending || !newPassword || !confirmPassword || !email;

  const inputClass =
    'w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground disabled:opacity-50';

  return (
    <section className="flex min-h-[65vh] items-center justify-center bg-background px-4 py-10 text-foreground">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md border border-border bg-surface px-5 py-8 sm:px-8"
      >
        <div className="text-center">
          <span className="section-label">Account security</span>

          <h1 className="mt-2 font-display text-3xl sm:text-4xl">
            New Password
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Create a new password for your account.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {/* New password */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              New password
            </label>

            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={isPending}
                className={`${inputClass} pr-12`}
              />

              <button
                type="button"
                aria-label={show ? 'Hide password' : 'Show password'}
                onClick={() => setShow((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {show ? <FaRegEyeSlash size={16} /> : <FaRegEye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Confirm password
            </label>

            <input
              type={show ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              disabled={isPending}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            fullWidth
            loading={isPending}
            disabled={isDisabled}
            className="tracking-[0.15em]"
          >
            RESET PASSWORD
          </Button>
        </div>
      </form>
    </section>
  );
}

export default ResetPassword;
