export function parseNumberData<T extends Record<string, any>>(data: T[]): T[] {
  return data.map((item) => {
    const newItem: any = {};

    Object.entries(item).forEach(([key, value]) => {
      const numeric = Number(value);

      if (!isNaN(numeric) && value !== "" && value !== null) {
        const realValue = numeric * 0.01;

        newItem[key] = realValue.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      } else {
        newItem[key] = value;
      }
    });

    return newItem as T;
  });
}
