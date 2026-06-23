import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Wrench } from "lucide-react";
import ConsoleLayout from "../../components/ConsoleLayout";
import { adminProductsApi } from "../../api/admin";
import { storageURL } from "../../api/client";
import ProductFormModal from "./ProductFormModal";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    adminProductsApi
      .list()
      .then(({ data }) => setProducts(data.data ?? data))
      .catch(() => setError("Couldn't load products."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (form) => { await adminProductsApi.create(form); load(); };
  const handleUpdate = async (form) => { await adminProductsApi.update(editing.id, form); load(); };
  const handleDelete = async (id) => {
    if (!confirm("Delete this product? This can't be undone.")) return;
    try { await adminProductsApi.remove(id); load(); }
    catch { setError("Couldn't delete the product."); }
  };

  const primaryImage = (p) => {
    const imgs = p.images ?? p.product_images ?? [];
    const primary = imgs.find((i) => i.is_primary) ?? imgs[0];
    if (!primary) return null;
    const url = primary.image_url ?? primary.url ?? primary.path;
    if (!url) return null;
    return url.startsWith("http") ? url : `${storageURL}/storage/${url}`;
  };

  return (
    <ConsoleLayout
      eyebrow="Catalog"
      title="Products"
      action={
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy text-white text-sm font-medium hover:bg-navy-dim transition-colors shrink-0"
        >
          <Plus size={16} /> New product
        </button>
      }
    >
      {loading && <p className="text-text-muted">Loading…</p>}
      {error && <p className="text-coral mb-4">{error}</p>}

      {!loading && (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block bg-ink border border-border rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text-muted font-body border-b border-border bg-surface">
                  <th className="px-5 py-3 font-medium w-12" />
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Stock</th>
                  <th className="px-5 py-3 font-medium">Installation</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => {
                  const img = primaryImage(p);
                  const hasInstall = p.installation_available === true || p.installation_available === 1;
                  return (
                    <tr key={p.id} className="text-text hover:bg-surface transition-colors">
                      <td className="px-5 py-3">
                        {img ? (
                          <img src={img} alt={p.name} className="w-9 h-9 rounded-lg object-cover border border-border" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center text-text-faint text-xs">—</div>
                        )}
                      </td>
                      <td className="px-5 py-3 font-medium">{p.name}</td>
                      <td className="px-5 py-3 font-mono text-amber">GHS {Number(p.price).toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={p.stock_quantity <= 5 ? "text-coral" : "text-text"}>{p.stock_quantity}</span>
                      </td>
                      <td className="px-5 py-3">
                        {hasInstall ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-mint/10 text-mint border border-mint/20">
                            <Wrench size={10} /> Available
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-surface text-text-faint border border-border">
                            None
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.is_active ? "bg-mint/10 text-mint border border-mint/20" : "bg-surface text-text-faint border border-border"}`}>
                          {p.is_active ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => { setEditing(p); setModalOpen(true); }}
                          className="text-text-muted hover:text-amber mr-3 transition-colors"
                          aria-label={`Edit ${p.name}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-text-muted hover:text-coral transition-colors"
                          aria-label={`Delete ${p.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-text-muted">No products yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {products.length === 0 && <p className="text-center text-text-muted py-8">No products yet.</p>}
            {products.map((p) => {
              const img = primaryImage(p);
              const hasInstall = p.installation_available === true || p.installation_available === 1;
              return (
                <div key={p.id} className="bg-ink border border-border rounded-xl p-4 flex gap-3 shadow-sm">
                  {img ? (
                    <img src={img} alt={p.name} className="w-14 h-14 rounded-lg object-cover border border-border shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-surface border border-border shrink-0 flex items-center justify-center text-text-faint text-xs">No img</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-text text-sm font-medium truncate">{p.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 border ${p.is_active ? "bg-mint/10 text-mint border-mint/20" : "bg-surface text-text-faint border-border"}`}>
                        {p.is_active ? "Active" : "Hidden"}
                      </span>
                    </div>
                    <p className="font-mono text-amber text-sm mt-0.5">GHS {Number(p.price).toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className={`text-xs ${p.stock_quantity <= 5 ? "text-coral" : "text-text-muted"}`}>
                        {p.stock_quantity} in stock
                      </p>
                      {hasInstall && (
                        <span className="inline-flex items-center gap-1 text-xs text-mint">
                          <Wrench size={10} /> Install
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button onClick={() => { setEditing(p); setModalOpen(true); }} className="text-text-muted hover:text-amber transition-colors" aria-label={`Edit ${p.name}`}>
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-text-muted hover:text-coral transition-colors" aria-label={`Delete ${p.name}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={editing ? handleUpdate : handleCreate}
        initial={editing}
      />
    </ConsoleLayout>
  );
}
