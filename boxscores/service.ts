import { Table } from "../deps.ts";
import { MlbSchedule } from "./model.ts";
import { createBoxscore } from "./table.ts";

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
      const table = await getBoxScoreFromMlb(game.gamePk);
      boxScores.push(table);
    }));
  }));
  return boxScores;
};

export const getBoxScoreFromMlb = async (gameId: number): Promise<Table> => {
  const response = await fetch(
    `${BASE_URL}/v1.1/game/${gameId}/feed/live`,
  );

  if (response.status !== 200) {
    throw new Error(`There was an error fetching game data for ${gameId} from MLB: ${response.statusText}`);
  }

  const {
    gamePk,
    liveData: { linescore },
    gameData: { teams, datetime, status },
  } = await response.json();

  return createBoxscore(
    linescore,
    gamePk,
    datetime,
    status,
    teams.away.abbreviation,
    teams.home.abbreviation,
  );
};
