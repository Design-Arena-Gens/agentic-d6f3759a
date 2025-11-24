import { Account, CommentThread, GeneratedPost, ScheduledPost, SocialPlatform } from "./types";

const CTA_LIBRARY = [
  "Tap the link in bio to explore",
  "Save this for your next inspiration boost",
  "Share with a friend who needs to see this",
  "Drop your thoughts in the comments",
  "Follow for more actionable insights",
  "Double-tap if you agree",
];

const TONE_LIBRARY = {
  inspirational: ["Bold", "Energetic", "Visionary", "Motivational", "Empowering"],
  educational: ["Actionable", "Research-backed", "Step-by-step", "Practical", "Insightful"],
  friendly: ["Conversational", "Warm", "Playful", "Relatable", "Casual"],
  bold: ["Provocative", "Unfiltered", "Unapologetic", "Confident", "Trailblazing"],
};

const HASHTAG_SETS: Record<string, string[]> = {
  wellness: [
    "#HealthyHabits",
    "#MindfulLiving",
    "#WellnessJourney",
    "#SelfCareDaily",
    "#HolisticHealth",
    "#BalanceYourLife",
  ],
  marketing: [
    "#GrowthTips",
    "#SocialStrategy",
    "#ContentCreator",
    "#BrandBuilding",
    "#DigitalMarketing",
    "#CreatorsOfInstagram",
  ],
  travel: [
    "#Wanderlust",
    "#TravelDiaries",
    "#HiddenGems",
    "#ExploreMore",
    "#PassportReady",
    "#AdventureCulture",
  ],
  food: [
    "#Foodstagram",
    "#ChefMode",
    "#FlavorJourney",
    "#RecipeIdea",
    "#KitchenDiaries",
    "#TastyTrends",
  ],
  design: [
    "#DesignInspiration",
    "#CreativeProcess",
    "#BuildInPublic",
    "#DesignThinking",
    "#StudioDay",
    "#VisualStorytelling",
  ],
};

const PLATFORM_STRENGTHS: Record<SocialPlatform, string[]> = {
  instagram: ["visual storytelling", "reels", "community building"],
  facebook: ["longer narratives", "groups", "event-driven content"],
  pinterest: ["evergreen inspiration", "how-to guides", "visual catalogs"],
};

export const suggestedPlatformCopy = (platform: SocialPlatform) =>
  PLATFORM_STRENGTHS[platform].join(", ");

const pickRandom = <T,>(items: T[], count = 1): T[] => {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const scoreEngagement = (category: string, tone: string, platforms: SocialPlatform[]) => {
  const toneBonus = tone === "bold" ? 8 : tone === "friendly" ? 5 : tone === "educational" ? 6 : 7;
  const platformBonus = platforms.includes("instagram") ? 7 : 5;
  const categoryBase = (category.length % 10) + 72;
  return Math.min(100, categoryBase + toneBonus + platformBonus);
};

export const generatePost = ({
  topic,
  category,
  tone,
  includePlatforms,
}: {
  topic: string;
  category: string;
  tone: keyof typeof TONE_LIBRARY;
  includePlatforms: SocialPlatform[];
}): GeneratedPost => {
  const descriptor = pickRandom(TONE_LIBRARY[tone], 2).join(" & ").toLowerCase();

  const hashtagSeed = HASHTAG_SETS[category] ?? pickRandom(Object.values(HASHTAG_SETS).flat(), 6);
  const hashtags = pickRandom(hashtagSeed, 5);

  const cta = pickRandom(CTA_LIBRARY)[0];

  const caption = [
    `Let's talk ${topic.toLowerCase()} today.`,
    `Here is a ${descriptor} approach you can implement right away.`,
    `What resonates most with your audience about this?`,
  ].join(" ");

  const imagePrompt = [
    `High-impact ${category} visual`,
    tone === "friendly" ? "bright color palette" : "bold contrast palette",
    includePlatforms.includes("pinterest") ? "vertical composition" : "square format",
  ].join(", ");

  return {
    id: `generated-${Date.now()}`,
    topic,
    category,
    tone,
    caption: `${caption} ${cta}.`,
    hashtags,
    callToAction: cta,
    imagePrompt,
    recommendedPlatforms: includePlatforms,
    engagementScore: scoreEngagement(category, tone, includePlatforms),
  };
};

export const seedAccounts: Account[] = [
  {
    id: "acct-ig-01",
    name: "GlowWell Studio",
    handle: "@glowwell",
    platform: "instagram",
    category: "wellness",
    followers: 84200,
    followerChange: 12.4,
    avgEngagementRate: 5.8,
    postingCadence: "high",
  },
  {
    id: "acct-fb-02",
    name: "Urban Harvest Co.",
    handle: "UrbanHarvestCo",
    platform: "facebook",
    category: "food",
    followers: 127500,
    followerChange: 4.1,
    avgEngagementRate: 3.2,
    postingCadence: "medium",
  },
  {
    id: "acct-pin-03",
    name: "Vista Journeys",
    handle: "@vistajourneys",
    platform: "pinterest",
    category: "travel",
    followers: 96500,
    followerChange: 9.6,
    avgEngagementRate: 7.1,
    postingCadence: "medium",
  },
];

export const seedScheduledPosts: ScheduledPost[] = [
  {
    id: "sched-001",
    contentId: "generated-seed-1",
    accountIds: ["acct-ig-01"],
    platforms: ["instagram", "facebook"],
    scheduledFor: new Date().toISOString(),
    status: "scheduled",
    caption: "5 micro-habits to recalibrate your morning routine.",
    hashtags: ["#HealthyHabits", "#MorningMotivation", "#WellnessRoutine"],
    assetPrompt: "Soft daylight, cozy morning setup with planner and herbal tea",
    performance: {
      reach: 21450,
      clicks: 483,
      comments: 62,
      saves: 310,
    },
  },
  {
    id: "sched-002",
    contentId: "generated-seed-2",
    accountIds: ["acct-pin-03"],
    platforms: ["pinterest"],
    scheduledFor: new Date(Date.now() + 86400000).toISOString(),
    status: "queued",
    caption: "Destination moodboard: 4-day itinerary through Barcelona's creative neighborhoods.",
    hashtags: ["#BarcelonaTravel", "#CreativeEscapes", "#CityExplorer"],
    assetPrompt: "Collage of Gothic Quarter, artisan markets, rooftop sunsets",
  },
];

export const colorForPlatform: Record<SocialPlatform, string> = {
  instagram: "bg-gradient-to-r from-pink-500 to-purple-500",
  facebook: "bg-blue-600",
  pinterest: "bg-red-500",
};

export const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));

export const seedCommentThreads: CommentThread[] = [
  {
    id: "thread-01",
    platform: "instagram",
    accountId: "acct-ig-01",
    postTitle: "Morning Rituals Carousel",
    sentiment: "positive",
    priority: "medium",
    comments: [
      {
        id: "c-101",
        author: "@wellnesswarrior",
        message: "This carousel is 🔥! Tried the breathwork tip today and felt amazing.",
        timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
        needsReply: false,
      },
      {
        id: "c-102",
        author: "@habitstacking",
        message: "Would love to see a printable checklist version of this!",
        timestamp: new Date(Date.now() - 1000 * 60 * 61).toISOString(),
        needsReply: true,
      },
    ],
  },
  {
    id: "thread-02",
    platform: "facebook",
    accountId: "acct-fb-02",
    postTitle: "Farm-to-table recipe drop",
    sentiment: "neutral",
    priority: "high",
    comments: [
      {
        id: "c-201",
        author: "Carla Mendes",
        message: "Is there a vegan substitute for the goat cheese?",
        timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
        needsReply: true,
      },
      {
        id: "c-202",
        author: "Marcus Alvarez",
        message: "Shared this with our cooking club. Great narrative!",
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        needsReply: false,
      },
    ],
  },
  {
    id: "thread-03",
    platform: "pinterest",
    accountId: "acct-pin-03",
    postTitle: "Barcelona creatives itinerary",
    sentiment: "positive",
    priority: "low",
    comments: [
      {
        id: "c-301",
        author: "@citydaydream",
        message: "Pinning this for our trip 😍 do you have a downloadable map?",
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        needsReply: true,
      },
    ],
  },
];
