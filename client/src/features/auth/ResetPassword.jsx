import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { resetPassword } from '../../services/auth';
import SpinnerMini from '../../ui/SpinnerMini';
import { FaRegEye } from 'react-icons/fa';

function ResetPassword() {
  const [show, setShow] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const { mutate, isLoading } = useMutation({
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

  const isDisabled = isLoading || !newPassword || !confirmPassword || !email;

  return (
    <div className="flex justify-center px-4 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <h1 className="mb-3 text-center text-3xl font-light tracking-[0.3em]">
          NEW PASSWORD
        </h1>

        <p className="mb-8 text-center text-sm text-gray-600">
          Create your new password
        </p>

        {/* New password */}
        <div className="relative mb-4">
          <input
            type={show ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            disabled={isLoading}
            className="w-full border border-gray-300 px-4 py-3 pr-12 text-sm outline-none focus:border-black"
          />
          <FaRegEye
            role="button"
            aria-label="Toggle password visibility"
            onClick={() => setShow((s) => !s)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
          />
        </div>

        {/* Confirm password */}
        <div className="mb-6">
          <input
            type={show ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            disabled={isLoading}
            className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
          />
        </div>

        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          disabled={isDisabled}
          className="py-3 tracking-[0.25em]"
        >
          RESET PASSWORD
        </Button>
      </form>
    </div>
  );
}

export default ResetPassword;
