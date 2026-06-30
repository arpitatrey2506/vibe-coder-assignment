import { useState, useRef, useEffect } from "react";
import { useInfluencerStore } from "../store/useInfluencerStore";
import { Plus, Check, ChevronDown, FolderPlus } from "lucide-react";
import type { Platform, UserProfileSummary } from "../types";

interface AddToListDropdownProps {
  profile: UserProfileSummary;
  platform: Platform;
  className?: string;
  size?: "sm" | "md";
  onOpenChange?: (isOpen: boolean) => void;
}

export function AddToListDropdown({ 
  profile, 
  platform, 
  className = "",
  size = "md",
  onOpenChange
}: AddToListDropdownProps) {
  const { lists, addProfileToList, removeProfileFromList, createList } = useInfluencerStore();
  const [isOpen, setIsOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync open state with parent card to adjust z-index stack context
  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCreateInput(false);
        setNewListName("");
        setErrorMsg("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine lists containing this influencer
  const listsContainingProfile = lists.filter((list) => 
    list.profiles.some((p) => p.user_id === profile.user_id)
  );

  const isAddedToAny = listsContainingProfile.length > 0;

  const handleToggleList = (listId: string, isChecked: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isChecked) {
      removeProfileFromList(listId, profile.user_id);
    } else {
      const res = addProfileToList(listId, profile, platform);
      if (!res.success && res.error) {
        setErrorMsg(res.error);
        setTimeout(() => setErrorMsg(""), 3000);
      }
    }
  };

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!newListName.trim()) return;
    
    // Create new list
    const newListId = createList(newListName.trim());
    // Add profile to it
    addProfileToList(newListId, profile, platform);
    
    setNewListName("");
    setShowCreateInput(false);
  };

  // Styles
  const sizeClasses = size === "sm"
    ? "px-2.5 py-1 text-xs"
    : "px-3.5 py-2 text-sm";

  const btnText = isAddedToAny 
    ? listsContainingProfile.length === 1 
      ? `In: ${listsContainingProfile[0].name}`
      : `In ${listsContainingProfile.length} Lists`
    : "Add to List";

  const activeBtnClasses = isAddedToAny
    ? "bg-purple-900/40 hover:bg-purple-900/60 border-purple-800/60 text-purple-200"
    : "bg-purple-600 hover:bg-purple-500 border-transparent text-white shadow-md shadow-purple-950/25 hover:-translate-y-0.5 active:translate-y-0";

  return (
    <div 
      className={`relative inline-block text-left ${className}`}
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()} // Prevent card navigation
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 font-semibold rounded-lg border transition-all duration-200 cursor-pointer ${sizeClasses} ${activeBtnClasses}`}
      >
        {isAddedToAny && <Check className="w-3.5 h-3.5 shrink-0" />}
        <span>{btnText}</span>
        <ChevronDown className={`w-3.5 h-3.5 opacity-80 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-60 bg-slate-900/95 backdrop-blur-xl border border-slate-800/80 text-slate-200 rounded-xl shadow-[0_20px_40px_-5px_rgba(0,0,0,0.6)] z-30 py-2.5 animate-fadeIn">
          <div className="px-3 pb-2 border-b border-slate-800 text-xs font-semibold text-slate-400">
            Add to Campaigns
          </div>
          
          <div className="max-h-48 overflow-y-auto py-1">
            {lists.map((list) => {
              const inThisList = listsContainingProfile.some((l) => l.id === list.id);
              return (
                <button
                  key={list.id}
                  onClick={(e) => handleToggleList(list.id, inThisList, e)}
                  className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-between transition-colors"
                >
                  <span className="truncate max-w-[170px]">{list.name}</span>
                  <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${
                    inThisList 
                      ? "bg-purple-600 border-purple-500 text-white" 
                      : "border-slate-700 bg-slate-950/30"
                  }`}>
                    {inThisList && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {errorMsg && (
            <div className="px-3 py-1.5 text-[10px] text-red-400 bg-red-950/20 border-y border-red-900/30">
              {errorMsg}
            </div>
          )}

          {/* Quick Create List Form */}
          <div className="mt-1 border-t border-slate-800 px-3 pt-2 text-xs">
            {!showCreateInput ? (
              <button
                onClick={() => setShowCreateInput(true)}
                className="w-full py-1 text-slate-400 hover:text-white flex items-center justify-center gap-1.5 hover:bg-slate-800/50 rounded transition-colors"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Create New List</span>
              </button>
            ) : (
              <form onSubmit={handleCreateAndAdd} className="flex gap-1">
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="List name..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-550 text-white p-1.5 rounded transition-colors cursor-pointer flex items-center justify-center"
                  title="Create and add"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
