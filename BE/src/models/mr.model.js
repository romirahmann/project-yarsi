const { getDB } = require("../database/db.config");
const moment = require("moment");

const getAllDataMR = async () => {
  const db = getDB();
  return await db.query(
    "SELECT NoUrut, NoMR, NamaPasien, Tanggal, Qty_Image, Kode_Checklist, Urut, Mulai, Selesai, rumahsakit, nobox, FilePath FROM tblDataMR"
  );
};

const getAllNonaktifMR = async () => {
  const db = getDB();
  const query = `SELECT NoUrut, NoMR, NamaPasien, Tanggal, Qty_Image, Kode_Checklist, Urut, Mulai, Selesai, rumahsakit, nobox, FilePath FROM tblDataMR_Doubel`;
  const result = await db.query(query);
  return result;
};

const dataExisting = async (NoUrut, Kode_Checklist) => {
  const db = getDB();

  const query = `
    SELECT COUNT(*) AS total_count FROM tblDataMR 
     WHERE NoUrut = '${NoUrut}' AND Kode_Checklist = '${Kode_Checklist}'
  `;

  const result = await db.query(query);
  return result[0].total_count > 0;
};

const getDataMRByKeys = async (NoUrut, Kode_Checklist) => {
  const db = getDB();

  // Buat query secara langsung tanpa parameterized query
  const query = `
      SELECT NoUrut, NoMR, NamaPasien, Tanggal, Qty_Image, Kode_Checklist, Urut, Mulai, Selesai, rumahsakit, nobox, FilePath
      FROM tblDataMR
      WHERE NoUrut = '${NoUrut}' AND Kode_Checklist = '${Kode_Checklist}'
    `;

  const result = await db.query(query);
  return result.length > 0 ? result[0] : null;
};

const getDataMRByChecklist = async (Kode_Checklist) => {
  const db = getDB();

  // Buat query secara langsung tanpa parameterized query
  const query = `
      SELECT NoUrut, NoMR, NamaPasien, Tanggal, Qty_Image, Kode_Checklist, Urut, Mulai, Selesai, rumahsakit, nobox, FilePath
      FROM tblDataMR
      WHERE Kode_Checklist = '${Kode_Checklist}'
    `;

  const result = await db.query(query);
  return result;
};

const createDataMR = async (data) => {
  const db = getDB();
  const {
    NoUrut,
    NoMR,
    NamaPasien,
    Tanggal,
    Qty_Image,
    Kode_Checklist,
    Urut,
    Mulai,
    Selesai,
    rumahsakit,
    nobox,
    FilePath,
  } = data;
  // // Konversi tanggal ke format Access atau NULL
  // const formattedTanggal = Tanggal ? `#${Tanggal}#` : "NULL";
  const query = `
    INSERT INTO tblDataMR 
    (NoUrut, NoMR, NamaPasien, Tanggal, Qty_Image, Kode_Checklist, Urut, Mulai, 
     Selesai, rumahsakit, nobox, filePath) 
    VALUES ('${NoUrut}', '${NoMR}', '${NamaPasien}', '${Tanggal}' , ${Qty_Image}, '${Kode_Checklist}', '${Urut}', '${Mulai}', '${Selesai}', '${rumahsakit}', '${nobox}', '${FilePath}')`;

  const result = await db.query(query);
  return result;
};

const createDataMR_Double = async (data) => {
  const db = getDB();
  const {
    NoUrut,
    NoMR,
    NamaPasien,
    Tanggal,
    Qty_Image,
    Kode_Checklist,
    Urut,
    Mulai,
    Selesai,
    rumahsakit,
    nobox,
    FilePath,
  } = data;

  const query = `
    INSERT INTO tblDataMR_Doubel 
    (NoUrut, NoMR, NamaPasien, Tanggal, Qty_Image, Kode_Checklist, Urut, Mulai, 
     Selesai, rumahsakit, nobox, filePath) 
    VALUES ('${NoUrut}', '${NoMR}', '${NamaPasien}', '${Tanggal}' , ${Qty_Image}, '${Kode_Checklist}', '${Urut}', '${Mulai}', '${Selesai}', '${rumahsakit}', '${nobox}', '${FilePath}')`;

  const result = await db.query(query);
  return result;
};

const dataExistingByMR = async (NoMR) => {
  const db = getDB();

  const query = `
    SELECT COUNT(*) AS total_count FROM tblDataMR 
     WHERE NoMR = '${NoMR}' 
  `;

  const result = await db.query(query);
  return result[0].total_count > 0;
};

const updateQtyMR = async (data) => {
  const db = getDB();
  const { NoMR, totalPages, nobox } = data; // Ambil properti yang tidak ada spasi
  const filePath = data["File Path"]; // Ambil "File Path" menggunakan bracket notation

  const query = `
  UPDATE tblDataMR 
  SET Qty_Image = '${totalPages}', 
      FilePath = '${filePath}'
      
  WHERE NoMR = '${NoMR}' AND Qty_Image IS NULL
`;

  const result = await db.query(query);
  return result;
};

const getQtyByMR = async () => {
  const db = getDB();
  const query = `SELECT Kode_Checklist, SUM(Qty_Image) AS totalPages FROM tblDataMR GROUP BY Kode_Checklist;`;
  const result = await db.query(query);
  return result;
};

const updateDataMR = async (NoUrut, Kode_Checklist, data) => {
  const db = getDB();
  const { NoMR, NamaPasien, formatedTanggal, nobox } = data;

  const query = `
    UPDATE tblDataMR
    SET NoMR = '${NoMR}',
        NamaPasien = '${NamaPasien}',
        Tanggal = '${formatedTanggal}',
        nobox = '${nobox}'
    WHERE NoUrut = '${NoUrut}' AND Kode_Checklist = '${Kode_Checklist}'
  `;

  const result = await db.query(query);
  return result;
};

const deleteDataMR = async (NoUrut, Kode_Checklist) => {
  const db = getDB();
  const query = `DELETE FROM tblDataMR WHERE NoUrut = '${NoUrut}' AND Kode_Checklist = '${Kode_Checklist}'`;
  const result = await db.query(query);
  return result;
};

const deleteMRDouble = async (NoUrut, Kode_Checklist) => {
  const db = getDB();
  const query = `DELETE FROM tblDataMR_Doubel WHERE NoUrut = '${NoUrut}' AND Kode_Checklist = '${Kode_Checklist}'`;
  const result = await db.query(query);
  return result;
};

// MR T3
const getAllMRt3 = async () => {
  const db = getDB();
  const query = `SELECT NoUrut, NoMR, NamaPasien, Tanggal, Layanan, Qty_Image, Kode_Checklist, Mulai, Selesai, namadokumen, Periode_Ranap FROM tblDataMRt3 `;
  const result = await db.query(query);
  return result;
};
const getMRt3ByKodeChecklist = async (kode_checklist) => {
  const db = getDB();
  const query = `SELECT NoUrut, Periode_Ranap, NoMR, NamaPasien, Tanggal, Layanan, Qty_Image, Kode_Checklist, Mulai, Selesai, namadokumen FROM tblDataMRt3 WHERE Kode_Checklist = '${kode_checklist}'`;
  const result = await db.query(query);
  return result;
};
const createDataMRt3 = async (data) => {
  const db = getDB();
  const {
    NoUrut,
    NoMR,
    NamaPasien,
    Tanggal,
    layanan,
    Qty_Image,
    Kode_Checklist,
    Mulai,
    Selesai,
    namadokumen,
    Periode_Ranap,
  } = data;
  // // Konversi tanggal ke format Access atau NULL
  // const formattedTanggal = Tanggal ? `#${Tanggal}#` : "NULL";
  const query = `
    INSERT INTO tblDataMRt3 
    (NoUrut, NoMR, NamaPasien, Tanggal, [Layanan], Qty_Image, Kode_Checklist, Mulai, Selesai, namadokumen,Periode_Ranap) 
    VALUES ('${NoUrut}', '${NoMR}', '${NamaPasien}', '${Tanggal}','${layanan}', ${Qty_Image}, '${Kode_Checklist}', '${Mulai}', '${Selesai}', '${namadokumen}', '${Periode_Ranap}')`;

  const result = db.query(query);
  return result;
};

const dataExistingT3 = async (NoUrut, Kode_Checklist) => {
  const db = getDB();

  const query = `
    SELECT COUNT(*) AS total_count FROM tblDataMRt3 
     WHERE NoUrut = '${NoUrut}' AND Kode_Checklist = '${Kode_Checklist}'
  `;

  const result = await db.query(query);
  return result[0].total_count > 0;
};

const updateDataMRt3 = async (data) => {
  const db = getDB();
  const {
    NoUrut,
    NoMR,
    NamaPasien,
    Tanggal,
    Layanan,
    Qty_Image,
    Kode_Checklist,
    Mulai,
    Selesai,
    namadokumen,
  } = data;

  const formDateToString = moment(Tanggal, "YYYY-MM-DD").format("DDMMYYYY");

  const query = `UPDATE tblDataMRt3 
  SET NoUrut = '${NoUrut}',
      NoMR = '${NoMR}', 
      NamaPasien = '${NamaPasien}', 
      Tanggal = '${formDateToString}', 
      Layanan = '${Layanan}',
      Qty_Image = '${Qty_Image}' ,
      Mulai = '${Mulai}',
      Selesai = '${Selesai}',
      namadokumen = '${namadokumen}'
  WHERE NoUrut = '${NoUrut}' AND Kode_Checklist = '${Kode_Checklist}'`;
  const result = await db.query(query);
  return result;
};

const deleteMRt3 = async (data) => {
  const db = getDB();
  const { NoUrut, Kode_Checklist } = data;
  const query = `DELETE FROM tblDataMRt3 WHERE NoUrut = '${NoUrut}' AND Kode_Checklist = '${Kode_Checklist}' `;
  const result = await db.query(query);
  return result;
};

const getRsName = async () => {
  const db = getDB();
  const query = `SELECT TOP 1 rumahsakit FROM tblDataMR`;
  const result = await db.query(query);
  return result[0];
};

module.exports = {
  getAllDataMR,
  getDataMRByKeys,
  createDataMR,
  updateDataMR,
  deleteDataMR,
  dataExisting,
  createDataMRt3,
  dataExistingT3,
  dataExistingByMR,
  updateQtyMR,
  getQtyByMR,
  getAllMRt3,
  getMRt3ByKodeChecklist,
  deleteMRt3,
  updateDataMRt3,
  getDataMRByChecklist,
  getAllNonaktifMR,
  createDataMR_Double,
  deleteMRDouble,
  getRsName,
};
