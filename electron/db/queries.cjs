const { initDatabase } = require("./database.cjs");

let dbInstance = null;

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

// Inicializa o reutiliza la DB
async function getDB() {
  if (!dbInstance) {
    dbInstance = await initDatabase();
  }
  return dbInstance;
}

// First Run
async function firstRun() {
  try {
    const db = await getDB();
    const result = db.exec("SELECT COUNT(*) as total FROM user");
    const rows = mapResultToObjects(result);

    return rows[0]?.total === 0;
  } catch (error) {
    console.error("Error checking first run:", error);
    return true;
  }
}

// Get Roles
async function getRoles() {
  const db = await getDB();
  const result = db.exec("SELECT id, code, description, created_at FROM rol;");
  return mapResultToObjects(result);
}

module.exports = {
  getRoles,
  firstRun,
};
