const { app } = require("electron");
const fs = require("fs");
const path = require("path");

function registerInstallDate() {
  const userData = app.getPath("userData");
  const filePath = path.join(userData, "install.json");

  // Si no existe, se crea
  if (!fs.existsSync(filePath)) {
    const data = {
      installed: new Date().toISOString(),
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

    console.log("Fecha de instalación registrada:", data.installed);
    return data.installed;
  }

  // Si existe, la leemos
  const raw = fs.readFileSync(filePath, "utf-8");
  const json = JSON.parse(raw);

  console.log("Fecha de instalación existente:", json.installed);
  return json.installed;
}

function getInstallDate() {
  const userData = app.getPath("userData");
  const filePath = path.join(userData, "install.json");

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const json = JSON.parse(raw);

  return json.installed;
}

module.exports = { registerInstallDate, getInstallDate };
