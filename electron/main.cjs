const { app, BrowserWindow, ipcMain, protocol, net } = require("electron");
const path = require("path");
const { getDB, createSchema } = require("./db/database.cjs");
const {
  firstRun,
  addAdmin,
  loginUser,
  insertNewPassword,
} = require("./db/queries/appQueries.cjs");
const {
  addUser,
  getUsers,
  deleteUser,
  editUser,
  changePassword,
  getFilterSearchUsers,
} = require("./db/queries/usersQueries.cjs");
const {
  getTopSalesCategory,
  getRevenue,
  getRecentSales,
  getSaleData,
  getNextNumberSale,
  createNewSale,
  getSalesNumberAmount,
  getPendingSalesAmount,
  getDiscountsAmount,
  getPaidVSPendingNumber,
  getHistorySales,
  getFilterSearchHistorySales,
  getAllHistorySales,
  getSalesByCategory,
  getTopSellingProducts,
  getTotalDebtsOverTime,
  getPaymentsDebt,
  addPaymentDebt,
} = require("./db/queries/salesQueries.cjs");
const {
  getActiveProductsCategory,
  getInvestment,
  getCategoryOptions,
  getProductsList,
  getFilterSearch,
  getSearchCodeSKU,
  getInventoryValue,
  getProductsStock,
  getProducts,
  getFilterSearchProducts,
  deleteProduct,
  addProduct,
  editProduct,
  addProductsImport,
  getAllProducts,
  getProductsStatus,
  getProductsByCategory,
} = require("./db/queries/productsQueries.cjs");
const {
  getAccountsReceivable,
  getIndebtedCustomers,
  getCustomerDebts,
  getCustomersList,
  addCustomer,
  getCustomersNumber,
  getCustomersInDebtNumber,
  getLastCustomerNamePaid,
  getCustomersTable,
  getFilterSearchCustomers,
  editCustomer,
  deleteCustomer,
  getCustomersSelect,
  getCustomerDebtsNumber,
  getCustomerPaymentsNumber,
  getCustomerTotalDebtAmount,
  getCustomerTotalPaymentAmount,
  getCustomerDebtsTable,
  getCustomerPaymentsTable,
  getFilterSearchCustomersDebts,
  getFilterSearchCustomersPayments,
  getAllCustomers,
  getAllDebtsCustomer,
  getAllPaymentsCustomer,
  activeCustomer,
  getCustomersStatus,
  getDebtsByCustomers,
  getDetailDebt,
} = require("./db/queries/customersQueries.cjs");
const {
  addCategory,
  getCategoriesSelect,
  getCategories,
  editCategory,
  deteleCategory,
  getFilterSearchCategories,
} = require("./db/queries/categoriesQueries.cjs");
const { sendRecoveryEmail } = require("./utility/recoveryPassword.cjs");
const { welcomeEmail } = require("./utility/welcomeEmail.cjs");
const { hasRealInternet } = require("./utility/hasRealInternet.cjs");
const { contactDevs } = require("./utility/contactDevs.cjs");
const { generatePassword } = require("./utility/generatePassword.cjs");
const { uploadUserImage } = require("./utility/uploadUserImage.cjs");
const isDev = !app.isPackaged;
require("dotenv").config();

function getPageUrl(route = "") {
  if (isDev) {
    return `http://localhost:6969/#/${route}`;
  } else {
    const distPath = path.join(
      process.resourcesPath,
      "app.asar",
      "dist",
      "index.html",
    );
    return `file://${distPath}#/${route}`;
  }
}

const {
  registerInstallDate,
  getInstallDate,
} = require("./utility/installDateManager.cjs");

let welcomeWindow = null;
let mainWindow = null;
let loginWindow = null;
let signupWindow = null;

//* CREATE WINDOWS --------------------

// Welcome Window
function createWelcomeWindow() {
  return new Promise((resolve) => {
    welcomeWindow = new BrowserWindow({
      width: 600,
      height: 450,
      resizable: false,
      frame: false,
      titleBarStyle: "hidden",
      titleBarOverlay: false,
      autoHideMenuBar: true,
      show: false,
      icon: path.join(__dirname, "../public/fidelogo.ico"),
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
      },
    });

    const url = getPageUrl("welcome");
    welcomeWindow.loadURL(url);

    welcomeWindow.webContents.once("did-finish-load", () => {
      welcomeWindow.show();
      resolve();
    });
  });
}

// Signup Window
function createSignupWindow() {
  signupWindow = new BrowserWindow({
    width: 600,
    height: 650,
    resizable: false,
    frame: false,
    titleBarStyle: "hidden",
    titleBarOverlay: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "../public/fidelogo.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
    show: false,
  });

  const url = getPageUrl("signup");
  signupWindow.loadURL(url);

  signupWindow.webContents.on("did-finish-load", () => {
    signupWindow.show();
  });
}

// Login Window
function createLoginWindow() {
  loginWindow = new BrowserWindow({
    width: 600,
    height: 450,
    resizable: false,
    frame: false,
    titleBarStyle: "hidden",
    titleBarOverlay: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "../public/fidelogo.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
    show: false,
  });

  const url = getPageUrl("login");
  loginWindow.loadURL(url);

  loginWindow.webContents.on("did-finish-load", () => {
    loginWindow.show();
  });
}

// Main Window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    minWidth: 1000,
    minHeight: 700,
    resizable: true,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "../public/fidelogo.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
    show: false,
  });

  const url = getPageUrl("main");
  mainWindow.maximize();
  mainWindow.loadURL(url);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

//* START APP --------------------
async function startApp() {
  const db = await getDB();
  await createSchema(db);
}

//* FUNCTIONS --------------------

// Save Login
let sessionUser = null;
function saveLogin(userData) {
  sessionUser = userData;
  console.log(
    `✅ Session started for: ${sessionUser.name} ${sessionUser.last_name}`,
  );
}

//* LISTENERS --------------------

//* APP LISTENERS ----------
// Get Install Date
ipcMain.handle("getInstallDate", () => {
  return getInstallDate();
});

// User Signup
ipcMain.handle("signup", async (event, data, lan) => {
  if (event.sender === signupWindow.webContents) {
    try {
      const response = await addAdmin(data);
      if (response.success) {
        welcomeEmail(data, lan);
        signupWindow.close();
        createLoginWindow();
        return {
          success: true,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// User Login
ipcMain.handle("login", async (event, data) => {
  if (event.sender === loginWindow.webContents) {
    try {
      const response = await loginUser(data);
      if (response.success) {
        saveLogin(response.result);
        loginWindow.close();
        createMainWindow();
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Get Session Data
ipcMain.handle("get-session", () => {
  return sessionUser;
});

// Forgot Password
ipcMain.handle("forgotPassword", async (event, email, lan) => {
  if (event.sender === loginWindow.webContents) {
    try {
      const hasInternet = await hasRealInternet();
      if (!hasInternet.success) {
        return {
          success: false,
          error: hasInternet.error,
        };
      }

      const newPass = await generatePassword();
      const response = await insertNewPassword(email, newPass);

      if (response.success) {
        const responseEmail = await sendRecoveryEmail(email, newPass, lan);
        if (responseEmail.success) {
          return {
            success: true,
            result: responseEmail.result,
          };
        } else {
          return {
            success: false,
            error: responseEmail.error,
          };
        }
      } else {
        console.error("❌ ERROR:", response.error);
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Logout Session
ipcMain.on("logout", (event) => {
  if (event.sender === mainWindow.webContents) {
    const userName = sessionUser.name;
    mainWindow.close();
    createLoginWindow();
    sessionUser = null;
    console.info(`🔒 Logout session: ${userName}`);
  }
});

// Contact Devs
ipcMain.handle("contactDevs", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const hasInternet = await hasRealInternet();
      if (!hasInternet.success) {
        return {
          success: false,
          error: hasInternet.error,
        };
      }

      const response = await contactDevs(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

//* DASHBOARD LISTENERS ----------

//* Get Dashboard Data Page
ipcMain.handle("get-dashboard-data", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const [
        topSalesCategory,
        activeProductsCategory,
        investment,
        revenue,
        recentSales,
        accountsReceivable,
      ] = await Promise.all([
        getTopSalesCategory(data),
        getActiveProductsCategory(),
        getInvestment(),
        getRevenue(),
        getRecentSales(),
        getAccountsReceivable(),
      ]);

      return {
        success: true,
        result: {
          topSalesCategory,
          activeProductsCategory,
          investment,
          revenue,
          recentSales,
          accountsReceivable,
        },
      };
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

//* NEW SALE LISTENERS ----------

//* Get New Sale Data Page
ipcMain.handle("get-newsale-data", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const { idCategory, limit, offset } = data;
      const [categoryOptions, productsList, customersList, nextNumberSale] =
        await Promise.all([
          getCategoryOptions(),
          getProductsList(idCategory, limit, offset),
          getCustomersList(),
          getNextNumberSale(),
        ]);

      return {
        success: true,
        result: {
          categoryOptions,
          productsList,
          customersList,
          nextNumberSale,
        },
      };
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Get Search CodeSKU Table
ipcMain.handle("get-search-codesku-table", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await getSearchCodeSKU(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Get Products List by Category
ipcMain.handle("get-products-category", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const { idCategory, limit, offset } = data;
      const response = await getProductsList(idCategory, limit, offset);
      if (response.success) {
        return {
          success: true,
          result: response.result,
          totalCount: response.totalCount,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Get Filter Search Table Products (NEW SALE PAGE)
ipcMain.handle("get-filter-search-table", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await getFilterSearch(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

//* PRODUCTS LISTENERS ----------

//* Get Products Data Page
ipcMain.handle("get-products-data", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const { limit, offset } = data;
      const [investment, inventoryValue, productsStock, inventoryTable] =
        await Promise.all([
          getInvestment(),
          getInventoryValue(),
          getProductsStock(),
          getProducts(limit, offset),
        ]);

      return {
        success: true,
        result: {
          investment,
          inventoryValue,
          productsStock,
          inventoryTable,
        },
      };
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Get All Products
ipcMain.handle("get-all-products", async (event) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await getAllProducts();
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Delete Product
ipcMain.handle("deleteProduct", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await deleteProduct(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Get Filter Search Products
ipcMain.handle("get-filter-search-products", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await getFilterSearchProducts(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

//* HISTORY LISTENERS ----------

//* Get History Data Page
ipcMain.handle("get-history-data", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const { limit, offset } = data;

      const [
        salesNumber,
        pendingSalesAmount,
        discountsAmount,
        paidVSPendingNumber,
        historySales,
      ] = await Promise.all([
        getSalesNumberAmount(),
        getPendingSalesAmount(),
        getDiscountsAmount(),
        getPaidVSPendingNumber(),
        getHistorySales(limit, offset),
      ]);

      return {
        success: true,
        result: {
          salesNumber,
          pendingSalesAmount,
          discountsAmount,
          paidVSPendingNumber,
          historySales,
        },
      };
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
  }
});

// Get All History Sales
ipcMain.handle("get-all-history-sales", async (event) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await getAllHistorySales();
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Get Filter Search History Sales
ipcMain.handle("get-filter-search-history-sales", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await getFilterSearchHistorySales(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

//* CUSTOMERS LISTENERS ----------

//* Get Customers General Data Page
ipcMain.handle("get-customers-general-data", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const { limit, offset } = data;

      const [
        customersNumber,
        customersInDebtNumber,
        totalDebtAmount,
        lastCustomerNamePaid,
        customersTable,
      ] = await Promise.all([
        getCustomersNumber(),
        getCustomersInDebtNumber(),
        getPendingSalesAmount(),
        getLastCustomerNamePaid(),
        getCustomersTable(limit, offset),
      ]);

      return {
        success: true,
        result: {
          customersNumber,
          customersInDebtNumber,
          totalDebtAmount,
          lastCustomerNamePaid,
          customersTable,
        },
      };
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
  }
});

// Get All Customers
ipcMain.handle("get-all-customers", async (event) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await getAllCustomers();
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

//* Get Customers Payments Data Page
ipcMain.handle("get-customers-payments-data", async (event) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const [customersSelect] = await Promise.all([getCustomersSelect()]);

      return {
        success: true,
        result: {
          customersSelect,
        },
      };
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
  }
});

// Get Selected Customer Data
ipcMain.handle("get-selected-customer-data", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    const { id, limitDebts, offsetDebts, limitPayments, offsetPayments } = data;
    try {
      const [
        customerDebtsNumber,
        customerPaymentsNumber,
        customerTotalDebtAmount,
        customerTotalPaymentAmount,
        customerDebts,
        customerPayments,
      ] = await Promise.all([
        getCustomerDebtsNumber(id),
        getCustomerPaymentsNumber(id),
        getCustomerTotalDebtAmount(id),
        getCustomerTotalPaymentAmount(id),
        getCustomerDebtsTable(id, limitDebts, offsetDebts),
        getCustomerPaymentsTable(id, limitPayments, offsetPayments),
      ]);

      return {
        success: true,
        result: {
          customerDebtsNumber,
          customerPaymentsNumber,
          customerTotalDebtAmount,
          customerTotalPaymentAmount,
          customerDebts,
          customerPayments,
        },
      };
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
  }
});

// Get All Debts and Payments by Customer
ipcMain.handle("get-all-debts-payments", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const [allDebtsCustomer, allPaymentsCustomer] = await Promise.all([
        getAllDebtsCustomer(data),
        getAllPaymentsCustomer(data),
      ]);

      return {
        success: true,
        result: {
          allDebtsCustomer,
          allPaymentsCustomer,
        },
      };
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
  }
});

// Edit Customer
ipcMain.handle("editCustomer", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await editCustomer(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Delete Customer
ipcMain.handle("deleteCustomer", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await deleteCustomer(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Active Customer
ipcMain.handle("activeCustomer", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await activeCustomer(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Get Filter Search Customers
ipcMain.handle("get-filter-search-customers", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await getFilterSearchCustomers(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Get Customer Debts Data
ipcMain.handle("get-customer-debts-data", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await getCustomerDebts(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Get Filter Search Customers Debts (Payments)
ipcMain.handle("get-filter-search-customers-debts", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await getFilterSearchCustomersDebts(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Get Filter Search Customers Payments (Payments)
ipcMain.handle("get-filter-search-customers-payments", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await getFilterSearchCustomersPayments(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

//* REPORTS LISTENERS ----------

//* Get Reports Sales Data Page
ipcMain.handle("get-reports-sales-data", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const [
        inventoryValue,
        salesNumberAmount,
        salesByCategory,
        topSellingProducts,
        allHistorySales,
      ] = await Promise.all([
        getInventoryValue(data),
        getSalesNumberAmount(data),
        getSalesByCategory(data),
        getTopSellingProducts(data),
        getAllHistorySales(data),
      ]);

      return {
        success: true,
        result: {
          inventoryValue,
          salesNumberAmount,
          salesByCategory,
          topSellingProducts,
          allHistorySales,
        },
      };
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
  }
});

//* Get Reports Customers Data Page
ipcMain.handle("get-reports-customers-data", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const [
        salesPendingAmount,
        salesNumberAmount,
        customersStatus,
        debtsByCustomers,
        customers,
        customersSelect,
      ] = await Promise.all([
        getPendingSalesAmount(data),
        getSalesNumberAmount(data),
        getCustomersStatus(data),
        getDebtsByCustomers(data),
        getAllCustomers(data),
        getCustomersSelect(data),
      ]);

      return {
        success: true,
        result: {
          salesPendingAmount,
          salesNumberAmount,
          customersStatus,
          debtsByCustomers,
          customers,
          customersSelect,
        },
      };
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
  }
});

// Get Debts Over Time
ipcMain.handle("get-debts-over-time", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await getTotalDebtsOverTime(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
  }
});

//* Get Reports General Data Page
ipcMain.handle("get-reports-general-data", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const [
        investment,
        revenue,
        inventoryValue,
        salesNumberAmount,
        salesPendingAmount,
        customersStatus,
        productsStatus,
        salesByCategory,
        topSellingProducts,
        accountsReceivable,
      ] = await Promise.all([
        getInvestment(data),
        getRevenue(data),
        getInventoryValue(data),
        getSalesNumberAmount(data),
        getPendingSalesAmount(data),
        getCustomersStatus(data),
        getProductsStatus(data),
        getSalesByCategory(data),
        getTopSellingProducts(data),
        getAccountsReceivable(data),
      ]);

      return {
        success: true,
        result: {
          investment,
          revenue,
          inventoryValue,
          salesNumberAmount,
          salesPendingAmount,
          customersStatus,
          productsStatus,
          salesByCategory,
          topSellingProducts,
          accountsReceivable,
        },
      };
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
  }
});

//* Get Reports Products Data Page
ipcMain.handle("get-reports-products-data", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const [
        investment,
        revenue,
        inventoryValue,
        productsByCategory,
        topSellingProducts,
        productsStatus,
        products,
      ] = await Promise.all([
        getInvestment(data),
        getRevenue(data),
        getInventoryValue(data),
        getProductsByCategory(data),
        getTopSellingProducts(data),
        getProductsStatus(data),
        getAllProducts(data),
      ]);

      return {
        success: true,
        result: {
          investment,
          revenue,
          inventoryValue,
          productsByCategory,
          topSellingProducts,
          productsStatus,
          products,
        },
      };
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
  }
});

// Get Debts and Payments Customer (Date)
ipcMain.handle("get-debts-payments-customer-date", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const { id, currentFilters } = data;
      const [customerDebts, customerPayments] = await Promise.all([
        getCustomerDebtsTable(id, null, null, currentFilters),
        getCustomerPaymentsTable(id, null, null, currentFilters),
      ]);

      return {
        success: true,
        result: {
          customerDebts,
          customerPayments,
        },
      };
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
  }
});

//* SETTINGS LISTENERS ----------

//* Get Settings Data Page
ipcMain.handle("get-settings-data", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const { limitUsers, offsetUsers, limitCategories, offsetCategories } =
        data;

      const [users, categories] = await Promise.all([
        getUsers(limitUsers, offsetUsers),
        getCategories(limitCategories, offsetCategories),
      ]);

      return {
        success: true,
        result: {
          users,
          categories,
        },
      };
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Add User
ipcMain.handle("addUser", async (event, data, lan) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await addUser(data);
      if (response.success) {
        welcomeEmail(data, lan);
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Delete User
ipcMain.handle("deleteUser", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await deleteUser(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Edit User
ipcMain.handle("editUser", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await editUser(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Get Filter Search Users
ipcMain.handle("get-filter-search-users", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await getFilterSearchUsers(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Change Password
ipcMain.handle("changePassword", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await changePassword(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Upload Img
ipcMain.handle("uploadImg", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await uploadUserImage(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Edit Category
ipcMain.handle("editCategory", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await editCategory(data);

      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Delete Category
ipcMain.handle("deleteCategory", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await deteleCategory(data);

      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Get Filter Search Categories
ipcMain.handle("get-filter-search-categories", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await getFilterSearchCategories(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

//* MODAL SALE LISTENER ----------------

// Get Sale Data
ipcMain.handle("get-sale-data", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await getSaleData(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

//* MODAL NEW PAYMENT LISTENER ----------------

// Get Indebted Customers Data
ipcMain.handle("get-indebted-customers-data", async (event) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await getIndebtedCustomers();
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

//* MODAL NEW SALE LISTENER ----------------

// Create New Sale
ipcMain.handle("createNewSale", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await createNewSale(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
          result: response.result,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

//* MODAL ADD/EDIT PRODUCT LISTENER --------------------

// Add Product
ipcMain.handle("addProduct", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await addProduct(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Edit Product
ipcMain.handle("editProduct", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await editProduct(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Get Categories Select
ipcMain.handle("get-categories-select", async (event) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await getCategoriesSelect();
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

//* MODAL IMPORT PRODUCTS LISTENER --------------------

// Add Products Import
ipcMain.handle("addProductsImport", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await addProductsImport(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
          result: response.result,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

//* MODAL ADD PAYMENT LISTENER --------------------

// Add Payment Debt
ipcMain.handle("addPaymentDebt", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await addPaymentDebt(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Get Debt Detail Data
ipcMain.handle("get-debt-detail-data", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const [detailDebt, paymentsDebt] = await Promise.all([
        getDetailDebt(data),
        getPaymentsDebt(data),
      ]);
      return {
        success: true,
        result: {
          detailDebt,
          paymentsDebt,
        },
      };
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

//* MODAL ADD CUSTOMER LISTENER --------------------

// Add Customer
ipcMain.handle("addCustomer", async (event, data, lan) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await addCustomer(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

//* MODAL ADD CATEGORY LISTENER --------------------

// Add Category
ipcMain.handle("addCategory", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await addCategory(data);
      if (response.success) {
        return {
          success: true,
          result: response.result,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error("❌ ERROR: ", error);
    }
  } else {
    console.warn("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

//* INITIALIZATION
let isInitializing = false;
app.whenReady().then(async () => {
  if (isInitializing) return;
  isInitializing = true;

  protocol.handle("fide-pos", (request) => {
    const url = request.url.replace("fide-pos://", "");
    const filePath = path.join(app.getPath("userData"), "profile_images", url);
    return net.fetch(`file:///${filePath}`);
  });

  try {
    await createWelcomeWindow();
    await startApp();
    console.log("🚀 APP AND DB READY TO START");
  } catch (err) {
    console.error("Initialization error:", err);
  } finally {
    isInitializing = false;
  }

  await new Promise((r) => setTimeout(r, 3000));
  const isFirstRun = await firstRun();
  if (isFirstRun) {
    console.log(`✅ Is First Run: ${isFirstRun}`);
    registerInstallDate();
    welcomeWindow.close();
    createSignupWindow();
  } else {
    console.log(`❌ Is First Run: ${isFirstRun}`);
    welcomeWindow.close();
    createLoginWindow();
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createSignupWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
