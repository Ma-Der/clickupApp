function padTo2Digits(num: number) {
  return num.toString().padStart(2, "0");
}

export function convertMsToHM(milliseconds: number) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;

  minutes = minutes % 60;

  hours = hours;
  const time = `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
    seconds
  )}`;
  return time;
}
