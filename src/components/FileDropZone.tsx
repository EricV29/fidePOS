import { useState } from "react";

export default function FileDropZone() {
  const [isDragging, setIsDragging] = useState(false);

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
      <p className="text-gray-500">Drop file .csv o .xlsx here</p>
      <label
        htmlFor="fileInput"
        className="text-blue-600 underline cursor-pointer font-medium"
      >
        or select in your files
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
