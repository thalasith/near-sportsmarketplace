import league from "./teams.json";

export default function getTeamFormatter(tricode) {
  if (tricode === "") {
    // const team = league.find(team => team.tricode === tricode);
    return "";
  }
  const teamName = league.league.standard.find(
    (team) => team.tricode === tricode
  ).fullName;
  return teamName;
}
