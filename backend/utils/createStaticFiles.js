const fs = require("fs");
const path = require("path");

// Define the paths
const rootPath = path.join(__dirname, "../", "uploads");
const usersPath = path.join(rootPath, "users");
const shapesPath = path.join(rootPath, "shapes");
const shopsPath = path.join(rootPath, "shops");
const colorsPath = path.join(rootPath, "colors");
const specialCardsPath = path.join(rootPath, "specialCards");
const designsPath = path.join(rootPath, "designs");

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

  if (!fs.existsSync(colorsPath)) {
    fs.mkdirSync(colorsPath);
    console.log("Created colors directory");
  }

  if (!fs.existsSync(specialCardsPath)) {
    fs.mkdirSync(specialCardsPath);
    console.log("Created specialCards directory");
  }

  if (!fs.existsSync(designsPath)) {
    fs.mkdirSync(designsPath);
    console.log("Created designs directory");
  }
}

module.exports = ensureDirectories;
