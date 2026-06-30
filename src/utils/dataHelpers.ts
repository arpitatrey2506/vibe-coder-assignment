import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { Platform, SearchData, UserProfileSummary } from "@/types";
import { getProfilePicture } from "./avatarOverrides";

const platformData: Record<Platform, SearchData> = {
  instagram: instagramData as SearchData,
  youtube: youtubeData as SearchData,
  tiktok: tiktokData as SearchData,
};

export function getSearchData(platform: Platform): SearchData {
  return platformData[platform];
}

export function extractProfiles(platform: Platform): UserProfileSummary[] {
  const data = getSearchData(platform);
  return data.accounts.map((item) => {
    const profile = item.account.user_profile;
    return {
      ...profile,
      picture: getProfilePicture(profile.username, profile.picture, platform, profile.handle),
    };
  });
}

export function filterProfiles(
  profiles: UserProfileSummary[],
  query: string
): UserProfileSummary[] {
  if (!query) return profiles;
  const lowerQuery = query.toLowerCase();
  return profiles.filter((p) => {
    const username = p.username || "";
    const fullname = p.fullname || "";
    const handle = p.handle || "";
    
    const matchUsername = username.toLowerCase().includes(lowerQuery);
    const matchFullname = fullname.toLowerCase().includes(lowerQuery);
    const matchHandle = handle.toLowerCase().includes(lowerQuery);
    
    return matchUsername || matchFullname || matchHandle;
  });
}

export const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

export function getPlatformLabel(platform: Platform): string {
  if (platform === "instagram") return "Instagram";
  if (platform === "youtube") return "YouTube";
  return "TikTok";
}

export function findProfileSummaryByUsername(
  username: string
): { profile: UserProfileSummary; platform: Platform } | null {
  for (const platform of PLATFORMS) {
    const profiles = extractProfiles(platform);
    const found = profiles.find((p) => p.username.toLowerCase() === username.toLowerCase());
    if (found) {
      return { profile: found, platform };
    }
  }
  return null;
}
