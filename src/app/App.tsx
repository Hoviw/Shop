import { useMemo, useState } from "react";
import { Sidebar, type View, type Category, type AdminTab } from "./components/Sidebar";
import { ProductGrid } from "./components/ProductGrid";
import { ProductDetail } from "./components/ProductDetail";
import { AdminPanel, type CardKey, type Order, type CategoryMeta } from "./components/AdminPanel";
import { Checkout } from "./components/Checkout";
import { NeonSearch } from "./components/NeonSearch";
import { HomePage } from "./components/HomePage";
import { initialProducts, type Product } from "./data";
import { motion, AnimatePresence } from "motion/react";

const initialCategories: CategoryMeta[] = [
  { id: "c1", name: "香氛", slug: "fragrance", count: 0, color: "from-fuchsia-400 to-purple-600" },
  { id: "c2", name: "护肤", slug: "skincare", count: 0, color: "from-emerald-400 to-teal-600" },
  { id: "c3", name: "配饰", slug: "accessories", count: 0, color: "from-rose-400 to-pink-600" },
  { id: "c4", name: "私藏精选", slug: "curated", count: 0, color: "from-amber-300 to-orange-500" },
];

const initialCardKeys: CardKey[] = [
  { id: "k1", productId: "p1", code: "OBSD-2026-ALPHA-77X1", status: "available", createdAt: "2026-04-10" },
  { id: "k2", productId: "p1", code: "OBSD-2026-ALPHA-77X2", status: "available", createdAt: "2026-04-10" },
  { id: "k3", productId: "p2", code: "SVGE-NOIR-GOLD-4421", status: "sold", createdAt: "2026-03-22" },
  { id: "k4", productId: "p3", code: "BOTA-RITE-GRN-9281", status: "available", createdAt: "2026-04-15" },
  { id: "k5", productId: "p4", code: "CRYS-AURA-SKY-1194", status: "reserved", createdAt: "2026-04-18" },
  { id: "k6", productId: "p5", code: "GOLD-HZON-LMT-0001", status: "available", createdAt: "2026-04-01" },
];

const initialOrders: Order[] = [
  { id: "o1000001", productId: "p1", productName: "Obsidian Elixir", qty: 1, amount: 1280, status: "paid", method: "微信", createdAt: "2026-04-20", buyer: "M***4421" },
  { id: "o1000002", productId: "p2", productName: "Sauvage Noir", qty: 2, amount: 3360, status: "paid", method: "支付宝", createdAt: "2026-04-19", buyer: "L***8812" },
  { id: "o1000003", productId: "p4", productName: "Crystal Aura", qty: 1, amount: 960, status: "pending", method: "银行卡", createdAt: "2026-04-21", buyer: "Z***0033" },
  { id: "o1000004", productId: "p5", productName: "Golden Horizon", qty: 1, amount: 2280, status: "paid", method: "微信", createdAt: "2026-04-18", buyer: "W***7751" },
  { id: "o1000005", productId: "p3", productName: "Botanical Ritual", qty: 3, amount: 1440, status: "refunded", method: "支付宝", createdAt: "2026-04-17", buyer: "S***2094" },
];

export default function App() {
  const [landed, setLanded] = useState(false);
  const [view, setView] = useState<View>("shop");
  const [category, setCategory] = useState<Category>("all");
  const [adminTab, setAdminTab] = useState<AdminTab>("dashboard");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<CategoryMeta[]>(initialCategories);
  const [cardKeys, setCardKeys] = useState<CardKey[]>(initialCardKeys);
  const [orders] = useState<Order[]>(initialOrders);
  const [selected, setSelected] = useState<Product | null>(null);
  const [buying, setBuying] = useState<{ product: Product; qty: number } | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = category === "all" ? products : products.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.subtitle.includes(query) || p.description.includes(query));
    }
    return list;
  }, [category, products, query]);

  return (
    <>
      <AnimatePresence>
        {!landed && (
          <motion.div
            key="home"
            className="fixed inset-0 z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <HomePage onEnter={() => setLanded(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="size-full flex bg-neutral-950 text-white overflow-hidden">
        <Sidebar view={view} setView={setView} category={category} setCategory={setCategory} adminTab={adminTab} setAdminTab={setAdminTab} />

        <main className="flex-1 h-full relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <AnimatePresence mode="wait">
            {view === "shop" ? (
              <motion.div key="shop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative h-full overflow-y-auto px-12 py-10">
                <div className="text-center">
                  <div className="text-[10px] tracking-[0.4em] text-amber-200/70 uppercase">Spring / Summer 2026</div>
                  <h1 className="mt-3 text-5xl text-white tracking-wide" style={{ fontFamily: "serif" }}>自助臻选空间</h1>
                  <p className="mt-3 text-white/50 max-w-xl mx-auto leading-relaxed">每一件商品都经过严苛臻选 · 点击任意商品查看详情并直接下单</p>
                </div>

                <div className="mt-12 mb-6">
                  <NeonSearch value={query} onChange={setQuery} />
                </div>

                <div className="mt-14 flex items-center justify-between">
                  <div className="text-xs text-white/40 tracking-[0.3em]">{filtered.length} 件商品</div>
                  <div className="text-xs text-white/40 tracking-[0.3em]">悬停展开 · 点击查看</div>
                </div>

                <div className="mt-6">
                  {filtered.length > 0 ? (
                    <ProductGrid key={category + query} products={filtered} onSelect={setSelected} />
                  ) : (
                    <div className="h-96 flex items-center justify-center text-white/40 tracking-widest">未找到相关商品</div>
                  )}
                </div>

                <div className="mt-12 grid grid-cols-3 gap-6 text-white/60 text-sm">
                  {[
                    { t: "即时发货", d: "支付后即刻发送卡密" },
                    { t: "七日无忧", d: "七天内无理由退换" },
                    { t: "银联加密", d: "银行级支付安全" },
                  ].map((f) => (
                    <div key={f.t} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                      <div className="text-white tracking-wider">{f.t}</div>
                      <div className="mt-1 text-xs text-white/40">{f.d}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative h-full">
                <AdminPanel tab={adminTab} products={products} setProducts={setProducts} categories={categories} setCategories={setCategories} cardKeys={cardKeys} setCardKeys={setCardKeys} orders={orders} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <ProductDetail
          product={selected}
          onClose={() => setSelected(null)}
          onBuy={(p, q) => { setBuying({ product: p, qty: q }); setSelected(null); }}
        />
        <Checkout order={buying} onClose={() => setBuying(null)} />
      </div>
    </>
  );
}