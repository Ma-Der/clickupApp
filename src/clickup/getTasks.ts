import { getRequest } from "../config/axios";
import { baseUrl } from "../config/envVar";
import { convertMsToHM } from "../utils/convertTime";
import { Folder, List } from "./getFolders";

export type Sorting = "asc" | "desc" | undefined;
export type Task = {
  task: {
    id: string;
    name: string;
    subfolder: string;
    status: string;
    timeEstimate: number;
    timeSpent: number;
    devLvl: string;
  };
};

const getTasks = async (
  folders: Array<Folder[]>,
  sort: Sorting,
  searchedTaskName?: string
): Promise<Task[][][]> => {
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

  const filteredTasks: Task[][] = tasks.map((item: any) =>
    item.map((item: any) =>
      item.tasks.map((task: any) => {
        const [customField] = task.custom_fields.filter(
          (customField: any) => customField.name === "Dev lvl"
        );

        const taskObject = {
          task: {
            id: task.id,
            name: task.name,
            subfolder: task.list.name,
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

  if (!sort || sort === "asc") {
    const sortedTaskAsc: Task[][][] = filteredTasks.map((tasks: any) =>
      tasks.map((tasks: any) =>
        tasks.sort((a: any, b: any) =>
          a.task.status.localeCompare(b.task.status)
        )
      )
    );
    if (!searchedTaskName) return sortedTaskAsc;
    const filteredByName: Task[][][] = filterTasksByName(
      sortedTaskAsc,
      searchedTaskName
    );
    return filteredByName;
  } else {
    const sortedTaskDesc: Task[][][] = filteredTasks.flatMap((tasks: any) =>
      tasks.map((task: any) =>
        task.sort((a: any, b: any) =>
          b.task.status.localeCompare(a.task.status)
        )
      )
    );
    if (!searchedTaskName) return sortedTaskDesc;
    const filteredByName: Task[][][] = filterTasksByName(
      sortedTaskDesc,
      searchedTaskName
    );
    return filteredByName;
  }
};

export default getTasks;

const filterTasksByName = (tasks: any[], name: string): Task[][][] => {
  const filteredByName = tasks.map((tasks: any[]) =>
    tasks.map((task: any[]) =>
      tasks.filter((item: any) =>
        item.task.name.toLowerCase().includes(name.toLowerCase())
      )
    )
  );
  return filteredByName;
};
