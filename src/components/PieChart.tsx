"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartPieDonutTextProps {}

export const description = "A donut chart with text";

const chartData = [
  { category: "Edredones", products: 224, fill: "#F57C00" },
  { category: "Maquillaje", products: 133, fill: "#FFA726" },
  { category: "Juguetes", products: 287, fill: "#4A4A4A" },
  { category: "Dulces", products: 173, fill: "#0277BD" },
];

const chartConfig = {
  category: {
    label: "Category",
  },
  chrome: {
    label: "Edredones",
    color: "#F57C00",
  },
  safari: {
    label: "Maquillaje",
    color: "#4A4A4A",
  },
  firefox: {
    label: "Juguetes",
    color: "#FFA726",
  },
  edge: {
    label: "Dulces",
    color: "#0277BD",
  },
} satisfies ChartConfig;

const ChartPieDonutText: React.FC<ChartPieDonutTextProps> = ({}) => {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.products, 0);
  }, []);

  return (
    <ChartContainer
      config={chartConfig}
      className="max-w-full min-w-[190px] w-[290px] max-h-full h-[200px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="products"
          nameKey="category"
          innerRadius={50}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {totalVisitors.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="font-extralight"
                    >
                      Total Stock
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};
export default ChartPieDonutText;
