const model = require("../../models/proses.model");
const api = require("../../tools/common");

const getAllProses = async (req, res) => {
  try {
    const data = await model.getAllProses();
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting proses:", error);
    return api.error(res, "Failed to get proses", 500);
  }
};

const getProsesById = async (req, res) => {
  const { idproses } = req.params;
  if (!idproses) {
    return api.error(res, "ID is required", 400);
  }

  try {
    const data = await model.getProsesById(idproses);
    if (!data) {
      return api.error(res, "Proses not found", 404);
    }
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting proses by ID:", error);
    return api.error(res, "Failed to get proses", 500);
  }
};

const createProses = async (req, res) => {
  const { idproses, nama_proses, urutan, trn_date } = req.body;

  if (!idproses || !nama_proses || !urutan || !trn_date) {
    return api.error(res, "All fields are required", 400);
  }

  try {
    const result = await model.createProses({
      idproses,
      nama_proses,
      urutan,
      trn_date,
    });
    if (result > 0) {
      return api.ok(res, "Proses successfully added");
    }
    return api.error(res, "Failed to add proses", 500);
  } catch (error) {
    console.error("❌ Error creating proses:", error);
    return api.error(res, "Failed to add proses", 500);
  }
};

const updateProses = async (req, res) => {
  const { id } = req.params;
  const { idproses, nama_proses, urutan, trn_date } = req.body;

  if (!nama_proses || !urutan || !trn_date) {
    return api.error(res, "All fields are required", 400);
  }

  try {
    const result = await model.updateProses(id, {
      idproses,
      nama_proses,
      urutan,
      trn_date,
    });
    if (result > 0) {
      return api.ok(res, "Proses successfully updated");
    }
    return api.error(res, "Failed to update proses", 500);
  } catch (error) {
    console.error("❌ Error updating proses:", error);
    return api.error(res, "Failed to update proses", 500);
  }
};

const deleteProses = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return api.error(res, "ID is required", 400);
  }

  try {
    const result = await model.deleteProses(id);
    if (result > 0) {
      return api.ok(res, "Proses successfully deleted");
    }
    return api.error(res, "Failed to delete proses", 500);
  } catch (error) {
    console.error("❌ Error deleting proses:", error);
    return api.error(res, "Failed to delete proses", 500);
  }
};

module.exports = {
  getAllProses,
  getProsesById,
  createProses,
  updateProses,
  deleteProses,
};
