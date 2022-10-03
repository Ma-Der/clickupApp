import { getRequest } from "../config/axios";
import { baseUrl } from "../config/envVar";

export type Space = {
  id: string;
  name: string;
};

const getSpaces = async (
  teamIds: string[],
  searchedSpaceName?: string
): Promise<Space[][]> => {
  if (teamIds.length == 0) throw new Error("No team ids.");

  const spacesPromises = teamIds.map((id: string) => {
    return getRequest(`${baseUrl}/team/${id}/space?archived=false`).then(
      (res) => res
    );
  });
  const spacesRequests = await Promise.all(spacesPromises);

  const spacesData = spacesRequests.map(
    (spaceReq: any) => spaceReq.data.spaces
  );

  const spacesDataFiltered: Space[][] = spacesData.map((space: Space[]) =>
    space.map((items: Space) => ({
      id: items.id,
      name: items.name,
    }))
  );

  if (!searchedSpaceName) return spacesDataFiltered;

  const nameFilteredSpaces: Space[][] = spacesDataFiltered
    .map((space: Space[]) =>
      space.filter((items: Space) =>
        items.name.toLowerCase().includes(searchedSpaceName.toLowerCase())
      )
    )
    .filter((space: Space[]) => space.length !== 0);

  return nameFilteredSpaces;
};

export default getSpaces;
