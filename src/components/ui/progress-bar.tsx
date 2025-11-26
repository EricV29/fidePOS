import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface DataItem {
  [key: string]: number;
}

interface ProgressBarProps {
  chartData: DataItem;
  totalItems: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ chartData, totalItems }) => {
  const values = Object.values(chartData);

  const data = [
    {
      xone: (values[0] / totalItems) * 100,
      xtwo: (values[1] / totalItems) * 100,
    },
  ];

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={25}>
        <BarChart layout="vertical" data={data}>
          <XAxis type="number" hide domain={[0, 100]} />
          <YAxis type="category" hide />
          <Bar
            dataKey="xone"
            stackId="a"
            fill="#1976D2"
            radius={[5, 0, 0, 5]}
          />
          <Bar
            dataKey="xtwo"
            stackId="a"
            fill="#43A047"
            radius={[0, 5, 5, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressBar;
