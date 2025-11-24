"use client";

import { FormEvent, useMemo, useState } from "react";
import { generatePost } from "./content-utils";
import { GeneratedPost, SocialPlatform } from "./types";

const categories = [
  { id: "wellness", label: "Wellness & Lifestyle" },
  { id: "marketing", label: "Marketing & Growth" },
  { id: "travel", label: "Travel & Experiences" },
  { id: "food", label: "Food & Hospitality" },
  { id: "design", label: "Design & Creativity" },
];

const tones: Array<{ id: keyof typeof toneLabels; label: string }> = [
  { id: "inspirational", label: "Inspirational" },
  { id: "educational", label: "Educational" },
  { id: "friendly", label: "Friendly" },
  { id: "bold", label: "Bold/Contrarian" },
];

const toneLabels = {
  inspirational: "Spark big ideas and aspirational storytelling",
  educational: "Teach, break down frameworks, onboard new audiences",
  friendly: "Human-first, conversational, and approachable",
  bold: "Hot takes, challengers, and scroll-stopping hooks",
};

type Props = {
  onGenerated: (post: GeneratedPost) => void;
};

export const ContentGenerator = ({ onGenerated }: Props) => {
  const [topic, setTopic] = useState("Micro habits for remote teams");
  const [category, setCategory] = useState(categories[0].id);
  const [tone, setTone] = useState<keyof typeof toneLabels>("inspirational");
  const [platforms, setPlatforms] = useState<SocialPlatform[]>(["instagram", "facebook"]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTogglePlatform = (platform: SocialPlatform) => {
    setPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((item) => item !== platform) : [...prev, platform]
    );
  };

  const handleGenerate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsGenerating(true);

    const result = generatePost({
      topic,
      category,
      tone,
      includePlatforms: platforms.length ? platforms : (["instagram"] as SocialPlatform[]),
    });

    setTimeout(() => {
      onGenerated(result);
      setIsGenerating(false);
    }, 580);
  };

  const recentHooks = useMemo(
    () => [
      "Start with a POV that flips your audience's expectations.",
      "Layer a data point with a relatable metaphor to earn saves.",
      "Translate your topic into a 3-slide narrative arc.",
    ],
    []
  );

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-lg shadow-slate-950/40">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Creative automation</h2>
          <p className="text-sm text-slate-400">
            Generate platform-ready copy, asset prompts, and hashtag sets adapted to your brand voice.
          </p>
        </div>
        <div className="rounded-xl border border-emerald-500/50 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-wide text-emerald-300">
          AI-assisted
        </div>
      </header>

      <form className="mt-6 space-y-6" onSubmit={handleGenerate}>
        <div className="grid gap-4 lg:grid-cols-[1.25fr,1fr]">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Campaign Topic
            </span>
            <textarea
              className="min-h-[90px] w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none transition focus:border-slate-500 focus:bg-slate-900 focus:ring-2 focus:ring-purple-500/40"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="What would you like to talk about?"
            />
          </label>
          <aside className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Prompt assistants</p>
            {recentHooks.map((hook) => (
              <button
                key={hook}
                className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-left text-[13px] text-slate-300 transition hover:border-purple-600/60 hover:bg-slate-900 hover:text-white"
                type="button"
                onClick={() => setTopic(hook)}
              >
                {hook}
              </button>
            ))}
          </aside>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <label className="space-y-2 text-xs">
            <span className="font-semibold uppercase tracking-wide text-slate-400">Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none transition focus:border-slate-500 focus:bg-slate-900 focus:ring-2 focus:ring-purple-500/40"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </label>
          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tone</p>
            <div className="grid gap-2 text-sm">
              {tones.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`rounded-lg border px-3 py-2 text-left transition ${
                    option.id === tone
                      ? "border-purple-500/80 bg-purple-500/20 text-white"
                      : "border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-600 hover:text-white"
                  }`}
                  onClick={() => setTone(option.id)}
                >
                  <p className="font-medium">{option.label}</p>
                  <p className="text-xs text-slate-400">{toneLabels[option.id]}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Distribution
            </p>
            <div className="flex flex-wrap gap-2">
              {(["instagram", "facebook", "pinterest"] as SocialPlatform[]).map((platform) => {
                const active = platforms.includes(platform);
                return (
                  <button
                    key={platform}
                    type="button"
                    className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide transition ${
                      active
                        ? "border-emerald-500/80 bg-emerald-500/10 text-emerald-300"
                        : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-600"
                    }`}
                    onClick={() => handleTogglePlatform(platform)}
                  >
                    {platform}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Each network receives platform-aware caption formatting and cropped asset prompts.
            </p>
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Auto-optimises hooks, body copy, and hashtags tailored to selected platforms.
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] active:scale-[0.99]"
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Post Blueprint"}
          </button>
        </footer>
      </form>
    </section>
  );
};
