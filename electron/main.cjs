const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");

const isDev = !app.isPackaged;

const dbModulePath = isDev
  ? path.join(__dirname, "db", "database.cjs")
  : path.join(process.resourcesPath, "db", "database.cjs");

let dbModule = null;
try {
  dbModule = require(dbModulePath);
} catch (err) {
  console.error("Error loading DB module:", err);
}

const {
  registerInstallDate,
  getInstallDate,
} = require("./installDateManager.cjs");

let mainWindow = null;
let loginWindow = null;
let signupWindow = null;

//* CREATE WINDOWS

// Signup Window
function createSignupWindow() {
  signupWindow = new BrowserWindow({
    width: 650,
    height: 700,
    resizable: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "../public/fidelogo.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  signupWindow.loadURL("http://localhost:6969/signup");
  signupWindow.on("closed", () => {
    signupWindow = null;
  });
}

// Login Window
function createLoginWindow() {
  loginWindow = new BrowserWindow({
    width: 650,
    height: 700,
    resizable: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "../public/fidelogo.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  loginWindow.loadURL("http://localhost:6969/login");
  loginWindow.on("closed", () => {
    loginWindow = null;
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
  });

  mainWindow.maximize();
  mainWindow.loadURL("http://localhost:6969/main");
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

//* GLOBAL LISTENER

// Open login
ipcMain.on("signup-success", () => {
  if (signupWindow) signupWindow.close();
  createLoginWindow();
});

// Open dashboard
ipcMain.on("login-success", () => {
  if (loginWindow) loginWindow.close();
  createMainWindow();
});

// Logout
ipcMain.on("logout-success", () => {
  if (mainWindow) mainWindow.close();
  createLoginWindow();
});

// Get Install Date
ipcMain.handle("installDate", () => {
  return getInstallDate();
});

// Global message
ipcMain.on("message", (event, msg) => {
  console.log("Message received:", msg);
  event.sender.send("message-reply", `Message: ${msg}`);
});

//* PRIVATE LISTENER

// Message private
ipcMain.on("message_private", (event, msg) => {
  if (event.sender === mainWindow.webContents) {
    console.log("Message received:", msg);
    event.sender.send("message-private-reply", `Message: ${msg}`);
  } else {
    console.log("Not allowed");
    event.reply("message-private-reply", { error: "Not allowed" });
  }
});

//* INITIALIZATION
app.whenReady().then(async () => {
  await dbModule.initDatabase();
  registerInstallDate();
  createSignupWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createSignupWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
