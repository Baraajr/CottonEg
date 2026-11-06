import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiShield } from 'react-icons/fi';

import { verifyResetCode } from '../../services/auth';
import Button from '../../ui/Button';

function VerifyResetCode() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error('Email not found. Please try again.');
      navigate('/forgot-password');
      return;
    }

    inputsRef.current[0]?.focus();
  }, [email, navigate]);

  const verifyMutation = useMutation({
    mutationFn: (resetCode) => verifyResetCode({ email, resetCode }),

    onSuccess: () => {
      toast.success('Code verified successfully');
      navigate('/reset-password', { state: { email } });
    },

    onError: (err) => {
      toast.error(err?.message || 'Invalid or expired code');
    },
  });

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
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

    const newCode = ['', '', '', '', '', ''];

    pasted.split('').forEach((digit, index) => {
      newCode[index] = digit;
    });

    setCode(newCode);

    const focusIndex = Math.min(pasted.length - 1, 5);
    inputsRef.current[focusIndex]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (verifyMutation.isPending) return;

    const resetCode = code.join('');

    if (resetCode.length !== 6) {
      toast.error('Please enter the full 6-digit code');
      return;
    }

    verifyMutation.mutate(resetCode);
  };

  if (!email) return null;

  return (
    <section className="flex min-h-[65vh] items-center justify-center bg-background px-4 py-10 text-foreground">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md border border-border bg-surface px-5 py-8 text-center sm:px-8"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center border border-border bg-background">
          <FiShield size={23} className="text-foreground" />
        </div>

        <span className="section-label mt-6 block">Password recovery</span>

        <h1 className="mt-2 font-display text-3xl sm:text-4xl">
          Verify your code
        </h1>

        <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
          Enter the 6-digit code sent to your email address.
        </p>

        <p className="mt-3 break-all text-sm font-semibold text-foreground">
          {email}
        </p>

        <div className="my-7 flex justify-center gap-2 sm:gap-3">
          {code.map((digit, index) => (
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
              disabled={verifyMutation.isPending}
              className="h-11 w-10 border border-border bg-background text-center text-lg font-semibold text-foreground outline-none transition-colors focus:border-foreground disabled:opacity-50 sm:h-13 sm:w-12"
            />
          ))}
        </div>

        <Button
          type="submit"
          fullWidth
          loading={verifyMutation.isPending}
          disabled={code.join('').length !== 6}
          className="tracking-[0.2em]"
        >
          VERIFY
        </Button>
      </form>
    </section>
  );
}

export default VerifyResetCode;
