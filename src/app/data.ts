import type { Category } from "./components/Sidebar";

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  stock: number;
  category: Exclude<Category, "all">;
  image: string;
  accent: string;
  notes?: string[];
}

export const initialProducts: Product[] = [
  {
    id: "p1",
    name: "Obsidian Elixir",
    subtitle: "黑曜石精华露",
    description: "以夜幕为灵感，融合沉香与黑胡椒的神秘气息。置于晨昏交替之间，留下无法忽视的存在感。",
    price: 1280,
    stock: 24,
    category: "fragrance",
    image: "https://images.unsplash.com/photo-1772191399367-91ed8d95664b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    accent: "from-amber-400/30 to-amber-900/40",
    notes: ["沉香", "黑胡椒", "雪松", "麝香"],
  },
  {
    id: "p2",
    name: "Sauvage Noir",
    subtitle: "幽谧之境",
    description: "金色基调的经典木质香调，绽放于光影之中。为讲究品味的你献上永恒的仪式。",
    price: 1680,
    stock: 12,
    category: "fragrance",
    image: "https://images.unsplash.com/photo-1760860992203-85ca32536788?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    accent: "from-yellow-300/30 to-orange-900/40",
    notes: ["佛手柑", "琥珀", "檀香"],
  },
  {
    id: "p3",
    name: "Botanical Ritual",
    subtitle: "植萃仪式洁净露",
    description: "植物精油与矿物温泉水的融合，温柔唤醒肌肤的自愈节律。",
    price: 480,
    stock: 48,
    category: "skincare",
    image: "https://images.unsplash.com/photo-1775126454577-4846f3e55cc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    accent: "from-emerald-400/30 to-emerald-900/40",
    notes: ["迷迭香", "尤加利", "薰衣草"],
  },
  {
    id: "p4",
    name: "Crystal Aura",
    subtitle: "晶透光感香水",
    description: "清透玻璃瓶身承载花果交织的清新乐章，如晨露般灵动。",
    price: 960,
    stock: 18,
    category: "fragrance",
    image: "https://images.unsplash.com/photo-1774682061055-3bfe402e5a12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    accent: "from-sky-300/30 to-indigo-900/40",
    notes: ["白茶", "铃兰", "白麝香"],
  },
  {
    id: "p5",
    name: "Golden Horizon",
    subtitle: "鎏金地平线",
    description: "金属感与极简主义的完美契合，置于梳妆台成为空间主角。",
    price: 2280,
    stock: 6,
    category: "curated",
    image: "https://images.unsplash.com/photo-1681310483042-64aa6776f112?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    accent: "from-amber-300/40 to-neutral-900/60",
    notes: ["限量典藏"],
  },
  {
    id: "p6",
    name: "Ustraa Trio",
    subtitle: "绅士三重奏",
    description: "三款经典男士古龙水的完美组合，演绎从晨间到深夜的层次变化。",
    price: 1560,
    stock: 20,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1758871992965-836e1fb0f9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    accent: "from-rose-400/20 to-neutral-900/60",
    notes: ["组合装"],
  },
];
