import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Package, TrendingUp, DollarSign, Box, KeyRound, CheckCircle2, Clock, XCircle, Copy, Upload, Users, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { Product } from "../data";
import type { AdminTab } from "./Sidebar";

export interface CardKey {
  id: string;
  productId: string;
  code: string;
  status: "available" | "sold" | "reserved";
  createdAt: string;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  qty: number;
  amount: number;
  status: "paid" | "pending" | "refunded";
  method: string;
  createdAt: string;
  buyer: string;
}

export interface CategoryMeta {
  id: string;
  name: string;
  slug: string;
  count: number;
  color: string;
}

interface Props {
  tab: AdminTab;
  products: Product[];
  setProducts: (p: Product[]) => void;
  categories: CategoryMeta[];
  setCategories: (c: CategoryMeta[]) => void;
  cardKeys: CardKey[];
  setCardKeys: (k: CardKey[]) => void;
  orders: Order[];
}

export function AdminPanel(props: Props) {
  return (
    <div className="h-full overflow-y-auto px-10 py-10">
      {props.tab === "dashboard" && <Dashboard {...props} />}
      {props.tab === "categories" && <CategoriesView {...props} />}
      {props.tab === "products" && <ProductsView {...props} />}
      {props.tab === "cardkeys" && <CardKeysView {...props} />}
      {props.tab === "orders" && <OrdersView {...props} />}
    </div>
  );
}

function PageHeader({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <div className="text-[10px] tracking-[0.4em] text-amber-200/70 uppercase">{eyebrow}</div>
        <h1 className="mt-2 text-4xl tracking-wide text-white" style={{ fontFamily: "serif" }}>{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-white/50 max-w-xl">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Dashboard({ products, orders, cardKeys }: Props) {
  const revenue = orders.filter((o) => o.status === "paid").reduce((s, o) => s + o.amount, 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const availableKeys = cardKeys.filter((k) => k.status === "available").length;

  const stats = [
    { label: "总营收", value: `¥${revenue.toLocaleString()}`, diff: "+12.4%", icon: DollarSign, tone: "from-amber-300 to-amber-500" },
    { label: "订单总数", value: orders.length, diff: "+8.1%", icon: Receipt2, tone: "from-emerald-300 to-emerald-500" },
    { label: "商品数量", value: products.length, diff: "+2", icon: Package, tone: "from-sky-300 to-sky-500" },
    { label: "可用卡密", value: availableKeys, diff: `${pending} 待处理`, icon: KeyRound, tone: "from-fuchsia-300 to-purple-500" },
  ];

  const salesByCat = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => {
      const p = products.find((x) => x.id === o.productId);
      if (p && o.status === "paid") map[p.category] = (map[p.category] || 0) + o.amount;
    });
    const total = Object.values(map).reduce((s, v) => s + v, 0) || 1;
    return Object.entries(map).map(([k, v]) => ({ name: k, value: v, pct: (v / total) * 100 }));
  }, [orders, products]);

  return (
    <>
      <PageHeader eyebrow="Dashboard" title="仪表盘" subtitle="实时运营数据概览" />

      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="relative rounded-2xl p-6 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 overflow-hidden">
              <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${s.tone} opacity-20 blur-2xl`} />
              <div className="flex items-center justify-between">
                <Icon className="w-5 h-5 text-white/60" />
                <span className="text-[10px] text-emerald-300 tracking-widest flex items-center gap-1"><ArrowUpRight className="w-3 h-3" />{s.diff}</span>
              </div>
              <div className="mt-6 text-3xl text-white tracking-wider">{s.value}</div>
              <div className="mt-1 text-xs text-white/40 tracking-[0.2em]">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-6">
        <div className="col-span-2 rounded-2xl p-6 bg-white/[0.02] border border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-white tracking-wider">营收趋势</div>
            <div className="text-xs text-white/40 tracking-widest">近 7 日</div>
          </div>
          <div className="mt-6 h-48 flex items-end gap-3">
            {[42, 58, 35, 72, 65, 88, 95].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-t-lg bg-gradient-to-t from-amber-500/10 to-amber-300/80 relative overflow-hidden" style={{ height: `${h}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-400 to-amber-200 opacity-80" />
                </div>
                <div className="text-[10px] text-white/40">D{i + 1}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6 bg-white/[0.02] border border-white/10">
          <div className="text-white tracking-wider">分类占比</div>
          <div className="mt-6 space-y-4">
            {salesByCat.length === 0 && <div className="text-sm text-white/40">暂无销售数据</div>}
            {salesByCat.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70 uppercase tracking-widest text-xs">{c.name}</span>
                  <span className="text-amber-200">¥{c.value.toLocaleString()}</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-fuchsia-500 to-blue-500" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="text-white tracking-wider">最近订单</div>
          <Users className="w-4 h-4 text-white/40" />
        </div>
        {orders.slice(0, 5).map((o) => (
          <div key={o.id} className="px-6 py-4 border-b border-white/5 last:border-0 grid grid-cols-5 items-center text-sm">
            <div className="text-white/80 tracking-wider">#{o.id.slice(-6)}</div>
            <div className="text-white/70">{o.productName}</div>
            <div className="text-white/60">× {o.qty}</div>
            <div className="text-amber-200">¥{o.amount.toLocaleString()}</div>
            <StatusPill status={o.status} />
          </div>
        ))}
      </div>
    </>
  );
}

function CategoriesView({ categories, setCategories, products }: Props) {
  const [editing, setEditing] = useState<CategoryMeta | null>(null);

  return (
    <>
      <PageHeader eyebrow="Categories" title="分类管理" subtitle="管理商品分类与标签"
        action={<button onClick={() => setEditing({ id: `c${Date.now()}`, name: "", slug: "", count: 0, color: "from-purple-400 to-blue-500" })} className="h-11 px-5 rounded-full bg-gradient-to-r from-amber-200 to-amber-400 text-neutral-900 tracking-widest text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> 新建分类</button>}
      />
      <div className="grid grid-cols-3 gap-5">
        {categories.map((c) => {
          const count = products.filter((p) => p.category === c.slug).length;
          return (
            <div key={c.id} className="relative rounded-2xl p-6 bg-white/[0.02] border border-white/10 overflow-hidden group">
              <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${c.color} opacity-20 blur-3xl`} />
              <div className="relative">
                <div className="text-[10px] tracking-[0.3em] text-white/40 uppercase">{c.slug}</div>
                <div className="mt-2 text-2xl text-white tracking-wide" style={{ fontFamily: "serif" }}>{c.name}</div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="text-3xl text-white tracking-wider">{count}</div>
                    <div className="text-xs text-white/40 tracking-widest mt-1">商品</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(c)} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setCategories(categories.filter((x) => x.id !== c.id))} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <Modal title={editing.name ? "编辑分类" : "新建分类"} onClose={() => setEditing(null)} onSave={() => { setCategories(categories.find((x) => x.id === editing.id) ? categories.map((x) => x.id === editing.id ? editing : x) : [...categories, editing]); setEditing(null); }}>
          <Field label="名称"><input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputCls} /></Field>
          <Field label="Slug"><input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className={inputCls} /></Field>
          <Field label="渐变色"><input value={editing.color} onChange={(e) => setEditing({ ...editing, color: e.target.value })} className={inputCls} placeholder="from-purple-400 to-blue-500" /></Field>
        </Modal>
      )}
    </>
  );
}

function ProductsView({ products, setProducts, categories }: Props) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [q, setQ] = useState("");
  const list = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.subtitle.includes(q));

  return (
    <>
      <PageHeader eyebrow="Products" title="商品管理" subtitle="维护商品目录与定价"
        action={<button onClick={() => setEditing({ id: `p${Date.now()}`, name: "", subtitle: "", description: "", price: 0, stock: 0, category: "fragrance", image: "", accent: "from-amber-300/30 to-neutral-900/40", notes: [] })} className="h-11 px-5 rounded-full bg-gradient-to-r from-amber-200 to-amber-400 text-neutral-900 tracking-widest text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> 新增商品</button>}
      />
      <div className="mb-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索商品..." className="w-80 h-10 px-4 rounded-lg bg-white/5 border border-white/10 outline-none text-white focus:border-amber-200/40" />
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-white/5 text-xs text-white/40 tracking-[0.2em]">
          <div>商品</div><div>描述</div><div>分类</div><div>价格</div><div>库存</div><div>操作</div>
        </div>
        {list.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
            className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-white/5 items-center text-white/80 hover:bg-white/[0.02]"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-800">
                {p.image && <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover" />}
              </div>
              <div>
                <div className="text-white">{p.name}</div>
                <div className="text-xs text-white/40">{p.subtitle}</div>
              </div>
            </div>
            <div className="text-sm text-white/60 line-clamp-2">{p.description}</div>
            <div className="text-xs tracking-widest text-white/60 uppercase">{p.category}</div>
            <div className="text-amber-200 tracking-wider">¥{p.price.toLocaleString()}</div>
            <div className={p.stock < 10 ? "text-rose-300" : "text-white/70"}>{p.stock}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(p)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => setProducts(products.filter((x) => x.id !== p.id))} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </motion.div>
        ))}
      </div>

      {editing && (
        <Modal title={editing.name ? "编辑商品" : "新增商品"} onClose={() => setEditing(null)} onSave={() => { setProducts(products.find((x) => x.id === editing.id) ? products.map((x) => x.id === editing.id ? editing : x) : [...products, editing]); setEditing(null); }}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="名称"><input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputCls} /></Field>
            <Field label="副标题"><input value={editing.subtitle} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} className={inputCls} /></Field>
            <div className="col-span-2"><Field label="描述"><textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={inputCls + " py-2 h-auto"} /></Field></div>
            <Field label="价格"><input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className={inputCls} /></Field>
            <Field label="库存"><input type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} className={inputCls} /></Field>
            <Field label="分类">
              <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as any })} className={inputCls}>
                {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="图片 URL"><input value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} className={inputCls} /></Field>
          </div>
        </Modal>
      )}
    </>
  );
}

function CardKeysView({ cardKeys, setCardKeys, products }: Props) {
  const [filter, setFilter] = useState<"all" | CardKey["status"]>("all");
  const [importing, setImporting] = useState<{ productId: string; codes: string } | null>(null);

  const filtered = filter === "all" ? cardKeys : cardKeys.filter((k) => k.status === filter);
  const stats = {
    total: cardKeys.length,
    available: cardKeys.filter((k) => k.status === "available").length,
    sold: cardKeys.filter((k) => k.status === "sold").length,
    reserved: cardKeys.filter((k) => k.status === "reserved").length,
  };

  const copy = (code: string) => navigator.clipboard?.writeText(code);

  const doImport = () => {
    if (!importing) return;
    const codes = importing.codes.split("\n").map((s) => s.trim()).filter(Boolean);
    const newKeys: CardKey[] = codes.map((code, i) => ({
      id: `k${Date.now()}${i}`,
      productId: importing.productId,
      code,
      status: "available",
      createdAt: new Date().toISOString().slice(0, 10),
    }));
    setCardKeys([...cardKeys, ...newKeys]);
    setImporting(null);
  };

  return (
    <>
      <PageHeader eyebrow="Card Keys" title="卡密库存管理" subtitle="管理虚拟商品的卡密库存"
        action={<button onClick={() => setImporting({ productId: products[0]?.id || "", codes: "" })} className="h-11 px-5 rounded-full bg-gradient-to-r from-amber-200 to-amber-400 text-neutral-900 tracking-widest text-sm flex items-center gap-2"><Upload className="w-4 h-4" /> 批量导入</button>}
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "卡密总数", value: stats.total, tone: "from-white/40 to-white/10" },
          { label: "可用", value: stats.available, tone: "from-emerald-400 to-emerald-600" },
          { label: "已售", value: stats.sold, tone: "from-sky-400 to-blue-600" },
          { label: "锁定", value: stats.reserved, tone: "from-amber-400 to-orange-600" },
        ].map((s) => (
          <div key={s.label} className="relative rounded-2xl p-5 bg-white/[0.03] border border-white/10 overflow-hidden">
            <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${s.tone} opacity-20 blur-2xl`} />
            <div className="text-xs text-white/40 tracking-[0.2em]">{s.label}</div>
            <div className="mt-3 text-3xl text-white tracking-wider">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {(["all", "available", "sold", "reserved"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 h-9 rounded-full text-xs tracking-widest transition-all ${filter === f ? "bg-white text-neutral-900" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>
            {f === "all" ? "全部" : f === "available" ? "可用" : f === "sold" ? "已售" : "锁定"}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="grid grid-cols-[1.2fr_2fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-white/5 text-xs text-white/40 tracking-[0.2em]">
          <div>关联商品</div><div>卡密</div><div>状态</div><div>生成日期</div><div>操作</div>
        </div>
        {filtered.map((k) => {
          const p = products.find((x) => x.id === k.productId);
          return (
            <div key={k.id} className="grid grid-cols-[1.2fr_2fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-white/5 items-center text-sm">
              <div className="text-white/80">{p?.name || "—"}</div>
              <div className="font-mono text-amber-200/90 tracking-wider">{k.code}</div>
              <StatusPill status={k.status} />
              <div className="text-white/50 text-xs tracking-widest">{k.createdAt}</div>
              <div className="flex gap-2">
                <button onClick={() => copy(k.code)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"><Copy className="w-3.5 h-3.5" /></button>
                <button onClick={() => setCardKeys(cardKeys.filter((x) => x.id !== k.id))} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="px-6 py-12 text-center text-white/40 text-sm">暂无卡密</div>}
      </div>

      {importing && (
        <Modal title="批量导入卡密" onClose={() => setImporting(null)} onSave={doImport}>
          <Field label="关联商品">
            <select value={importing.productId} onChange={(e) => setImporting({ ...importing, productId: e.target.value })} className={inputCls}>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
          <Field label="卡密（每行一个）">
            <textarea rows={8} value={importing.codes} onChange={(e) => setImporting({ ...importing, codes: e.target.value })} className={inputCls + " py-2 h-auto font-mono"} placeholder="XXXX-XXXX-XXXX-XXXX" />
          </Field>
        </Modal>
      )}
    </>
  );
}

function OrdersView({ orders, products }: Props) {
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");
  const list = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <>
      <PageHeader eyebrow="Orders" title="订单管理" subtitle="订单跟踪与处理" />
      <div className="flex gap-2 mb-4">
        {(["all", "paid", "pending", "refunded"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 h-9 rounded-full text-xs tracking-widest transition-all ${filter === f ? "bg-white text-neutral-900" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>
            {f === "all" ? "全部" : f === "paid" ? "已支付" : f === "pending" ? "待处理" : "已退款"}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="grid grid-cols-[1fr_1.5fr_1fr_0.8fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-white/5 text-xs text-white/40 tracking-[0.2em]">
          <div>订单号</div><div>商品</div><div>买家</div><div>数量</div><div>金额</div><div>支付</div><div>状态</div>
        </div>
        {list.map((o) => (
          <div key={o.id} className="grid grid-cols-[1fr_1.5fr_1fr_0.8fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-white/5 items-center text-sm">
            <div className="text-white/80 font-mono">#{o.id.slice(-8)}</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-neutral-800 overflow-hidden">
                {(() => { const p = products.find((x) => x.id === o.productId); return p?.image ? <ImageWithFallback src={p.image} alt="" className="w-full h-full object-cover" /> : null; })()}
              </div>
              <span className="text-white/80">{o.productName}</span>
            </div>
            <div className="text-white/60">{o.buyer}</div>
            <div className="text-white/60">× {o.qty}</div>
            <div className="text-amber-200">¥{o.amount.toLocaleString()}</div>
            <div className="text-white/60 text-xs tracking-widest">{o.method}</div>
            <StatusPill status={o.status} />
          </div>
        ))}
        {list.length === 0 && <div className="px-6 py-12 text-center text-white/40 text-sm">暂无订单</div>}
      </div>
    </>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; icon: any; cls: string }> = {
    paid: { label: "已支付", icon: CheckCircle2, cls: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" },
    pending: { label: "待处理", icon: Clock, cls: "bg-amber-500/10 text-amber-300 border-amber-500/20" },
    refunded: { label: "已退款", icon: XCircle, cls: "bg-rose-500/10 text-rose-300 border-rose-500/20" },
    available: { label: "可用", icon: CheckCircle2, cls: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" },
    sold: { label: "已售", icon: CheckCircle2, cls: "bg-sky-500/10 text-sky-300 border-sky-500/20" },
    reserved: { label: "锁定", icon: Clock, cls: "bg-amber-500/10 text-amber-300 border-amber-500/20" },
  };
  const s = map[status];
  if (!s) return null;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] tracking-widest ${s.cls}`}>
      <Icon className="w-3 h-3" /> {s.label}
    </span>
  );
}

const inputCls = "w-full h-10 px-4 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-amber-200/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-white/40 tracking-[0.2em] mb-2">{label}</div>
      {children}
    </div>
  );
}

function Modal({ title, children, onClose, onSave }: { title: string; children: React.ReactNode; onClose: () => void; onSave: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative w-full max-w-xl rounded-3xl bg-neutral-950 border border-white/10 p-8 max-h-[85vh] overflow-y-auto">
        <div className="text-xl text-white tracking-wide mb-6" style={{ fontFamily: "serif" }}>{title}</div>
        <div className="space-y-4">{children}</div>
        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="h-10 px-5 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm tracking-widest">取消</button>
          <button onClick={onSave} className="h-10 px-6 rounded-full bg-gradient-to-r from-amber-200 to-amber-400 text-neutral-900 text-sm tracking-widest">保存</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Receipt2(props: any) {
  return <TrendingUp {...props} />;
}
