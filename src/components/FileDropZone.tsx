import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function FileDropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useTranslation();

  const handleFiles = (files: FileList) => {
    const file = files[0];
    console.log("Archivo recibido:", file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`border-2 border-dashed rounded-[7px] p-6 text-center cursor-pointer transition
        ${isDragging ? "border-[#F57C00] bg-[#FFEFDE]" : "border-[#F57C00]"}
      `}
    >
      <p className="text-gray-500">{t("dropZone.text1")}</p>
      <label
        htmlFor="fileInput"
        className="text-blue-600 underline cursor-pointer font-medium"
      >
        {t("dropZone.text2")}
      </label>
      <input
        id="fileInput"
        type="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  );
}
