import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { verifyResetCode } from '../../services/auth';
import SpinnerMini from '../../ui/SpinnerMini';

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
    <div className="flex justify-center px-4 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-md text-center">
        <h1 className="mb-3 text-3xl font-light tracking-[0.3em]">
          VERIFY CODE
        </h1>

        <p className="mb-2 text-sm text-gray-600">
          Enter the 6-digit code sent to your email
        </p>

        <p className="mb-8 text-sm font-medium break-all">{email}</p>

        <div className="mb-8 flex justify-center gap-2">
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
              className="h-12 w-12 border border-gray-300 rounded-md text-center text-lg font-medium outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={verifyMutation.isPending || code.join('').length !== 6}
          className="group relative w-full overflow-hidden bg-black py-3 text-sm tracking-[0.25em] text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="absolute inset-0 -translate-x-full bg-white transition-transform duration-500 group-hover:translate-x-0" />

          <span className="relative z-10 group-hover:text-black">
            {verifyMutation.isPending ? <SpinnerMini /> : 'VERIFY'}
          </span>
        </button>
      </form>
    </div>
  );
}

export default VerifyResetCode;
