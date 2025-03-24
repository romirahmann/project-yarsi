const argon2 = require("argon2");
const model = require("../../models/user.model");
const api = require("../../tools/common");

const register = async (req, res) => {
  const newUser = req.body;
  try {
    // Dapatkan tanggal saat ini dengan format YYYY/MM/DD
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Tambahkan leading zero
    const day = String(now.getDate()).padStart(2, "0");

    newUser.trn_date = `${year}/${month}/${day}`;

    newUser.password = await hashPassword(newUser.password);
    let data = await model.createUser(newUser);

    return api.ok(res, { message: "Create user successfully!", data: data });
  } catch (e) {
    console.error("❌ Error registering user:", e);
    return api.error(res, "Internal Server Error", 500);
  }
};

const hashPassword = async (plainPassword) => {
  try {
    return await argon2.hash(plainPassword, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 4,
      parallelism: 2,
    });
  } catch (e) {
    console.error("❌ Error hashing password:", e);
    return api.error(res, "Failed Hasing Password", 400);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await model.getAllUsers();
    return api.ok(res, users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await model.getUserById(id);
    if (!user) return api.error(res, "User not found", 404);
    return api.ok(res, user);
  } catch (error) {
    console.error("❌ Error fetching user by ID:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    let result = await model.updateUser(id, updatedData);
    if (result.affectedRows === 0) return api.error(res, "User not found", 404);

    return api.ok(res, { message: "User updated successfully" });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    let result = await model.deleteUser(id);
    if (result.affectedRows === 0) return api.error(res, "User not found", 404);
    return api.ok(res, { message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

module.exports = {
  register,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
