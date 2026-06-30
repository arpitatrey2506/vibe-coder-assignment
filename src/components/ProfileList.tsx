import type { Platform, UserProfileSummary } from "../types";
import { ProfileCard } from "./ProfileCard";
import { Sparkles } from "lucide-react";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  onProfileClick: (username: string) => void;
}

export function ProfileList({
  profiles,
  platform,
  onProfileClick,
}: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-900/20 border border-slate-900 rounded-3xl w-full">
        <div className="w-12 h-12 bg-slate-800/80 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
          <Sparkles className="w-6 h-6 text-purple-400" />
        </div>
        <h4 className="text-base font-bold text-white mb-1">No creators found</h4>
        <p className="text-sm text-slate-500 max-w-sm">
          We couldn't find any influencers matching your search. Try adjusting your search query or switching platforms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.user_id}
          profile={profile}
          platform={platform}
          onProfileClick={onProfileClick}
        />
      ))}
    </div>
  );
}
