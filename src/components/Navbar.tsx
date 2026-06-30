import { Link } from "react-router-dom";
import { Sparkles, Users } from "lucide-react";
import { useInfluencerStore } from "../store/useInfluencerStore";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const { lists } = useInfluencerStore();

  const totalSavedCount = lists.reduce((acc, l) => acc + l.profiles.length, 0);

  return (
    <header className="sticky top-0 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-900 z-30 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 group transition-transform duration-200 active:scale-98"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-950/20 group-hover:rotate-6 transition-transform">
            <Sparkles className="w-5.5 h-5.5 text-white animate-pulse" />
          </div>
          <div className="text-left">
            <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-400 bg-clip-text text-transparent">
              Wobb Discovery
            </span>
            <span className="block text-[10px] font-semibold text-purple-450 tracking-wider uppercase -mt-0.5">
              Influencer Hub
            </span>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-150 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:text-white cursor-pointer hover:shadow-lg hover:shadow-slate-950/50 relative"
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>My Lists</span>
            {totalSavedCount > 0 && (
              <span className="flex items-center justify-center bg-purple-600 text-white font-bold text-[10px] min-w-5 h-5 px-1.5 rounded-full shadow-inner">
                {totalSavedCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
