const { getDB } = require("../database/db.config");

const login = async (username) => {
  const db = getDB();
  const safeUsername = username.replace(/'/g, "''");

  const query = `SELECT id, username, password, jabatan FROM Users WHERE username = '${safeUsername}'`;
  const result = await db.query(query);

  return result.length > 0 ? result[0] : null;
};

module.exports = {
  login,
};
