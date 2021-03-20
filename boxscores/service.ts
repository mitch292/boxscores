import { Table, bold, rgb24 } from "../deps.ts";
import {
  MlbInning,
  MlbLineScore,
  MlbSchedule,
} from "./model.ts";

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
      const data = await response.json();
      const table = createBoxscore(data.liveData.linescore, data.gameData.teams.away.abbreviation, data.gameData.teams.home.abbreviation);
      boxScores.push(table);
    }));
  }));
  return boxScores;
};

const createBoxscore = (lineScore: MlbLineScore, awayTeam: string, homeTeam: string): Table => {
  const innings: string[] = [];
  const home: string[] = [];
  const away: string[] = [];

  lineScore.innings.forEach((inning: MlbInning) => {
    console.log(inning.home.runs);
    innings.push(String(inning.num));
    home.push(formatNumAsTableString(inning.home.runs));
    away.push(formatNumAsTableString(inning.away.runs));
  });

  // lets make sure that the array is at least 9 innings long
  innings.fill("", lineScore.innings.length, 9);
  home.fill("", lineScore.innings.length, 9);
  away.fill("", lineScore.innings.length, 9);

  const table = new Table()
    .border(true)
    .minColWidth(2)
    .header(["inning", ...innings, bold("R"), "H", "E"])
    .body([
      [
        awayTeam,
        ...away,
        bold(formatNumAsTableString(lineScore.teams.away.runs)),
        lineScore.teams.away.hits,
        lineScore.teams.away.errors,
      ],
      [
        homeTeam,
        ...home,
        bold(formatNumAsTableString(lineScore.teams.home.runs)),
        lineScore.teams.home.hits,
        lineScore.teams.home.errors,
      ],
    ]);

  return table;
};


const formatNumAsTableString = (val: number|undefined): string => {
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
}