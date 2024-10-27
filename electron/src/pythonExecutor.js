const { handleError } = require("./errorHandler");
const { execFile } = require("child_process");
const path = require("path");
const pythonExePath = path.join(__dirname, "../utils/main.exe");

function executeCoreOperation(operation, ...args) {
  return new Promise((resolve, reject) => {
    // Build the command arguments by spreading the args
    execFile(pythonExePath, [operation, ...args], (error, stdout, stderr) => {
      if (error) {
        handleError(`Error executing operation ${operation}: ${error.message}`);
        reject(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        handleError(`Stderr for operation ${operation}: ${stderr}`);
        reject(`Stderr: ${stderr}`);
        return;
      }

      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (parseError) {
        handleError(
          `Error parsing JSON response from operation ${operation}: ${parseError}`
        );
        reject(`Error parsing output: ${parseError}`);
      }
    });
  });
}

function runPythonScript() {
  return new Promise((resolve, reject) => {
    const pythonExecutablePath = path.join(__dirname, "../utils/signature.exe");

    execFile(pythonExecutablePath, (error, stdout, stderr) => {
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
  executeCoreOperation,
};
