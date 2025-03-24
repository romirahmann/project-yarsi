const { getDBData, getDBQty } = require("../database/update.config");

const getAllCandra = async () => {
  const db = getDBData();
  const query = `
      SELECT 
        id,
        kode_checklist, 
        idproses, 
        nik, 
        qty_image, 
        nama_proses, 
        nama_karyawan, 
        tanggal, 
        FORMAT(mulai, 'HH:mm:ss') AS mulai_formatted, 
        FORMAT(selesai, 'HH:mm:ss') AS selesai_formatted, 
        submittedby,
        editBy
      FROM tblcandra
    `;

  const result = await db.query(query);
  return result;
};
const getAllDataMR = async () => {
  const db = getDBData();
  const query = `SELECT * FROM tblDataMR`;

  const result = await db.query(query);
  return result;
};
const getAllDataMR3 = async () => {
  const db = getDBData();
  const query = `SELECT * FROM tblDataMRt3`;

  const result = await db.query(query);
  return result;
};

const getQty = async () => {
  const db = getDBQty();
  const query = `
      SELECT subquery.NoMR, subquery.totalPages, Query1.[File Path] 
      FROM (
          SELECT NoMR, IIF(ISNULL(SUM(Pages)), 0, SUM(Pages)) AS totalPages
          FROM Query1 
          GROUP BY NoMR, [File Path]
      ) AS subquery
      INNER JOIN Query1 ON subquery.NoMR = Query1.NoMR
    `;

  const result = await db.query(query);
  return result;
};

module.exports = { getAllCandra, getQty, getAllDataMR, getAllDataMR3 };
