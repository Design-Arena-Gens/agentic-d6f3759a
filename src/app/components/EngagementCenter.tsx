"use client";

import { useMemo, useState } from "react";
import { Account, CommentThread } from "./types";
import { colorForPlatform, formatDateTime } from "./content-utils";

type Props = {
  threads: CommentThread[];
  accounts: Account[];
};

const sentimentLabel: Record<CommentThread["sentiment"], string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Needs attention",
};

const priorityLabel: Record<CommentThread["priority"], string> = {
  high: "High priority",
  medium: "Medium priority",
  low: "Low priority",
};

export const EngagementCenter = ({ threads, accounts }: Props) => {
  const [activeThreadId, setActiveThreadId] = useState(threads[0]?.id ?? "");
  const [responseDraft, setResponseDraft] = useState("");

  const activeThread = useMemo(
    () => threads.find((item) => item.id === activeThreadId) ?? threads[0],
    [threads, activeThreadId]
  );

  const accountName = accounts.find((account) => account.id === activeThread?.accountId)?.name;

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-lg shadow-slate-950/40">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Engagement console</h2>
          <p className="text-sm text-slate-400">
            Monitor sentiment, triage conversations, and draft responses in one workspace.
          </p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
          {threads.length} open threads
        </div>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.92fr,1.08fr]">
        <aside className="space-y-3">
          {threads.map((thread) => (
            <button
              key={thread.id}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                thread.id === activeThread?.id
                  ? "border-purple-500/70 bg-purple-500/10"
                  : "border-slate-800 bg-slate-900/50 hover:border-slate-600"
              }`}
              onClick={() => setActiveThreadId(thread.id)}
            >
              <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-wide text-slate-400">
                <span className={`rounded-full px-2 py-0.5 text-white ${colorForPlatform[thread.platform]}`}>
                  {thread.platform}
                </span>
                <span>{priorityLabel[thread.priority]}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-white">{thread.postTitle}</p>
              <p className="mt-1 text-xs text-slate-400">
                {thread.comments.filter((comment) => comment.needsReply).length} replies needed
              </p>
            </button>
          ))}
        </aside>

        {activeThread ? (
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
              <span className={`rounded-full px-2 py-0.5 text-white ${colorForPlatform[activeThread.platform]}`}>
                {activeThread.platform}
              </span>
              <span>{accountName}</span>
              <span>{sentimentLabel[activeThread.sentiment]}</span>
            </div>
            <ul className="space-y-3 text-sm">
              {activeThread.comments.map((comment) => (
                <li key={comment.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{comment.author}</p>
                    <span className="text-xs text-slate-400">{formatDateTime(comment.timestamp)}</span>
                  </div>
                  <p className="mt-2 text-slate-200">{comment.message}</p>
                  {comment.needsReply && (
                    <span className="mt-3 inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[11px] uppercase tracking-wide text-amber-200">
                      Reply suggested
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Draft response</p>
              <textarea
                value={responseDraft}
                onChange={(event) => setResponseDraft(event.target.value)}
                placeholder="Compose an on-brand response, then hand off to your community manager."
                className="mt-3 min-h-[110px] w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-purple-500/30"
              />
              <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-400">
                <span>Responses sync to your CRM via API automations.</span>
                <button className="rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:scale-[1.01]">
                  Mark as drafted
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
            Select a thread to triage engagements.
          </div>
        )}
      </div>
    </section>
  );
};
