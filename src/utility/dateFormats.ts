export const dateFormat = (date: string | Date, locale: string) => {
  let dateToParse = date;

  if (typeof date === "string") {
    dateToParse = date.split(" ")[0].replace(/-/g, "/");
  }

  const parsedDate = new Date(dateToParse);

  if (isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
};

export const formatDateColumns = (value: string, language: string) => {
  const locale = language.startsWith("es") ? "es-419" : "en-US";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

export const toSqlDate = (date: Date | null) => {
  if (!date) return null;
  return date.toISOString().split("T")[0];
};
