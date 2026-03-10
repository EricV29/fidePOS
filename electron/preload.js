// preload.js (CommonJS)
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Install Date
  getInstallDate: () => ipcRenderer.invoke("getInstallDate"),

  // Singup bridge
  signup: (data, lan) => ipcRenderer.invoke("signup", data, lan),

  // Login
  login: (data) => ipcRenderer.invoke("login", data),

  // Get session
  getSession: (data) => ipcRenderer.invoke("get-session", data),

  // Forgot password
  forgotPassword: (email, lan) =>
    ipcRenderer.invoke("forgotPassword", email, lan),

  // Logout
  logout: () => ipcRenderer.send("logout"),

  // Add user
  addUser: (data, lan) => ipcRenderer.invoke("addUser", data, lan),

  // Get session
  getUsers: (data) => ipcRenderer.invoke("get-users", data),

  // Delete user
  deleteUser: (data) => ipcRenderer.invoke("deleteUser", data),

  // Edit user
  editUser: (data) => ipcRenderer.invoke("editUser", data),

  // Change password
  changePassword: (data) => ipcRenderer.invoke("changePassword", data),

  // Upload Image
  uploadUserImage: (data) => ipcRenderer.invoke("uploadImg", data),

  // Contact Devs
  contactDevs: (data) => ipcRenderer.invoke("contactDevs", data),

  //* Get Dashboard Data Page
  getDashboardData: (data) => ipcRenderer.invoke("get-dashboard-data", data),

  // Get Sale Data
  getSaleData: (data) => ipcRenderer.invoke("get-sale-data", data),

  // Get Indebted Customers Data
  getIndebtedCustomers: () => ipcRenderer.invoke("get-indebted-customers-data"),

  // Get Customer Debts Data
  getCustomerDebts: (data) =>
    ipcRenderer.invoke("get-customer-debts-data", data),

  // Get Customer Debts Data
  getDebtDetail: (data) => ipcRenderer.invoke("get-debt-detail-data", data),

  // Add payment debt
  addPaymentDebt: (data) => ipcRenderer.invoke("addPaymentDebt", data),

  //* Get New Sale Data Page
  getNewSaleData: (data) => ipcRenderer.invoke("get-newsale-data", data),

  // Get Filter Search Table
  getFilterSearch: (data) =>
    ipcRenderer.invoke("get-filter-search-table", data),

  // Get Products List by Category
  getProductsCategory: (data) =>
    ipcRenderer.invoke("get-products-category", data),

  // Add Customer
  addCustomer: (data) => ipcRenderer.invoke("addCustomer", data),

  // Get Search CodeSKU Table
  getSearchCodeSKU: (data) =>
    ipcRenderer.invoke("get-search-codesku-table", data),

  // Create New Sale
  createNewSale: (data) => ipcRenderer.invoke("createNewSale", data),

  //* Get Products Data Page
  getProductsData: (data) => ipcRenderer.invoke("get-products-data", data),

  // Add Category
  addCategory: (data) => ipcRenderer.invoke("addCategory", data),

  // Get Filter Search Table Products
  getFilterSearchProducts: (data) =>
    ipcRenderer.invoke("get-filter-search-products", data),

  // Delete Product
  deleteProduct: (data) => ipcRenderer.invoke("deleteProduct", data),

  // Get Categories
  getCategoriesSelect: () => ipcRenderer.invoke("get-categories-select"),

  // Add Product
  addProduct: (data) => ipcRenderer.invoke("addProduct", data),

  // Edit Product
  editProduct: (data) => ipcRenderer.invoke("editProduct", data),

  // Add Products Import
  addProductsImport: (data) => ipcRenderer.invoke("addProductsImport", data),

  // Get All Products
  getAllProducts: () => ipcRenderer.invoke("get-all-products"),

  //* Get Hisotry Data Page
  getHistoryData: (data) => ipcRenderer.invoke("get-history-data", data),

  // Get Filter Search Table History Sales
  getFilterSearchHistorySales: (data) =>
    ipcRenderer.invoke("get-filter-search-history-sales", data),

  // Get All History Sales
  getAllHistorySales: () => ipcRenderer.invoke("get-all-history-sales"),

  //* Get Customers General Data Page
  getCustomersGeneralData: (data) =>
    ipcRenderer.invoke("get-customers-general-data", data),

  // Get Filter Search Table Customers
  getFilterSearchCustomers: (data) =>
    ipcRenderer.invoke("get-filter-search-customers", data),

  // Edit Customer
  editCustomer: (data) => ipcRenderer.invoke("editCustomer", data),

  // Delete Customer
  deleteCustomer: (data) => ipcRenderer.invoke("deleteCustomer", data),

  //* Get Customers Payments Data Page
  getCustomersPaymentsData: () =>
    ipcRenderer.invoke("get-customers-payments-data"),

  // Get Selected Customer Data
  getSelectedCustomerData: (data) =>
    ipcRenderer.invoke("get-selected-customer-data", data),

  // Get Filter Search Table Customers Debts (Payments)
  getFilterSearchCustomersDebts: (data) =>
    ipcRenderer.invoke("get-filter-search-customers-debts", data),

  // Get Filter Search Table Customers Payments (Payments)
  getFilterSearchCustomersPayments: (data) =>
    ipcRenderer.invoke("get-filter-search-customers-payments", data),

  // Get All Customers
  getAllCustomers: () => ipcRenderer.invoke("get-all-customers"),

  // Get All Debts and Payments by Customer
  getAllDebtsPayments: (data) =>
    ipcRenderer.invoke("get-all-debts-payments", data),

  // Active Customer
  activeCustomer: (data) => ipcRenderer.invoke("activeCustomer", data),

  //* Get Reports General Page
  getReportsGeneralData: (data) =>
    ipcRenderer.invoke("get-reports-general-data", data),

  //* Get Reports Sales Page
  getReportsSalesData: (data) =>
    ipcRenderer.invoke("get-reports-sales-data", data),

  //* Get Reports Products Page
  getReportsProductsData: (data) =>
    ipcRenderer.invoke("get-reports-products-data", data),

  //* Get Reports Customers Page
  getReportsCustomersData: (data) =>
    ipcRenderer.invoke("get-reports-customers-data", data),

  // Get Debts Over Time
  getDebtsOverTime: (data) => ipcRenderer.invoke("get-debts-over-time", data),
});
