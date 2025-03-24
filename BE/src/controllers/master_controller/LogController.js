const api = require("../../tools/common");
const logService = require("../../services/log.service");
const addLog = async (req, res) => {
  try {
    const data = req.body;
    logService.log(data.messege, data.level);
    return api.ok(res, "Log added successfully");
  } catch (error) {
    return api.error(res, "Log added failed", 500);
  }
};

module.exports = {
  addLog,
};
