import { useMutation } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiMail } from 'react-icons/fi';

import { resendEmail, verifyEmail } from '../../services/auth';
import Button from '../../ui/Button';

function VerifyEmailPrompt() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);

  const inputsRef = useRef([]);

  useEffect(() => {
    if (!email) {
      toast.error('Email not found. Please sign up again.');
      navigate('/signup');
    }
  }, [email, navigate]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const resendMutation = useMutation({
    mutationFn: () => resendEmail(email),
    onSuccess: (res) => {
      toast.success(res.message || 'OTP sent successfully!');
      setCountdown(60);
    },
    onError: () => {
      toast.error('Failed to resend code.');
    },
  });

  const verifyMutation = useMutation({
    mutationFn: () =>
      verifyEmail({
        email,
        code: otp.join(''),
      }),
    onSuccess: () => {
      toast.success('Email verified successfully!');
      navigate('/login');
    },
    onError: (err) => {
      toast.error(err?.message || 'Invalid or expired code');
    },
  });

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (e.key === 'ArrowRight' && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);

    if (!pasted) return;

    const newOtp = ['', '', '', '', '', ''];

    pasted.split('').forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const focusIndex = Math.min(pasted.length - 1, 5);
    inputsRef.current[focusIndex]?.focus();
  };

  const handleVerify = () => {
    if (verifyMutation.isPending) return;

    const code = otp.join('');

    if (code.length !== 6) {
      toast.error('Please enter the full 6-digit code');
      return;
    }

    verifyMutation.mutate();
  };

  if (!email) return null;

  return (
    <section className="flex min-h-[65vh] items-center justify-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-md border border-border bg-surface px-5 py-8 text-center sm:px-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center border border-border bg-background">
          <FiMail size={23} className="text-foreground" />
        </div>

        <span className="section-label mt-6 block">Account verification</span>

        <h1 className="mt-2 font-display text-3xl sm:text-4xl">
          Verify your email
        </h1>

        <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
          Enter the 6-digit verification code we sent to your email address.
        </p>

        <p className="mt-3 break-all text-sm font-semibold text-foreground">
          {email}
        </p>

        <div className="my-7 flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength={1}
              inputMode="numeric"
              autoComplete="one-time-code"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="h-11 w-10 border border-border bg-background text-center text-lg font-semibold text-foreground outline-none transition-colors focus:border-foreground sm:h-13 sm:w-12"
            />
          ))}
        </div>

        <Button
          onClick={handleVerify}
          fullWidth
          loading={verifyMutation.isPending}
          disabled={otp.join('').length !== 6}
          className="mb-5"
        >
          Verify Email
        </Button>

        <div className="border-t border-border pt-5">
          <p className="text-xs text-muted-foreground">
            Didn&apos;t receive the code?
          </p>

          <Button
            type="button"
            variant="ghost"
            onClick={() => resendMutation.mutate()}
            loading={resendMutation.isPending}
            disabled={countdown > 0}
            className="mt-1 text-sm"
          >
            {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default VerifyEmailPrompt;
