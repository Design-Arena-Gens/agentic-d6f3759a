"use client";

import { useMemo, useState } from "react";
import { Account, GeneratedPost, ScheduledPost, SocialPlatform } from "./types";
import { colorForPlatform, formatDateTime } from "./content-utils";

type Props = {
  accounts: Account[];
  scheduledPosts: ScheduledPost[];
  draft?: GeneratedPost | null;
  onSchedulePost: (input: {
    accountIds: string[];
    platforms: SocialPlatform[];
    scheduledFor: string;
    caption: string;
    hashtags: string[];
    assetPrompt: string;
  }) => void;
};

const statusStyles: Record<ScheduledPost["status"], string> = {
  queued: "border-blue-500/40 bg-blue-500/10 text-blue-200",
  scheduled: "border-amber-500/40 bg-amber-500/10 text-amber-200",
  published: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
};

const defaultScheduleDate = () => {
  const nextHour = new Date(Date.now() + 1000 * 60 * 90);
  nextHour.setMinutes(0, 0, 0);
  return nextHour.toISOString().slice(0, 16);
};

const platformsForAccounts = (accounts: Account[], ids: string[]) => {
  const selected = accounts.filter((account) => ids.includes(account.id));
  const uniquePlatforms = Array.from(new Set(selected.map((item) => item.platform)));
  return uniquePlatforms.length ? uniquePlatforms : (["instagram"] as SocialPlatform[]);
};

export const SchedulePlanner = ({ accounts, scheduledPosts, draft, onSchedulePost }: Props) => {
  const defaultAccountSelection = accounts.slice(0, 1).map((item) => item.id);
  const [accountIds, setAccountIds] = useState<string[]>(
    draft?.recommendedPlatforms?.length ? defaultAccountSelection : defaultAccountSelection
  );
  const [platforms, setPlatforms] = useState<SocialPlatform[]>(
    draft?.recommendedPlatforms?.length
      ? draft.recommendedPlatforms
      : platformsForAccounts(accounts, defaultAccountSelection)
  );
  const [scheduledFor, setScheduledFor] = useState(defaultScheduleDate());
  const [caption, setCaption] = useState(draft?.caption ?? "");
  const [hashtags, setHashtags] = useState(draft?.hashtags ?? []);
  const [assetPrompt, setAssetPrompt] = useState(draft?.imagePrompt ?? "");

  const upcoming = useMemo(
    () =>
      [...scheduledPosts].sort(
        (a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
      ),
    [scheduledPosts]
  );

  const groupedByDay = useMemo(() => {
    const map = new Map<string, ScheduledPost[]>();
    for (const item of upcoming) {
      const key = new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(
        new Date(item.scheduledFor)
      );
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries());
  }, [upcoming]);

  const toggleAccount = (id: string) => {
    setAccountIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      setPlatforms((current) => {
        const derived = platformsForAccounts(accounts, next);
        if (!derived.length) return current;
        return Array.from(new Set([...current.filter((platform) => derived.includes(platform)), ...derived]));
      });
      return next.length ? next : prev;
    });
  };

  const togglePlatform = (platform: SocialPlatform) => {
    setPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((item) => item !== platform) : [...prev, platform]
    );
  };

  const handleSchedule = () => {
    onSchedulePost({
      accountIds,
      platforms: platforms.length ? platforms : platformsForAccounts(accounts, accountIds),
      scheduledFor: new Date(scheduledFor).toISOString(),
      caption,
      hashtags,
      assetPrompt,
    });
    setCaption("");
    setHashtags([]);
    setAssetPrompt("");
    setScheduledFor(defaultScheduleDate());
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-lg shadow-slate-950/40">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Scheduling & calendar</h2>
          <p className="text-sm text-slate-400">
            Orchestrate timed publishing across channels and monitor execution status.
          </p>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
          {upcoming.length} items queued
        </span>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Select accounts</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {accounts.map((account) => {
                const active = accountIds.includes(account.id);
                return (
                  <button
                    key={account.id}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                      active
                        ? "border-emerald-500/70 bg-emerald-500/10 text-emerald-200"
                        : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-600 hover:text-white"
                    }`}
                    onClick={() => toggleAccount(account.id)}
                    type="button"
                  >
                    {account.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Publish at
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={(event) => setScheduledFor(event.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-purple-500/30"
              />
            </label>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Platforms</p>
              <div className="flex flex-wrap gap-2">
                {(["instagram", "facebook", "pinterest"] as SocialPlatform[]).map((platform) => {
                  const active = platforms.includes(platform);
                  return (
                    <button
                      key={platform}
                      className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide transition ${
                        active
                          ? "border-purple-500/70 bg-purple-500/10 text-purple-200"
                          : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-600 hover:text-white"
                      }`}
                      onClick={() => togglePlatform(platform)}
                      type="button"
                    >
                      {platform}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Caption</span>
            <textarea
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              className="min-h-[120px] w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-purple-500/40"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Hashtags
              <input
                value={hashtags.join(" ")}
                onChange={(event) =>
                  setHashtags(
                    event.target.value
                      .split(" ")
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                  )
                }
                placeholder="#socialstrategy #contentworkflow"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-purple-500/30"
              />
            </label>
            <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Asset prompt
              <input
                value={assetPrompt}
                onChange={(event) => setAssetPrompt(event.target.value)}
                placeholder="Vertical reel with dynamic text overlays"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-purple-500/30"
              />
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSchedule}
              className="rounded-full bg-gradient-to-r from-emerald-500 to-purple-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 transition hover:scale-[1.02]"
            >
              Schedule post
            </button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Upcoming timeline
            </p>
            <div className="mt-4 space-y-4 text-sm">
              {groupedByDay.map(([day, items]) => (
                <div key={day} className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-slate-500">{day}</p>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-slate-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">
                            {formatDateTime(item.scheduledFor)}
                          </span>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-wide ${statusStyles[item.status]}`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-medium text-white">{item.caption}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-wide text-slate-400">
                          {item.platforms.map((platform) => (
                            <span
                              key={platform}
                              className={`rounded-full px-2 py-1 text-white ${colorForPlatform[platform]}`}
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {!groupedByDay.length && (
                <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-4 text-center text-xs text-slate-400">
                  Your calendar is clear. Queue a post to get started.
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};
