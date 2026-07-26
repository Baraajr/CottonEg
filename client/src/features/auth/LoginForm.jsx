import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { FaRegEye } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { login } from '../../services/auth';
import SpinnerMini from '../../ui/SpinnerMini';

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ email, password }) => login({ email, password }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate('/', { replace: true });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function handleForgotPassword() {
    if (email) {
      localStorage.setItem('resetEmail', email);
    }
    navigate('/forgot-password', { state: { email } });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;

    mutate(
      { email, password },
      {
        onSettled: () => {
          setEmail('');
          setPassword('');
        },
      },
    );
  }

  return (
    <div className="flex justify-center px-4 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <h1 className="mb-3 text-center text-3xl font-light tracking-[0.3em]">
          LOGIN
        </h1>

        <p className="mb-8 text-center text-sm text-gray-600">
          Enter your email and password to login
        </p>

        {/* Email */}
        <div className="mb-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="E-mail"
            required
            disabled={isLoading}
            className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
          />
        </div>

        {/* Password */}
        <div className="relative mb-2">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
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

        {/* Forgot password */}
        <div className="mb-4 text-right">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-xs text-gray-500 hover:text-black"
          >
            Forgot your password?
          </button>
        </div>

        {/* Login button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full overflow-hidden bg-black py-3 text-sm tracking-[0.25em] text-white"
        >
          <span className="absolute inset-0 -translate-x-full bg-white transition-transform duration-500 group-hover:translate-x-0" />
          <span className="relative z-10 group-hover:text-black">
            {!isLoading ? 'LOGIN' : <SpinnerMini />}
          </span>
        </button>

        {/* Google */}
        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-3 border border-gray-300 py-3 text-sm hover:border-black"
        >
          <FcGoogle className="h-5 w-5" />
          Continue with Google
        </button>

        {/* Signup */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="text-black hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
