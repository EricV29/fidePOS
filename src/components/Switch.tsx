import React from "react";

interface SwitchProps {
  opa: string;
  opb: string;
  active: number;
  onChange: (value: number) => void;
}

const Switch: React.FC<SwitchProps> = ({ opa, opb, active, onChange }) => {
  console.log(active);

  return (
    <>
      <div className="flex justify-between gap-3 bg-[#FFEFDE] border border-[#f57c00] py-1 px-1 rounded-lg w-fit">
        <button
          className={`${
            active === 0
              ? "bg-[#f57c00] text-[#FFEFDE] font-semibold px-2 rounded-md"
              : "text-[#f57c00] px-2"
          }`}
          onClick={() => onChange(0)}
        >
          {opa}
        </button>
        <button
          className={`${
            active === 1
              ? "bg-[#f57c00] text-[#FFEFDE] font-semibold px-2 rounded-md"
              : "text-[#f57c00] px-2"
          }`}
          onClick={() => onChange(1)}
        >
          {opb}
        </button>
      </div>
    </>
  );
};

export default Switch;
