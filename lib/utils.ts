export const convertSecToJsxTime = (time: number) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date(time);
  return `${date.getDay()} ${monthNames[date.getMonth()].slice(
    0,
    3
  )}, ${date.getFullYear()}`;
};
