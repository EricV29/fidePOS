import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import type { ShoppingCarT, SaleData } from "@typesm/sales";
import { currencyFormat } from "@utility/currencyFormat";
import { useModal } from "@context/ModalContext";
import { ModalAddCustomer } from "@modals/ModalAddCustomer";
import { useTranslation } from "react-i18next";
import { ModalPaid } from "@modals/ModalPaid";
import { useLoading } from "@context/LoadingContext";
import type { UserSession } from "@typesm/users";
import { useOutletContext } from "react-router-dom";

interface NewSaleProps {}

/*
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
*/

interface MyContext {
  session: UserSession;
  installDate: string;
}

const NewSale: React.FC<NewSaleProps> = ({}) => {
  const [categories, setCategories] = useState<Categories[]>();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [dataProducts, setDataProducts] = useState<ProductsSale[]>([]);
  const [dataCustomers, setDataCustomers] = useState<CustomersSale[]>([]);
  const [dataCar, setCar] = useState<ShoppingCarT[]>([]);
  const [discount, setDisacount] = useState(0);
  const { setModal } = useModal();
  const { t } = useTranslation();
  const columnsps = columnsPS(t);
  const columnssc = columnsSC(t);
  const [totalRows, setTotalRows] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedCustomerId, setSelectedCustomerId] = useState<
    string | undefined
  >();
  const [searchCodeSKU, setSearchCodeSKU] = useState("");
  const [nextNumberSale, setNextNumberSale] = useState("");
  const { setLoading } = useLoading();
  const { session } = useOutletContext<MyContext>();
  const { triggerResponseAlert } = useModal();

  const loadNewSale = useCallback(async () => {
    const idCategory = activeCategory ? Number(activeCategory) : null;

    const limit = pagination.pageSize;
    const offset = pagination.pageIndex * pagination.pageSize;

    const response = await window.electronAPI.getNewSaleData({
      idCategory,
      limit: limit,
      offset: offset,
    });
    const newSaleData =
      typeof response.result === "string"
        ? JSON.parse(response.result)
        : response.result;

    if (newSaleData?.categoryOptions) {
      const categoryData = newSaleData.categoryOptions.result;
      setCategories(categoryData);
    }

    if (newSaleData?.productsList) {
      const productsData = newSaleData.productsList.result;
      setDataProducts(productsData);
      setTotalRows(newSaleData.productsList.totalCount);
    }

    if (newSaleData?.customersList) {
      const customersData = newSaleData.customersList.result;
      setDataCustomers(customersData);
    }

    if (newSaleData?.nextNumberSale) {
      const nextNumberSaleData = newSaleData.nextNumberSale.result;
      setNextNumberSale(nextNumberSaleData[0].next_sale);
    }
  }, [activeCategory, pagination]);

  useEffect(() => {
    loadNewSale();
  }, [loadNewSale, activeCategory]);

  useEffect(() => {
    if (searchCodeSKU.trim() === "") {
      loadNewSale();
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      const data = searchCodeSKU;

      const response = await window.electronAPI.getSearchCodeSKU(data);

      if (response.success && response.result) {
        setDataProducts(response.result);
      } else {
        console.error("Error en la base de datos:", response.error);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchCodeSKU, loadNewSale]);

  const customerOptions = useMemo(() => {
    return dataCustomers.map((c) => ({
      label: `${c.name} ${c.last_name}`,
      value: c.id?.toString(),
    }));
  }, [dataCustomers]);

  const handleCategory = async (idCategory: string) => {
    const nextCategory = activeCategory === idCategory ? null : idCategory;
    setActiveCategory(nextCategory);
    if (nextCategory !== null) {
      const limit = pagination.pageSize;
      const offset = pagination.pageIndex * pagination.pageSize;
      const response = await window.electronAPI.getProductsCategory({
        idCategory: idCategory,
        limit: limit,
        offset: offset,
      });
      if (response.result) {
        setDataProducts(response.result);
        setTotalRows(response.totalCount);
      }
    } else {
      loadNewSale();
    }
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
            : item,
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
    0,
  );

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisacount(Number(e.target.value));
  };

  const handleChangeCustomer = (value: string) => {
    if (!value || value === selectedCustomerId) {
      setSelectedCustomerId(undefined);
    } else {
      setSelectedCustomerId(value);
    }
  };

  const totalCart = subtotalCart - Number(discount);

  const handleNewSale = async (finalSaleData: SaleData) => {
    setLoading(true);
    const data = { ...finalSaleData, userId: session.id };

    const response = await window.electronAPI.createNewSale(data);
    console.log(response.result);

    if (response.success) {
      // getUsers();
      setLoading(false);
      triggerResponseAlert(response.result);
    } else {
      setLoading(false);
      const productFound = dataProducts.find(
        (item) => item.id === response.result,
      );
      const productName = productFound ? productFound.product : "";
      triggerResponseAlert(response.error, { product: productName });
    }
  };

  return (
    <>
      <div className="w-full h-full flex min-h-0">
        <div className="w-2/3 h-full p-2 flex flex-col gap-2">
          <div className="inputtexto">
            <BarCodeIcon />
            <input
              placeholder={t("newSale.input_code")}
              className="w-full h-full"
              onChange={(event) => setSearchCodeSKU(event.target.value)}
            />
          </div>
          <div className="w-full flex min-h-25 max-h-25 justify-start gap-2 pb-1 overflow-x-auto h-24 sm:h-28">
            {categories &&
              categories.length > 0 &&
              categories.map((item: Categories) => (
                <CardCategory
                  key={item.id}
                  name={item.category}
                  options={item.products}
                  onClick={() => handleCategory(item.id)}
                  active={activeCategory == item.id}
                />
              ))}
          </div>
          <div className="w-full flex-1 flex flex-col p-2 min-h-0 dark:text-[#b3b3b3] overflow-hidden">
            <div className="h-fit">
              <h2 className="font-semibold">{t("newSale.title")}</h2>
              <hr className="border border-[#b3b3b3] my-2" />
            </div>
            <div className="flex-1 min-h-0 w-full overflow-hidden">
              <DataTableSale
                data={dataProducts}
                columns={columnsps}
                addProduct={addProductToCart}
                pagination={pagination}
                setPagination={setPagination}
                totalRows={totalRows}
              />
            </div>
          </div>
        </div>
        <div className="w-1/3 p-2 flex flex-col gap-2 bg-white dark:bg-[#353935] drop-shadow-[0px_0px_5px_rgba(0,0,0,0.25)] rounded-2xl ">
          <p className="font-semibold text-[20px] text-[#F57C00]">
            {t("newSale.num_sale")}: #{nextNumberSale ? nextNumberSale : ""}
          </p>
          <div className="w-full flex gap-2">
            <CustomSelect
              options={customerOptions}
              placeholder={t("newSale.input_select")}
              color="#F57C00"
              value={selectedCustomerId}
              onChange={handleChangeCustomer}
            />
            <button
              className="bnormal"
              onClick={() =>
                setModal(<ModalAddCustomer onSuccess={loadNewSale} />)
              }
            >
              <UserPlusIcon />{" "}
              <p className="lg:block sm:hidden">
                {t("buttons.btn_add_customer")}
              </p>
            </button>
          </div>
          <div className="w-full h-[500px] py-2 overflow-y-auto dark:text-[#b3b3b3]">
            {" "}
            <ShoppingCart
              data={dataCar}
              columns={columnssc}
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
                  }),
                );
              }}
            />
          </div>
          <div className="w-full flex flex-col">
            <div className="w-full flex justify-between dark:text-white">
              <p>Subtotal</p>
              <p>{currencyFormat(subtotalCart)}</p>
            </div>
            <div className="w-full flex justify-between dark:text-white">
              <p>{t("newSale.discount")}</p>
              <div className="inputnumber">
                <input
                  type="number"
                  className="w-full text-center"
                  onChange={handleAmountChange}
                />
              </div>
            </div>
            <hr className="border border-[#b3b3b3] my-2" />
            <div className="w-full flex justify-between dark:text-white">
              <p className="font-bold">Total</p>
              <p className="font-bold">{currencyFormat(totalCart)}</p>
            </div>
          </div>
          <div className="w-full">
            <button
              className="borange"
              disabled={dataCar.length === 0}
              onClick={() =>
                setModal(
                  <ModalPaid
                    data={{
                      nextNumberSale: nextNumberSale,
                      products: dataCar,
                      subtotal: subtotalCart,
                      discount: discount,
                      total: totalCart,
                      customerId: selectedCustomerId,
                    }}
                    onSuccess={handleNewSale}
                  />,
                )
              }
            >
              {t("newSale.btn_sale")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewSale;
