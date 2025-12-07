import React from "react";

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
  return (
    <>
      <button
        className={`min-w-[170px] min-h-15 h-full flex flex-col p-2 justify-end items-start rounded-xl ${
          active ? "bg-[#F57C00] text-white" : "bg-[#FFEFDE] text-[#a1a1a1]"
        }`}
        onClick={onClick}
      >
        <p className="font-bold text-[1.5rem]">{name.toLocaleUpperCase()}</p>
        <p className="font-extralight">{options} options</p>
      </button>
    </>
  );
};

export default CardCategory;
