const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { initDatabase } = require("./db/database.cjs");
const { getRoles, firstRun } = require("./db/queries.cjs");

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
  await createWelcomeWindow();
  await initDatabase();

  await new Promise((r) => setTimeout(r, 3000));
  const isFirstRun = await firstRun();
  if (!isFirstRun) {
    console.log(isFirstRun);
    registerInstallDate();
    welcomeWindow.close();
    createSignupWindow();
  } else {
    console.log(isFirstRun);
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
