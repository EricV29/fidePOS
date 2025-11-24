"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DataItem {
  [key: string]: string | number;
}

interface ChartPieDonutTextProps {
  chartData: DataItem[];
  chartConfig: ChartConfig;
  xKey: string;
  yKey: string;
}

const ChartPieDonutText: React.FC<ChartPieDonutTextProps> = ({
  chartData,
  chartConfig,
  yKey,
  xKey,
}) => {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + Number(curr.products), 0);
  }, [chartData]);

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
          dataKey={yKey}
          nameKey={xKey}
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
