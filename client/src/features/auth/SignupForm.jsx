import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

import { signup } from '../../services/auth';
import Button from '../../ui/Button';
import SpinnerMini from '../../ui/SpinnerMini';

function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast.success('Account created successfully');

      localStorage.setItem('pendingVerificationEmail', email.trim());

      navigate('/', {
        state: { email: email.trim() },
      });
    },
    onError: (err) => {
      toast.error(err.message || 'Signup failed');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password || !passwordConfirm) return;

    if (password !== passwordConfirm) {
      toast.error('Passwords do not match');
      return;
    }

    mutate({
      name: trimmedName,
      email: trimmedEmail,
      password,
      passwordConfirm,
    });
  }

  function handleGoogleAuth() {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  }

  return (
    <div className="flex w-full justify-center px-4 py-8 sm:py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        {/* Heading */}
        <div className="space-y-2">
          <p className="section-label">Join CottonEg</p>

          <h1 className="font-serif text-3xl font-medium text-foreground">
            Create account.
          </h1>

          <p className="text-sm text-muted-foreground">
            Create your account and discover your style.
          </p>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="signup-name" className="label">
            Full name
          </label>

          <input
            id="signup-name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            autoComplete="name"
            required
            disabled={isPending}
            className="input"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="signup-email" className="label">
            Email address
          </label>

          <input
            id="signup-email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
            required
            disabled={isPending}
            className="input"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="signup-password" className="label">
            Password
          </label>

          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              autoComplete="new-password"
              required
              disabled={isPending}
              className="input pr-11"
            />

            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <FaRegEyeSlash size={15} />
              ) : (
                <FaRegEye size={15} />
              )}
            </button>
          </div>
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="signup-confirm-password" className="label">
            Confirm password
          </label>

          <div className="relative">
            <input
              id="signup-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
              disabled={isPending}
              className="input pr-11"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((s) => !s)}
              aria-label={
                showConfirmPassword ? 'Hide password' : 'Show password'
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? (
                <FaRegEyeSlash size={15} />
              ) : (
                <FaRegEye size={15} />
              )}
            </button>
          </div>

          {passwordConfirm && password !== passwordConfirm && (
            <p className="error">Passwords do not match.</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          fullWidth
          disabled={
            isPending ||
            !name.trim() ||
            !email.trim() ||
            !password ||
            !passwordConfirm ||
            password !== passwordConfirm
          }
          className="py-3 text-xs tracking-[0.15em]"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <SpinnerMini />
              CREATING ACCOUNT...
            </span>
          ) : (
            'CREATE ACCOUNT'
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

        {/* Login */}
        <p className="pt-1 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-foreground underline underline-offset-4 hover:text-muted-foreground"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignupForm;
