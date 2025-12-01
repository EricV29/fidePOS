import React from "react";

interface CardInfoNumberProps {
  icon: React.ComponentType<any> | null;
  title: string;
  icond: React.ComponentType<any> | null;
  number: number;
  format: boolean;
  color: string;
}

const CardInfoNumber: React.FC<CardInfoNumberProps> = ({
  icon: Icon,
  title,
  icond: Icond,
  number,
  format,
  color,
}) => {
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  function clampSize(min: number, mid: number, max: number) {
    return `clamp(${min}px, ${mid}px + 1vw, ${max}px)`;
  }

  return (
    <>
      <div
        className="min-w-[200] min-h-[100px] max-h-full w-full flex flex-col justify-center items-center px-6 py-4 rounded-xl border-[3px] bg-white transition-all"
        style={{ borderColor: color }}
      >
        <div className="flex gap-2 items-center">
          {Icon && <Icon size={clampSize(24, 30, 40)} color={color} />}
          <p className="font-bold text-[clamp(14px,2vw,20px)]">{title}</p>
        </div>

        <div className="flex items-center gap-1">
          {Icond ? (
            <Icond size={clampSize(24, 30, 40)} color={color} />
          ) : (
            <p className="text-[clamp(20px,4vw,35px)]" style={{ color }}>
              $
            </p>
          )}

          {number ? (
            <p className="text-[clamp(20px,3vw,35px)]" style={{ color }}>
              {format ? formatNumber(number) : number}
            </p>
          ) : (
            <div className="w-full h-full flex items-center justify-center font-extralight">
              There is no data yet.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CardInfoNumber;
