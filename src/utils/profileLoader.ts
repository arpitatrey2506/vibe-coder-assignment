import type { ProfileDetailResponse } from "../types";
import { getProfilePicture } from "./avatarOverrides";

const profileModules = import.meta.glob<ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

export async function loadProfileByUsername(
  username: string
): Promise<ProfileDetailResponse | null> {
  const path = `../assets/data/profiles/${username}.json`;
  const loader = profileModules[path];

  if (!loader) {
    return null;
  }

  const result = await loader();
  const data =
    (result as { default?: ProfileDetailResponse }).default ?? result;

  if (data && data.data && data.data.user_profile) {
    const user = data.data.user_profile;
    user.picture = getProfilePicture(user.username, user.picture, user.type, user.handle);
  }

  return data as ProfileDetailResponse;
}
