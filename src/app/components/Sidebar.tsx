import { Store, LayoutGrid, Sparkles, ShoppingBag, Heart, Package, LayoutDashboard, FolderTree, Boxes, KeyRound, Receipt } from "lucide-react";
import { motion } from "motion/react";

export type View = "shop" | "admin";
export type Category = "all" | "fragrance" | "skincare" | "accessories" | "curated";
export type AdminTab = "dashboard" | "categories" | "products" | "cardkeys" | "orders";

interface SidebarProps {
  view: View;
  setView: (v: View) => void;
  category: Category;
  setCategory: (c: Category) => void;
  adminTab: AdminTab;
  setAdminTab: (t: AdminTab) => void;
}

const categories: { id: Category; label: string; icon: any }[] = [
  { id: "all", label: "全部臻选", icon: LayoutGrid },
  { id: "fragrance", label: "香氛", icon: Sparkles },
  { id: "skincare", label: "护肤", icon: Heart },
  { id: "accessories", label: "配饰", icon: ShoppingBag },
  { id: "curated", label: "私藏精选", icon: Package },
];

const adminTabs: { id: AdminTab; label: string; icon: any }[] = [
  { id: "dashboard", label: "仪表盘", icon: LayoutDashboard },
  { id: "categories", label: "分类管理", icon: FolderTree },
  { id: "products", label: "商品管理", icon: Boxes },
  { id: "cardkeys", label: "卡密库存", icon: KeyRound },
  { id: "orders", label: "订单管理", icon: Receipt },
];

export function Sidebar({ view, setView, category, setCategory, adminTab, setAdminTab }: SidebarProps) {
  return (
    <aside className="w-72 h-full bg-gradient-to-b from-neutral-950 to-neutral-900 border-r border-white/5 flex flex-col text-white/80">
      <div className="px-7 py-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-200 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Store className="w-5 h-5 text-neutral-900" />
          </div>
          <div>
            <div className="tracking-[0.3em] text-white">MAISON</div>
            <div className="text-xs text-white/40 tracking-widest">SELF · BOUTIQUE</div>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 flex gap-2">
        <button onClick={() => setView("shop")} className={`flex-1 h-9 rounded-lg text-xs tracking-widest transition-all ${view === "shop" ? "bg-white text-neutral-900" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>商店</button>
        <button onClick={() => setView("admin")} className={`flex-1 h-9 rounded-lg text-xs tracking-widest transition-all ${view === "admin" ? "bg-white text-neutral-900" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>后台</button>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {view === "shop" ? (
          <>
            <div className="px-3 py-2 text-xs text-white/30 tracking-[0.2em]">商品分类</div>
            {categories.map((c) => {
              const Icon = c.icon;
              const active = category === c.id;
              return (
                <button key={c.id} onClick={() => setCategory(c.id)}
                  className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${active ? "text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                >
                  {active && <motion.div layoutId="nav-active" className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-white/0 border border-white/10" transition={{ type: "spring", stiffness: 400, damping: 35 }} />}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10 tracking-wide">{c.label}</span>
                </button>
              );
            })}
          </>
        ) : (
          <>
            <div className="px-3 py-2 text-xs text-white/30 tracking-[0.2em]">后台模块</div>
            {adminTabs.map((c) => {
              const Icon = c.icon;
              const active = adminTab === c.id;
              return (
                <button key={c.id} onClick={() => setAdminTab(c.id)}
                  className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${active ? "text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                >
                  {active && <motion.div layoutId="nav-active" className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-white/0 border border-white/10" transition={{ type: "spring", stiffness: 400, damping: 35 }} />}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10 tracking-wide">{c.label}</span>
                </button>
              );
            })}
          </>
        )}
      </nav>

      <div className="p-5 border-t border-white/5">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-fuchsia-500/10 via-purple-500/10 to-blue-500/10 border border-white/10">
          <div className="text-xs text-white/50 tracking-widest">支持</div>
          <div className="mt-1 text-white tracking-wider text-sm">7×24 在线客服</div>
        </div>
      </div>
    </aside>
  );
}
