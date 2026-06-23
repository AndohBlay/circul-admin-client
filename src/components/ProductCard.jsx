import { useState } from "react";
import { Smartphone, ShoppingCart, X, Wrench, WrenchIcon } from "lucide-react";
import { productImageUrl } from "../utils/image";

export default function ProductCard({ product, onAddToCart }) {
  const imageUrl = productImageUrl(product);
  const outOfStock = product.stock_quantity <= 0;
  const [zoomed, setZoomed] = useState(false);

  const hasInstallation = product.installation_available === true || product.installation_available === 1;

  return (
    <>
      <div className="bg-ink border border-border rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md hover:border-navy/30 transition-all">
        {/* Image */}
        <div
          className="aspect-square bg-surface flex items-center justify-center cursor-zoom-in relative overflow-hidden group"
          onClick={() => imageUrl && setZoomed(true)}
          title={imageUrl ? "Click to zoom" : undefined}
        >
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-navy text-xs font-medium px-2 py-1 rounded-full">
                  View
                </span>
              </div>
            </>
          ) : (
            <Smartphone size={36} className="text-text-faint" />
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-display text-base text-text mb-1 line-clamp-1">{product.name}</h3>

          {/* Installation status — above price */}
          <div className="mb-2">
            {hasInstallation ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-mint bg-mint/10 border border-mint/20 rounded-full px-2.5 py-0.5">
                <Wrench size={10} /> Installation Available
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-text-faint bg-surface border border-border rounded-full px-2.5 py-0.5">
                No Installation
              </span>
            )}
          </div>

          <p className="font-mono text-amber text-sm mb-3 font-semibold">
            GHS {Number(product.price).toLocaleString()}
          </p>

          {onAddToCart && (
            <button
              onClick={() => onAddToCart(product)}
              disabled={outOfStock}
              className="mt-auto inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-dim transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={14} /> {outOfStock ? "Out of stock" : "Add to cart"}
            </button>
          )}
        </div>
      </div>

      {/* Zoom modal */}
      {zoomed && imageUrl && (
        <div
          className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-ink rounded-2xl overflow-hidden border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomed(false)}
              className="absolute top-3 right-3 z-10 size-8 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted hover:text-text transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
            <img src={imageUrl} alt={product.name} className="w-full object-contain max-h-[80vh]" />
            <div className="p-4 border-t border-border">
              <p className="font-display font-semibold text-text">{product.name}</p>
              <p className="font-mono text-amber text-sm mt-1">GHS {Number(product.price).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
