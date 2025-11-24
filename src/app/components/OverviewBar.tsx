import { Account, ScheduledPost } from "./types";
import { formatDateTime } from "./content-utils";

const metricClass =
  "rounded-2xl border border-slate-800 bg-slate-950/60 px-6 py-4 shadow-inner shadow-black/20";

const formatNumber = (value: number) =>
  value >= 1000 ? `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k` : value.toString();

type Props = {
  accounts: Account[];
  scheduledPosts: ScheduledPost[];
};

export const OverviewBar = ({ accounts, scheduledPosts }: Props) => {
  const totalFollowers = accounts.reduce((acc, item) => acc + item.followers, 0);
  const avgEngagement =
    accounts.reduce((acc, item) => acc + item.avgEngagementRate, 0) / accounts.length;
  const upcoming = [...scheduledPosts]
    .filter((post) => post.status !== "published")
    .sort((a, b) => +new Date(a.scheduledFor) - +new Date(b.scheduledFor))[0];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className={`${metricClass}`}>
        <p className="text-sm uppercase tracking-wider text-slate-400">Total Audience</p>
        <p className="mt-2 text-3xl font-semibold text-white">{formatNumber(totalFollowers)}</p>
        <p className="mt-1 text-xs text-slate-400">Across {accounts.length} connected profiles</p>
      </div>
      <div className={`${metricClass}`}>
        <p className="text-sm uppercase tracking-wider text-slate-400">Engagement Rate</p>
        <p className="mt-2 text-3xl font-semibold text-white">
          {Number.isNaN(avgEngagement) ? "0.0" : avgEngagement.toFixed(1)}%
        </p>
        <p className="mt-1 text-xs text-slate-400">30-day trailing average</p>
      </div>
      <div className={`${metricClass}`}>
        <p className="text-sm uppercase tracking-wider text-slate-400">Next Publish</p>
        {upcoming ? (
          <>
            <p className="mt-2 text-lg font-semibold text-white">{formatDateTime(upcoming.scheduledFor)}</p>
            <p className="mt-1 text-xs text-slate-400">
              {upcoming.platforms.join(", ")} · {upcoming.caption.slice(0, 40)}...
            </p>
          </>
        ) : (
          <p className="mt-2 text-lg font-semibold text-white">No posts scheduled</p>
        )}
      </div>
    </section>
  );
};
