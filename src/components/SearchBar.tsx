import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search influencers..." }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xl">
      {/* Search Icon */}
      <span className="absolute left-4 top-3.5 text-slate-550 flex items-center justify-center pointer-events-none">
        <Search className="w-5 h-5" />
      </span>

      {/* Input Field */}
      <input
        type="text"
        className="w-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-750 focus:border-purple-500 focus:bg-slate-950 text-slate-100 rounded-2xl pl-12 pr-10 py-3 text-base placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all duration-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />

      {/* Clear Button */}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-4 top-3.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-850 p-0.5 transition-colors cursor-pointer"
          title="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
