import { Boxscore, MlbSchedule } from "./types.ts";
import { createBoxscore, getPlayerBoxScoreTable } from "./table.ts";

const BASE_URL = "https://statsapi.mlb.com/api/";

export const getSchedule = async (): Promise<MlbSchedule> => {
  const response = await fetch(`${BASE_URL}/v1/schedule?sportId=1`);
  const data: MlbSchedule = await response.json();
  return data;
};

export const getBoxScoresFromMlb = async (): Promise<Boxscore[]> => {
  const schedule: MlbSchedule = await getSchedule();
  const boxScores: Boxscore[] = [];

  await Promise.all(schedule.dates.map(async (date) => {
    await Promise.all(date.games.map(async (game) => {
      const boxscore = await getBoxScoreFromMlb(game.gamePk);
      boxScores.push(boxscore);
    }));
  }));
  return boxScores;
};

export const getBoxScoreFromMlb = async (gameId: number): Promise<Boxscore> => {
  const response = await fetch(
    `${BASE_URL}/v1.1/game/${gameId}/feed/live`,
  );

  if (response.status !== 200) {
    throw new Error(
      `There was an error fetching game data for ${gameId} from MLB: ${response.statusText}`,
    );
  }

  const {
    gamePk,
    liveData: { linescore, boxscore },
    gameData: { teams, datetime, status },
  } = await response.json();

  const gameSummary = createBoxscore(
    linescore,
    gamePk,
    datetime,
    status,
    teams.away.abbreviation,
    teams.home.abbreviation,
  );
  const awayPlayerTable = getPlayerBoxScoreTable(
    teams.away.name,
    boxscore.teams.away.battingOrder,
    boxscore.teams.away.players,
  );
  const homePlayerTable = getPlayerBoxScoreTable(
    teams.home.name,
    boxscore.teams.home.battingOrder,
    boxscore.teams.home.players,
  );

  return {
    gameSummary,
    teamSummary: {
      away: awayPlayerTable,
      home: homePlayerTable,
    },
  };
};
