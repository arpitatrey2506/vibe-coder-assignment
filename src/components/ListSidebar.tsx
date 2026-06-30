import { useState } from "react";
import { useInfluencerStore } from "../store/useInfluencerStore";
import { 
  X, Plus, Trash2, Download, Copy, Check, Users, Search, 
  ExternalLink, Sparkles, AlertCircle 
} from "lucide-react";
import { getPlatformLabel } from "../utils/dataHelpers";
import { formatFollowers } from "../utils/formatters";
import { Avatar } from "./Avatar";

interface ListSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ListSidebar({ isOpen, onClose }: ListSidebarProps) {
  const { 
    lists, 
    activeListId, 
    createList, 
    deleteList, 
    removeProfileFromList, 
    setActiveListId 
  } = useInfluencerStore();

  const [newListName, setNewListName] = useState("");
  const [newListDesc, setNewListDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [listSearchQuery, setListSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const activeList = lists.find((l) => l.id === activeListId) || null;

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const newId = createList(newListName, newListDesc);
    setNewListName("");
    setNewListDesc("");
    setIsCreating(false);
    setActiveListId(newId);
  };

  const handleDeleteList = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the list "${name}"?`)) {
      deleteList(id);
    }
  };

  // Filter profiles within the active list
  const filteredProfiles = activeList
    ? activeList.profiles.filter((p) => {
        const username = p.username || p.handle || "";
        const fullname = p.fullname || "";
        return (
          username.toLowerCase().includes(listSearchQuery.toLowerCase()) ||
          fullname.toLowerCase().includes(listSearchQuery.toLowerCase())
        );
      })
    : [];

  // Export to CSV
  const handleExportCSV = () => {
    if (!activeList || activeList.profiles.length === 0) return;
    
    const headers = ["Username", "Full Name", "Platform", "Followers", "Engagement Rate (%)", "URL"];
    const rows = activeList.profiles.map((p) => [
      p.username || p.handle || "",
      p.fullname || "",
      getPlatformLabel(p.platform),
      p.followers,
      p.engagement_rate ? (p.engagement_rate * 100).toFixed(2) : "N/A",
      p.url
    ]);

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map((r) => r.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeList.name.toLowerCase().replace(/\s+/g, "_")}_influencers.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportDropdownOpen(false);
  };

  // Export to JSON
  const handleExportJSON = () => {
    if (!activeList || activeList.profiles.length === 0) return;
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeList, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `${activeList.name.toLowerCase().replace(/\s+/g, "_")}_influencers.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportDropdownOpen(false);
  };

  // Copy outreach details (usernames)
  const handleCopyHandles = () => {
    if (!activeList || activeList.profiles.length === 0) return;
    
    const handles = activeList.profiles
      .map((p) => `@${p.username || p.handle} (${getPlatformLabel(p.platform)})`)
      .join("\n");
    
    navigator.clipboard.writeText(handles).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
    setExportDropdownOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 right-0 h-screen w-full sm:w-[450px] bg-slate-900/90 backdrop-blur-xl text-slate-100 border-l border-slate-800/80 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white mb-0">My Influencer Lists</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Selector / Actions */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <select
              value={activeListId || ""}
              onChange={(e) => {
                setActiveListId(e.target.value || null);
                setIsCreating(false);
              }}
              className="flex-1 bg-slate-850 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            >
              {lists.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.profiles.length})
                </option>
              ))}
              {lists.length === 0 && <option value="">No lists available</option>}
            </select>

            <button
              onClick={() => setIsCreating(!isCreating)}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-purple-950/25 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New</span>
            </button>
          </div>

          {/* Create List Form */}
          {isCreating && (
            <form onSubmit={handleCreateList} className="p-3 bg-slate-850 border border-slate-700 rounded-lg flex flex-col gap-2.5 animate-fadeIn">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">List Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Campaign 2026"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Description (Optional)</label>
                <textarea
                  placeholder="What is this list for?"
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-2.5 py-1.5 border border-slate-700 hover:bg-slate-800 rounded font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded cursor-pointer transition-colors"
                >
                  Create List
                </button>
              </div>
            </form>
          )}

          {/* Active List Info and Exports */}
          {activeList && !isCreating && (
            <div className="flex items-start justify-between gap-4 pt-1">
              <div>
                {activeList.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {activeList.description}
                  </p>
                )}
                <span className="text-[10px] text-slate-500 block mt-1">
                  Created on {new Date(activeList.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex gap-1.5 shrink-0">
                {activeList.profiles.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                      title="Export Options"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {exportDropdownOpen && (
                      <div className="absolute right-0 mt-1.5 w-44 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50 text-xs">
                        <button
                          onClick={handleExportCSV}
                          className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export to CSV</span>
                        </button>
                        <button
                          onClick={handleExportJSON}
                          className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export to JSON</span>
                        </button>
                        <button
                          onClick={handleCopyHandles}
                          className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2 border-t border-slate-700"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Handles</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Don't allow deleting the default list if it's the only one */}
                {(lists.length > 1 || activeList.id !== "default-list") && (
                  <button
                    onClick={() => handleDeleteList(activeList.id, activeList.name)}
                    className="p-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-900/30 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                    title="Delete List"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {activeList && activeList.profiles.length > 0 && (
            <div className="relative mb-1">
              <span className="absolute left-2.5 top-2.5 text-slate-500">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                placeholder="Search within this list..."
                value={listSearchQuery}
                onChange={(e) => setListSearchQuery(e.target.value)}
                className="w-full bg-slate-850 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 focus:bg-slate-800 transition-colors"
              />
              {listSearchQuery && (
                <button
                  onClick={() => setListSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {copied && (
            <div className="p-2 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-lg flex items-center gap-2 animate-fadeIn">
              <Check className="w-3.5 h-3.5" />
              <span>Handles copied to clipboard!</span>
            </div>
          )}

          {activeList ? (
            filteredProfiles.length > 0 ? (
              <div className="flex flex-col gap-2">
                {filteredProfiles.map((profile) => (
                  <div 
                    key={profile.user_id}
                    className="p-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between gap-3 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar 
                        src={profile.picture} 
                        username={profile.username || profile.handle || ""}
                        className="w-9 h-9 border border-slate-700 shrink-0" 
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-white truncate block">
                            @{profile.username || profile.handle}
                          </span>
                          {profile.is_verified && (
                            <span className="text-[10px] text-blue-400 bg-blue-950 px-1 py-0.2 rounded font-semibold shrink-0">✓</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span className="capitalize">{profile.platform}</span>
                          <span>•</span>
                          <span>{formatFollowers(profile.followers)} followers</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={profile.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="View Profile"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => removeProfileFromList(activeList.id, profile.user_id)}
                        className="p-1 text-slate-400 hover:text-red-400 rounded hover:bg-red-950/30 transition-colors"
                        title="Remove from list"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <AlertCircle className="w-8 h-8 mb-2.5 text-slate-600" />
                {listSearchQuery ? (
                  <p className="text-xs">No matching influencers found in this list.</p>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-slate-400">This list is empty</p>
                    <p className="text-[11px] mt-1 max-w-[240px]">
                      Search for influencers and click <strong className="text-purple-400">"Add to List"</strong> to build your roster.
                    </p>
                  </>
                )}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-slate-500 text-center">
              <Sparkles className="w-8 h-8 mb-2 text-slate-600" />
              <p className="text-xs">Please select or create a list to get started.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
