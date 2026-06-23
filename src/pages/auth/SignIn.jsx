import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../../components/AuthShell";
import FormField from "../../components/FormField";
import { authApi } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_BASE_URL ?? ""}/auth/google/redirect`;

export default function SignIn() {
  const navigate = useNavigate();
  const { completeAuth } = useAuth();
  const [form, setForm] = useState({ login: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      completeAuth(data.token, data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't sign you in. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage your orders and payment plans.">
      {error && (
        <div className="mb-4 rounded-lg bg-coral/10 border border-coral/30 text-coral text-sm px-3 py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Email or phone"
          type="text"
          value={form.login}
          onChange={update("login")}
          placeholder="ama@example.com"
          required
        />
        <div>
          <FormField
            label="Password"
            type="password"
            value={form.password}
            onChange={update("password")}
            placeholder="••••••••"
            required
          />
          <Link to="/forgot-password" className="text-xs text-amber hover:underline mt-1.5 block text-right">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-2.5 rounded-lg bg-navy text-white font-medium hover:bg-navy-dim transition-colors disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-border" />
        <span className="text-text-faint text-xs">or continue with</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Google Sign In */}
      <a
        href={GOOGLE_AUTH_URL}
        className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border border-border bg-ink hover:bg-surface transition-colors text-sm font-medium text-text"
      >
        <GoogleIcon />
        Sign in with Google
      </a>

      <p className="text-center text-sm text-text-muted mt-6">
        New to Circul?{" "}
        <Link to="/signup" className="text-amber hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}
