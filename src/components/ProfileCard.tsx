import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "../types";
import { VerifiedBadge } from "./VerifiedBadge";
import { AddToListDropdown } from "./AddToListDropdown";
import { Avatar } from "./Avatar";
import { formatFollowers, formatEngagementRate } from "../utils/formatters";
import { Users, TrendingUp } from "lucide-react";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  onProfileClick?: (username: string) => void;
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

export function ProfileCard({
  profile,
  platform,
  onProfileClick,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCardClick = () => {
    if (onProfileClick) onProfileClick(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case "instagram":
        return <InstagramIcon className="w-3.5 h-3.5" />;
      case "youtube":
        return <YoutubeIcon className="w-3.5 h-3.5" />;
      case "tiktok":
        return <TiktokIcon className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };



  const getPlatformRingColor = () => {
    switch (platform) {
      case "instagram":
        return "ring-pink-500/20 group-hover:ring-pink-500 group-hover:shadow-[0_0_15px_rgba(236,72,153,0.4)]";
      case "youtube":
        return "ring-red-500/20 group-hover:ring-red-500 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]";
      case "tiktok":
        return "ring-cyan-500/20 group-hover:ring-cyan-450 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]";
      default:
        return "ring-purple-500/20 group-hover:ring-purple-500";
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-slate-900/35 hover:bg-slate-900/75 backdrop-blur-xs border border-slate-850 hover:border-slate-700/80 rounded-2xl p-5 cursor-pointer transition-all duration-205 hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.5)] hover:-translate-y-1 flex flex-col justify-between h-full ${
        isDropdownOpen ? "z-20 shadow-2xl" : "z-0"
      }`}
    >
      <div>
        {/* Profile Avatar & Details */}
        <div className="flex flex-col items-center text-center mt-2 mb-4">
          <div className="relative mb-3.5">
            <Avatar 
              src={profile.picture} 
              username={profile.username || profile.handle || ""}
              className={`w-20 h-20 ring-2 transition-all duration-300 ${getPlatformRingColor()}`} 
            />
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center shadow-lg ${
              platform === "instagram" ? "text-pink-400" : platform === "youtube" ? "text-red-400" : "text-cyan-400"
            }`}>
              {getPlatformIcon()}
            </div>
          </div>
          
          <h3 className="text-base font-bold text-white flex items-center justify-center gap-1 mb-0.5 max-w-full">
            <span className="truncate">@{profile.username || profile.handle}</span>
            <VerifiedBadge verified={profile.is_verified} />
          </h3>
          <p className="text-xs text-slate-450 truncate max-w-full font-medium">
            {profile.fullname}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 border-y border-slate-850/80 py-3.5 mb-5">
          <div className="flex flex-col pl-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-550" />
              <span>Followers</span>
            </span>
            <span className="text-sm font-black text-white mt-1">
              {formatFollowers(profile.followers)}
            </span>
          </div>

          <div className="flex flex-col border-l border-slate-850/80 pl-6">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-slate-550" />
              <span>Eng. Rate</span>
            </span>
            <span className="text-sm font-black text-white mt-1">
              {profile.engagement_rate !== undefined 
                ? formatEngagementRate(profile.engagement_rate) 
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Add To List Button/Dropdown */}
      <div className="w-full pt-1">
        <AddToListDropdown 
          profile={profile} 
          platform={platform} 
          className="w-full"
          size="sm"
          onOpenChange={setIsDropdownOpen}
        />
      </div>
    </div>
  );
}
