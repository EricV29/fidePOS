const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { initDatabase } = require("./db/database.cjs");
const { getRoles } = require("./db/queries.cjs");
const { firstRun } = require("./firstRun.cjs");

const isDev = !app.isPackaged;

function getPageUrl(route = "") {
  if (isDev) {
    return `http://localhost:6969/#/${route}`;
  } else {
    const distPath = path.join(
      process.resourcesPath,
      "app.asar",
      "dist",
      "index.html"
    );
    return `file://${distPath}#/${route}`;
  }
}

const {
  registerInstallDate,
  getInstallDate,
} = require("./installDateManager.cjs");

let welcomeWindow = null;
let mainWindow = null;
let loginWindow = null;
let signupWindow = null;

//* CREATE WINDOWS

// Welcome Window
function createWelcomeWindow() {
  splash = new BrowserWindow({
    width: 300,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
  });

  welcomeWindow = new BrowserWindow({
    width: 600,
    height: 450,
    resizable: false,
    frame: false,
    titleBarStyle: "hidden",
    titleBarOverlay: false,
    autoHideMenuBar: true,
    backgroundColor: "#F57C00",
    icon: path.join(__dirname, "../public/fidelogo.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
    show: false,
  });

  const url = getPageUrl("welcome");
  welcomeWindow.loadURL(url);

  welcomeWindow.webContents.on("did-finish-load", () => {
    if (splash && !splash.isDestroyed()) {
      splash.close();
      splash = null;
    }

    welcomeWindow.show();
  });

  welcomeWindow.on("closed", () => {
    welcomeWindow = null;
  });
}

// Signup Window
function createSignupWindow() {
  splash = new BrowserWindow({
    width: 300,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
  });

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
    splash.close();
    signupWindow.show();
  });

  signupWindow.on("closed", () => {
    signupWindow = null;
  });
}

// Login Window
function createLoginWindow() {
  splash = new BrowserWindow({
    width: 300,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
  });

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
    splash.close();
    loginWindow.show();
  });

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
    show: false,
  });

  const url = getPageUrl("main");
  mainWindow.maximize();
  mainWindow.loadURL(url);

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

//* DATABASE CONSULTS

// Consult getRoles
ipcMain.handle("getRoles", async () => {
  return await getRoles();
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
  //await initDatabase();
  createWelcomeWindow();
  //registerInstallDate();
  //createSignupWindow();
  //createLoginWindow();
  //createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createSignupWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
