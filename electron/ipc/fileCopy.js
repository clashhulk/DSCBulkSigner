const fs = require("fs");
const path = require("path");
const { dialog } = require("electron");

async function selectFolder() {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  return result.filePaths[0];
}

async function copyFiles(sourcePath, destinationPath) {
  try {
    const files = fs.readdirSync(sourcePath);

    for (const file of files) {
      const sourceFile = path.join(sourcePath, file);
      const destFile = path.join(destinationPath, file);

      fs.copyFileSync(sourceFile, destFile);
    }

    return "Files copied successfully!";
  } catch (error) {
    return `Error copying files: ${error.message}`;
  }
}

module.exports = {
  selectFolder,
  copyFiles,
};
