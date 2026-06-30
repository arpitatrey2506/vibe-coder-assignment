import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { VerifiedBadge } from "../components/VerifiedBadge";
import { Avatar } from "../components/Avatar";
import type { FullUserProfile, ProfileDetailResponse, Platform } from "../types";
import { formatEngagementRate } from "../utils/formatters";
import { loadProfileByUsername } from "../utils/profileLoader";
import { useInfluencerStore } from "../store/useInfluencerStore";
import { findProfileSummaryByUsername } from "../utils/dataHelpers";
import { 
  ArrowLeft, ExternalLink, Calendar, Hash, Layers, CheckSquare, 
  Square, PlusCircle, Award
} from "lucide-react";

function formatFollowersDetail(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(2) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return String(count);
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platformQuery = (searchParams.get("platform") || "instagram") as Platform;
  
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [showCreateInput, setShowCreateInput] = useState(false);

  const { lists, addProfileToList, removeProfileFromList, createList } = useInfluencerStore();

  useEffect(() => {
    if (!username) return;

    let active = true;
    loadProfileByUsername(username).then((data) => {
      if (!active) return;
      
      if (data) {
        setProfileData(data);
        setLoaded(true);
      } else {
        // Fallback to search list summary if detailed profile is missing
        const summaryInfo = findProfileSummaryByUsername(username);
        if (summaryInfo) {
          setProfileData({
            cached: false,
            data: {
              success: true,
              user_profile: {
                ...summaryInfo.profile,
                type: summaryInfo.platform
              }
            }
          });
        } else {
          setProfileData(null);
        }
        setLoaded(true);
      }
    });

    return () => {
      active = false;
      setLoaded(false);
    };
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">Invalid profile request.</p>
          <Link to="/" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </Link>
        </div>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-purple-950"></div>
            <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm font-semibold text-slate-400">Loading profile details...</p>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">Could not load profile details for @{username}.</p>
          <Link to="/" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to search</span>
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const platform = (user.type || platformQuery) as Platform;

  // Determine lists containing this creator
  const listsContainingUser = lists.filter((list) =>
    list.profiles.some((p) => p.user_id === user.user_id)
  );

  const handleToggleList = (listId: string, isChecked: boolean) => {
    if (isChecked) {
      removeProfileFromList(listId, user.user_id);
    } else {
      addProfileToList(listId, user, platform);
    }
  };

  const handleCreateAndAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const newListId = createList(newListName.trim());
    addProfileToList(newListId, user, platform);
    setNewListName("");
    setShowCreateInput(false);
  };

  // Platform banner gradient
  const getBannerGradient = () => {
    switch (platform) {
      case "instagram":
        return "from-pink-600 via-purple-600 to-orange-500";
      case "youtube":
        return "from-red-700 to-red-500";
      case "tiktok":
        return "from-slate-900 via-slate-850 to-slate-950 border-b border-slate-800";
      default:
        return "from-purple-700 to-indigo-600";
    }
  };

  return (
    <Layout>
      {/* Back Button */}
      <div className="mb-6 self-start">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold transition-colors bg-slate-900/40 border border-slate-900 hover:border-slate-850 px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discovery</span>
        </Link>
      </div>

      {/* Profile Header Banner Block */}
      <div className="relative rounded-3xl overflow-hidden mb-8 border border-slate-900 shadow-xl bg-slate-900/10">
        <div className={`h-36 sm:h-48 bg-gradient-to-r ${getBannerGradient()} w-full`} />
        
        <div className="px-6 pb-6 pt-0 flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-10 sm:-mt-16 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end text-center sm:text-left gap-4">
            <Avatar
              src={user.picture}
              username={user.username || user.handle || ""}
              className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-slate-950 bg-slate-900 shadow-2xl relative z-10"
            />
            <div className="mb-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center sm:justify-start gap-1.5">
                @{user.username || user.handle}
                <VerifiedBadge verified={user.is_verified} className="w-5 h-5" />
              </h2>
              <p className="text-sm font-semibold text-slate-450">{user.fullname}</p>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-slate-950 border border-slate-850 text-slate-400 capitalize">
                  Platform: {platform}
                </span>
                {user.is_business && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-indigo-950/60 border border-indigo-900/30 text-indigo-400">
                    Business Account
                  </span>
                )}
                {user.age_group && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-slate-950 border border-slate-850 text-slate-400">
                    Age Group: {user.age_group}
                  </span>
                )}
                {user.gender && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-slate-950 border border-slate-850 text-slate-400 uppercase">
                    {user.gender}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0 flex justify-center w-full md:w-auto">
            {user.url && (
              <a
                href={user.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4.5 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-750 text-slate-100 hover:text-white text-sm font-semibold rounded-xl transition-all shadow-md"
              >
                <span>View on {platform}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Bio Section */}
        {user.description && (
          <div className="px-6 py-4 border-t border-slate-900 bg-slate-900/20 text-left">
            <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Biography</h4>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">{user.description}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Stats and Info */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Key Metrics Grid */}
          <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6 text-left">
            <div className="flex items-center gap-1.5 mb-6">
              <Layers className="w-4.5 h-4.5 text-purple-400" />
              <h3 className="text-base font-bold text-white mb-0">Engagement & Performance</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900/50 border border-slate-850 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Followers</span>
                <span className="text-lg font-extrabold text-white block">
                  {formatFollowersDetail(user.followers)}
                </span>
                <span className="text-[10px] text-slate-450 block mt-0.5">Total Audience</span>
              </div>

              <div className="p-4 bg-slate-900/50 border border-slate-850 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Engagement Rate</span>
                <span className="text-lg font-extrabold text-white block">
                  {formatEngagementRate(user.engagement_rate)}
                </span>
                <span className="text-[10px] text-slate-450 block mt-0.5">Audience Interaction</span>
              </div>

              {user.engagements !== undefined && (
                <div className="p-4 bg-slate-900/50 border border-slate-850 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Engagements</span>
                  <span className="text-lg font-extrabold text-white block">
                    {formatFollowersDetail(user.engagements)}
                  </span>
                  <span className="text-[10px] text-slate-450 block mt-0.5">Avg per Post</span>
                </div>
              )}

              {user.avg_likes !== undefined && (
                <div className="p-4 bg-slate-900/50 border border-slate-850 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Avg Likes</span>
                  <span className="text-lg font-extrabold text-white block">
                    {formatFollowersDetail(user.avg_likes)}
                  </span>
                  <span className="text-[10px] text-slate-450 block mt-0.5">Likes per Post</span>
                </div>
              )}

              {user.avg_comments !== undefined && (
                <div className="p-4 bg-slate-900/50 border border-slate-850 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Avg Comments</span>
                  <span className="text-lg font-extrabold text-white block">
                    {formatFollowersDetail(user.avg_comments)}
                  </span>
                  <span className="text-[10px] text-slate-450 block mt-0.5">Comments per Post</span>
                </div>
              )}

              {user.avg_views !== undefined && user.avg_views > 0 && (
                <div className="p-4 bg-slate-900/50 border border-slate-850 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Avg Views</span>
                  <span className="text-lg font-extrabold text-white block">
                    {formatFollowersDetail(user.avg_views)}
                  </span>
                  <span className="text-[10px] text-slate-450 block mt-0.5">Views per Video</span>
                </div>
              )}

              {user.avg_reels_plays !== undefined && user.avg_reels_plays > 0 && (
                <div className="p-4 bg-slate-900/50 border border-slate-850 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Reels Plays</span>
                  <span className="text-lg font-extrabold text-white block">
                    {formatFollowersDetail(user.avg_reels_plays)}
                  </span>
                  <span className="text-[10px] text-slate-450 block mt-0.5">Plays per Reel</span>
                </div>
              )}

              {user.posts_count !== undefined && (
                <div className="p-4 bg-slate-900/50 border border-slate-850 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Total Posts</span>
                  <span className="text-lg font-extrabold text-white block">
                    {user.posts_count}
                  </span>
                  <span className="text-[10px] text-slate-450 block mt-0.5">Content Catalog</span>
                </div>
              )}
            </div>
          </div>

          {/* Followers Growth History (stat_history) */}
          {user.stat_history && user.stat_history.length > 0 && (
            <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6 text-left">
              <div className="flex items-center gap-1.5 mb-5">
                <Calendar className="w-4.5 h-4.5 text-purple-400" />
                <h3 className="text-base font-bold text-white mb-0">Follower Growth History</h3>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-850">
                <table className="w-full text-sm text-left text-slate-400">
                  <thead className="text-[10px] font-bold text-slate-400 uppercase bg-slate-900/60 border-b border-slate-850">
                    <tr>
                      <th scope="col" className="px-5 py-3.5">Month</th>
                      <th scope="col" className="px-5 py-3.5">Followers</th>
                      <th scope="col" className="px-5 py-3.5">Following</th>
                      <th scope="col" className="px-5 py-3.5">Avg Likes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/50">
                    {user.stat_history.map((row, index) => (
                      <tr key={index} className="bg-slate-900/10 hover:bg-slate-900/30 transition-colors">
                        <td className="px-5 py-3 text-xs font-semibold text-slate-300">
                          {row.month}
                        </td>
                        <td className="px-5 py-3 font-semibold text-white">
                          {formatFollowersDetail(row.followers)}
                        </td>
                        <td className="px-5 py-3 text-slate-400">
                          {row.following || "N/A"}
                        </td>
                        <td className="px-5 py-3 font-medium text-slate-300">
                          {row.avg_likes ? formatFollowersDetail(row.avg_likes) : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: List Management & Tags */}
        <div className="flex flex-col gap-8">
          
          {/* Campaign List Management Section */}
          <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6 text-left">
            <div className="flex items-center gap-1.5 mb-4">
              <Award className="w-4.5 h-4.5 text-purple-400" />
              <h3 className="text-base font-bold text-white mb-0">Campaign Shortlists</h3>
            </div>
            
            <p className="text-xs text-slate-450 leading-relaxed mb-4">
              Manage campaign rosters for this influencer. Add them to current shortlists or create a new campaign checklist.
            </p>

            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto mb-4">
              {lists.map((list) => {
                const isMember = listsContainingUser.some((l) => l.id === list.id);
                return (
                  <button
                    key={list.id}
                    onClick={() => handleToggleList(list.id, isMember)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border transition-all text-xs font-medium text-left cursor-pointer group"
                    style={{
                      backgroundColor: isMember ? "rgba(168, 85, 247, 0.05)" : "transparent",
                      borderColor: isMember ? "rgba(168, 85, 247, 0.3)" : "rgba(30, 41, 59, 0.8)",
                    }}
                  >
                    <div className="flex flex-col truncate pr-2">
                      <span className={`font-bold truncate ${isMember ? "text-purple-350 font-extrabold" : "text-slate-300"}`}>
                        {list.name}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5">
                        {list.profiles.length} creators shortlisted
                      </span>
                    </div>

                    <div className="shrink-0">
                      {isMember ? (
                        <CheckSquare className="w-5 h-5 text-purple-500" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-700 group-hover:text-slate-500 transition-colors" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick List Creation */}
            <div className="border-t border-slate-900 pt-3">
              {!showCreateInput ? (
                <button
                  onClick={() => setShowCreateInput(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-850 rounded-xl border border-dashed border-slate-800 hover:border-slate-750 transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-purple-400" />
                  <span>Create Campaign List</span>
                </button>
              ) : (
                <form onSubmit={handleCreateAndAdd} className="flex gap-1.5 mt-1 animate-fadeIn">
                  <input
                    type="text"
                    required
                    placeholder="List name (e.g. Q4 Brand Launch)"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    className="bg-purple-650 hover:bg-purple-750 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    Create & Add
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Hashtag insights */}
          {user.top_hashtags && user.top_hashtags.length > 0 && (
            <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6 text-left">
              <div className="flex items-center gap-1.5 mb-4">
                <Hash className="w-4.5 h-4.5 text-purple-400" />
                <h3 className="text-base font-bold text-white mb-0">Top Hashtags</h3>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {user.top_hashtags.slice(0, 15).map((item, index) => (
                  <div
                    key={index}
                    className="px-3 py-1.5 rounded-xl bg-slate-900/50 border border-slate-850 hover:border-purple-900/40 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
                  >
                    <span className="text-purple-400">#</span>
                    <span>{item.tag}</span>
                    {item.weight !== undefined && (
                      <span className="text-[10px] text-slate-500 font-bold bg-slate-950/60 px-1 py-0.2 rounded">
                        {(item.weight * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </Layout>
  );
}
