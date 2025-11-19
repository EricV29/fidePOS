import React from "react";

interface ReportsProps {}

const Reports: React.FC<ReportsProps> = ({}) => {
  return (
    <>
      <div className="w-full h-full flex flex-col min-h-0">
        <div className="w-full h-fit flex justify-between items-end">
          <h1 className="text-[30px] mb-0">Reports</h1>
          Boton o date picker
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
      </div>
    </>
  );
};

export default Reports;
