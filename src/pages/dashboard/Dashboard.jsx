import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, Clock, ArrowRight, ShoppingCart, ShieldCheck } from "lucide-react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { identityApi } from "../../api/identity";

export default function Dashboard() {
  const { user } = useAuth();
  const { items, totalItems, totalPrice } = useCart();
  const [identityStatus, setIdentityStatus] = useState(null);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    identityApi
      .status()
      .then(({ data }) => setIdentityStatus(data.status))
      .catch(() => setIdentityStatus("unverified"))
      .finally(() => setChecking(false));
  }, []);

  // If unverified, show full-screen prompt first
  if (!checking && identityStatus === "unverified") {
    return <IdentityGate user={user} />;
  }

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
        <p className="font-mono text-xs tracking-widest text-amber uppercase mb-2">Dashboard</p>
        <h1 className="font-display text-3xl font-semibold text-text mb-1">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-text-muted font-body mb-8">
          Manage your orders and installment plans here.
        </p>

        {!checking && identityStatus && identityStatus !== "approved" && identityStatus !== "unverified" && (
          <IdentityBanner status={identityStatus} />
        )}

        {!checking && identityStatus === "approved" && (
          <div className="flex items-center gap-3 rounded-2xl border border-mint/30 bg-mint/5 p-4 mb-8">
            <ShieldCheck size={18} className="text-mint shrink-0" />
            <p className="text-sm text-text-muted">Identity verified — you're all set for installment plans.</p>
          </div>
        )}

        <Link
          to="/cart"
          className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 mb-8 hover:border-navy/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-surface-raised border border-border flex items-center justify-center text-navy shrink-0">
              <ShoppingCart size={18} />
            </div>
            <div>
              <p className="text-text font-medium">
                {totalItems > 0 ? `${totalItems} item${totalItems > 1 ? "s" : ""} in your cart` : "Your cart is empty"}
              </p>
              <p className="text-text-muted text-sm mt-0.5">
                {totalItems > 0 ? `GHS ${totalPrice.toLocaleString()} — ready when you are` : "Browse the shop to add a phone"}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-navy shrink-0">
            {items.length > 0 ? "Go to cart" : "Shop now"} <ArrowRight size={14} />
          </span>
        </Link>

        <p className="text-text-muted font-body mt-4">
          Order history and installment plan management land in the next build pass.
        </p>
      </div>
    </div>
  );
}

/** Full-screen prompt shown to users who haven't verified yet */
function IdentityGate({ user }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="sticky top-0 z-50 border-b border-border bg-ink/95 backdrop-blur px-5 sm:px-8 h-16 flex items-center">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg text-navy">
          <span className="size-7 rounded-full border-2 border-amber border-r-transparent rotate-45" aria-hidden="true" />
          Circul
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-md bg-ink border border-border rounded-2xl p-8 shadow-sm text-center">
          <div className="size-16 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center mx-auto mb-5">
            <ShieldAlert size={28} className="text-amber" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-text mb-2">
            Verify your identity
          </h2>
          <p className="text-text-muted font-body text-sm leading-relaxed mb-6">
            Hey {user?.name?.split(" ")[0] ?? "there"}, welcome to Circul! Before you start shopping, 
            we need to verify your identity with your <strong className="text-text">Ghana Card</strong> or another accepted ID. 
            This keeps your account secure and unlocks installment plans.
          </p>
          <p className="text-text-faint text-xs font-body mb-6">
            It only takes a couple of minutes.
          </p>
          <Link
            to="/verify-identity"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-navy text-white font-medium hover:bg-navy-dim transition-colors"
          >
            Verify now <ArrowRight size={16} />
          </Link>
          <Link
            to="/shop"
            className="block text-center text-sm text-text-muted hover:text-text mt-4 transition-colors"
          >
            Browse without verifying first
          </Link>
        </div>
      </div>
    </div>
  );
}

function IdentityBanner({ status }) {
  const config = {
    pending: {
      icon: Clock,
      color: "text-amber",
      bg: "bg-amber/10 border-amber/30",
      title: "Identity verification pending",
      body: "We're reviewing the documents you submitted. We'll let you know once it's confirmed.",
      cta: "View status",
    },
    rejected: {
      icon: ShieldAlert,
      color: "text-coral",
      bg: "bg-coral/10 border-coral/30",
      title: "Identity verification needs another look",
      body: "Your last submission was rejected. Please resubmit your documents.",
      cta: "Resubmit",
    },
  }[status];

  if (!config) return null;
  const Icon = config.icon;

  return (
    <Link
      to="/verify-identity"
      className={`flex items-center justify-between gap-4 rounded-2xl border p-5 mb-8 hover:opacity-90 transition-opacity ${config.bg}`}
    >
      <div className="flex items-start gap-3">
        <Icon size={20} className={`${config.color} mt-0.5 shrink-0`} />
        <div>
          <p className={`font-medium ${config.color}`}>{config.title}</p>
          <p className="text-text-muted text-sm mt-1">{config.body}</p>
        </div>
      </div>
      <span className={`inline-flex items-center gap-1 text-sm font-medium shrink-0 ${config.color}`}>
        {config.cta} <ArrowRight size={14} />
      </span>
    </Link>
  );
}
