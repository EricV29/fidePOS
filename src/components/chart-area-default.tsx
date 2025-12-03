import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DataItem {
  [key: string]: string | number;
}

interface ChartAreaExProp {
  chartData: DataItem[];
  chartConfig: ChartConfig;
}

const ChartAreaDefault: React.FC<ChartAreaExProp> = ({
  chartData,
  chartConfig,
}) => {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center font-extralight">
        There is no data yet.
      </div>
    );
  }

  const sample = chartData[0];

  const keys = Object.keys(sample).filter((k) => k !== "fill");

  const nameKey = keys.find((k) => typeof sample[k] === "string") || keys[0];
  const dataKey = keys.find((k) => typeof sample[k] === "number") || keys[1];

  const color = chartConfig[dataKey]?.color || "#F57C00";

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-square min-h-0 w-full"
    >
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={nameKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          dataKey={dataKey}
          type="natural"
          fill={color}
          fillOpacity={0.4}
          stroke={color}
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default ChartAreaDefault;
