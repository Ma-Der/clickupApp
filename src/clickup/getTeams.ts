import { getRequest } from "../config/axios";
import { baseUrl } from "../config/envVar";

const getTeams = async (): Promise<any[]> => {
  const teams = await getRequest(`${baseUrl}/team`);
  const teamsIds = teams.data.teams.map((team: any) => team.id);

  return teamsIds;
};

export default getTeams;
