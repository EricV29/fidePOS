const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");
const { app, safeStorage, dialog } = require("electron");
const crypto = require("crypto");
const { generateDBSecurity } = require("../utility/generateDBKeys.cjs");
const { generatePassword } = require("../utility/generatePassword.cjs");
const AUTH_CODES = require("../../constants/authCodes.json");
// C:\Users\user\AppData\Roaming\FidePOS or FidePOS-DEV

let PASSWORD, SALT, ENCRYPTION_KEY, ALGORITHM, dbPath, configPath;
let dbInstance = null;

//* START APP FUNCTIONS -----------------------

//* NEW DB
async function newDB() {
  try {
    const keys = await generateDBSecurity();
    await setupSecurity(keys);
    await createSchema();

    return { success: true, result: keys };
  } catch (err) {
    console.error("❌ Error new DB:", err);
    return { success: false, error: err.message };
  }
}

//* INITIALIZE AND SAVE ALL SECURITY (DB)
async function setupSecurity(dbKeys) {
  try {
    // Memory Config
    PASSWORD = dbKeys.db_password;
    SALT = dbKeys.db_salt;
    ENCRYPTION_KEY = crypto.scryptSync(PASSWORD, SALT, 32);
    ALGORITHM = "aes-256-cbc";

    // Paths
    const userDataPath = path.join(app.getPath("appData"), "fidepos");
    app.setPath("userData", userDataPath);

    configPath = path.join(userDataPath, "config.bin");
    dbPath = path.join(userDataPath, "app.db");

    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }

    // Create Object
    const fullConfig = {
      db_password: dbKeys.db_password,
      db_salt: dbKeys.db_salt,
      setup_date: new Date().toISOString(),
    };

    // Encrypt Object (SafeStorage)
    const configString = JSON.stringify(fullConfig);
    const secureBuffer = safeStorage.encryptString(configString);

    // Create .bin
    fs.writeFileSync(configPath, secureBuffer);

    console.log("🔐 CONFIG SUCCESSFULLY (DB)");
    return true;
  } catch (err) {
    console.error("❌ Error config setup credentials:", err);
    return false;
  }
}

//* LOAD SECURITY CONFIGS START APP
async function loadSecurityConfigs() {
  const userDataPath = path.join(app.getPath("appData"), "fidepos");
  const configPath = path.join(userDataPath, "config.bin");

  if (fs.existsSync(configPath)) {
    try {
      const encryptedConfig = fs.readFileSync(configPath);
      const decryptedConfig = safeStorage.decryptString(encryptedConfig);
      const config = JSON.parse(decryptedConfig);

      // ASSING VARIABLES
      PASSWORD = config.db_password;
      SALT = config.db_salt;
      ENCRYPTION_KEY = crypto.scryptSync(PASSWORD, SALT, 32);
      ALGORITHM = "aes-256-cbc";

      // ASSING DBPATH
      dbPath = path.join(userDataPath, "app.db");

      console.log("✅ LOAD CONFIG START APP.");
      return true;
    } catch (err) {
      console.error("❌ Error load config security:", err);
      return false;
    }
  }
  return false;
}

//* VERIFY DATABASE ACCESS
async function verifyDatabaseAccess(dbPath, data) {
  try {
    const { db_password } = data;

    const buffer = fs.readFileSync(dbPath);

    const SALT_LENGTH = 16;
    const IV_LENGTH = 16;
    const saltHex = buffer.subarray(0, SALT_LENGTH).toString("hex");
    const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const encryptedData = buffer.subarray(SALT_LENGTH + IV_LENGTH);

    const KEY = crypto.scryptSync(String(db_password), saltHex, 32);

    const decipher = crypto.createDecipheriv("aes-256-cbc", KEY, iv);
    const decryptedBuffer = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    const SQL = await initSqlJs();

    const db = new SQL.Database(new Uint8Array(decryptedBuffer));

    db.exec("SELECT name FROM sqlite_master WHERE type='table' LIMIT 1");

    db.close();

    console.log("✅ ACCESS DB SUCCESSFULLY");
    return { success: true };
  } catch (error) {
    console.error("❌ ERROR ACCESS DB WITH FILES:", error.message);
    return { success: false, error: AUTH_CODES.FILES_DB_INCORRECT };
  }
}

//* PREPARE FILE AND KEYS DB
//* PREPARE FILE AND KEYS DB
async function prepareFileKeysDB(originalDbPath, keys) {
  try {
    const userDataPath = path.join(app.getPath("appData"), "fidepos");
    const finalDbPath = path.join(userDataPath, "app.db");

    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }

    const originalBuffer = fs.readFileSync(originalDbPath);
    const SALT_LENGTH = 16;
    const saltHex = originalBuffer.subarray(0, SALT_LENGTH).toString("hex");
    const dbBuffer = originalBuffer.subarray(SALT_LENGTH);
    fs.writeFileSync(finalDbPath, dbBuffer);

    dbPath = finalDbPath;
    PASSWORD = keys.db_password;
    SALT = saltHex;
    ENCRYPTION_KEY = crypto.scryptSync(PASSWORD, SALT, 32);
    ALGORITHM = "aes-256-cbc";

    const configData = {
      db_password: keys.db_password,
      db_salt: saltHex,
    };

    const encryptedConfig = safeStorage.encryptString(
      JSON.stringify(configData),
    );
    const configPath = path.join(userDataPath, "config.bin");
    fs.writeFileSync(configPath, encryptedConfig);

    console.log("📦 IMPORT DB SUCCESSFULLY:", finalDbPath);
    return true;
  } catch (err) {
    console.error("❌ Error load import config security:", err);
    return false;
  }
}

//* DELETE ALL APP DATA (FACTORY RESET)
async function resetAppData() {
  try {
    const userDataPath = app.getPath("userData");

    dbInstance = null;
    PASSWORD = undefined;
    SALT = undefined;
    ENCRYPTION_KEY = undefined;
    ALGORITHM = undefined;
    dbPath = undefined;
    configPath = undefined;

    const targets = [
      path.join(userDataPath, "app.db"),
      path.join(userDataPath, "config.bin"),
      path.join(userDataPath, "profile_images"),
    ];

    for (const target of targets) {
      if (fs.existsSync(target)) {
        fs.rmSync(target, { recursive: true, force: true });
      }
    }

    console.log("🧹 APP DATA DELETED SUCCESSFULLY");
    return { success: true };
  } catch (err) {
    console.error("❌ Error deleting app data:", err);
    return { success: false, error: err.message };
  }
}

//* DATA BASE FUNCTIONS -----------------------

//* GET INSTANCE
async function getDB() {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();

  const encryptedBuffer = fs.readFileSync(dbPath);
  const iv = encryptedBuffer.subarray(0, 16);
  const data = encryptedBuffer.subarray(16);
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);

  dbInstance = new SQL.Database(decrypted);

  console.log("📦 GET DB INSTANCE");

  return dbInstance;
}

//* SAVE DATA BASE
async function saveDB(db) {
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const binaryData = db.export();
    const dbBuffer = Buffer.from(binaryData);

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

    const encrypted = Buffer.concat([
      iv,
      cipher.update(dbBuffer),
      cipher.final(),
    ]);

    fs.writeFileSync(dbPath, encrypted);
    console.log("💾 SAVE DB");
  } catch (err) {
    console.error("❌ Error save DB:", err);
  }
}

//* CREATE SCHEMA DB
async function createSchema() {
  const SQL = await initSqlJs();
  dbInstance = new SQL.Database();

  // CREATE SYSTEM TABLE
  dbInstance.run(`
  CREATE TABLE IF NOT EXISTS app (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT,
    install_date DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

  // INSERT O IGNORE
  dbInstance.run(`
  INSERT OR IGNORE INTO app (id, description) 
  VALUES (1, 'FidePOS');
`);

  // CREATE ROLE TABLE
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS role (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // CREATE SATUS TABLE
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // CREATE USER TABLE
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      password TEXT NOT NULL,
      img TEXT DEFAULT NULL,
      role_id INTEGER NOT NULL,
      status_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted_at DATETIME DEFAULT NULL,
      FOREIGN KEY (role_id) REFERENCES role(id),
      FOREIGN KEY (status_id) REFERENCES status(id)
    );
  `);

  // CREATE INDEX EMAIL UNIQUE USER TABLE
  dbInstance.run(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_user_email_active 
    ON user(email) 
    WHERE deleted_at IS NULL;
  `);

  // CREATE INDEX PHONE UNIQUE USER TABLE
  dbInstance.run(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_user_phone_active 
    ON user(phone) 
    WHERE deleted_at IS NULL;
  `);

  // CREATE CUSTOMER TABLE
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS customer (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      status_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted_at DATETIME DEFAULT NULL,
      FOREIGN KEY (status_id) REFERENCES status(id)
    );
  `);

  // CREATE CATEGORY TABLE
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS category (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      color TEXT NOT NULL,
      status_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted_at DATETIME DEFAULT NULL,
      FOREIGN KEY (status_id) REFERENCES status(id)
    );
  `);

  // CREATE PRODUCT TABLE
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS product (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code_sku TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category_id INTEGER NOT NULL,
      cost_price REAL NOT NULL,
      unit_price REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      status_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted_at DATETIME DEFAULT NULL,
      FOREIGN KEY (category_id) REFERENCES category(id),
      FOREIGN KEY (status_id) REFERENCES status(id)
    );
  `);

  // CREATE SALE TABLE
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS sale (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_num INT UNIQUE NOT NULL,
      total_amount REAL NOT NULL,
      paid_amount REAL NOT NULL,
      discount REAL NOT NULL,
      customer_id INTEGER,
      status_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted_at DATETIME DEFAULT NULL,
      FOREIGN KEY (status_id) REFERENCES status(id),
      FOREIGN KEY (customer_id) REFERENCES customer(id),
      FOREIGN KEY (user_id) REFERENCES user(id)
    );
  `);

  // CREATE SALE DETAIL TABLE
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS sale_detail (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      cost_price REAL NOT NULL,
      subt_price REAL NOT NULL,
      status_id INTEGER NOT NULL,
      FOREIGN KEY (sale_id) REFERENCES sale(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES product(id),
      FOREIGN KEY (status_id) REFERENCES status(id)
    );
  `);

  // CREATE PAYMENT TABLE
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS payment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      note TEXT,
      sale_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sale_id) REFERENCES sale(id)
    );
  `);

  // CREATE ENTRIES TABLE
  dbInstance.run(`
      CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        cost_price REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES product(id)
      );
    `);

  // SEED DATA FOR ROLES
  const countRole =
    dbInstance.exec("SELECT COUNT(*) AS count FROM role;")[0]?.values[0][0] ||
    0;
  if (countRole === 0) {
    dbInstance.run("INSERT INTO role (id, description) VALUES (?, ?);", [
      "1",
      "admin",
    ]);
    dbInstance.run("INSERT INTO role (id, description) VALUES (?, ?);", [
      "2",
      "user",
    ]);
    shouldSave = true;
  }

  // SEED DATA FOR STATUS
  const countStatus =
    dbInstance.exec("SELECT COUNT(*) AS count FROM status;")[0]?.values[0][0] ||
    0;
  if (countStatus === 0) {
    dbInstance.run("INSERT INTO status (id, description) VALUES (?, ?);", [
      "0",
      "inactive",
    ]);
    dbInstance.run("INSERT INTO status (id, description) VALUES (?, ?);", [
      "1",
      "active",
    ]);
    dbInstance.run("INSERT INTO status (id, description) VALUES (?, ?);", [
      "3",
      "debt",
    ]);
    dbInstance.run("INSERT INTO status (id, description) VALUES (?, ?);", [
      "4",
      "paid",
    ]);
    dbInstance.run("INSERT INTO status (id, description) VALUES (?, ?);", [
      "5",
      "unpaid",
    ]);
    shouldSave = true;
  }

  // SEED DATA FOR VIEWS
  //? v_accounts_receivable
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_accounts_receivable AS
    SELECT 
        s.id AS idSale,
        cu.id AS idCustomer,
        cu.name,
        cu.last_name,
        GROUP_CONCAT(p.code_sku, ', ') AS code_sku, 
        s.total_amount AS debt_amount, 
        s.paid_amount AS debt_paid,
        (s.total_amount - s.paid_amount) AS debt_pending, 
        s.created_at 
    FROM sale_detail sd 
    INNER JOIN sale s ON sd.sale_id = s.id
    INNER JOIN product p ON sd.product_id = p.id
    INNER JOIN customer cu ON s.customer_id = cu.id
    WHERE sd.status_id = 5
    GROUP BY s.id
    ORDER BY s.created_at DESC;
  `);

  //? v_active_products_by_category
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_active_products_by_category AS
    SELECT 
      c.name AS category, 
      count(p.id) AS products
    FROM category c
    INNER JOIN product p ON c.id = p.category_id
    WHERE p.status_id = 1
    GROUP BY c.name
    ORDER BY products DESC;
  `);

  //? v_all_customers
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_all_customers AS
    SELECT 
      c.id,
      c.name,
      c.last_name,
      c.phone,
      s.description AS status,
      COUNT(CASE WHEN sl.status_id = 5 THEN 1 END) AS debts_number,
      SUM(CASE WHEN sl.status_id = 5 THEN total_amount ELSE 0 END) AS debts_amount,
      SUM(CASE WHEN sl.status_id = 5 THEN paid_amount ELSE 0 END) AS debts_paid,
      c.created_at,
      c.deleted_at
    FROM customer c
    INNER JOIN status s ON c.status_id = s.id
    LEFT JOIN sale sl ON c.id = sl.customer_id
    GROUP BY c.id
    ORDER BY c.created_at DESC;
  `);

  //? v_all_history_sales
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_all_history_sales AS
    SELECT 
      s.id,
      s.sale_num,
      c.name,
      c.last_name,
      GROUP_CONCAT(p.name, ', ') AS products,
      s.total_amount,
      s.paid_amount,
      (s.total_amount - s.paid_amount) AS pending_amount,
      s.discount,
      st.description as status,
      s.user_id,
      s.created_at,
      s.deleted_at 
    FROM sale s
    LEFT JOIN customer c ON s.customer_id = c.id
    INNER JOIN status st ON s.status_id = st.id
    LEFT JOIN sale_detail sd ON s.id = sd.sale_id
    LEFT JOIN product p ON sd.product_id = p.id 
    GROUP BY s.id
    ORDER BY s.created_at DESC;
  `);

  //? v_all_products
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_all_products AS
    SELECT 
        p.id, 
        p.code_sku, 
        p.name AS product, 
        p.description, 
        c.name AS category, 
        c.color AS ccolor,
        p.cost_price,
        p.unit_price,
        p.stock,
        s.description AS status, 
        p.created_at,
        p.deleted_at  
    FROM product p
    INNER JOIN category c ON p.category_id = c.id
    INNER JOIN status s ON p.status_id  = s.id
    ORDER BY p.created_at DESC;
  `);

  //? v_categories_active_select
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_categories_active_select AS
    SELECT id, name
    FROM category
    WHERE status_id = 1;
  `);

  //? v_category_options
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_category_options AS
    SELECT 
      c.id, 
      COUNT(p.id) AS products, 
      c.name AS category
    FROM product p
    INNER JOIN category c ON p.category_id = c.id
    WHERE c.status_id = 1
    GROUP BY c.id
    ORDER BY products DESC;
  `);

  //? v_customers_in_debt_number
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_customers_in_debt_number AS
    SELECT COUNT(id) AS customersInDebtNumber
    FROM customer
    WHERE status_id IN (3);
  `);

  //? v_customers_number
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_customers_number AS
    SELECT COUNT(id) AS customersNumber
    FROM customer
    WHERE status_id IN (1, 3);
  `);

  //? v_customers_select
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_customers_select AS
    SELECT id, name, last_name
    FROM customer;
  `);

  //? v_discounts_amount
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_discounts_amount AS
    SELECT SUM(discount) AS discountsAmount
    FROM sale;
  `);

  //? v_inventory_value
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_inventory_value AS
    SELECT COALESCE(SUM(cost_price * stock),0) AS inventory_value 
    FROM product
    WHERE status_id = 1;
  `);

  //? v_investment
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_investment AS
    SELECT sum(cost_price) AS investment
    FROM entries;
  `);

  //? v_last_customer_name_paid
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_last_customer_name_paid AS
    SELECT 
      (c.name || ' ' || c.last_name) AS lastCustomerNamePaid, 
      p.created_at  
    FROM payment p
    INNER JOIN sale s ON p.sale_id = s.id
    INNER JOIN customer c ON s.customer_id = c.id
    WHERE s.status_id = 5
    ORDER BY p.created_at  DESC
    LIMIT 1;
  `);

  //? v_paid_vs_pending_number
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_paid_vs_pending_number AS
    SELECT
      COUNT(CASE WHEN status_id = 4 THEN id END) AS Paid,
      COUNT(CASE WHEN status_id = 5 THEN id END) AS Pending
    FROM sale;
  `);

  //? v_pending_sales_amount
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_pending_sales_amount AS
    SELECT SUM(total_amount - paid_amount) AS pendingSalesAmount
    FROM sale
    WHERE status_id = 5;
  `);

  //? v_products_stock
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_products_stock AS
    SELECT 
        SUM(CASE WHEN stock > 0 THEN stock ELSE 0 END) AS Stock,
        SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) AS 'No Stock'
    FROM product
    WHERE status_id = 1;
  `);

  //? v_recent_sales_products
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_recent_sales_products AS
    SELECT 
      s.id, 
      s.sale_num, 
      s.created_at, 
      c.name AS category, 
      c.color AS ccolor, 
      s.total_amount   
    FROM sale_detail sd 
    INNER JOIN sale s ON sd.sale_id = s.id
    INNER JOIN product p ON sd.product_id  = p.id
    INNER JOIN category c ON p.category_id = c.id
    WHERE sd.status_id = 4
    ORDER BY s.created_at DESC
    LIMIT 5;
  `);

  //? v_revenue
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_revenue AS
    SELECT SUM((subt_price - cost_price) * quantity) AS revenue
    FROM sale_detail
    WHERE status_id = 4;
  `);

  //? v_sales_amount
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_sales_amount AS
    SELECT SUM(subt_price) salesAmount
    FROM sale_detail
    WHERE status_id = 4;
  `);

  //? v_sales_number
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_sales_number AS
    SELECT COUNT(id) AS salesNumber
    FROM sale
    WHERE status_id = 4;
  `);

  //? v_total_debt_amount
  dbInstance.run(`
    CREATE VIEW IF NOT EXISTS v_total_debt_amount AS
    SELECT SUM(total_amount - paid_amount) AS totalDebtAmount
    FROM sale
    WHERE status_id = 5;
  `);

  await saveDB(dbInstance);
  console.log("📦 DB CREATED SUCCESSFULLY");
}

//* Mapping results
function mapResultToObjects(result) {
  if (!result[0]) return [];

  const columns = result[0].columns;
  const values = result[0].values;

  return values.map((row) => {
    const obj = {};
    row.forEach((val, i) => {
      obj[columns[i]] = val;
    });
    return obj;
  });
}

//* Helper >1 rows return
async function queryAll(sql, params = []) {
  const db = await getDB();
  const stmt = db.prepare(sql);
  const rows = [];
  try {
    stmt.bind(params);
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
  } finally {
    stmt.free();
  }
  return rows;
}

//* Helper 1 row return
async function queryOne(sql, params = []) {
  const db = await getDB();
  const stmt = db.prepare(sql);
  try {
    stmt.bind(params);
    return stmt.step() ? stmt.getAsObject() : null;
  } finally {
    stmt.free();
  }
}

//* Helper run query
async function runQuery(sql, params = []) {
  const db = await getDB();
  db.run(sql, params);
  await saveDB(db);
  return { success: true };
}

//* EXPORT DATABASE FOR MIGRATION
async function exportDatabase() {
  try {
    // 1. Generate random password for export
    const exportPassword = await generatePassword(16);

    // 2. Read current encrypted DB
    const encryptedBuffer = fs.readFileSync(dbPath);

    // 3. Decrypt with current keys
    const iv = encryptedBuffer.subarray(0, 16);
    const encryptedData = encryptedBuffer.subarray(16);
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    // 4. Generate new salt and key for export
    const newSalt = crypto.randomBytes(16).toString("hex");
    const newKey = crypto.scryptSync(exportPassword, newSalt, 32);
    const newIv = crypto.randomBytes(16);

    // 5. Re-encrypt with new password
    const cipher = crypto.createCipheriv("aes-256-cbc", newKey, newIv);
    const reEncrypted = Buffer.concat([
      newIv,
      cipher.update(decrypted),
      cipher.final(),
    ]);

    // 6. Save dialog
    const dateStr = new Date().toISOString().slice(0, 10);
    const { filePath } = await dialog.showSaveDialog({
      defaultPath: `FidePOS_Backup_${dateStr}.db`,
      filters: [{ name: "Database", extensions: ["db"] }],
    });

    if (filePath) {
      const saltBuffer = Buffer.from(newSalt, "hex");
      const fileBuffer = Buffer.concat([saltBuffer, reEncrypted]);
      fs.writeFileSync(filePath, fileBuffer);
      console.log("📦 DATABASE EXPORTED SUCCESSFULLY:", filePath);
      return { success: true, password: exportPassword };
    }

    return { success: false, error: "Export cancelled" };
  } catch (err) {
    console.error("❌ Error exporting database:", err);
    return { success: false, error: err.message };
  }
}

module.exports = {
  getDB,
  saveDB,
  createSchema,
  mapResultToObjects,
  queryAll,
  queryOne,
  runQuery,
  newDB,
  loadSecurityConfigs,
  verifyDatabaseAccess,
  prepareFileKeysDB,
  resetAppData,
  exportDatabase,
};
