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

  // Get Dashboard Data
  getDashboardData: (data) => ipcRenderer.invoke("get-dashboard-data", data),

  // Get Sale Data
  getSaleData: (data) => ipcRenderer.invoke("get-sale-data", data),

  // Get Indebted Customers Data
  getIndebtedCustomers: () => ipcRenderer.invoke("get-indebted-customers-data"),

  // Get Customer Debts Data
  getCustomerDebts: (data) =>
    ipcRenderer.invoke("get-customer-debts-data", data),
});
