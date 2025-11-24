import { Bar, BarChart, CartesianGrid, XAxis, LabelList } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

interface DataItem {
  [key: string]: string | number;
}

interface BarChartExProps {
  chartData: DataItem[];
  chartConfig: ChartConfig;
  xAxis: string;
  yAxis: string;
}

const BarChartEx: React.FC<BarChartExProps> = ({
  chartData,
  chartConfig,
  xAxis,
  yAxis,
}) => {
  return (
    <ChartContainer config={chartConfig} className="min-h-0 w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xAxis}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 15)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey={yAxis} fill={`var(--color-${yAxis})`} radius={10}>
          <LabelList
            position="center"
            offset={5}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export default BarChartEx;
