import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HomePageProps {
  onEnter: () => void;
}

/* ── Orbiting sparkle icon ── */
function OrbitIcon({ angle, radius, delay }: { angle: number; radius: number; delay: number }) {
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: "50%", top: "50%", x: x - 5, y: y - 5, width: 10, height: 10 }}
      animate={{ opacity: [0.3, 1, 0.3], scale: [0.7, 1.2, 0.7] }}
      transition={{ duration: 2 + delay * 0.3, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M5 0L6.2 3.8L10 5L6.2 6.2L5 10L3.8 6.2L0 5L3.8 3.8Z" fill="rgba(255,255,255,0.85)" />
      </svg>
    </motion.div>
  );
}

/* ── Frosted glass CTA button with orbiting stars ── */
function GlassButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  // 16 sparkle positions around the button
  const ORBIT_ANGLES = Array.from({ length: 16 }, (_, i) => i * 22.5);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 280, height: 120 }}
    >
      {/* Orbiting sparkles */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        {ORBIT_ANGLES.map((angle, i) => (
          <OrbitIcon key={i} angle={angle} radius={90} delay={i * 0.12} />
        ))}
      </motion.div>

      {/* Counter-rotating inner ring (smaller, offset angles) */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 10 }, (_, i) => i * 36 + 18).map((angle, i) => (
          <OrbitIcon key={i} angle={angle} radius={68} delay={i * 0.2} />
        ))}
      </motion.div>

      {/* The pill button */}
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative z-10 overflow-hidden"
        style={{
          padding: "12px 36px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.28)",
          background: hovered
            ? "rgba(255,255,255,0.18)"
            : "rgba(255,255,255,0.10)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          cursor: "pointer",
          outline: "none",
          boxShadow: hovered
            ? "0 0 24px rgba(255,255,255,0.15), inset 0 1px 1px rgba(255,255,255,0.2)"
            : "0 0 12px rgba(255,255,255,0.06), inset 0 1px 1px rgba(255,255,255,0.1)",
          transition: "background 0.3s, box-shadow 0.3s",
        }}
        animate={{ scale: hovered ? 1.04 : 1 }}
        transition={{ duration: 0.25 }}
      >
        {/* Inner shimmer */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: hovered ? ["-200% 0%", "200% 0%"] : "-200% 0%" }}
          transition={{ duration: 0.6 }}
        />
        <span
          className="relative tracking-[0.2em] text-white/90 uppercase select-none"
          style={{ fontSize: "12px", letterSpacing: "0.22em", fontWeight: 400 }}
        >
          进入商店
        </span>
      </motion.button>
    </div>
  );
}

/* ── Section Divider ── */
function Divider() {
  return (
    <div className="flex items-center gap-4 w-full max-w-xs mx-auto">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-white/15" />
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M4 0L4.9 3.1L8 4L4.9 4.9L4 8L3.1 4.9L0 4L3.1 3.1Z" fill="rgba(255,255,255,0.3)" />
      </svg>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/15 to-white/15" />
    </div>
  );
}

/* ── Feature card ── */
function FeatureCard({
  icon, title, desc, delay,
}: {
  icon: React.ReactNode; title: string; desc: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay, duration: 0.7, ease: "easeOut" }}
      className="flex flex-col items-center text-center p-8 rounded-3xl border border-white/[0.06]"
      style={{ background: "rgba(255,255,255,0.025)", backdropFilter: "blur(12px)" }}
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.2)" }}>
        {icon}
      </div>
      <div className="text-white/90 tracking-wider mb-2" style={{ fontSize: "14px" }}>{title}</div>
      <div className="text-white/35" style={{ fontSize: "12px", lineHeight: 1.8 }}>{desc}</div>
    </motion.div>
  );
}

/* ── Category preview card ── */
function CategoryCard({
  label, sub, img, color, delay,
}: {
  label: string; sub: string; img: string; color: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl aspect-[3/4] group cursor-default"
    >
      <ImageWithFallback
        src={img}
        alt={label}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(to top, ${color}33, transparent)` }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="text-white tracking-widest uppercase" style={{ fontSize: "11px", opacity: 0.5 }}>{sub}</div>
        <div className="text-white tracking-wide mt-1" style={{ fontSize: "16px" }}>{label}</div>
      </div>
    </motion.div>
  );
}

/* ── Scroll indicator ── */
function ScrollHint() {
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="text-white/25 tracking-[0.3em] uppercase" style={{ fontSize: "9px" }}>Scroll</div>
      <div className="w-px h-8 relative overflow-hidden">
        <motion.div
          className="absolute inset-x-0 top-0 h-full"
          style={{ background: "linear-gradient(to bottom, rgba(167,139,250,0.8), transparent)" }}
          animate={{ y: ["-100%", "100%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-white/10" />
      </div>
    </motion.div>
  );
}

/* ── Aurora canvas background ── */
function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      t += 0.003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bg.addColorStop(0, "rgba(8,4,20,1)");
      bg.addColorStop(1, "rgba(2,2,10,1)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const blobs = [
        { cx: 0.3 + Math.sin(t * 0.7) * 0.12, cy: 0.35 + Math.cos(t * 0.5) * 0.1, r: 0.38, r1: 120, g1: 40, b1: 220, a: 0.13 },
        { cx: 0.72 + Math.cos(t * 0.6) * 0.1, cy: 0.55 + Math.sin(t * 0.4) * 0.12, r: 0.3, r1: 60, g1: 20, b1: 190, a: 0.1 },
        { cx: 0.5 + Math.sin(t * 0.3) * 0.08, cy: 0.18 + Math.cos(t * 0.6) * 0.06, r: 0.25, r1: 200, g1: 70, b1: 255, a: 0.08 },
        { cx: 0.15 + Math.cos(t * 0.5) * 0.06, cy: 0.72 + Math.sin(t * 0.4) * 0.07, r: 0.28, r1: 70, g1: 150, b1: 255, a: 0.07 },
      ];

      blobs.forEach(({ cx, cy, r, r1, g1, b1, a }) => {
        const gx = cx * canvas.width;
        const gy = cy * canvas.height;
        const gr = r * canvas.width;
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        grad.addColorStop(0, `rgba(${r1},${g1},${b1},${a})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

/* ══════════════════════════════════════════════════
   Main HomePage
══════════════════════════════════════════════════ */
export function HomePage({ onEnter }: HomePageProps) {
  const [exiting, setExiting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const heroOpacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.4));
  const heroY = -(scrollY * 0.12);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onEnter, 650);
  };

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="hp"
          className="fixed inset-0 overflow-hidden"
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.65, ease: "easeInOut" }}
        >
          {/* Scrollable inner container */}
          <div ref={scrollRef} className="absolute inset-0 overflow-y-auto overflow-x-hidden" style={{ scrollBehavior: "smooth" }}>

            {/* ════ HERO SECTION ════ */}
            <section className="relative min-h-screen flex flex-col items-center justify-center">
              {/* Aurora */}
              <div className="sticky top-0 left-0 w-full h-screen pointer-events-none" style={{ marginBottom: "-100vh" }}>
                <AuroraCanvas />
                {/* Grid */}
                <div className="absolute inset-0 opacity-[0.025]"
                  style={{
                    backgroundImage: "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                  }} />
                {/* Vignette */}
                <div className="absolute inset-0"
                  style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 20%, rgba(2,2,10,0.75) 100%)" }} />
              </div>

              <motion.div
                style={{ opacity: heroOpacity, transform: `translateY(${heroY}px)` }}
                className="relative z-10 flex flex-col items-center text-center px-6"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="mb-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/25 bg-violet-900/15 backdrop-blur-sm"
                >
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-violet-400"
                    style={{ boxShadow: "0 0 6px 2px rgba(167,139,250,0.8)" }}
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-violet-300/75 tracking-[0.35em] uppercase" style={{ fontSize: "9px" }}>
                    Spring · Summer 2026
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="text-white select-none"
                  style={{
                    fontFamily: "serif",
                    fontSize: "clamp(56px, 9vw, 108px)",
                    lineHeight: 1.0,
                    letterSpacing: "0.04em",
                    textShadow: "0 0 80px rgba(167,139,250,0.2)",
                  }}
                >
                  臻选
                  <br />
                  <span style={{
                    background: "linear-gradient(135deg, #e2d9f3 0%, #a78bfa 40%, #7c3aed 72%, #c4b5fd 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    自助空间
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 1 }}
                  className="mt-6 text-white/35 tracking-[0.18em]"
                  style={{ fontSize: "12px", lineHeight: 2.2 }}
                >
                  每一件商品都经过严苛臻选
                  <br />
                  即选 · 即付 · 即发
                </motion.p>

                {/* Glass pill button */}
                <motion.div
                  className="mt-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1, duration: 0.8, ease: "easeOut" }}
                >
                  <GlassButton onClick={handleEnter} />
                </motion.div>

                {/* Scroll hint */}
                <motion.div
                  className="mt-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6, duration: 1 }}
                >
                  <ScrollHint />
                </motion.div>
              </motion.div>
            </section>

            {/* ════ FEATURES SECTION ════ */}
            <section className="relative py-28 px-8"
              style={{ background: "linear-gradient(to bottom, rgba(2,2,10,0) 0%, rgba(4,2,18,0.98) 8%, rgba(4,2,18,0.98) 92%, rgba(2,2,10,0) 100%)" }}>

              <div className="max-w-5xl mx-auto">
                {/* Section label */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-14"
                >
                  <div className="text-violet-400/50 tracking-[0.4em] uppercase mb-3" style={{ fontSize: "9px" }}>Why choose us</div>
                  <h2 className="text-white/80 tracking-[0.1em]" style={{ fontFamily: "serif", fontSize: "28px" }}>
                    购物保障
                  </h2>
                  <div className="mt-4">
                    <Divider />
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <FeatureCard
                    delay={0}
                    icon={
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,0.9)" strokeWidth="1.5">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    }
                    title="即时发货"
                    desc={"支付成功后系统自动发送卡密\n无需等待，秒级交付"}
                  />
                  <FeatureCard
                    delay={0.1}
                    icon={
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,0.9)" strokeWidth="1.5">
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    }
                    title="七日无忧"
                    desc={"七天内无理由退换保障\n让每一次购买都安心无虑"}
                  />
                  <FeatureCard
                    delay={0.2}
                    icon={
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,0.9)" strokeWidth="1.5">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    }
                    title="银联加密"
                    desc={"银行级支付安全体系\n每笔交易全程加密保护"}
                  />
                </div>
              </div>
            </section>

            {/* ════ CATEGORY SHOWCASE ════ */}
            <section className="relative py-24 px-8" style={{ background: "rgba(4,2,18,0.98)" }}>
              <div className="max-w-5xl mx-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-14"
                >
                  <div className="text-violet-400/50 tracking-[0.4em] uppercase mb-3" style={{ fontSize: "9px" }}>Collections</div>
                  <h2 className="text-white/80 tracking-[0.1em]" style={{ fontFamily: "serif", fontSize: "28px" }}>
                    精选分类
                  </h2>
                  <div className="mt-4">
                    <Divider />
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <CategoryCard
                    label="香氛"
                    sub="Fragrance"
                    img="https://images.unsplash.com/photo-1533603208986-24fd819e718a?w=600&q=80"
                    color="rgba(167,139,250,1)"
                    delay={0}
                  />
                  <CategoryCard
                    label="护肤"
                    sub="Skincare"
                    img="https://images.unsplash.com/photo-1775255487971-af15499994b1?w=600&q=80"
                    color="rgba(52,211,153,1)"
                    delay={0.1}
                  />
                  <CategoryCard
                    label="配饰"
                    sub="Accessories"
                    img="https://images.unsplash.com/photo-1767921482419-d2d255b5b700?w=600&q=80"
                    color="rgba(251,191,36,1)"
                    delay={0.2}
                  />
                </div>
              </div>
            </section>

            {/* ════ EXPERIENCE SECTION ════ */}
            <section className="relative py-24 px-8" style={{ background: "rgba(4,2,18,0.98)" }}>
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  {/* Left text */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="text-violet-400/50 tracking-[0.4em] uppercase mb-4" style={{ fontSize: "9px" }}>How it works</div>
                    <h2 className="text-white/85 tracking-wide" style={{ fontFamily: "serif", fontSize: "32px", lineHeight: 1.3 }}>
                      三步完成<br />
                      <span style={{
                        background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}>
                        臻选购物
                      </span>
                    </h2>
                    <div className="mt-8 space-y-6">
                      {[
                        { n: "01", t: "浏览 & 筛选", d: "通过分类侧边栏或霓虹搜索框快速定位心仪商品" },
                        { n: "02", t: "查看详情", d: "点击商品查看完整描述、规格与实时库存" },
                        { n: "03", t: "立即购买", d: "选好数量直接跳转支付，支付完成即时收到卡密" },
                      ].map(({ n, t, d }) => (
                        <div key={n} className="flex gap-4 items-start">
                          <div
                            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-violet-300/70"
                            style={{
                              border: "1px solid rgba(167,139,250,0.2)",
                              background: "rgba(167,139,250,0.06)",
                              fontSize: "10px",
                              letterSpacing: "0.05em",
                            }}
                          >
                            {n}
                          </div>
                          <div>
                            <div className="text-white/80 tracking-wide" style={{ fontSize: "13px" }}>{t}</div>
                            <div className="mt-1 text-white/35" style={{ fontSize: "12px", lineHeight: 1.7 }}>{d}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Right visual */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                  >
                    <div
                      className="relative overflow-hidden rounded-3xl aspect-square"
                      style={{
                        border: "1px solid rgba(167,139,250,0.12)",
                        background: "rgba(167,139,250,0.04)",
                      }}
                    >
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1764258560214-71d5f28852d0?w=700&q=80"
                        alt="neon glow"
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0"
                        style={{ background: "radial-gradient(circle at 60% 40%, rgba(124,58,237,0.25), transparent 70%)" }} />
                      {/* Floating stat chips */}
                      {[
                        { label: "库存商品", value: "200+", pos: "top-6 left-6" },
                        { label: "累计订单", value: "1.2K+", pos: "top-6 right-6" },
                        { label: "好评率", value: "99.8%", pos: "bottom-6 left-6" },
                        { label: "发货速度", value: "< 1min", pos: "bottom-6 right-6" },
                      ].map(({ label, value, pos }) => (
                        <div
                          key={label}
                          className={`absolute ${pos} px-4 py-2.5 rounded-xl backdrop-blur-md`}
                          style={{
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: "rgba(0,0,0,0.45)",
                          }}
                        >
                          <div className="text-white/40 tracking-widest uppercase" style={{ fontSize: "8px" }}>{label}</div>
                          <div className="text-white/90 mt-0.5" style={{ fontSize: "15px", letterSpacing: "0.05em" }}>{value}</div>
                        </div>
                      ))}
                    </div>
                    {/* Outer glow */}
                    <div className="absolute inset-0 rounded-3xl pointer-events-none"
                      style={{ boxShadow: "0 0 60px rgba(124,58,237,0.15)" }} />
                  </motion.div>
                </div>
              </div>
            </section>

            {/* ════ FINAL CTA SECTION ════ */}
            <section className="relative py-32 flex flex-col items-center justify-center text-center overflow-hidden"
              style={{ background: "rgba(4,2,18,0.98)" }}>

              {/* Ambient glow */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full"
                  style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.12), transparent 70%)", filter: "blur(40px)" }} />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10 flex flex-col items-center"
              >
                <div className="text-violet-400/50 tracking-[0.4em] uppercase mb-5" style={{ fontSize: "9px" }}>Ready?</div>
                <h2 className="text-white/85 tracking-wide" style={{ fontFamily: "serif", fontSize: "36px", lineHeight: 1.2 }}>
                  开始你的
                  <br />
                  <span style={{
                    background: "linear-gradient(135deg, #e2d9f3 0%, #a78bfa 50%, #7c3aed 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    臻选之旅
                  </span>
                </h2>
                <p className="mt-5 text-white/30 tracking-[0.15em]" style={{ fontSize: "12px", lineHeight: 2 }}>
                  数百件严选商品等待你的探索
                </p>

                <div className="mt-10">
                  <GlassButton onClick={handleEnter} />
                </div>

                {/* Bottom line */}
                <div className="mt-16">
                  <Divider />
                </div>
                <div className="mt-6 text-white/15 tracking-[0.25em] uppercase" style={{ fontSize: "9px" }}>
                  © 2026 臻选自助空间 · All rights reserved
                </div>
              </motion.div>
            </section>

          </div>{/* end scroll container */}
        </motion.div>
      ) : (
        <motion.div
          key="exit"
          className="fixed inset-0"
          style={{ background: "rgba(2,2,10,1)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </AnimatePresence>
  );
}