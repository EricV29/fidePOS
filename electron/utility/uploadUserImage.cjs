const fs = require("fs");
const path = require("path");
const { app } = require("electron");
const { initDatabase, saveDB } = require("../db/database.cjs");
const AUTH_CODES = require("../../constants/authCodes.json");

let dbInstance = null;

async function getDB() {
  if (!dbInstance) {
    dbInstance = await initDatabase();
  }
  return dbInstance;
}

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

async function uploadUserImage(data) {
  try {
    const db = await getDB();

    const { userId, fileArrayBuffer, fileName } = data;

    const uploadPath = path.join(app.getPath("userData"), "profile_images");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const userQuery = db.exec("SELECT img FROM user WHERE id = ?", [userId]);
    const userData = mapResultToObjects(userQuery)[0];

    if (userData && userData.img) {
      const oldFilePath = path.join(uploadPath, userData.img);

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
        console.log("🗑️ Delete img:", userData.img);
      }
    }

    const fileExtension = path.extname(fileName);
    const newFileName = `user_${userId}_${Date.now()}${fileExtension}`;
    const filePath = path.join(uploadPath, newFileName);

    fs.writeFileSync(filePath, Buffer.from(fileArrayBuffer));

    db.run("UPDATE user SET img = ? WHERE id = ?", [newFileName, userId]);
    saveDB(db);

    return { success: true, result: AUTH_CODES.IMAGE_UPLOAD };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, error: error.message };
  }
}

module.exports = { uploadUserImage };
