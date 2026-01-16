// preload.js (CommonJS)
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Install Date bridge
  getInstallDate: () => ipcRenderer.invoke("getInstallDate"),

  // getRoles bridge
  getRoles: () => ipcRenderer.invoke("getRoles"),

  // Singup bridge
  signup: (data) => ipcRenderer.invoke("signup", data),

  // Login bridge
  login: (data) => ipcRenderer.invoke("login", data),

  // Get session bridge
  getSession: (data) => ipcRenderer.invoke("get-session", data),

  // Forgot password bridge
  forgotPassword: (email, lan) =>
    ipcRenderer.invoke("forgotPassword", email, lan),

  // Logout bridge
  logoutSuccess: () => ipcRenderer.send("logout-success"),

  // message 1 bridge
  sendMessage: (msg) => ipcRenderer.send("message", msg),

  onMessageReply: (callback) => {
    ipcRenderer.on("message-reply", (_event, data) => callback(data));
  },

  // message 2 bridge
  sendMessagePrivate: (msg) => ipcRenderer.send("message_private", msg),

  onMessageReplyPrivate: (callback) => {
    ipcRenderer.on("message_private-reply", (_event, data) => callback(data));
  },
});
