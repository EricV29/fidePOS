export function formatDateColumns(value: string, language: string) {
  const locale = language.startsWith("es") ? "es-419" : "en-US";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}
