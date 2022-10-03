import { prepareData } from "./clickup/prepareData";

prepareData()
  .then((res) => {
    console.dir(res, { depth: null });
    //console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
