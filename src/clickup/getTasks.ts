import { getRequest } from "../config/axios";
import { baseUrl } from "../config/envVar";
import { convertMsToHM } from "../utils/convertTime";
import { Folder, List } from "./getFolders";

const getTasks = async (
  folders: Array<Folder[]>,
  searchedTaskName?: string
) => {
  const tasksPromises = folders
    .map((folder: Folder[]) =>
      folder.map((folder: Folder) =>
        folder.lists.map((item: List) => {
          return getRequest(`${baseUrl}/list/${item.id}/task`);
        })
      )
    )
    .flat();

  const tasksRequests = await Promise.all(
    tasksPromises.map((requests) => Promise.all(requests))
  );

  const tasks = tasksRequests.map((taskRequest: any) =>
    taskRequest.map((singleRequest: any) => singleRequest.data)
  );

  const filteredTasks = tasks.map((item: any) =>
    item.map((item: any) =>
      item.tasks.map((task: any) => {
        const [customField] = task.custom_fields.filter(
          (customField: any) => customField.name === "Dev lvl"
        );

        const taskObject = {
          task: {
            id: task.id,
            name: task.name,
            status: task.status.status,
            timeEstimate:
              task.time_estimate === null
                ? 0
                : convertMsToHM(task.time_estimate),
            timeSpent: !task.time_spent ? 0 : convertMsToHM(task.time_spent),
            devLvl: customField.value === 0 ? "lvl1" : "lvl2",
          },
        };
        return taskObject;
      })
    )
  );
  if (!searchedTaskName) return filteredTasks;
  const filteredByName = filteredTasks.map((tasks: any[][]) =>
    tasks.map((task: any[]) =>
      task.filter((item: any) => item.task.name === searchedTaskName)
    )
  );
  return filteredByName;
};

export default getTasks;
