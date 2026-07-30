import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaRegEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { signup } from '../../services/auth';
import SpinnerMini from '../../ui/SpinnerMini';
import Button from '../../ui/Button';

function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');

  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ email, password, passwordConfirm, name }) =>
      signup({ email, password, passwordConfirm, name }),
    onSuccess: (res) => {
      toast.success(res.message);

      localStorage.setItem('pendingVerificationEmail', email);

      navigate('/verifyEmailPrompt', {
        state: { email },
      });
    },
    onError: (err) => {
      toast.error(err.message || 'Signup failed');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password || !passwordConfirm || !name) return;

    mutate(
      { email, password, passwordConfirm, name },
      {
        onSettled: () => {
          setPassword('');
          setPasswordConfirm('');
          setName('');
        },
      },
    );
  }

  function handleGoogleAuth() {
    navigate(`${import.meta.env.VITE_API_URL}/auth/google`);
  }

  return (
    <div className="flex justify-center px-4 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <h1 className="mb-3 text-center text-3xl font-light tracking-[0.3em]">
          SIGN UP
        </h1>

        <p className="mb-8 text-center text-sm text-gray-600">
          Create your account to continue
        </p>

        {/* Name */}
        <div className="mb-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full Name"
            required
            disabled={isLoading}
            className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="E-mail"
            required
            disabled={isLoading}
            className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
          />
        </div>

        {/* Password */}
        <div className="relative mb-4">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            required
            disabled={isLoading}
            className="w-full border border-gray-300 px-4 py-3 pr-12 text-sm outline-none focus:border-black"
          />

          <FaRegEye
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-black"
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <input
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            required
            disabled={isLoading}
            className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
          />
        </div>

        {/* Signup button (HOVER EFFECT ADDED) */}
        {/* Sign Up */}
        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          className="py-3 tracking-[0.25em]"
        >
          SIGN UP
        </Button>

        {/* Google */}
        <Button
          onClick={() => handleGoogleAuth()}
          type="button"
          variant="secondary"
          fullWidth
          className="mt-4 justify-center py-3"
        >
          <FcGoogle className="h-5 w-5" />
          Continue with Google
        </Button>

        {/* Login */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <a href="/login" className="text-black hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}

export default SignupForm;
