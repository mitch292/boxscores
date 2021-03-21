import { getBoxScoresFromMlb } from "./boxscores/service.ts";
import { Table } from "./deps.ts";

// TODO:
//  - Completely type the response from  lb
//  - Add color coding to teams in the boxcore output
//  - Add player hits etc to boxcore
//  - Add ability t get scores for just one game

if (import.meta.main) {
  const results: Table[] = await getBoxScoresFromMlb();
  results.forEach((table) => {
    console.log(table.toString());
  });
}
