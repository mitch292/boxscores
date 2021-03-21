export type MlbSchedule = {
  copyright: string;
  totalItems: number;
  totalEvents: number;
  totalGames: number;
  totalGamesInProgress: number;
  dates: MlbDate[];
};
export type MlbDate = {
  date: string; // TODO: type as date
  totalItems: number;
  totalEvents: number;
  totalGames: number;
  totalGamesInProgress: number;
  games: Game[];
  events: [];
};

export type Game = {
  gamePk: number;
  link: string;
  gamtype: string; // TODO: figure out enums here
  season: string;
  gameDate: string; // TOOD: timestamp
  officialDate: string; // TODO: date
  status: {
    abstractGameState: string; // TODO: determine enums
    codedGameState: string; // TODO: determine enums
    detailedState: string; // TODO: determine enums
    statusCode: string; // TODO: determine enums
    startTimeTBD: boolean;
    abstractGameCode: string; // TODO: determine enums
  };
  teams: {
    away: MlbTeam;
    home: MlbTeam;
  };
  venue: MlbVenue;
  content: { link: string };
  gameNumber: number;
  publicFacing: true;
  doubleHeader: string;
  gamedayType: string;
  tiebreaker: string;
  calendarEventID: string;
  seasonDisplay: string;
  dayNight: string;
  scheduledInnings: number;
  reverseHomeAwayStatus: false;
  gamesInSeries: number;
  seriesGameNumber: number;
  seriesDescription: string;
  recordSource: string;
  ifNecessary: string;
  ifNecessaryDescription: string;
};

export type MlbTeam = {
  leagueRecord: {
    wins: number;
    losses: number;
    pct: string;
  };
  score: number;
  team: {
    id: number;
    name: string;
    link: string;
  };
  splitSquad: boolean;
  seriesNumber: number;
};

export type MlbVenue = {
  id: number;
  name: string;
  link: string;
};

export type MlbLinescoreTeamTotal = {
  runs: number;
  hits: number;
  errors: number;
  lefOnBase: number;
};
export type MlbLineScore = {
  currentInning: number;
  currentInningOrdinal: string;
  inningState: string;
  inningHalf: string;
  isTopInning: boolean;
  scheduledInnings: number;
  innings: MlbInning[];
  teams: {
    home: MlbLinescoreTeamTotal;
    away: MlbLinescoreTeamTotal;
  };
};

export type MlbInning = {
  num: number;
  ordinalNum: string;
  home: MLbInningScore;
  away: MLbInningScore;
};

export type MLbInningScore = {
  runs: number;
  hits: number;
  errors: number;
  leftOnBase: number;
};

export type MlbDateTime = {
  dateTime: string; // TODO: type as datetime
  originalDate: string; // TODO: type as date
  dayNight: string;
  time: string;
  ampm: string;
};

export type MlbGameStatus = {
  abstractGameState: string; // TODO: figure out enums
  codedGameState: string; // TODO: figure out enums
  detailedState: string; // TODO: figure out enums
  statusCode: string; // TODO: figure out enums
  startTimeTBD: boolean;
  abstractGameCode: string; // TODO: figure out enums
};
