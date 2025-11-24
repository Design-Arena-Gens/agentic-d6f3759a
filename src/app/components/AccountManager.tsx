import { Account, SocialPlatform } from "./types";
import { colorForPlatform, suggestedPlatformCopy } from "./content-utils";

const platformLabels: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  pinterest: "Pinterest",
};

type Props = {
  accounts: Account[];
  selectedAccountIds: string[];
  onToggleAccount: (id: string) => void;
};

const cadenceLabel: Record<Account["postingCadence"], string> = {
  low: "Low cadence",
  medium: "Balanced cadence",
  high: "High cadence",
};

export const AccountManager = ({ accounts, selectedAccountIds, onToggleAccount }: Props) => (
  <section className="space-y-3">
    <header className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-white">Connected profiles</p>
        <p className="text-xs text-slate-400">Sync multiple brands and audiences in one place</p>
      </div>
      <button className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/60">
        + Connect
      </button>
    </header>
    <ul className="space-y-3">
      {accounts.map((account) => {
        const active = selectedAccountIds.includes(account.id);
        return (
          <li
            key={account.id}
            className={`rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-slate-600 ${
              active ? "ring-2 ring-purple-500/70" : ""
            }`}
          >
            <button className="flex w-full items-start gap-4 text-left" onClick={() => onToggleAccount(account.id)}>
              <div className={`h-12 w-12 shrink-0 rounded-xl ${colorForPlatform[account.platform]} p-[2px]`}>
                <div className="flex h-full w-full items-center justify-center rounded-lg bg-black/30 text-xs font-semibold uppercase text-white/80">
                  {platformLabels[account.platform][0]}
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white">{account.name}</p>
                  <span className="text-xs text-slate-400">{cadenceLabel[account.postingCadence]}</span>
                </div>
                <p className="text-xs text-slate-400">{account.handle}</p>
                <div className="grid grid-cols-3 gap-3 pt-2 text-[11px] uppercase tracking-wide text-slate-400">
                  <div>
                    <p className="text-slate-500">Followers</p>
                    <p className="text-sm font-semibold text-white">
                      {account.followers.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">30d Growth</p>
                    <p className={`text-sm font-semibold ${account.followerChange >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {account.followerChange >= 0 ? "+" : ""}
                      {account.followerChange.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Engagement</p>
                    <p className="text-sm font-semibold text-white">
                      {account.avgEngagementRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-[11px] leading-relaxed text-slate-400">
                  <p className="font-semibold uppercase text-slate-500">Platform edge</p>
                  <p>{suggestedPlatformCopy(account.platform as SocialPlatform)}</p>
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  </section>
);
