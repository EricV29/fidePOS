const { app } = require("electron");
const fs = require("fs");
const path = require("path");

function registerInstallDate() {
  const userData = app.getPath("userData");
  const filePath = path.join(userData, "install.json");

  if (!fs.existsSync(filePath)) {
    const data = {
      installed: new Date().toISOString(),
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

    return data.installed;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const json = JSON.parse(raw);

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
