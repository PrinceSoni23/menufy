"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { validateEmail } from "@/lib/validation";
import { getErrorMessage } from "@/lib/error-handling";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.error;
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await login({ email, password });
      if (response?.success) {
        router.push("/dashboard");
      } else {
        setError(response?.error || "Login failed. Please try again.");
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell min-h-screen bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-20 -left-24 w-64 h-64 rounded-full bg-orange-500/25 blur-3xl" />
      <div className="absolute -bottom-20 -right-24 w-64 h-64 rounded-full bg-teal-400/20 blur-3xl" />

      <div className="w-full max-w-md slide-in-up relative z-10">
        <div className="card">
          <div className="text-center mb-6">
            <span className="fancy-pill mb-4">Welcome Back</span>
          </div>

          <h1 className="text-3xl hero-title font-bold text-center mb-2 gradient-text">
            MenuAR
          </h1>
          <p className="text-center text-slate-400 mb-8">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className={`form-input ${errors.email ? "border-red-500" : ""}`}
                disabled={loading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors({ ...errors, password: undefined });
                }}
                className={`form-input ${errors.password ? "border-red-500" : ""}`}
                disabled={loading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || Object.keys(errors).length > 0}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-orange-300 hover:text-orange-200 font-semibold"
            >
              Create one
            </Link>
          </p>

          <p className="text-center text-slate-500 text-xs mt-4">
            <Link href="/forgot-password" className="hover:text-slate-400">
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
