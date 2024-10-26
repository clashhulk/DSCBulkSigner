const { executeCoreOperation } = require("../src/pythonExecutor");

function add() {
  return executeCoreOperation("add", "5", "5");
}

async function getListConnectedDsc() {
  try {
    const result = await executeCoreOperation(
      "listConnectedDsc",
      "C:/Windows/System32/SignatureP11.dll"
    );
    return result;
  } catch (error) {
    console.error("Failed to get list of connected DSCs:", error);
    // Optionally, rethrow the error or handle it differently
    // throw error; // Uncomment if you want to propagate the error upwards
    return error; // Return null or any other appropriate value on failure
  }
}

module.exports = {
  getListConnectedDsc,
};
