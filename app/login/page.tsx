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
    <div className="auth-shell-light min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col lg:flex-row">
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
                Menufy
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
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Menufy</h1>
            <p className="text-slate-600 text-base">
              Sign in to your account and manage your restaurant's AR menu
              experience.
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
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
            <div className="relative p-8">
              <div className="text-center mb-8">
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                  Welcome Back
                </span>
              </div>

              <h1 className="text-3xl font-bold text-center mb-2 text-slate-900">
                Sign In
              </h1>
              <p className="text-center text-slate-600 mb-8">
                Access your MenuAR account
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email
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
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
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

                <button
                  type="submit"
                  disabled={loading || Object.keys(errors).length > 0}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className="text-center text-slate-600 text-sm mt-6">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Create one
                </Link>
              </p>

              <p className="text-center text-slate-500 text-xs mt-4">
                <Link href="/forgot-password" className="hover:text-slate-600">
                  Forgot password?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
