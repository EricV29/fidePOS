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

  // getRoles
  getRoles: () => ipcRenderer.invoke("getRoles"),

  /*
  
  onMessageReplyPrivate: (callback) => {
    ipcRenderer.on("message_private-reply", (_event, data) => callback(data));
  },
  */
});
