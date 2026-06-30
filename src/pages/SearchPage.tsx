import { useState } from "react";
import { useInfluencerStore } from "../store/useInfluencerStore";
import { Layout } from "../components/Layout";
import { PlatformFilter } from "../components/PlatformFilter";
import { SearchBar } from "../components/SearchBar";
import { ProfileList } from "../components/ProfileList";
import { extractProfiles, filterProfiles } from "../utils/dataHelpers";
import { Sparkles, Layers, ListTodo } from "lucide-react";

export function SearchPage() {
  const { 
    selectedPlatform, 
    setPlatform, 
    searchQuery, 
    setSearchQuery,
    lists
  } = useInfluencerStore();

  const [clickCount, setClickCount] = useState(0);

  const allProfiles = extractProfiles(selectedPlatform);
  const filtered = filterProfiles(allProfiles, searchQuery);

  const handleProfileClick = (username: string) => {
    setClickCount((prev) => {
      const next = prev + 1;
      console.log("Clicked profile:", username, "total clicks:", next);
      return next;
    });
  };

  // Calculate real-time stats from the store
  const totalCampaigns = lists.length;
  const totalShortlisted = lists.reduce((acc, list) => acc + list.profiles.length, 0);

  return (
    <Layout>
      {/* Hero Banner Section */}
      <div className="text-center md:text-left py-12 md:py-16 border-b border-slate-900/60 mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-900/40 text-purple-400 text-xs font-semibold mb-4 hover:border-purple-800 transition-all select-none">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>AI-Powered Sourcing Engine</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-transparent leading-[1.15]">
            Find the Perfect Creator <br className="hidden md:inline" />
            for Your Next Campaign
          </h1>
          <p className="text-base text-slate-400 max-w-lg leading-relaxed">
            Search, filter, and shortlist top-performing creators across Instagram, YouTube, and TikTok to drive engagement.
          </p>
        </div>

        {/* Real-time Analytics Grid */}
        <div className="grid grid-cols-3 gap-3 w-full lg:max-w-md shrink-0 text-left">
          <div className="p-4 bg-slate-900/25 border border-slate-900 rounded-2xl hover:border-slate-800/80 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-black/10">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Creators</span>
            </div>
            <span className="text-xl font-black text-white block">30 Total</span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Across platforms</span>
          </div>

          <div className="p-4 bg-slate-900/25 border border-slate-900 rounded-2xl hover:border-slate-800/80 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-black/10">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Layers className="w-3 h-3 text-purple-400" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Campaigns</span>
            </div>
            <span className="text-xl font-black text-white block">{totalCampaigns}</span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Active lists</span>
          </div>

          <div className="p-4 bg-slate-900/25 border border-slate-900 rounded-2xl hover:border-slate-800/80 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-black/10">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <ListTodo className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Shortlisted</span>
            </div>
            <span className="text-xl font-black text-white block">{totalShortlisted}</span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Total selections</span>
          </div>
        </div>
      </div>

      {/* Discovery Dashboard Controls */}
      <div className="bg-slate-900/20 backdrop-blur-md border border-slate-900 rounded-3xl p-6 mb-8 flex flex-col gap-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <PlatformFilter
            selected={selectedPlatform}
            onChange={(p) => {
              setPlatform(p);
              setSearchQuery("");
            }}
          />

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`Search ${selectedPlatform} creators...`}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-900/80 pt-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              Showing <strong>{filtered.length}</strong> of <strong>{allProfiles.length}</strong> accounts
            </span>
          </div>
          <div className="flex items-center gap-4">
            {clickCount > 0 && (
              <span className="hidden sm:inline">Session Clicks: <strong className="text-slate-350">{clickCount}</strong></span>
            )}
            <span className="flex items-center gap-1">
              Platform: <strong className="capitalize text-slate-350">{selectedPlatform}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Profiles Grid */}
      <ProfileList
        profiles={filtered}
        platform={selectedPlatform}
        onProfileClick={handleProfileClick}
      />
    </Layout>
  );
}
