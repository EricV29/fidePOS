// preload.js (CommonJS)
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Install Date bridge
  getInstallDate: () => ipcRenderer.invoke("getInstallDate"),

  // Singup bridge
  signup: (data, lan) => ipcRenderer.invoke("signup", data, lan),

  // Login bridge
  login: (data) => ipcRenderer.invoke("login", data),

  // Get session bridge
  getSession: (data) => ipcRenderer.invoke("get-session", data),

  // Forgot password bridge
  forgotPassword: (email, lan) =>
    ipcRenderer.invoke("forgotPassword", email, lan),

  // Logout bridge
  logout: () => ipcRenderer.send("logout"),

  // Add user bridge
  addUser: (data, lan) => ipcRenderer.invoke("addUser", data, lan),

  // getRoles bridge
  getRoles: () => ipcRenderer.invoke("getRoles"),

  /*
  
  onMessageReplyPrivate: (callback) => {
    ipcRenderer.on("message_private-reply", (_event, data) => callback(data));
  },
  */
});
