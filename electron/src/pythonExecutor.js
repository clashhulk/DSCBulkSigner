// src/pythonExecutor.js
const { exec } = require("child_process");
const path = require("path");
const { handleError } = require("./errorHandler");

function runPythonScript() {
  return new Promise((resolve, reject) => {
    const pythonExecutablePath = path.join(__dirname, "../utils/signature.exe");

    exec(pythonExecutablePath, (error, stdout, stderr) => {
      if (error) {
        handleError(`Error executing Python script: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        handleError(`Python script error output: ${stderr}`);
        reject(new Error(stderr));
        return;
      }

      resolve(stdout.trim());
    });
  });
}

module.exports = {
  runPythonScript,
};
