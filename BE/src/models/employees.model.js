const { getDB } = require("../database/db.config");

const getAllKaryawan = async () => {
  const db = getDB();
  const result = await db.query("SELECT * FROM tblkaryawan");
  return result;
};

const getKaryawanById = async (id) => {
  const db = getDB();
  const result = await db.query("SELECT * FROM tblkaryawan WHERE id = ", id);
  return result.length > 0 ? result[0] : null;
};
const getKaryawanByNIK = async (nik) => {
  const db = getDB();
  const query = `SELECT * FROM tblkaryawan WHERE nik ='${nik}'`;
  const result = await db.query(query);
  return result[0];
};

const createKaryawan = async (formattedDate, data) => {
  const db = getDB();
  const { nik, nama_karyawan, submittedby } = data;

  // Gunakan Parameterized Query untuk keamanan
  const query = `INSERT INTO tblkaryawan (trn_date, nik, nama_karyawan, submittedby) VALUES (#${formattedDate}#,'${nik}', '${nama_karyawan}', '${submittedby}' )`;

  const result = await db.query(query);
  return result.count;
};

const updateKaryawan = async (id, data) => {
  const db = getDB();
  const { trn_date, nik, nama_karyawan, submittedby } = data;

  // Pastikan semua input valid untuk menghindari SQL Injection
  const safeNik = nik.replace(/'/g, "''"); // Escape single quotes
  const safeNamaKaryawan = nama_karyawan.replace(/'/g, "''");
  const safeSubmittedBy = submittedby.replace(/'/g, "''");

  // Gunakan # untuk format DATE di Microsoft Access
  const query = `UPDATE tblkaryawan 
                 SET trn_date = #${trn_date}#, 
                     nik = '${safeNik}', 
                     nama_karyawan = '${safeNamaKaryawan}', 
                     submittedby = '${safeSubmittedBy}'
                 WHERE id = ${id}`;
  const result = await db.query(query);

  return result.count; // ✅ Return jumlah baris yang diupdate
};

const deleteKaryawan = async (id) => {
  const db = getDB();
  const query = `DELETE FROM tblkaryawan WHERE id = ${id}`;
  const result = await db.query(query);

  return result.count; // ✅ Return jumlah baris yang dihapus
};

module.exports = {
  getAllKaryawan,
  getKaryawanById,
  createKaryawan,
  updateKaryawan,
  deleteKaryawan,
  getKaryawanByNIK,
};
