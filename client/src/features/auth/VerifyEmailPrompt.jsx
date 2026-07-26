import { useMutation } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { resendEmail, verifyEmail } from '../../services/auth';
import SpinnerMini from '../../ui/SpinnerMini';

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
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center py-10">
        <h3 className="text-lg font-medium mb-2">Verify your email</h3>

        <p className="text-sm text-gray-500 mb-1">
          Enter the 6-digit code sent to:
        </p>

        <p className="text-sm font-medium mb-6 break-all">{email}</p>

        <div className="flex justify-center gap-2 mb-6">
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
              className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-black"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={verifyMutation.isPending || otp.join('').length !== 6}
          className="w-full bg-black text-white py-3 rounded-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {verifyMutation.isPending ? <SpinnerMini /> : 'Verify Email'}
        </button>

        <button
          onClick={() => resendMutation.mutate()}
          disabled={resendMutation.isPending || countdown > 0}
          className="text-sm underline text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resendMutation.isPending ? (
            <SpinnerMini />
          ) : countdown > 0 ? (
            `Resend code in ${countdown}s`
          ) : (
            'Resend code'
          )}
        </button>
      </div>
    </div>
  );
}

export default VerifyEmailPrompt;
