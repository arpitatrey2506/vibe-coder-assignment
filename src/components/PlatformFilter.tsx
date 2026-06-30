import type { Platform } from "../types";
import { PLATFORMS, getPlatformLabel } from "../utils/dataHelpers";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
}

const InstagramIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

const TiktokIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export function PlatformFilter({ selected, onChange }: PlatformFilterProps) {
  
  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case "instagram":
        return <InstagramIcon className="w-4 h-4" />;
      case "youtube":
        return <YoutubeIcon className="w-4 h-4" />;
      case "tiktok":
        return <TiktokIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPlatformStyles = (platform: Platform, isActive: boolean) => {
    if (!isActive) {
      return "bg-slate-900/50 backdrop-blur-sm border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-800/80 hover:-translate-y-0.5";
    }
    
    switch (platform) {
      case "instagram":
        return "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white border-transparent shadow-lg shadow-pink-500/25 hover:-translate-y-0.5";
      case "youtube":
        return "bg-red-600 text-white border-transparent hover:bg-red-700 shadow-lg shadow-red-600/25 hover:-translate-y-0.5";
      case "tiktok":
        return "bg-slate-950 text-white border-transparent ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/25 hover:-translate-y-0.5";
      default:
        return "bg-purple-600 text-white border-transparent hover:-translate-y-0.5";
    }
  };

  return (
    <div className="flex gap-2.5 justify-center md:justify-start">
      {PLATFORMS.map((p) => {
        const isActive = selected === p;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-all duration-300 cursor-pointer active:scale-95 ${getPlatformStyles(p, isActive)}`}
          >
            {getPlatformIcon(p)}
            <span>{getPlatformLabel(p)}</span>
          </button>
        );
      })}
    </div>
  );
}
