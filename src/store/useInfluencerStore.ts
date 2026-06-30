import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, UserProfileSummary } from "../types";

export interface InfluencerListItem extends UserProfileSummary {
  platform: Platform;
}

export interface InfluencerList {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  profiles: InfluencerListItem[];
}

interface InfluencerStore {
  selectedPlatform: Platform;
  searchQuery: string;
  lists: InfluencerList[];
  activeListId: string | null;
  isSidebarOpen: boolean;
  
  // Actions
  setPlatform: (platform: Platform) => void;
  setSearchQuery: (query: string) => void;
  createList: (name: string, description?: string) => string;
  deleteList: (id: string) => void;
  addProfileToList: (listId: string, profile: UserProfileSummary, platform: Platform) => { success: boolean; error?: string };
  removeProfileFromList: (listId: string, userId: string) => void;
  setActiveListId: (id: string | null) => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

const DEFAULT_LIST_ID = "default-list";

export const useInfluencerStore = create<InfluencerStore>()(
  persist(
    (set, get) => ({
      selectedPlatform: "instagram",
      searchQuery: "",
      lists: [
        {
          id: DEFAULT_LIST_ID,
          name: "My Shortlist",
          description: "Influencers for the upcoming campaign",
          createdAt: new Date().toISOString(),
          profiles: [],
        },
      ],
      activeListId: DEFAULT_LIST_ID,
      isSidebarOpen: false,

      setPlatform: (platform) => set({ selectedPlatform: platform }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      createList: (name, description) => {
        const id = `list-${Date.now()}`;
        const newList: InfluencerList = {
          id,
          name: name.trim(),
          description: description?.trim() || "",
          createdAt: new Date().toISOString(),
          profiles: [],
        };
        
        set((state) => ({
          lists: [...state.lists, newList],
          activeListId: id,
          isSidebarOpen: true, // open sidebar to show the new list
        }));
        
        return id;
      },
      
      deleteList: (id) => {
        set((state) => {
          const updatedLists = state.lists.filter((l) => l.id !== id);
          let newActiveId = state.activeListId;
          
          // Fallback if we delete the active list
          if (state.activeListId === id) {
            newActiveId = updatedLists.length > 0 ? updatedLists[0].id : null;
          }
          
          return {
            lists: updatedLists,
            activeListId: newActiveId,
          };
        });
      },
      
      addProfileToList: (listId, profile, platform) => {
        const { lists } = get();
        const listIndex = lists.findIndex((l) => l.id === listId);
        
        if (listIndex === -1) {
          return { success: false, error: "List not found" };
        }
        
        const list = lists[listIndex];
        const exists = list.profiles.some((p) => p.user_id === profile.user_id);
        
        if (exists) {
          return { success: false, error: "Profile already in this list" };
        }
        
        const updatedLists = [...lists];
        updatedLists[listIndex] = {
          ...list,
          profiles: [...list.profiles, { ...profile, platform }],
        };
        
        set({ lists: updatedLists });
        return { success: true };
      },
      
      removeProfileFromList: (listId, userId) => {
        const { lists } = get();
        const listIndex = lists.findIndex((l) => l.id === listId);
        
        if (listIndex === -1) return;
        
        const list = lists[listIndex];
        const updatedProfiles = list.profiles.filter((p) => p.user_id !== userId);
        
        const updatedLists = [...lists];
        updatedLists[listIndex] = {
          ...list,
          profiles: updatedProfiles,
        };
        
        set({ lists: updatedLists });
      },
      
      setActiveListId: (id) => set({ activeListId: id }),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
    }),
    {
      name: "influencer-search-storage",
      partialize: (state) => ({
        lists: state.lists,
        activeListId: state.activeListId,
        selectedPlatform: state.selectedPlatform,
      }),
    }
  )
);
