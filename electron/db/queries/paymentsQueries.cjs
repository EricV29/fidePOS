const { getDB, saveDB, mapResultToObjects } = require("../database.cjs");
const bcrypt = require("bcrypt");
const AUTH_CODES = require("../../../constants/authCodes.json");

// Get Payments by Debt
async function getPaymentsDebt(idSale) {
  try {
    const db = await getDB();
    const params = [idSale];
    const sql = `SELECT id, created_at, amount, note FROM payment WHERE sale_id = ? ORDER BY created_at DESC;`;

    const query = db.exec(sql, params);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting payments debt:", error);
    return { success: false, error: error.message };
  }
}

// Add Payment Debt
async function addPaymentDebt(data) {
  try {
    const db = await getDB();
    const { idSale, payment_amount, note } = data;

    // Search Debt Sale
    const queryDebtSale = db.exec(
      "SELECT total_amount, paid_amount FROM sale WHERE id = ? AND status_id = 5;",
      [idSale],
    );

    const debtFound = mapResultToObjects(queryDebtSale);
    if (debtFound.length === 0) {
      return { success: false, error: AUTH_CODES.DEBT_NOT_FOUND };
    }

    const { total_amount, paid_amount } = debtFound[0];

    db.run("BEGIN TRANSACTION;");

    try {
      // Insert New Payment
      db.run("INSERT INTO payment(amount, note, sale_id) VALUES(?, ?, ?);", [
        payment_amount,
        note,
        idSale,
      ]);

      // Update Debt Sale Amount and Status
      db.run(
        "UPDATE sale SET paid_amount = paid_amount + ?, status_id = CASE WHEN (paid_amount + ?) >= total_amount THEN 4 ELSE 5 END WHERE id = ?;",
        [payment_amount, payment_amount, idSale],
      );

      db.run("COMMIT;");
    } catch (dbError) {
      db.run("ROLLBACK;");
      throw dbError;
    }

    saveDB(db);
    return { success: true, result: AUTH_CODES.DEBT_PAYMENT_SUCCESS };
  } catch (error) {
    console.error("Error inserting payment debt:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  getPaymentsDebt,
  addPaymentDebt,
};
