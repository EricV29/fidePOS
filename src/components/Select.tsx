import { useEffect, useRef, useState } from "react";
import CaretDIcon from "../assets/icons/CaretDIcon";

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
    <div
      className="w-full min-w-[100px] max-w-[400px] relative"
      ref={selectRef}
    >
      <div onClick={toggleSelect} className="inputselect">
        <p>{selectedLabel}</p>

        <span onClick={toggleSelect}>
          <CaretDIcon size={20} color="#f57c00" />
        </span>
      </div>

      {isOpen && (
        <div className="w-full absolute z-10 mt-2 rounded-xl border-2 border-[#f57c00] bg-white max-h-60 overflow-y-auto ">
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
