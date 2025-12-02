import React, { useEffect, useState } from "react";
import { DataTableSearch } from "@/components/data-table-search";
import { columnsC } from "@/components/columns/columnsC";
import CustomSelect from "@/components/Select";
import CardInfoNumber from "@/components/CardInfoNumber";
import FlagIcon from "@/assets/icons/FlagIcon";

export type dataPaymentI = {
  id: string;
  name: string;
  last_name: string;
  phone: string;
  status: string;
  created_at: string;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
};

interface CustomersPaymentsProps {}

//* Example data products
const dataPaymentsDB = [
  {
    id: "34234",
    name: "Eric",
    last_name: "Villeda",
    phone: "7713940793",
    status: "active",
    created_at: "01/01/2025",
  },
  {
    id: "34234",
    name: "Eric",
    last_name: "Reyes",
    phone: "7713940793",
    status: "debt",
    created_at: "01/01/2025",
  },
];

const optionsCustomers = [
  { label: "Eric Villeda Reyes", value: "idcustomer1" },
  { label: "Jared Villeda Reyes", value: "idcustomer2" },
];

const CustomersPayments: React.FC<CustomersPaymentsProps> = ({}) => {
  const [dataPayment, setPayment] = useState<dataPaymentI[]>([]);

  useEffect(() => {
    setPayment(dataPaymentsDB);
  }, []);

  return (
    <>
      <div className="w-full h-full flex flex-col gap-2">
        <CustomSelect
          options={optionsCustomers}
          placeholder="Select your customer"
        />
        <div className="flex gap-2 h-[100px]">
          <CardInfoNumber
            icon={null}
            title="Debts"
            icond={FlagIcon}
            number={5}
            format={false}
            color="#D32F2F"
          />
          <CardInfoNumber
            icon={null}
            title="Paids"
            icond={FlagIcon}
            number={5}
            format={false}
            color="#43A047"
          />
          <CardInfoNumber
            icon={null}
            title="Unpaid"
            icond={null}
            number={500}
            format={true}
            color="#D32F2F"
          />
          <CardInfoNumber
            icon={null}
            title="Paid"
            icond={null}
            number={500}
            format={true}
            color="#43A047"
          />
        </div>
        <div className="w-full min-w-0 h-full min-h-0 flex gap-2">
          <div className="w-1/2 min-h-0 min-w-0 flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
            <p className="font-semibold">Debts Table</p>
            <DataTableSearch
              data={dataPayment}
              columns={columnsC}
              actions={{
                view: true,
                edit: true,
                delete: true,
              }}
            />
          </div>
          <div className="w-1/2 min-h-0 min-w-0 flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
            <p className="font-semibold">Payments Table</p>
            <DataTableSearch
              data={dataPayment}
              columns={columnsC}
              actions={{
                view: true,
                edit: true,
                delete: true,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomersPayments;
