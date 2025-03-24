const model = require("../../models/employees.model");
const api = require("../../tools/common");
const moment = require("moment");

const getAllEmployee = async (req, res) => {
  try {
    const data = await model.getAllKaryawan();
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting employees:", error);
    return api.error(res, "Failed to get employees", 500);
  }
};

const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return api.error(res, "ID is required", 400);
  }

  try {
    const data = await model.getKaryawanById(id);
    if (!data) {
      return api.error(res, "Employee not found", 404);
    }
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting employee by ID:", error);
    return api.error(res, "Failed to get employee", 500);
  }
};
const getEmployeeByNIK = async (req, res) => {
  const { nik } = req.params;
  if (!nik) {
    return api.error(res, "ID is required", 400);
  }

  try {
    const data = await model.getKaryawanByNIK(nik);
    if (!data) {
      return api.error(res, "Employee not found", 404);
    }
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting employee by ID:", error);
    return api.error(res, "Failed to get employee", 500);
  }
};

const createEmployee = async (req, res) => {
  const { trn_date, nik, nama_karyawan, submittedby } = req.body;

  try {
    const dateNow = moment().format("YYYY/MM/DD HH:mm:ss");

    const result = await model.createKaryawan(dateNow, {
      trn_date,
      nik,
      nama_karyawan,
      submittedby,
    });
    if (result > 0) {
      return api.ok(res, "Employee successfully added");
    }
    return api.error(res, "Failed to add employee", 500);
  } catch (error) {
    console.error("❌ Error creating employee:", error);
    return api.error(res, "Failed to add employee", 500);
  }
};

const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { trn_date, nik, nama_karyawan, submittedby } = req.body;

  if (!id) {
    return api.error(res, "ID is required", 400);
  }
  if (!trn_date || !nik || !nama_karyawan || !submittedby) {
    return api.error(res, "All fields are required", 400);
  }

  try {
    const result = await model.updateKaryawan(id, {
      trn_date,
      nik,
      nama_karyawan,
      submittedby,
    });
    if (result > 0) {
      return api.ok(res, "Employee successfully updated");
    }
    return api.error(res, "Failed to update employee", 500);
  } catch (error) {
    console.error("❌ Error updating employee:", error);
    return api.error(res, "Failed to update employee", 500);
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return api.error(res, "ID is required", 400);
  }

  try {
    const result = await model.deleteKaryawan(id);
    if (result > 0) {
      return api.ok(res, "Employee successfully deleted");
    }
    return api.error(res, "Failed to delete employee", 500);
  } catch (error) {
    console.error("❌ Error deleting employee:", error);
    return api.error(res, "Failed to delete employee", 500);
  }
};

module.exports = {
  getAllEmployee,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeByNIK,
};
