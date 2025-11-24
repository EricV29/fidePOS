import React from "react";

interface CustomersProps {}

const Customers: React.FC<CustomersProps> = ({}) => {
  return (
    <>
      <div className="w-full h-full flex flex-col min-h-0">
        <div className="w-full h-fit flex justify-between items-end">
          <h1 className="text-[30px] mb-0">Customers Payments</h1>
          Boton o date picker
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
      </div>
    </>
  );
};

export default Customers;
