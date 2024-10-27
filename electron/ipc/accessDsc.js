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
    return error;
  }
}

module.exports = {
  getListConnectedDsc,
};
