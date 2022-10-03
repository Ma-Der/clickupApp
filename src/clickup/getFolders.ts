import { getRequest } from "../config/axios";
import { baseUrl } from "../config/envVar";
import { Space } from "./getSpaces";

export type List = {
  id: string;
  name: string;
  space: {
    id: string;
    name: string;
    access: boolean;
  }
}

export type Folder = {
  id: string;
  name: string;
  lists: List[]
}

const getFolders = async (spaces: Space[][], searchedFolderName?: string) => {
  const foldersPromises = spaces
    .map((space: Space[]) =>
      space.map((space: Space) => {
        return getRequest(
          `${baseUrl}/space/${space.id}/folder?archived=false`
        ).then((res) => res);
      })
    )
    .flat();
  
  const folders = await Promise.all(foldersPromises);

  const foldersArray = folders.map((folder: any) => folder.data.folders);

  const foldersFiltered = foldersArray.map((folder: Folder[]) =>
    folder.map((items: Folder) => ({
      id: items.id,
      name: items.name,
      lists: items.lists || [],
    }))
  );

  if (!searchedFolderName) return foldersFiltered;
  if(searchedFolderName.length <= 2) throw new Error('Not enought letters.');
  return foldersFiltered.map((folder: Folder[]) =>
    folder.filter(({name}) => name.toLowerCase().includes(searchedFolderName.toLowerCase()))
  );
};

export default getFolders;
