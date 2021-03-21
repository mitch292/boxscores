import { bold, rgb24, Table, Cell } from "../deps.ts";
import { MlbInning, MlbLineScore, MlbSchedule, MlbGameStatus, MlbDateTime } from "./model.ts";

const BASE_URL = "https://statsapi.mlb.com/api/";

export const getSchedule = async (): Promise<MlbSchedule> => {
  const response = await fetch(`${BASE_URL}/v1/schedule?sportId=1`);
  const data: MlbSchedule = await response.json();
  return data;
};

export const getBoxScoresFromMlb = async (): Promise<Table[]> => {
  const schedule: MlbSchedule = await getSchedule();
  const boxScores: Table[] = [];

  await Promise.all(schedule.dates.map(async (date) => {
    await Promise.all(date.games.map(async (game) => {
      const response = await fetch(
        `${BASE_URL}/v1.1/game/${game.gamePk}/feed/live`,
      );
      const { gamePk, liveData: { linescore }, gameData: { teams, datetime, status } } =
        await response.json();
      const table = createBoxscore(
        linescore,
        gamePk,
        datetime,
        status,
        teams.away.abbreviation,
        teams.home.abbreviation,
      );
      boxScores.push(table);
    }));
  }));
  return boxScores;
};

const createBoxscore = (
  lineScore: MlbLineScore,
  gamePk: number,
  gameTime: MlbDateTime,
  status: MlbGameStatus,
  awayTeam: string,
  homeTeam: string,
): Table => {
  const innings: string[] = Array(9).map((val: any, i: number) =>
    String(i + 1)
  );
  const home: string[] = Array(9).fill(formatNumAsTableString(undefined));
  const away: string[] = Array(9).fill(formatNumAsTableString(undefined));

  lineScore.innings.forEach((inning: MlbInning, i: number) => {
    // Add any extra innings
    if (!innings[i]) {
      innings[i] = String(inning.num);
    }
    home[i] = formatNumAsTableString(inning.home.runs);
    away[i] = formatNumAsTableString(inning.away.runs);
  });

  const header = 
    [
      `ID: ${gamePk}`,
      ...innings,
      rgb24(bold("R"), { r: 149, g: 226, b: 249 }),
      "H",
      "E",
    ];


  const table = Table
    .from([
      [Cell.from(`${gameTime.time}${gameTime.ampm} -- ${status.detailedState}`).colSpan(header.length)],
      [ ...header ],
      [
        awayTeam,
        ...away,
        rgb24(bold(String(lineScore.teams.away.runs)), {
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
        rgb24(bold(String(lineScore.teams.home.runs)), {
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

const formatNumAsTableString = (val: number | undefined): string => {
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
