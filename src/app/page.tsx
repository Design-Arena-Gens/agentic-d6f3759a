"use client";

import { useMemo, useState } from "react";
import { AccountManager } from "./components/AccountManager";
import { ContentGenerator } from "./components/ContentGenerator";
import { EngagementCenter } from "./components/EngagementCenter";
import { GeneratedContentDeck } from "./components/GeneratedContentDeck";
import { OverviewBar } from "./components/OverviewBar";
import { SchedulePlanner } from "./components/SchedulePlanner";
import {
  colorForPlatform,
  formatDateTime,
  seedAccounts,
  seedCommentThreads,
  seedScheduledPosts,
} from "./components/content-utils";
import { GeneratedPost, ScheduledPost } from "./components/types";

export default function Home() {
  const [accounts] = useState(seedAccounts);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([
    seedAccounts[0]?.id ?? "",
    seedAccounts[1]?.id ?? "",
  ]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(seedScheduledPosts);
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
  const [activeDraft, setActiveDraft] = useState<GeneratedPost | null>(null);
  const [threads] = useState(seedCommentThreads);

  const handleToggleAccount = (id: string) => {
    setSelectedAccountIds((prev) => {
      if (prev.includes(id)) {
        return prev.length > 1 ? prev.filter((item) => item !== id) : prev;
      }
      return [...prev, id];
    });
  };

  const handleGeneratedPost = (post: GeneratedPost) => {
    setGeneratedPosts((prev) => [post, ...prev]);
    setActiveDraft(post);
  };

  const handleSendToCalendar = (post: GeneratedPost) => {
    setActiveDraft(post);
  };

  const handleSchedulePost = ({
    accountIds,
    platforms,
    scheduledFor,
    caption,
    hashtags,
    assetPrompt,
  }: {
    accountIds: string[];
    platforms: ScheduledPost["platforms"];
    scheduledFor: string;
    caption: string;
    hashtags: string[];
    assetPrompt: string;
  }) => {
    const newEntry: ScheduledPost = {
      id: `sched-${Date.now()}`,
      contentId: activeDraft?.id ?? `manual-${Date.now()}`,
      accountIds,
      platforms,
      scheduledFor,
      status: "scheduled",
      caption,
      hashtags,
      assetPrompt,
    };

    setScheduledPosts((prev) => [...prev, newEntry]);
    if (activeDraft) {
      setGeneratedPosts((prev) => prev.filter((item) => item.id !== activeDraft.id));
    }
    setActiveDraft(null);
  };

  const filteredThreads = useMemo(
    () => threads.filter((thread) => selectedAccountIds.includes(thread.accountId)),
    [threads, selectedAccountIds]
  );

  const activityDigest = useMemo(() => {
    const snapshot = scheduledPosts
      .filter((item) => item.status !== "published")
      .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
      .slice(0, 3);
    return snapshot;
  }, [scheduledPosts]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950 to-slate-900" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-6 px-5 pb-20 pt-10 sm:px-8 lg:px-12">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-purple-300/80">PulsePilot</p>
              <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
                Unified social media automation console
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Plan, author, and orchestrate social storytelling across Instagram, Facebook, and Pinterest with
                intelligent scheduling, hashtag intelligence, and engagement triage.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Live monitor</p>
                <div className="mt-2 space-y-1 text-xs text-slate-400">
                  {activityDigest.map((item) => (
                    <p key={item.id} className="flex items-center gap-2">
                      <span
                        className={`inline-flex h-2 w-2 rounded-full ${colorForPlatform[item.platforms[0]] ?? "bg-purple-400"}`}
                      />
                      {formatDateTime(item.scheduledFor)} · {item.platforms.join(", ")}
                    </p>
                  ))}
                  {!activityDigest.length && <span>No pending launches</span>}
                </div>
              </div>
            </div>
          </div>
          <OverviewBar accounts={accounts} scheduledPosts={scheduledPosts} />
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
          <AccountManager
            accounts={accounts}
            selectedAccountIds={selectedAccountIds}
            onToggleAccount={handleToggleAccount}
          />
          <ContentGenerator onGenerated={handleGeneratedPost} />
        </div>

        <GeneratedContentDeck generatedPosts={generatedPosts} onSendToCalendar={handleSendToCalendar} />

        <SchedulePlanner
          key={activeDraft?.id ?? "schedule-core"}
          accounts={accounts}
          scheduledPosts={scheduledPosts}
          draft={activeDraft}
          onSchedulePost={handleSchedulePost}
        />

        <EngagementCenter
          threads={filteredThreads.length ? filteredThreads : threads}
          accounts={accounts}
        />
      </div>
    </div>
  );
}
