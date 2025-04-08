const argon2 = require("argon2");
const model = require("../../models/auth.model");
const api = require("../../tools/common");
const { generateToken } = require("../../services/auth.service");
const logService = require("../../services/log.service");

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return api.error(res, "Please provide both username and password", 400);
  }

  try {
    const user = await model.login(username);
    if (!user) {
      return api.error(res, "Account Not Found", 404);
    }

    // console.log(user);
    // ✅ Gunakan await saat memverifikasi password
    const passwordIsMatch = await verifyPassword(password, user.password);
    if (!passwordIsMatch) {
      return api.error(res, "Incorrect Password!", 400);
    }

    const payload = {
      id: user.id,
      username: user.username,
      jabatan: user.jabatan,
    };
    const token = generateToken(payload);
    logService.log(`${payload.username} Berhasil Login`, "SUCCESSFULLY");
    return api.ok(res, { token, user: payload });
  } catch (error) {
    console.error("❌ Error logging in:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    return await argon2.verify(hashedPassword, plainPassword);
  } catch (err) {
    console.error("❌ Error verifying password:", err);
    throw err;
  }
};

module.exports = {
  login,
};
