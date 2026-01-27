const { app, BrowserWindow, ipcMain, protocol } = require("electron");
const path = require("path");
const { getDB, saveDB, createSchema } = require("./db/database.cjs");
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
} = require("./db/queries/usersQueries.cjs");
const {
  getTopSalesCategory,
  getRevenue,
  getRecentSales,
  getSaleData,
} = require("./db/queries/salesQueries.cjs");
const {
  getActiveProductsCategory,
  getInvestment,
} = require("./db/queries/productsQueries.cjs");
const {
  getAccountsReceivable,
  getIndebtedCustomers,
  getCustomerDebts,
} = require("./db/queries/customersQueries.cjs");
const { getDetailDebt } = require("./db/queries/debtsQueries.cjs");
const { sendRecoveryEmail } = require("./utility/recoveryPassword.cjs");
const { welcomeEmail } = require("./utility/welcomeEmail.cjs");
const { hasRealInternet } = require("./utility/hasRealInternet.cjs");
const { contactDevs } = require("./utility/contactDevs.cjs");
const { generatePassword } = require("./utility/generatePassword.cjs");
require("dotenv").config();
const { uploadUserImage } = require("./utility/uploadUserImage.cjs");

const isDev = !app.isPackaged;

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
const { log } = require("console");
const { success } = require("zod");

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

//* START APP
async function startApp() {
  const db = await getDB();
  await createSchema(db);
}

//* FUNCTIONS

// Save Login
let sessionUser = null;
function saveLogin(userData) {
  sessionUser = userData;
  console.log(
    `✅ Session started for: ${sessionUser.name} ${sessionUser.last_name}`,
  );
}

//* LISTENERS

// Get Install Date
ipcMain.handle("getInstallDate", () => {
  return getInstallDate();
});

// User Signup Private
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
      console.log("❌ ERROR: ", error);
    }
  } else {
    console.log("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// User Login Private
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
      console.log("❌ ERROR: ", error);
    }
  } else {
    console.log("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Get Session Data
ipcMain.handle("get-session", () => {
  return sessionUser;
});

// Forgot Password Private
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
      console.log("❌ ERROR: ", error);
    }
  } else {
    console.log("❌ ERROR: NOT ALLOWED");
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
    console.log(`🔒 Logout session: ${userName}`);
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
      console.log("❌ ERROR: ", error);
    }
  } else {
    console.log("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Get Users
ipcMain.handle("get-users", async (event) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const response = await getUsers();
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
      console.log("❌ ERROR: ", error);
    }
  } else {
    console.log("❌ ERROR: NOT ALLOWED");
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
      console.log("❌ ERROR: ", error);
    }
  } else {
    console.log("❌ ERROR: NOT ALLOWED");
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
      console.log("❌ ERROR: ", error);
    }
  } else {
    console.log("❌ ERROR: NOT ALLOWED");
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
      console.log("❌ ERROR: ", error);
    }
  } else {
    console.log("❌ ERROR: NOT ALLOWED");
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
      console.log("❌ ERROR: ", error);
    }
  } else {
    console.log("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
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
      console.log("❌ ERROR: ", error);
    }
  } else {
    console.log("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Get Dashboard Data
ipcMain.handle("get-dashboard-data", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const { startDate, endDate } = data;
      const [
        topSalesCategory,
        activeProductsCategory,
        investment,
        revenue,
        recentSales,
        accountsReceivable,
      ] = await Promise.all([
        getTopSalesCategory(startDate, endDate),
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
      console.log("❌ ERROR: ", error);
    }
  } else {
    console.log("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

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
      console.log("❌ ERROR: ", error);
    }
  } else {
    console.log("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

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
      console.log("❌ ERROR: ", error);
    }
  } else {
    console.log("❌ ERROR: NOT ALLOWED");
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
      console.log("❌ ERROR: ", error);
    }
  } else {
    console.log("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

// Get Debt Dtail Data
ipcMain.handle("get-debt-detail-data", async (event, data) => {
  if (event.sender === mainWindow.webContents) {
    try {
      const [detailDebt, paymentsDebt] = await Promise.all([
        getDetailDebt(data),
        //getPaymentsDebt(data),
      ]);
      return {
        success: true,
        result: {
          detailDebt,
          //paymentsDebt,
        },
      };
    } catch (error) {
      console.log("❌ ERROR: ", error);
    }
  } else {
    console.log("❌ ERROR: NOT ALLOWED");
    return { success: false, error: "Not allowed" };
  }
});

//* INITIALIZATION
let isInitializing = false;
app.whenReady().then(async () => {
  if (isInitializing) return;
  isInitializing = true;

  protocol.registerFileProtocol("fide-pos", (request, callback) => {
    const url = request.url.replace("fide-pos://", "");
    const filePath = path.join(app.getPath("userData"), "profile_images", url);
    callback({ path: filePath });
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
