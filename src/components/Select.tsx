import { useEffect, useRef, useState } from "react";
import CaretDIcon from "../assets/icons/CaretDIcon";
import CalendarIcon from "../assets/icons/CalendarIcon";

interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | undefined>();
  const selectRef = useRef<HTMLDivElement>(null);

  const toggleSelect = () => setIsOpen(!isOpen);

  const handleSelect = (option: SelectOption) => {
    setSelectedValue(option.value);
    onChange?.(option.value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || placeholder;

  return (
    <div className="w-[250px] relative z-10" ref={selectRef}>
      <div className="relative flex items-center">
        <div
          onClick={toggleSelect}
          className="w-full cursor-pointer rounded-[10px] border-2 bg-white py-2.5 pl-3 pr-8 text-[#f57c00] outline-none transition border-[#f57c00] shadow-[0px_2px_0px_#F57C00]"
        >
          {selectedLabel}
        </div>

        <span
          className="absolute right-0 cursor-pointer pr-4 text-[#f57c00]"
          onClick={toggleSelect}
        >
          <CaretDIcon size={20} color="#f57c00" />
        </span>
      </div>

      {isOpen && (
        <div className="shadow-datepicker absolute mt-2 w-full rounded-xl border-2 border-[#f57c00] bg-white py-3">
          {options.map((option) => (
            <div
              key={option.value}
              className="cursor-pointer px-5 py-2 text-black hover:bg-[#f57c00] hover:text-white"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
