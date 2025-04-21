export interface PostData {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  author?: string;
  image?: string;
  // Deprecate audioUrl in favor of specific platform links
  // audioUrl?: string; 
  tags?: string[];
  readingTime?: string;
  // Podcast-related fields
  isPodcast?: boolean;
  podcastEpisodeNumber?: number;
  podcastDuration?: string;
  podcastHost?: string;
  podcastGuest?: string;
  // NEW: Direct links for podcast platforms
  podcastSpotifyUrl?: string; 
  podcastAppleUrl?: string;
  podcastGoogleUrl?: string; // Keep for potential future use
  podcastRssUrl?: string; // Keep for potential future use
  // Deprecated structure - remove later if not needed
  // podcastPlatforms?: {
  //   spotify?: string;
  //   apple?: string;
  //   google?: string;
  //   rss?: string;
  // };
}
