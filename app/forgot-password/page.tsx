"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { validateEmail } from "@/lib/validation";
import { getErrorMessage } from "@/lib/error-handling";
import { apiClient } from "@/lib/api-client";

type ForgotPasswordStep = "email" | "otp" | "reset-password" | "success";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

interface FormErrors {
  email?: string;
  otp?: string;
  password?: string;
  confirmPassword?: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Form state
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");

  // UI state
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Step 1: Request password reset (email)
  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setError("");

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setErrors({ email: emailValidation.error });
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post<any>("/auth/forgot-password", {
        email,
      });

      if (response?.success) {
        setSuccess("OTP sent to your email. Please check your inbox.");
        setStep("otp");
        setError("");
      } else {
        setError(response?.message || "Failed to send OTP. Please try again.");
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setError("");

    if (!otp || otp.length !== 6) {
      setErrors({ otp: "OTP must be 6 digits" });
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post<{ resetToken?: string }>(
        "/auth/verify-otp",
        {
          email,
          otp,
        },
      );

      if (response?.success) {
        setResetToken(response?.data?.resetToken || "");
        setSuccess("OTP verified successfully. Now reset your password.");
        setStep("reset-password");
        setError("");
      } else {
        setError(response?.message || "Invalid OTP. Please try again.");
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setError("");

    const newErrors: FormErrors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post<ApiResponse>(
        "/auth/reset-password",
        {
          email,
          resetToken,
          newPassword: password,
          confirmPassword,
        },
      );

      if (response?.success) {
        setSuccess("Password reset successfully! Redirecting to login...");
        setStep("success");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(
          response?.message || "Failed to reset password. Please try again.",
        );
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell-light min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 flex flex-col lg:flex-row">
      {/* Left Side - Video Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/vids2.mp4"
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
          <div className="text-center max-w-lg">
            <div className="mb-6 inline-flex items-center justify-center gap-4">
              <img
                src="/logo2.png"
                alt="Menufy logo"
                className="w-12 h-12 object-contain"
              />
              <h2 className="text-5xl sm:text-6xl font-serif font-extrabold italic tracking-[0.12em] text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.55)]">
                Menuffy
              </h2>
            </div>
            <p className="text-lg leading-8 font-semibold text-white/90 mb-8 max-w-md drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
              Curate unforgettable dining journeys with beautifully immersive AR
              menus.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md slide-in-up">
          <div className="lg:hidden mb-8 text-center px-2">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Menuffy</h1>
            <p className="text-slate-600 text-base">
              Reset your password securely
            </p>
          </div>

          <div
            className="relative overflow-hidden rounded-3xl shadow-lg border border-gray-200"
            style={{
              backgroundImage: "url(/drinks.jpeg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
            <div className="relative p-8">
              {/* Step Indicator */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      step === "email" ||
                      step === "otp" ||
                      step === "reset-password" ||
                      step === "success"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    1
                  </div>
                  <span className="text-xs font-medium text-slate-600">
                    Email
                  </span>
                </div>
                <div className="flex-1 h-0.5 mx-2 bg-gray-300" />
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      step === "otp" ||
                      step === "reset-password" ||
                      step === "success"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-xs font-medium text-slate-600">
                    OTP
                  </span>
                </div>
                <div className="flex-1 h-0.5 mx-2 bg-gray-300" />
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      step === "reset-password" || step === "success"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    3
                  </div>
                  <span className="text-xs font-medium text-slate-600">
                    Reset
                  </span>
                </div>
              </div>

              <div className="text-center mb-8">
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                  Forgot Password
                </span>
              </div>

              <h1 className="text-3xl font-bold text-center mb-2 text-slate-900">
                {step === "email" && "Reset Password"}
                {step === "otp" && "Verify OTP"}
                {step === "reset-password" && "Create New Password"}
                {step === "success" && "Success!"}
              </h1>
              <p className="text-center text-slate-600 mb-8">
                {step === "email" && "Enter your email to receive an OTP"}
                {step === "otp" && "Enter the OTP sent to your email"}
                {step === "reset-password" && "Create a strong new password"}
                {step === "success" && "Your password has been reset"}
              </p>

              {/* Email Step */}
              {step === "email" && (
                <form
                  onSubmit={handleRequestPasswordReset}
                  className="space-y-4"
                >
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                      {success}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        if (errors.email)
                          setErrors({ ...errors, email: undefined });
                      }}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all bg-white text-slate-900 placeholder-slate-400 ${
                        errors.email
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                      } focus:outline-none focus:ring-2`}
                      disabled={loading}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full py-3 px-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </form>
              )}

              {/* OTP Step */}
              {step === "otp" && (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                      {success}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      OTP Code
                    </label>
                    <input
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={e => {
                        const value = e.target.value
                          .replace(/[^0-9]/g, "")
                          .slice(0, 6);
                        setOtp(value);
                        if (errors.otp)
                          setErrors({ ...errors, otp: undefined });
                      }}
                      maxLength={6}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all bg-white text-slate-900 placeholder-slate-400 text-center text-2xl tracking-widest font-semibold ${
                        errors.otp
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                      } focus:outline-none focus:ring-2`}
                      disabled={loading}
                    />
                    {errors.otp && (
                      <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
                    )}
                    <p className="mt-2 text-xs text-slate-600">
                      Didn't receive the code?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setStep("email");
                          setOtp("");
                          setSuccess("");
                        }}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Request again
                      </button>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full py-3 px-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </form>
              )}

              {/* Reset Password Step */}
              {step === "reset-password" && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => {
                        setPassword(e.target.value);
                        if (errors.password)
                          setErrors({ ...errors, password: undefined });
                      }}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all bg-white text-slate-900 placeholder-slate-400 ${
                        errors.password
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                      } focus:outline-none focus:ring-2`}
                      disabled={loading}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword)
                          setErrors({ ...errors, confirmPassword: undefined });
                      }}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all bg-white text-slate-900 placeholder-slate-400 ${
                        errors.confirmPassword
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                      } focus:outline-none focus:ring-2`}
                      disabled={loading}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !password || !confirmPassword}
                    className="w-full py-3 px-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              )}

              {/* Success Step */}
              {step === "success" && (
                <div className="space-y-4 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-slate-600">
                    Your password has been reset successfully. You will be
                    redirected to login page shortly.
                  </p>
                  <Link
                    href="/login"
                    className="inline-block py-3 px-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                  >
                    Go to Login
                  </Link>
                </div>
              )}

              <p className="text-center text-slate-600 text-sm mt-6">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
