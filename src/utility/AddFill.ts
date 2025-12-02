const COLORS = [
  "#000000",
  "#B3B3B3",
  "#F57C00",
  "#43A047",
  "#FFEFDE",
  "#D32F2F",
  "#FFC107",
  "#1976D2",
  "#008F4C",
  "#9C27B0",
  "#FF1744",
  "#F9A825",
  "#546E7A",
  "#00E5FF",
  "#FF4081",
  "#64FFDA",
  "#7C4DFF",
  "#FFC400",
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
