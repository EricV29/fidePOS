import { Label, Pie, PieChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTranslation } from "react-i18next";

interface DataItem {
  fill: string;
  [key: string]: string | number;
}

interface ChartPieExProp {
  chartData: DataItem[];
  chartConfig: ChartConfig;
}

const ChartPieDonut: React.FC<ChartPieExProp> = ({
  chartData,
  chartConfig,
}) => {
  const { t } = useTranslation();
  if (!chartData || chartData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center font-extralight">
        {t("charts.noData")}
      </div>
    );
  }
  const sample = chartData[0];

  const keys = Object.keys(sample).filter((k) => k !== "fill");

  const nameKey = keys.find((k) => typeof sample[k] === "string") || keys[0];
  const dataKey = keys.find((k) => typeof sample[k] === "number") || keys[1];

  const totalItems = chartData.reduce(
    (acc, item) => acc + Number(item[dataKey]),
    0
  );

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-square min-h-0 w-full"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />

        <Pie
          data={chartData}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius={60}
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
                      {totalItems.toLocaleString()}
                    </tspan>

                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {chartConfig.products.label}
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

export default ChartPieDonut;
