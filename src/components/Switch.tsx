import React from "react";

type Option = {
  label: string;
  value: string;
};

interface SwitchProps {
  options: Option[];
  active: string;
  onChange: (value: string) => void;
}

const Switch: React.FC<SwitchProps> = ({ options, active, onChange }) => {
  return (
    <>
      <div className="flex justify-between gap-3 bg-[#FFEFDE] dark:bg-[#5f5f5f] border border-[#f57c00] py-1 px-1 rounded-lg w-fit">
        {options.map((op, index) => (
          <button
            key={index}
            className={`${
              active === op.value
                ? "bg-[#f57c00] text-[#FFEFDE] font-semibold px-2 rounded-md"
                : "text-[#f57c00] px-2"
            }`}
            onClick={() => onChange(op.value)}
          >
            {op.label}
          </button>
        ))}
      </div>
    </>
  );
};

export default Switch;
