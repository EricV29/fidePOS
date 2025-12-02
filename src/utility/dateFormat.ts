const months = [
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

export function dateFormat(dateStr: string) {
  const [day, month, year] = dateStr.split("/");

  const monthName = months[parseInt(month) - 1];

  return `${monthName} ${day} - ${year}`;
}
