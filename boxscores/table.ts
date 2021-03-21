import { bold, Cell, rgb24, Table } from "../deps.ts";
import {
  MlbDateTime,
  MlbGameStatus,
  MlbInning,
  MlbLineScore,
  MlbPlayerGameSummary,
} from "./types.ts";
import { convertToPlayerSummary } from "./util.ts";

export const createBoxscore = (
  lineScore: MlbLineScore,
  gamePk: number,
  gameTime: MlbDateTime,
  status: MlbGameStatus,
  awayTeam: string,
  homeTeam: string,
): Table => {
  const innings: string[] = [];

  // set the length of the game by default
  for (let i = 0; i < lineScore.scheduledInnings; i++) {
    innings.push((String(i + 1)));
  }

  const home: string[] = Array(9).fill(formatNumAsTableString(undefined));
  const away: string[] = Array(9).fill(formatNumAsTableString(undefined));

  lineScore.innings.forEach((inning: MlbInning, i: number) => {
    if (!innings[i]) {
      innings[i] = String(inning.num);
    }
    home[i] = formatNumAsTableString(inning.home.runs);
    away[i] = formatNumAsTableString(inning.away.runs);
  });

  const header = [
    `ID: ${gamePk}`,
    ...innings,
    rgb24(bold("R"), { r: 149, g: 226, b: 249 }),
    "H",
    "E",
  ].map((val) => val !== "R" ? rgb24(val, { r: 130, g: 133, b: 134 }) : val);

  const table = Table
    .from([
      [
        Cell.from(`${gameTime.time}${gameTime.ampm} -- ${status.detailedState}`)
          .colSpan(header.length),
      ],
      header,
      [
        awayTeam,
        ...away,
        rgb24(bold(String(lineScore.teams.away.runs || 0)), {
          r: 149,
          g: 226,
          b: 249,
        }),
        lineScore.teams.away.hits || "0",
        lineScore.teams.away.errors || "0",
      ],
      [
        homeTeam,
        ...home,
        rgb24(bold(String(lineScore.teams.home.runs || 0)), {
          r: 149,
          g: 226,
          b: 249,
        }),
        lineScore.teams.home.hits || "0",
        lineScore.teams.home.errors || "0",
      ],
    ])
    .border(true)
    .minColWidth(2);

  return table;
};

export const formatNumAsTableString = (val: number | undefined): string => {
  if (val === undefined) {
    return "";
  }

  if (val > 0) {
    return rgb24(String(val), {
      r: 77,
      g: 190,
      b: 225,
    });
  }

  return String(val);
};

export const getPlayerBoxScoreTable = (
  teamName: string,
  battingOrder: string[],
  playerSummaries: any,
): Table => {
  const formattedPlayers: MlbPlayerGameSummary[] = [];

  battingOrder.forEach((playerId) =>
    formattedPlayers.push(
      convertToPlayerSummary(playerSummaries[`ID${playerId}`]),
    )
  );

  const header = ["batters", "AB", "R", "H", "RBI", "BB", "SO", "AVG", "OPS"]
    .map((val) => rgb24(val, { r: 130, g: 133, b: 134 }));

  const rows = formattedPlayers.map(
    (p) => [
      `${p.name}, ${p.position}`,
      p.atBats,
      p.runs,
      p.hits,
      p.rbi,
      p.bob,
      p.strikeOuts,
      p.seasonAvg,
      p.seasonAvg,
    ],
  );

  const table = Table.from([
    [Cell.from(teamName).colSpan(header.length)],
    header,
    ...rows,
  ]).border(true).minColWidth(1);

  return table;
};
