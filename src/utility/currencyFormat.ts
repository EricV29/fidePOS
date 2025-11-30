export const currencyFormat = (value: number) => {
  if (isNaN(value)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};
