import { Bar, BarChart, CartesianGrid, XAxis, LabelList } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@components/ui/chart";
import { useTranslation } from "react-i18next";

interface DataItem {
  [key: string]: string | number;
}

interface ChartBarLabelProps {
  chartData: DataItem[];
  chartConfig: ChartConfig;
  xAxis: string;
  yAxis: string;
}

const ChartBarLabel: React.FC<ChartBarLabelProps> = ({
  chartData,
  chartConfig,
  xAxis,
  yAxis,
}) => {
  const { t } = useTranslation();

  if (!chartData || chartData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center font-extralight">
        {t("global.no_data")}
      </div>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-0 w-full dark:text-[#b3b3b3]"
    >
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

export default ChartBarLabel;
