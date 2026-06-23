import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Smartphone, Wallet, Lock, Phone } from "lucide-react";
import Navbar from "../components/Navbar";
import CycleRing from "../components/CycleRing";
import ProductCard from "../components/ProductCard";
import { productsApi } from "../api/products";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Landing() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi
      .list({ per_page: 16, sort_by: "created_at", sort_order: "desc" })
      .then(({ data }) => setProducts(data.data ?? data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const gridClass =
    products.length <= 2
      ? "grid grid-cols-2 gap-5"
      : products.length <= 6
      ? "grid grid-cols-2 sm:grid-cols-3 gap-5"
      : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5";

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-mono text-xs tracking-widest text-amber uppercase mb-4">
            Own it in cycles, not all at once
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight text-text">
            Get the phone now.
            <br />
            Pay it down in cycles.
          </h1>
          <p className="font-body text-text-muted mt-5 max-w-md leading-relaxed">
            Circul splits the cost of your next phone into manageable installments —
            no hidden charges, no waiting around. Pick a plan, get verified, walk away
            with your device.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-navy text-white font-medium hover:bg-navy-dim transition-colors"
            >
              Browse phones <ArrowRight size={16} />
            </Link>
            <a
              href="tel:0541851088"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber text-white font-medium hover:bg-amber-dim transition-colors"
            >
              <Phone size={16} />
              Call to Order
            </a>
          </div>
          <p className="text-text-muted text-sm mt-3 font-mono">
            📞 0541 851 088 — call or WhatsApp
          </p>
          <Link
            to="/track-order"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text mt-4 transition-colors"
          >
            Track an existing order <ArrowRight size={13} />
          </Link>
        </div>

        <div className="flex justify-center items-center gap-8 md:gap-12 flex-wrap">
          {/* iPhone illustration */}
          <div className="relative">
            <div className="w-48 h-96 sm:w-56 sm:h-[440px] rounded-[3rem] bg-surface border-4 border-border shadow-lg flex flex-col items-center justify-center overflow-hidden relative">
              {/* Phone speaker */}
              <div className="absolute top-5 w-16 h-1.5 rounded-full bg-border" />
              {/* Phone screen content */}
              <div className="w-full h-full bg-gradient-to-b from-navy to-navy-dim flex flex-col items-center justify-center gap-4 px-4">
                <div className="size-16 rounded-full bg-amber/20 border border-amber/40 flex items-center justify-center">
                  <span className="text-amber font-display font-bold text-xl">C</span>
                </div>
                <p className="text-white/90 font-display font-semibold text-sm text-center">Circul</p>
                <p className="text-white/50 text-xs text-center font-body">Pay in cycles</p>
                <div className="mt-4 space-y-2 w-full">
                  {[3, 2, 1].map((n) => (
                    <div key={n} className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber"
                        style={{ width: `${n * 28}%` }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-white/40 text-[10px] font-mono">3 of 6 paid</p>
              </div>
              {/* Home indicator */}
              <div className="absolute bottom-3 w-20 h-1 rounded-full bg-white/20" />
            </div>
            {/* Glow ring */}
            <div className="absolute -inset-3 rounded-[3.5rem] border border-amber/20 -z-10" />
          </div>

          <div className="hidden sm:block">
            <CycleRing
              segments={6}
              filled={3}
              size={200}
              label="3 / 6"
              sublabel="installments paid"
            />
          </div>
        </div>
      </section>

      {/* Featured phones */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-mono text-xs tracking-widest text-amber uppercase mb-2">In stock now</p>
              <h2 className="font-display text-2xl font-semibold text-text">Latest phones</h2>
            </div>
            <Link to="/shop" className="hidden sm:inline-flex items-center gap-1.5 text-amber text-sm hover:underline">
              See all <ArrowRight size={14} />
            </Link>
          </div>

          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-surface border border-border animate-pulse h-64" />
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <p className="text-text-muted">New stock is on the way — check back soon.</p>
          )}

          {!loading && products.length > 0 && (
            <div className={gridClass}>
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={() => addItem(p)} />
              ))}
            </div>
          )}

          <div className="mt-10 rounded-2xl border border-border bg-surface p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-surface-raised border border-border flex items-center justify-center text-text-muted shrink-0">
                <Lock size={16} />
              </div>
              <p className="text-text-muted text-sm">
                {user
                  ? "See the full catalog and place orders from the shop."
                  : "Sign in to see the full catalog and place orders."}
              </p>
            </div>
            <Link
              to="/shop"
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-navy text-white text-sm font-medium hover:bg-navy-dim transition-colors"
            >
              See more <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Circul */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 grid sm:grid-cols-3 gap-10">
          <Feature
            icon={<Smartphone size={20} />}
            title="Real devices, fair prices"
            body="Every phone listed is verified stock with transparent, all-in pricing — what you see is what you pay."
          />
          <Feature
            icon={<Wallet size={20} />}
            title="Flexible cycles"
            body="Choose a payment cycle that fits your income. Miss nothing — we remind you before anything is due."
          />
          <Feature
            icon={<ShieldCheck size={20} />}
            title="Verified, secure checkout"
            body="Identity verification and secure payment processing keep every transaction protected end to end."
          />
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 flex flex-col sm:flex-row justify-between gap-4 text-sm text-text-muted font-body">
          <span>© {new Date().getFullYear()} Circul. All rights reserved.</span>
          <span className="font-mono text-text-faint">Built in cycles.</span>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, body }) {
  return (
    <div>
      <div className="size-10 rounded-full bg-navy/10 border border-navy/20 flex items-center justify-center text-navy mb-4">
        {icon}
      </div>
      <h3 className="font-display text-lg font-medium text-text mb-2">{title}</h3>
      <p className="font-body text-sm text-text-muted leading-relaxed">{body}</p>
    </div>
  );
}
