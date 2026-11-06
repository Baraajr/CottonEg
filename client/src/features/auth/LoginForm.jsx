import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

import { login } from '../../services/auth';
import SpinnerMini from '../../ui/SpinnerMini';
import Button from '../../ui/Button';

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Welcome back!');
      navigate('/', { replace: true });
    },
    onError: (err) => {
      toast.error(err.message || 'Unable to sign in');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim() || !password) return;

    mutate({ email: email.trim(), password });
  }

  function handleGoogleAuth() {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  }

  return (
    <div className="flex w-full justify-center px-4 py-8 sm:py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
        {/* Heading */}
        <div className="space-y-2">
          <p className="section-label">Welcome back</p>

          <h1 className="font-serif text-3xl font-medium text-foreground">
            Sign in.
          </h1>

          <p className="text-sm text-muted-foreground">
            Enter your details to access your account.
          </p>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="login-email" className="label">
            Email address
          </label>

          <input
            id="login-email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            autoComplete="username"
            required
            disabled={isPending}
            className="input"
          />
        </div>

        {/* Password */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="login-password" className="label mb-0">
              Password
            </label>

            <button
              type="button"
              onClick={() =>
                navigate('/forgot-password', {
                  state: { email: email.trim() },
                })
              }
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              disabled={isPending}
              className="input pr-11"
            />

            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? (
                <FaRegEyeSlash size={15} />
              ) : (
                <FaRegEye size={15} />
              )}
            </button>
          </div>
        </div>

        {/* Sign in */}
        <Button
          type="submit"
          fullWidth
          disabled={isPending || !email.trim() || !password}
          className="py-3 text-xs tracking-[0.15em]"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <SpinnerMini />
              SIGNING IN...
            </span>
          ) : (
            'SIGN IN'
          )}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />

          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Or continue with
          </span>

          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Google */}
        <Button
          type="button"
          variant="secondary"
          fullWidth
          disabled={isPending}
          onClick={handleGoogleAuth}
          className="justify-center gap-2 py-3 text-xs"
        >
          <FcGoogle size={17} />
          Continue with Google
        </Button>

        {/* Signup */}
        <p className="pt-1 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-foreground underline underline-offset-4 hover:text-muted-foreground"
          >
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
