const fs = require("fs");
const path = require("path");

// Define the paths
const rootPath = path.join(__dirname, "../", "uploads");
const usersPath = path.join(rootPath, "users");
const shapesPath = path.join(rootPath, "shapes");
const shopsPath = path.join(rootPath, "shops");

function ensureDirectories() {
  if (!fs.existsSync(rootPath)) {
    fs.mkdirSync(rootPath);
    console.log("Created uploads directory");
  }

  if (!fs.existsSync(usersPath)) {
    fs.mkdirSync(usersPath);
    console.log("Created users directory");
  }

  if (!fs.existsSync(shapesPath)) {
    fs.mkdirSync(shapesPath);
    console.log("Created shapes directory");
  }

  if (!fs.existsSync(shopsPath)) {
    fs.mkdirSync(shopsPath);
    console.log("Created shops directory");
  }
}

module.exports = ensureDirectories;
