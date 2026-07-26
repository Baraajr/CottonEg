import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { forgotPassword } from '../../services/auth';
import SpinnerMini from '../../ui/SpinnerMini';

function ForgotPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialEmail = location.state?.email || '';
  const [email, setEmail] = useState(initialEmail);

  const { mutate, isLoading } = useMutation({
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
    if (!email || isLoading) return;

    mutate(email);
  }

  return (
    <div className="flex justify-center px-4 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <h1 className="mb-3 text-center text-3xl font-light tracking-[0.3em]">
          RESET PASSWORD
        </h1>

        <p className="mb-8 text-center text-sm text-gray-600">
          Enter your email to receive a reset code
        </p>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="E-mail"
          required
          disabled={isLoading}
          className="mb-6 w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
        />

        <button
          type="submit"
          disabled={isLoading || !email}
          className="group relative w-full overflow-hidden bg-black py-3 text-sm tracking-[0.25em] text-white disabled:opacity-50"
        >
          <span className="absolute inset-0 -translate-x-full bg-white transition-transform duration-500 group-hover:translate-x-0" />
          <span className="relative z-10 group-hover:text-black">
            {!isLoading ? 'SEND CODE' : <SpinnerMini />}
          </span>
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
