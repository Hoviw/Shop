import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { Product } from "../data";

interface Props {
  product: Product | null;
  onClose: () => void;
  onBuy: (p: Product, qty: number) => void;
}

export function ProductDetail({ product, onClose, onBuy }: Props) {
  const [qty, setQty] = useState(1);
  useEffect(() => { setQty(1); }, [product?.id]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="relative w-full max-w-5xl h-[640px] rounded-3xl overflow-hidden bg-neutral-950 border border-white/10 grid grid-cols-2 shadow-2xl"
          >
            <div className="relative">
              <ImageWithFallback src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-t ${product.accent} mix-blend-multiply`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white/70 text-xs tracking-[0.3em] uppercase">{product.subtitle}</div>
            </div>

            <div className="relative flex flex-col p-10 text-white">
              <button onClick={onClose} className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors">
                <X className="w-4 h-4" />
              </button>

              <div className="text-[10px] tracking-[0.4em] text-amber-200/70 uppercase">Maison Collection</div>
              <h2 className="mt-3 text-4xl tracking-wide" style={{ fontFamily: "serif" }}>{product.name}</h2>
              <div className="mt-2 text-white/50 tracking-widest text-sm">{product.subtitle}</div>

              <div className="mt-6 h-px bg-gradient-to-r from-white/20 via-white/5 to-transparent" />

              <p className="mt-6 text-white/70 leading-relaxed">{product.description}</p>

              {product.notes && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {product.notes.map((n) => (
                    <span key={n} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 tracking-wider">{n}</span>
                  ))}
                </div>
              )}

              <div className="mt-auto">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[10px] text-white/40 tracking-[0.3em]">PRICE</div>
                    <div className="mt-1 text-3xl text-amber-200 tracking-wider">¥ {product.price.toLocaleString()}</div>
                  </div>
                  <div className="text-xs text-white/40 tracking-widest">库存 {product.stock}</div>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-full overflow-hidden">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-11 h-11 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="w-12 text-center tracking-widest">{qty}</div>
                    <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-11 h-11 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onBuy(product, qty)}
                    className="flex-1 h-11 rounded-full bg-gradient-to-r from-amber-200 to-amber-400 text-neutral-900 tracking-[0.2em] text-sm flex items-center justify-center gap-2 hover:from-amber-100 hover:to-amber-300 transition-all shadow-lg shadow-amber-500/20"
                  >
                    <Zap className="w-4 h-4" /> 立即购买 · ¥{(product.price * qty).toLocaleString()}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
