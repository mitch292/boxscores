import {
  getBoxScoreFromMlb,
  getBoxScoresFromMlb,
} from "./boxscores/service.ts";
import { parse, Table } from "./deps.ts";

// TODO:
//  - Completely type the response from  lb
//  - Add color coding to teams in the boxcore output
//  - Add player hits etc to boxcore
//  - Add ability to get scores for just one game
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
      const table: Table = await getBoxScoreFromMlb(gameId);
      console.log(table.toString());
    } catch (err) {
      console.log(err);
      Deno.exit();
    }
  } else {
    const results: Table[] = await getBoxScoresFromMlb();
    results.forEach((table) => {
      console.log(table.toString());
    });
  }
}
