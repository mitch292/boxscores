import {
  getBoxScoreFromMlb,
  getBoxScoresFromMlb,
} from "./boxscores/service.ts";
import { parse } from "./deps.ts";
import { Boxscore } from "./boxscores/types.ts";

// TODO:
//  - Completely type the response from  lb
//  - Add color coding to teams in the boxcore output
//  - Add player hits etc to boxcore
//  - cliffy has bug with emojis & borders, report or submit pr, also add support for async commands
//  - Add a highlighting for current inning
//  - Add a help message

if (import.meta.main) {
  const { gameId } = parse(Deno.args, {
    alias: {
      gameId: ["game"],
    },
    unknown: () => {
      console.log("The command you passed could not be understood.");
      Deno.exit(1);
    },
  });

  if (gameId) {
    try {
      const { gameSummary, teamSummary: { away, home } }: Boxscore =
        await getBoxScoreFromMlb(gameId);
      console.log(gameSummary.toString());
      console.log(away.toString());
      console.log(home.toString());
    } catch (err) {
      console.log(err);
      Deno.exit();
    }
  } else {
    const results: Boxscore[] = await getBoxScoresFromMlb();
    results.forEach(({ gameSummary }) => {
      console.log(gameSummary.toString());
    });
  }
}
