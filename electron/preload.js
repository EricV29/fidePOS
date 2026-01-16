// preload.js (CommonJS)
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Install Date bridge
  installDate: () => ipcRenderer.invoke("installDate"),

  // getRoles bridge
  getRoles: () => ipcRenderer.invoke("getRoles"),

  // Singup bridge
  signup: (data) => ipcRenderer.send("signup", data),
  signupReply: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on("signup-reply", listener);

    return () => {
      ipcRenderer.removeListener("signup-reply", listener);
    };
  },

  // Login bridge
  login: (data) => ipcRenderer.invoke("login", data),

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
