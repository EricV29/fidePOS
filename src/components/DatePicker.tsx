import { useEffect, useRef, useState } from "react";
import CalendarIcon from "@icons/CalendarIcon";
import CaretDIcon from "@icons/CaretDIcon";
import LeftIcon from "@icons/LeftIcon";
import RightIcon from "@icons/RightIcon";
import { useTranslation } from "react-i18next";
import { toSqlDate } from "@utility/dateFormats";

interface DatePickerProps {
  installDate: string | null;
  onApply: (startDate: string | null, endDate: string | null) => void;
}

const DateRangePickerWithInlineButtons: React.FC<DatePickerProps> = ({
  installDate,
  onApply,
}) => {
  const { t, i18n } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [onlyToday, setOnlyToday] = useState(false);

  const datepickerRef = useRef(null);

  const monthKey = currentDate
    .toLocaleString("en-US", { month: "long" })
    .toLowerCase();

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "";

    const d = new Date(date);

    if (isNaN(d.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat(i18n.language, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(<div key={`empty-${i}`}></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      const dayString = formatDate(day);
      let className =
        "flex items-center justify-center cursor-pointer w-[46px] h-[46px] rounded-full hover:bg-[#f57c00] hover:text-white text-black dark:text-white";

      if (
        selectedStartDate &&
        day.toDateString() === selectedStartDate.toDateString()
      ) {
        className += " bg-[#f57c00] text-white rounded-r-none";
      }
      if (
        selectedEndDate &&
        day.toDateString() === selectedEndDate.toDateString()
      ) {
        className += " bg-[#f57c00] text-white rounded-l-none";
      }
      if (
        selectedStartDate &&
        selectedEndDate &&
        new Date(day) > new Date(selectedStartDate) &&
        new Date(day) < new Date(selectedEndDate)
      ) {
        className += " bg-[#ffead6] dark:bg-[#b3b3b3] rounded-none";
      }

      daysArray.push(
        <div
          key={i}
          className={className}
          data-date={dayString}
          onClick={() => handleDayClick(day)}
        >
          {i}
        </div>,
      );
    }

    return daysArray;
  };

  const handleDayClick = (selectedDay: Date) => {
    if (!selectedStartDate || selectedEndDate) {
      setSelectedStartDate(selectedDay);
      setSelectedEndDate(null);
    } else {
      if (selectedDay < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(selectedDay);
      } else {
        setSelectedEndDate(selectedDay);
      }
      setOnlyToday(false);
    }
  };

  const updateInput = () => {
    if (selectedStartDate && selectedEndDate) {
      return `${formatDate(selectedStartDate)} - ${formatDate(
        selectedEndDate,
      )}`;
    } else if (selectedStartDate) {
      return formatDate(selectedStartDate);
    } else {
      const today = formatDate(currentDate);
      const iDate = installDate ? formatDate(installDate) : "";

      return iDate ? `${iDate} - ${today}` : today;
    }
  };

  const toggleDatepicker = () => {
    setIsOpen(!isOpen);
  };

  const cleanDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return dateStr.split("T")[0];
  };

  const handleApply = () => {
    let start: string | null = null;
    let end: string | null = null;

    if (selectedStartDate && selectedEndDate) {
      start = toSqlDate(selectedStartDate);
      end = toSqlDate(selectedEndDate);
    } else if (selectedStartDate) {
      if (onlyToday) {
        start = toSqlDate(selectedStartDate);
        end = toSqlDate(selectedStartDate);
      } else {
        start = cleanDate(installDate);
        end = toSqlDate(selectedStartDate);
      }
    } else {
      start = installDate;
      end = toSqlDate(new Date());
    }

    onApply(start, end);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setOnlyToday(false); // Resetear check

    const today = toSqlDate(new Date());
    onApply(installDate, today);
    setIsOpen(false);
  };

  useEffect(() => {
    // Remove document click event listener
    // document.addEventListener("click", handleDocumentClick);

    return () => {
      // document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const isRangeSelected = !!(selectedStartDate && selectedEndDate);

  return (
    <>
      <div className="w-[320px] h-12 relative z-10" ref={datepickerRef}>
        <div className="relative flex items-center">
          <span className="absolute left-0 pl-5 text-dark-5 ">
            <CalendarIcon size={20} color="#f57c00" />
          </span>
          <input
            id="datepicker"
            type="text"
            placeholder="Pick a date"
            className="w-full rounded-[10px] border-2 bg-white dark:bg-[#353935] py-2.5 pl-[50px] pr-8 text-[#f57c00] outline-none transition border-[#f57c00] shadow-[0px_2px_0px_#F57C00]"
            value={updateInput()}
            onClick={toggleDatepicker}
            readOnly
          />
          <span
            className="absolute right-0 cursor-pointer pr-4 text-[#f57c00]"
            onClick={toggleDatepicker}
          >
            <CaretDIcon size={20} color="#f57c00" />
          </span>
        </div>

        {isOpen && (
          <div
            id="datepicker-container"
            className="shadow-datepicker absolute mt-2 rounded-xl border-2 bg-white dark:bg-[#353935] pt-5 border-[#f57c00]"
          >
            <div className="flex items-center justify-between px-5">
              <button
                id="prevMonth"
                className="rounded-md px-2 py-2 text-dark hover:bg-[#f57c00] text-black dark:text-white hover:text-white"
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setMonth(currentDate.getMonth() - 1)),
                  )
                }
              >
                <LeftIcon size={20} color="#000 hover:#fff" />
              </button>

              <div
                id="currentMonth"
                className="text-lg font-medium text-dark-3 text-black dark:text-white"
              >
                {t(`datePicker.months.${monthKey}`)} {currentDate.getFullYear()}
              </div>

              <button
                id="nextMonth"
                className="rounded-md px-2 py-2 text-dark hover:bg-[#f57c00] text-black dark:text-white hover:text-white"
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setMonth(currentDate.getMonth() + 1)),
                  )
                }
              >
                <RightIcon size={20} color="#000 hover:#fff" />
              </button>
            </div>

            <div className="mb-4 mt-6 grid grid-cols-7 gap-2 px-5">
              {["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-secondary-color dark:text-white"
                >
                  {t(`datePicker.days.${day}`)}
                </div>
              ))}
            </div>

            <div
              id="days-container"
              className="mt-2 grid grid-cols-7 gap-y-0.5 px-5"
            >
              {renderCalendar()}
            </div>

            <div className="mt-5 flex justify-end space-x-2.5 border-t-2 border-[#f57c00] p-5 border-dark-3">
              <label
                className={`flex items-center space-x-2 text-sm font-medium ${isRangeSelected ? "opacity-30 cursor-not-allowed" : "cursor-pointer"} text-black dark:text-white`}
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-[#f57c00]"
                  disabled={isRangeSelected}
                  checked={onlyToday}
                  onChange={(e) => setOnlyToday(e.target.checked)}
                />
                <span>{t("datePicker.onlyToday") || "Only this day?"}</span>
              </label>

              <button
                id="cancelButton"
                className="rounded-lg border border-[#f57c00] px-5 py-2.5 text-base font-medium text-[#f57c00] hover:bg-[#f57c00] hover:text-white"
                onClick={handleCancel}
              >
                {t("datePicker.btn1")}
              </button>
              <button
                id="applyButton"
                className="rounded-lg bg-[#f57c00] px-5 py-2.5 text-base font-medium text-white hover:bg-[#ce6700]"
                onClick={handleApply}
              >
                {t("datePicker.btn2")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DateRangePickerWithInlineButtons;
