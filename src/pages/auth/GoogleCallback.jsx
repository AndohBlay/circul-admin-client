import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * The backend redirects here after Google OAuth with ?token=...&user=...
 * We extract the token, store it, then send the user to dashboard.
 * If there's an error param we redirect to sign-in with a message.
 */
export default function GoogleCallback() {
  const [params] = useSearchParams();
  const { completeAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    const userRaw = params.get("user");
    const error = params.get("error");

    if (error || !token) {
      navigate("/signin?error=google_failed", { replace: true });
      return;
    }

    try {
      const user = userRaw ? JSON.parse(decodeURIComponent(userRaw)) : {};
      completeAuth(token, user);
      navigate("/dashboard", { replace: true });
    } catch {
      navigate("/signin?error=google_failed", { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <p className="text-text-muted font-body animate-pulse">Finishing sign-in…</p>
    </div>
  );
}
