import React from "react";
import { dateFormat } from "@utility/dateFormats";
import type { IconProps } from "@typesm/icons";
import { useTranslation } from "react-i18next";

interface CardInfoTextProps {
  icon: React.ComponentType<IconProps> | null;
  title: string;
  icond: React.ComponentType<IconProps> | null;
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
  const { i18n } = useTranslation();

  function splitName(text: string) {
    const [first, last] = text.split(" ");
    return `${first} ${last[0]}.`;
  }

  const datef = dateFormat(date, i18n.language);

  return (
    <>
      <div
        className="min-w-[200] min-h-[100px] max-h-full w-full flex flex-col justify-center items-center px-6 py-4 rounded-xl border-[3px] bg-transparent transition-all"
        style={{ borderColor: color }}
      >
        <div className="flex gap-2 items-center dark:text-[#b3b3b3]">
          {Icon && <Icon color={color} />}
          <p className="font-bold text-[clamp(14px,2vw,20px)]">{title}</p>
        </div>

        <div className="flex flex-col items-center justify-center">
          {Icond && <Icond color={color} />}

          {text ? (
            <>
              <p
                className="font-bold text-[clamp(20px,3vw,35px)] leading-none"
                style={{ color }}
              >
                {splitName(text)}
              </p>
              <p className="leading-none font-semibold" style={{ color }}>
                {datef}
              </p>
            </>
          ) : (
            <p className="text-[clamp(20px,3vw,35px)]" style={{ color }}>
              ---
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default CardInfoText;
