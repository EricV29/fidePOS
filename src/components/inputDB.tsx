import React, { useRef } from "react";
import { FolderOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DBFileInputProps {
  // Ahora path es el objeto File completo
  path: string;
  onSelect: (file: string) => void;
}

const DBFileInput: React.FC<DBFileInputProps> = ({ path, onSelect }) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileUploaded = event.target.files?.[0];
    if (fileUploaded) {
      const realPath = window.electronAPI.getFilePath(fileUploaded);
      onSelect(realPath);
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        accept=".db"
        style={{ display: "none" }}
      />

      <div className="group flex items-center gap-2 p-1 pl-3 bg-white border rounded-xl transition-all duration-200 border-gray-200 focus-within:border-[#F57C00] focus-within:ring-2 focus-within:ring-orange-50">
        <span
          className={`flex-1 text-xs truncate ${path ? "text-gray-700 font-medium" : "text-gray-400 italic"}`}
        >
          {path ? path : t("formDBCredentials.input1")}
        </span>

        <button
          type="button"
          onClick={handleClick}
          className="flex items-center gap-2 px-4 py-2 bg-[#F57C00] hover:bg-[#bd5e00] active:scale-95 text-white text-sm font-bold rounded-lg transition-all shadow-sm"
        >
          <FolderOpen size={16} />
          <span>
            {path
              ? t("formDBCredentials.btn1.2")
              : t("formDBCredentials.btn1.1")}
          </span>
        </button>
      </div>
    </div>
  );
};

export default DBFileInput;
