const { initDatabase } = require("./db/database.cjs");

let dbInstance = null;

// Inicializa o reutiliza la DB
async function getDB() {
  if (!dbInstance) {
    dbInstance = await initDatabase();
  }
  return dbInstance;
}

async function firstRun() {
  const db = await getDB();

  return new Promise((resolve) => {
    db.get("SELECT COUNT(*) as total FROM user", (err, row) => {
      if (err) {
        console.error("Error checking first run:", err);
        resolve(true); // fallback seguro
      } else {
        resolve(row.total === 0);
      }
    });
  });
}

module.exports = { firstRun };
