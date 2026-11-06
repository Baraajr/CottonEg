import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { forgotPassword } from '../../services/auth';
import Button from '../../ui/Button';

function ForgotPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialEmail = location.state?.email || '';
  const [email, setEmail] = useState(initialEmail);

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,

    onSuccess: () => {
      toast.success('Reset code sent to email');

      navigate('/verify-reset-code', {
        state: { email },
      });
    },

    onError: (err) => {
      toast.error(err?.message || 'Something went wrong');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();

    if (!email || isPending) return;

    mutate(email);
  }

  return (
    <section className="flex min-h-[65vh] items-center justify-center bg-background px-4 py-10 text-foreground">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md border border-border bg-surface px-5 py-8 sm:px-8"
      >
        <div className="text-center">
          <span className="section-label">Account recovery</span>

          <h1 className="mt-2 font-display text-3xl sm:text-4xl">
            Reset Password
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Enter your email to receive a password reset code.
          </p>
        </div>

        <div className="mt-8">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Email address
          </label>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
            required
            disabled={isPending}
            className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground disabled:opacity-50"
          />
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            loading={isPending}
            disabled={!email || isPending}
            fullWidth
            className="tracking-[0.15em]"
          >
            SEND CODE
          </Button>
        </div>
      </form>
    </section>
  );
}

export default ForgotPassword;
