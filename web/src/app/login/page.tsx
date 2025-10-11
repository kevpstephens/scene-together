"use client";

import { useState, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { INPUT_CLASSES } from "@/lib/constants";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      router.push("/admin");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sign in";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000102] via-[#23797E] to-[#46D4AF] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#46D4AF] to-[#23797E] rounded-xl mb-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-[#000102] mb-2">
              SceneTogether
            </h1>
            <p className="text-gray-600">Admin Dashboard</p>
          </div>

          {/* Demo Account Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">🎭</span>
              <h3 className="font-semibold text-blue-900">Demo Account</h3>
            </div>
            <p className="text-sm text-blue-700 mb-2">
              Try the admin dashboard with these credentials:
            </p>
            <div className="bg-white rounded p-3 space-y-1 font-mono text-sm">
              <p className="text-gray-700">
                <strong>Email:</strong> demo@scenetogether.com
              </p>
              <p className="text-gray-700">
                <strong>Password:</strong> DemoPassword123!
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                console.log("Auto-fill clicked!");
                const demoEmail = "demo@scenetogether.com";
                const demoPassword = "DemoPassword123!";

                // Update state
                setEmail(demoEmail);
                setPassword(demoPassword);

                // Also directly update input values as fallback
                if (emailInputRef.current) {
                  emailInputRef.current.value = demoEmail;
                }
                if (passwordInputRef.current) {
                  passwordInputRef.current.value = demoPassword;
                }

                console.log("Email set to:", demoEmail);
                console.log("Password set to:", demoPassword);
              }}
              className="mt-3 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              ← Click to auto-fill credentials
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                ref={emailInputRef}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={INPUT_CLASSES}
                placeholder="admin@scenetogether.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                ref={passwordInputRef}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={INPUT_CLASSES}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#46D4AF] to-[#23797E] text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            SceneTogether Admin Portal
          </p>
        </div>
      </div>
    </div>
  );
}
