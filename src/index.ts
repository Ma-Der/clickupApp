import getTeams from "./clickup/getTeams";
import getSpaces from "./clickup/getSpaces";
import getFolders from "./clickup/getFolders";
import getTasks from './clickup/getTasks';

const prepareData = async (spaceName?: string, folderName?: string, taskName?: string) => {
  const teams = await getTeams();
  const spaces = await getSpaces(teams, spaceName);
  const folders = await getFolders(spaces, folderName);
  const tasks = await getTasks(folders, taskName);
  
  const final = teams.map((team: string) => {
    const folder = folders.map((folder: any, i) => folder.map((singleFolder: any, j: number) => {
      return { [singleFolder.name]: tasks[j] };
    }));
    const space = spaces.flat().map((space: any, i) => {
      return { [space.name]: folder[i] };
    });

    return { [team]: space };
  })

  return final;
};

prepareData('Outsmartly', 'Big Blanket', 'OS Yotpo plugin implementation').then((res) => {
  const value = res[0];
  console.dir(value, { depth: null})
  //console.log(value)
});