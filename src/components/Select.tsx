import { useEffect, useRef, useState } from "react";
import CaretDIcon from "@icons/CaretDIcon";

interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  color: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  color,
  options,
  placeholder = "Select an option",
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value);
  const selectRef = useRef<HTMLDivElement>(null);

  const toggleSelect = () => setIsOpen(!isOpen);

  const handleSelect = (option: SelectOption) => {
    setSelectedValue(option.value);
    onChange?.(option.value);
    setIsOpen(false);
  };

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

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
      <div
        onClick={toggleSelect}
        className="inputselect"
        style={{ borderColor: color, color: color, boxShadow: color }}
      >
        <p className="truncate whitespace-nowrap overflow-hidden">
          {selectedLabel}
        </p>

        <span onClick={toggleSelect}>
          <CaretDIcon size={20} color={color} />
        </span>
      </div>

      {isOpen && (
        <div
          className="w-full absolute z-10 mt-2 rounded-xl border-2 bg-white max-h-60 overflow-y-auto"
          style={{ borderColor: color }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className="cursor-pointer px-5 py-2 text-black transition-colors hover:text-white"
              onClick={() => handleSelect(option)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = color)
              }
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
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
