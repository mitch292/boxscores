import { MlbPlayerGameSummary } from "./types.ts";

export const convertToPlayerSummary = (json: any): MlbPlayerGameSummary => {
  return {
    name: json?.person?.fullName,
    position: json?.position?.abbreviation,
    atBats: json?.stats?.batting?.atBats,
    runs: json?.stats?.batting?.runs,
    hits: json?.stats?.batting?.hits,
    rbi: json?.stats?.batting?.rbi,
    bob: json?.stats?.batting?.baseOnBalls,
    strikeOuts: json?.stats?.batting?.strikeOuts,
    seasonAvg: json?.seasonStats?.batting?.avg,
    seasonOps: json?.seasonStats?.batting?.ops,
  };
};
