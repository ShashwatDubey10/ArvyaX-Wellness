import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const emailRef = useRef(null);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const emailValue = watch("email", "");
  const passwordValue = watch("password", "");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      toast.success("Welcome back to ARVYA.X! 🧘", {
        duration: 3000,
        style: {
          background: "#065f46",
          color: "#ffffff",
        },
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Login failed", {
        style: {
          background: "#dc2626",
          color: "#ffffff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 flex items-center justify-center p-4 font-montserrat">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-500/10 rounded-full animate-pulse"></div>
        <div
          className="absolute top-3/4 right-1/4 w-24 h-24 bg-emerald-400/5 rounded-full animate-bounce"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/6 w-16 h-16 bg-emerald-600/10 rounded-full animate-ping"
          style={{ animationDuration: "4s" }}
        ></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-l from-emerald-600/20 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-emerald-600/5 rounded-3xl"></div>

          <div className="relative z-10 text-center mb-8">
            <Link
              to="/"
              className="inline-block font-extrabold text-3xl tracking-wider text-emerald-400 drop-shadow-lg hover:scale-105 transition-transform duration-300 mb-2"
            >
              ARVYA.X
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-emerald-200/80 text-sm">
              Continue your wellness journey
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 relative z-10"
          >
            <div className="relative">
              <input
                id="email"
                type="email"
                autoComplete="email"
                ref={emailRef}
                className={`w-full px-4 py-4 bg-white/10 border rounded-2xl text-white placeholder-transparent focus:outline-none transition-all duration-300 ${
                  errors.email
                    ? "border-red-400 ring-2 ring-red-400/50"
                    : focusedField === "email" || emailValue
                    ? "border-emerald-400 ring-2 ring-emerald-400/50"
                    : "border-white/30 hover:border-white/50"
                }`}
                placeholder="Email Address"
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                {...formRegister("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email",
                  },
                })}
              />
              <label
                htmlFor="email"
                className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  focusedField === "email" || emailValue
                    ? "-top-2 text-xs bg-slate-900 px-2 rounded text-emerald-400"
                    : "top-4 text-base text-emerald-200/70"
                }`}
              >
                Email Address
              </label>
              {errors.email && (
                <p className="text-red-400 text-xs mt-2 animate-shake">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className={`w-full px-4 py-4 pr-12 bg-white/10 border rounded-2xl text-white placeholder-transparent focus:outline-none transition-all duration-300 ${
                  errors.password
                    ? "border-red-400 ring-2 ring-red-400/50"
                    : focusedField === "password" || passwordValue
                    ? "border-emerald-400 ring-2 ring-emerald-400/50"
                    : "border-white/30 hover:border-white/50"
                }`}
                placeholder="Password"
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                {...formRegister("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <label
                htmlFor="password"
                className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  focusedField === "password" || passwordValue
                    ? "-top-2 text-xs bg-slate-900 px-2 rounded text-emerald-400"
                    : "top-4 text-base text-emerald-200/70"
                }`}
              >
                Password
              </label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 p-1 text-emerald-200/70 hover:text-emerald-400 transition-colors duration-200"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
              {errors.password && (
                <p className="text-red-400 text-xs mt-2 animate-shake">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-emerald-500/25 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-emerald-400/50 relative overflow-hidden"
            >
              {isLoading || isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing In...
                </div>
              ) : (
                <>
                  Sign In
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center relative z-10">
            <p className="text-emerald-200/70 text-sm">
              New to ARVYA.X?{" "}
              <Link
                to="/register"
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-200 hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-emerald-500/20 rounded-full blur-xl"></div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
