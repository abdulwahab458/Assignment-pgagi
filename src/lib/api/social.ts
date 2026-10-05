import type { ContentItem } from "@/types/content";
import { getMockSocial } from "@/lib/mock-data";

/** Mock social feed — replace with Twitter/X or Instagram API when credentials are available. */
export async function fetchSocialPosts(hashtag: string): Promise<ContentItem[]> {
  await new Promise((r) => setTimeout(r, 100));
  return getMockSocial(hashtag.replace(/^#/, ""));
}
