import React from "react";
import { useTranslation } from "react-i18next";

interface CardCategoryProps {
  name: string;
  options: number;
  active?: boolean;
  onClick?: () => void;
}

const CardCategory: React.FC<CardCategoryProps> = ({
  name,
  options,
  active,
  onClick,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <button
        className={`min-w-[170px] min-h-15 h-full flex flex-col p-2 justify-end items-start rounded-xl ${
          active
            ? "bg-[#F57C00] text-white"
            : "bg-[#FFEFDE] dark:bg-[#b3b3b3] text-[#b3b3b3] dark:text-[#353935]"
        }`}
        onClick={onClick}
      >
        <p className="font-bold text-[1.5rem]">{name.toLocaleUpperCase()}</p>
        <p className="font-extralight">
          {options} {t("cards.options")}
        </p>
      </button>
    </>
  );
};

export default CardCategory;
