import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function NeonSearch({ value, onChange }: Props) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-r from-fuchsia-500/60 via-purple-500/40 to-blue-500/60 blur-2xl opacity-80" />
      <div className="absolute -inset-3 rounded-[32px] bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 blur-lg opacity-70" />
      <div className="relative flex items-center h-16 px-6 rounded-2xl bg-neutral-950 border border-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search...."
          className="flex-1 bg-transparent outline-none text-white text-lg tracking-wide placeholder:text-white/40"
        />
        <button className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-blue-700 border border-white/10 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Search className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
