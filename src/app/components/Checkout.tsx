import { motion, AnimatePresence } from "motion/react";
import { X, CreditCard, Wallet, Smartphone, Check, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { Product } from "../data";

interface Props {
  order: { product: Product; qty: number } | null;
  onClose: () => void;
}

type Method = "wechat" | "alipay" | "card";

export function Checkout({ order, onClose }: Props) {
  const [method, setMethod] = useState<Method>("wechat");
  const [stage, setStage] = useState<"pay" | "processing" | "done">("pay");

  const pay = () => {
    setStage("processing");
    setTimeout(() => setStage("done"), 1600);
  };

  const methods: { id: Method; label: string; icon: any; tone: string }[] = [
    { id: "wechat", label: "微信支付", icon: Smartphone, tone: "from-emerald-400 to-green-600" },
    { id: "alipay", label: "支付宝", icon: Wallet, tone: "from-sky-400 to-blue-600" },
    { id: "card", label: "银行卡", icon: CreditCard, tone: "from-amber-300 to-orange-500" },
  ];

  return (
    <AnimatePresence>
      {order && (
        <motion.div className="fixed inset-0 z-[60] flex items-center justify-center p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={stage !== "processing" ? onClose : undefined} />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="relative w-full max-w-md rounded-3xl bg-neutral-950 border border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="relative h-36 overflow-hidden">
              <ImageWithFallback src={order.product.image} alt={order.product.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-neutral-950" />
              <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white">
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="text-[10px] tracking-[0.3em] text-white/60 uppercase">订单确认</div>
                <div className="mt-1 text-xl tracking-wide" style={{ fontFamily: "serif" }}>{order.product.name}</div>
              </div>
            </div>

            <div className="p-6">
              {stage === "pay" && (
                <>
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>数量</span>
                    <span className="text-white tracking-wider">× {order.qty}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-white/70">
                    <span>单价</span>
                    <span>¥ {order.product.price.toLocaleString()}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-white/70">
                    <span>配送</span>
                    <span className="text-emerald-300">免费</span>
                  </div>
                  <div className="my-5 h-px bg-white/10" />
                  <div className="flex items-end justify-between">
                    <span className="text-white/60 tracking-widest text-xs">应付金额</span>
                    <span className="text-3xl text-amber-200 tracking-wider">¥ {(order.product.price * order.qty).toLocaleString()}</span>
                  </div>

                  <div className="mt-6 text-xs text-white/40 tracking-[0.2em]">支付方式</div>
                  <div className="mt-3 space-y-2">
                    {methods.map((m) => {
                      const Icon = m.icon;
                      const active = method === m.id;
                      return (
                        <button key={m.id} onClick={() => setMethod(m.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${active ? "bg-white/10 border-white/20" : "bg-white/[0.03] border-white/5 hover:bg-white/5"}`}>
                          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${m.tone} flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="flex-1 text-left text-white/90 tracking-wide">{m.label}</span>
                          <div className={`w-4 h-4 rounded-full border ${active ? "border-amber-200 bg-amber-200" : "border-white/20"}`}>
                            {active && <Check className="w-3 h-3 text-neutral-900 m-0.5" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button onClick={pay} className="mt-6 w-full h-12 rounded-full bg-gradient-to-r from-amber-200 to-amber-400 text-neutral-900 tracking-[0.2em]">
                    立即支付 ¥ {(order.product.price * order.qty).toLocaleString()}
                  </button>
                  <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-white/40 tracking-widest">
                    <ShieldCheck className="w-3 h-3" /> 银联级加密 · 安全支付
                  </div>
                </>
              )}

              {stage === "processing" && (
                <div className="py-12 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full border-2 border-white/10 border-t-amber-200 animate-spin" />
                  <div className="mt-5 text-white/80 tracking-widest">支付处理中...</div>
                </div>
              )}

              {stage === "done" && (
                <div className="py-8 flex flex-col items-center text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-300 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Check className="w-7 h-7 text-white" />
                  </motion.div>
                  <div className="mt-5 text-2xl text-white tracking-wide" style={{ fontFamily: "serif" }}>支付成功</div>
                  <div className="mt-2 text-sm text-white/50">订单号 · {Date.now().toString().slice(-10)}</div>
                  <div className="mt-1 text-xs text-white/40 tracking-widest">卡密将通过邮箱发送至您的账户</div>
                  <button onClick={onClose} className="mt-6 w-full h-11 rounded-full bg-white/10 border border-white/10 text-white tracking-widest text-sm">完成</button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
