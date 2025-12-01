import React from "react";
import { dateFormat } from "../utility/dateFormat";

interface CardInfoTextProps {
  icon: React.ComponentType<any> | null;
  title: string;
  icond: React.ComponentType<any> | null;
  text: string;
  date: string;
  color: string;
}

const CardInfoText: React.FC<CardInfoTextProps> = ({
  icon: Icon,
  title,
  icond: Icond,
  text,
  date,
  color,
}) => {
  function clampSize(min: number, mid: number, max: number) {
    return `clamp(${min}px, ${mid}px + 1vw, ${max}px)`;
  }

  const [first, last] = text.split(" ");
  const textf = `${first} ${last[0]}.`;

  const datef = dateFormat(date);

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

        <div className="flex flex-col items-center justify-center">
          {Icond && <Icond size={clampSize(24, 30, 40)} color={color} />}

          {text ? (
            <>
              <p
                className="font-bold text-[clamp(20px,3vw,35px)] leading-none"
                style={{ color }}
              >
                {textf}
              </p>
              <p className="leading-none font-semibold" style={{ color }}>
                {datef}
              </p>
            </>
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

export default CardInfoText;
