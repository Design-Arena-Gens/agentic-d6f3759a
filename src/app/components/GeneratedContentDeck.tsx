"use client";

import { GeneratedPost } from "./types";
import { colorForPlatform } from "./content-utils";

type Props = {
  generatedPosts: GeneratedPost[];
  onSendToCalendar: (post: GeneratedPost) => void;
};

const emptyState =
  "rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center text-sm text-slate-400";

export const GeneratedContentDeck = ({ generatedPosts, onSendToCalendar }: Props) => {
  if (!generatedPosts.length) {
    return (
      <div className={emptyState}>
        Generate a blueprint to populate your cross-platform content queue.
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {generatedPosts.map((post) => (
        <article
          key={post.id}
          className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-md shadow-slate-950/40"
        >
          <header className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">{post.category}</p>
              <h3 className="text-lg font-semibold text-white">{post.topic}</h3>
            </div>
            <div className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-emerald-300">
              Score {post.engagementScore}
            </div>
          </header>
          <p className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm leading-relaxed text-slate-200">
            {post.caption}
          </p>
          <div className="grid gap-3 text-xs text-slate-400 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="font-semibold uppercase tracking-wide text-slate-500">
                Asset creative direction
              </p>
              <p className="rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-slate-200">
                {post.imagePrompt}
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold uppercase tracking-wide text-slate-500">Hashtags</p>
              <div className="flex flex-wrap gap-2 rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                {post.hashtags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-800 px-3 py-1 text-slate-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {post.recommendedPlatforms.map((platform) => (
                <span
                  key={platform}
                  className={`rounded-full px-3 py-1 text-xs uppercase tracking-wide text-white ${colorForPlatform[platform]}`}
                >
                  {platform}
                </span>
              ))}
            </div>
            <button
              className="rounded-full border border-purple-500/60 bg-purple-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-300 transition hover:border-purple-400 hover:bg-purple-500/20"
              onClick={() => onSendToCalendar(post)}
            >
              Add to schedule
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};
