export type SocialPlatform = "instagram" | "facebook" | "pinterest";

export interface Account {
  id: string;
  name: string;
  handle: string;
  platform: SocialPlatform;
  category: string;
  followers: number;
  followerChange: number;
  avgEngagementRate: number;
  postingCadence: "low" | "medium" | "high";
}

export interface GeneratedPost {
  id: string;
  topic: string;
  category: string;
  tone: string;
  caption: string;
  hashtags: string[];
  imagePrompt: string;
  recommendedPlatforms: SocialPlatform[];
  callToAction: string;
  engagementScore: number;
}

export interface ScheduledPost {
  id: string;
  contentId: string;
  accountIds: string[];
  platforms: SocialPlatform[];
  scheduledFor: string;
  status: "scheduled" | "queued" | "published";
  caption: string;
  hashtags: string[];
  assetPrompt: string;
  performance?: {
    reach: number;
    clicks: number;
    comments: number;
    saves: number;
  };
}

export interface CommentThread {
  id: string;
  platform: SocialPlatform;
  accountId: string;
  postTitle: string;
  sentiment: "positive" | "neutral" | "negative";
  priority: "high" | "medium" | "low";
  comments: Array<{
    id: string;
    author: string;
    message: string;
    timestamp: string;
    needsReply: boolean;
  }>;
}
