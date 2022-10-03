import getTeams from "./getTeams";
import getSpaces from "./getSpaces";
import getFolders from "./getFolders";
import getTasks from "./getTasks";
import { Sorting } from "./getTasks";

export const prepareData = async (
  sort?: Sorting,
  spaceName?: string,
  folderName?: string,
  taskName?: string
) => {
  const teams = await getTeams();
  const spaces = await getSpaces(teams, spaceName);
  const folders = await getFolders(spaces, folderName);
  const tasks = await getTasks(folders, sort, taskName);

  const final = teams.map((team: string) => {
    const folder = folders.map((folder: any, i) =>
      folder.map((singleFolder: any, j: number) => {
        return { [singleFolder.name]: tasks[j] };
      })
    );
    const space = spaces.flat().map((space: any, i) => {
      return { [space.name]: folder[i] };
    });

    return { [team]: space };
  });

  return final;
};
