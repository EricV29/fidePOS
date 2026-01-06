const COLORS = [
  "#F57C00",
  "#43A047",
  "#FFEFDE",
  "#D32F2F",
  "#FFC107",
  "#1976D2",
  "#008F4C",
  "#FF1744",
  "#F9A825",
  "#546E7A",
  "#FF4081",
  "#64FFDA",
  "#FFC400",
  "#aae3ab",
  "#ecd079",
  "#ef3353",
  "#26979f",
  "#d69e60",
  "#5ac7aa",
  "#4b538b",
];

export function addRandomFill<
  T extends Record<string, string | number> & { fill?: string }
>(data: T[]): (Omit<T, "fill"> & { fill: string })[] {
  const shuffledColors = [...COLORS].sort(() => Math.random() - 0.5);

  return data.map((item, index) => ({
    ...item,
    fill: item.fill ?? shuffledColors[index % shuffledColors.length],
  }));
}
