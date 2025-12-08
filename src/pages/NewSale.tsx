import React, { useEffect, useState } from "react";
import BarCodeIcon from "@icons/BarCodeIcon";
import CardCategory from "@components/CardCategory";
import type { Categories, ProductsSale } from "@typesm/products";
import { DataTableSale } from "@components/data-table-sale";
import { columnsPS } from "@columns/columnsPS";
import CustomSelect from "@components/Select";
import type { CustomersSale } from "@typesm/customers";
import UserPlusIcon from "@icons/UserPlusIcon";
import { ShoppingCart } from "@/components/shopping-cart";
import { columnsSC } from "@columns/columnsSC";
import type { ShoppingCarT } from "@typesm/sales";
import { currencyFormat } from "@utility/currencyFormat";
import { useModal } from "@/context/ModalContext";
import { ModalAddCustomer } from "@modals/ModalAddCustomer";

interface NewSaleProps {}

//* Example data categories
const categoriesDB = [
  { id: "0001", category: "Zapatos", products: 15 },
  { id: "0002", category: "Edredones", products: 12 },
  { id: "0003", category: "Maquillaje", products: 10 },
  { id: "0005", category: "Juguetes", products: 20 },
  { id: "0006", category: "Barberia", products: 45 },
  { id: "0007", category: "Peluches", products: 90 },
  { id: "0008", category: "Dulces", products: 14 },
];

//* Example data products
const dataProductsSaleDB = [
  {
    id: "34234",
    code_sku: "JW0012",
    product: "Labial",
    description: "Yuya rojo",
    category: "Maquillaje",
    ccolor: "#5b49ff",
    unit_price: 200,
  },
  {
    id: "34235",
    code_sku: "JW0013",
    product: "Carrito",
    description: "hotweels",
    category: "Toys",
    ccolor: "#ff49ff",
    unit_price: 30,
  },
];

//* Example data customers
const customersDB = [
  { label: "Eric Jared Villeda Reyes", value: "001" },
  { label: "Lucila Reyes Valera", value: "002" },
  { label: "Roberto Villeda Serrano", value: "003" },
  { label: "Wendy Fabiola Villeda Reyes", value: "004" },
];

const NewSale: React.FC<NewSaleProps> = ({}) => {
  const [categories, setCategories] = useState<Categories[]>();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [dataProducts, setDataProducts] = useState<ProductsSale[]>([]);
  const [dataCustomers, setDataCustomers] = useState<CustomersSale[]>([]);
  const [dataCar, setCar] = useState<ShoppingCarT[]>([]);
  const [discount, setDisacount] = useState("");
  const { setModal } = useModal();

  useEffect(() => {
    setCategories(categoriesDB);
    setDataProducts(dataProductsSaleDB);
    setDataCustomers(customersDB);
    setCar([]);
  }, []);

  const handleCategory = (id: string) => {
    setActiveCategory(id);
  };

  const addProductToCart = (product: ProductsSale) => {
    setCar((old) => {
      const existing = old.find((item) => item.id === product.id);

      if (existing) {
        return old.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total_amount: (item.quantity + 1) * item.unit_price,
              }
            : item
        );
      }

      return [
        ...old,
        {
          ...product,
          quantity: 1,
          total_amount: product.unit_price,
        },
      ];
    });
  };

  const deleteProductFromCart = (id: string) => {
    setCar((old) => old.filter((item) => item.id !== id));
  };

  const subtotalCart = dataCar.reduce(
    (sum, item) => sum + item.total_amount,
    0
  );

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisacount(e.target.value);
  };

  const totalCart = subtotalCart - Number(discount);

  if (!categories) return null;
  return (
    <>
      <div className="w-full h-full flex min-h-0">
        <div className="w-2/3 h-full p-2 flex flex-col gap-2">
          <div className="inputtexto">
            <BarCodeIcon />
            <input
              placeholder="Search by SKU code..."
              className="w-full h-full"
            />
          </div>
          <div className="w-full flex-1 flex justify-start gap-2 pb-1 overflow-x-auto">
            {categories.map((item: Categories) => (
              <CardCategory
                key={item.id}
                name={item.category}
                options={item.products}
                onClick={() => handleCategory(item.id)}
                active={activeCategory == item.id}
              />
            ))}
          </div>
          <div className="flex-5 w-full p-2 flex flex-col gap-4">
            <div>
              <h2 className="font-semibold">Products</h2>
              <hr className="border border-[#b3b3b3] my-2" />
            </div>
            <DataTableSale
              data={dataProducts}
              columns={columnsPS}
              actions={{ add: true }}
              addProduct={addProductToCart}
            />
          </div>
        </div>
        <div className="w-1/3 p-2 flex flex-col gap-2 bg-white drop-shadow-[0px_0px_5px_rgba(0,0,0,0.25)] rounded-2xl ">
          <p className="font-semibold text-[20px] text-[#F57C00]">
            Sale: #0001
          </p>
          <div className="w-full flex gap-2">
            <CustomSelect
              options={dataCustomers}
              placeholder="Choose a customer"
              color="#F57C00"
            />
            <button
              className="bnormal"
              onClick={() => setModal(<ModalAddCustomer />)}
            >
              <UserPlusIcon /> <p className="lg:block sm:hidden">Customer</p>
            </button>
          </div>
          <div className="w-full h-[500px] py-2 overflow-y-auto">
            {" "}
            <ShoppingCart
              data={dataCar}
              columns={columnsSC}
              actions={{ delete: true }}
              deleteProduct={deleteProductFromCart}
              updateData={(rowIndex, columnId, value) => {
                setCar((old) =>
                  old.map((row, index) => {
                    if (index !== rowIndex) return row;

                    const updated = { ...row, [columnId]: value };
                    if (columnId === "quantity") {
                      updated.total_amount =
                        updated.quantity * updated.unit_price;
                    }

                    return updated;
                  })
                );
              }}
            />
          </div>
          <div className="w-full flex flex-col">
            <div className="w-full flex justify-between">
              <p>Subtotal</p>
              <p>{currencyFormat(subtotalCart)}</p>
            </div>
            <div className="w-full flex justify-between">
              <p>Discount</p>
              <div className="inputnumber">
                <input
                  type="text"
                  className="w-full text-center"
                  onChange={handleAmountChange}
                />
              </div>
            </div>
            <hr className="border border-[#b3b3b3] my-2" />
            <div className="w-full flex justify-between">
              <p className="font-bold">Total</p>
              <p className="font-bold">{currencyFormat(totalCart)}</p>
            </div>
          </div>
          <div className="w-full">
            <button className="borange">Complete sale</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewSale;
