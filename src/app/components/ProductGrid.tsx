import { useState } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { Product } from "../data";

interface Props {
  products: Product[];
  onSelect: (p: Product) => void;
}

export function ProductGrid({ products, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      className="grid gap-4 h-[520px]"
      style={{ gridTemplateColumns: products.map((p) => (hovered === p.id ? "2.2fr" : hovered ? "0.9fr" : "1fr")).join(" ") }}
      onMouseLeave={() => setHovered(null)}
    >
      {products.map((p, i) => (
        <motion.div
          key={p.id}
          layout
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          onMouseEnter={() => setHovered(p.id)}
          onClick={() => onSelect(p)}
          className="relative rounded-3xl overflow-hidden cursor-pointer group border border-white/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ transitionDelay: `${i * 40}ms` }}
        >
          <ImageWithFallback src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-t ${p.accent} mix-blend-multiply`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
            <div className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] tracking-[0.2em] text-white/80 uppercase">
              {p.category}
            </div>
            {p.stock < 10 && (
              <div className="px-2.5 py-1 rounded-full bg-amber-300/90 text-neutral-900 text-[10px] tracking-wider">仅剩 {p.stock}</div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <motion.div layout="position">
              <div className="text-xs tracking-[0.3em] text-white/50 uppercase">{p.subtitle}</div>
              <div className="mt-2 text-2xl tracking-wide" style={{ fontFamily: "serif" }}>{p.name}</div>
            </motion.div>

            {hovered === p.id && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-4"
              >
                <p className="text-sm text-white/70 leading-relaxed line-clamp-2">{p.description}</p>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <div className="text-[10px] text-white/40 tracking-widest">PRICE</div>
                    <div className="text-amber-200 tracking-wider">¥ {p.price.toLocaleString()}</div>
                  </div>
                  <div className="px-4 py-2 rounded-full bg-white text-neutral-900 text-xs tracking-widest">查看详情 →</div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
