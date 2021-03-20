import { getBoxScoresFromMlb } from "./boxscores/service.ts";
import { Table } from "./deps.ts";

// TODO:
//  - Completely type the response from  lb 
//  - Add color coding to teams in the boxcore output 


if (import.meta.main) {
  const results: Table[] = await getBoxScoresFromMlb();
  results.forEach((table) => {
    console.log(table.toString());
  });
}
