import ProgressBar from "@/components/progress-bar";

interface DataItem {
  [key: string]: number;
}

interface CardInfoDetailProps {
  chartData: DataItem;
  title: string;
  color: string;
}

const CardInfoDetail: React.FC<CardInfoDetailProps> = ({
  chartData,
  title,
  color,
}) => {
  if (!chartData) return null;
  const totalItems = Object.values(chartData).reduce(
    (a, b) => a + Number(b),
    0
  );

  return (
    <>
      <div
        className="min-w-[200] min-h-[100px] max-h-full w-full flex flex-col justify-center items-center px-6 py-4 rounded-xl border-[3px] bg-white transition-all"
        style={{ borderColor: color }}
      >
        <div className="w-full flex flex-col justify-center items-start">
          <div className="flex items-center gap-2 font-bold">
            <p className="text-[clamp(15px,3vw,30px)]">{totalItems}</p>
            <p className="text-[clamp(10px,2vw,20px)]">{title}</p>
          </div>
          <ProgressBar chartData={chartData} totalItems={totalItems} />
          <div className="w-full flex justify-between gap-1 font-regular text-[clamp(5px,2vw,15px)]">
            <p className="flex gap-1 items-center">
              <span className="bg-[#1976D2] rounded-full w-2 h-2 block"></span>
              {Object.keys(chartData)[0]}:
              <span className="font-semibold">
                {Object.values(chartData)[0]}
              </span>
            </p>
            <p className="flex gap-1 items-center">
              <span className="bg-[#43A047] rounded-full w-2 h-2 block"></span>
              {Object.keys(chartData)[1]}:
              <span className="font-semibold">
                {Object.values(chartData)[1]}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardInfoDetail;
