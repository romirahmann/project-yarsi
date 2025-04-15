const moment = require("moment");
const { getDB } = require("../database/db.config");

const getAllCandra = async () => {
  const db = getDB();
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

const getCandraByChecklist = async (Kode_Checklist) => {
  const db = getDB();
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
    FROM tblcandra WHERE kode_checklist = ${Kode_Checklist}
  `;
  const result = await db.query(query);
  return result;
};

const dataExisting = async (kode_checklist, idproses) => {
  const db = getDB();

  const query = `
    SELECT COUNT(*) as count FROM tblcandra 
    WHERE kode_checklist = '${kode_checklist}' AND idproses = '${idproses}'
  `;

  const result = await db.query(query);
  return result[0].count > 0;
};

const getAllByDateNow = async () => {
  const db = getDB();
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
      FORMAT(mulai, 'HH:nn:ss') AS mulai_formatted, 
      FORMAT(selesai, 'HH:nn:ss') AS selesai_formatted, 
      submittedby,
      editBy
    FROM tblcandra
    WHERE tanggal = FORMAT(NOW(), 'yyyy-MM-dd')
    ORDER BY mulai DESC
  `;
  const result = await db.query(query);
  return result;
};

const getCandraByKeys = async (kode_checklist, idproses) => {
  const db = getDB();

  const query = `
    SELECT * FROM tblcandra 
    WHERE kode_checklist = '${kode_checklist}' AND idproses = '${idproses}'
  `;

  const result = await db.query(query);
  return result.length > 0 ? result[0] : null;
};

const createCandra = async (data) => {
  const db = getDB();
  const {
    kode_checklist,
    idproses,
    nik,
    qty_image,
    nama_proses,
    nama_karyawan,
    tanggal,
    mulai_formatted,
    selesai_formatted,
    submittedby,
  } = data;

  const formattedTanggal = moment(tanggal, "YYYY-MM-DD").format("yyyy-MM-DD");

  const query = `
    INSERT INTO tblcandra (kode_checklist, idproses, nik, qty_image, nama_proses, nama_karyawan, tanggal, mulai, selesai, submittedby)
    VALUES ('${kode_checklist}', '${idproses}', '${nik}', ${parseInt(
    qty_image || 0
  )}, '${nama_proses}', '${nama_karyawan}', #${formattedTanggal}#, '${mulai_formatted}', '${selesai_formatted}', '${submittedby}')
  `;

  const result = await db.query(query);
  return result; // ✅ Return jumlah baris yang ditambahkan
};

const createCandraFromScan = async (data) => {
  const db = getDB();
  const {
    kode_checklist,
    idproses,
    nik,
    qty_image,
    nama_proses,
    nama_karyawan,
    tanggal,
    mulai,
    selesai,
    submittedby,
  } = data;

  const query = `
    INSERT INTO tblcandra (kode_checklist, idproses, nik, qty_image, nama_proses, nama_karyawan, tanggal, mulai, selesai, submittedby)
    VALUES ('${kode_checklist}', '${idproses}', '${nik}', ${parseInt(
    qty_image
  )}, '${nama_proses}', '${nama_karyawan}', #${tanggal}#, '${mulai}', '${selesai}', '${submittedby}')
  `;

  const result = await db.query(query);
  return result.count; // ✅ Return jumlah baris yang ditambahkan
};

const updateCandra = async (kode_checklist, idproses, data) => {
  const db = getDB();
  const {
    nik,
    nama_proses,
    nama_karyawan,
    qty_image,
    tanggal,
    mulai,
    selesai,
    editby,
  } = data;
  const formattedTanggal = tanggal ? `#${tanggal}#` : "NULL";
  const query = `
    UPDATE tblcandra
    SET nik = '${nik}', nama_proses = '${nama_proses}', 
        nama_karyawan = '${nama_karyawan}', tanggal = ${formattedTanggal}, mulai = '${mulai}', qty_image = ${parseInt(
    qty_image
  )}, 
        selesai = '${selesai}', editby = '${editby}'
    WHERE kode_checklist = '${kode_checklist}' AND idproses = '${idproses}'
  `;

  const result = await db.query(query);
  return result.count; // ✅ Return jumlah baris yang diperbarui
};

const finishedProses = async (kode_checklist, idproses, data) => {
  const db = getDB();
  const { selesai_formatted } = data;

  const query = `
    UPDATE tblcandra
    SET selesai = '${selesai_formatted}'
    WHERE kode_checklist = '${kode_checklist}' AND idproses = '${idproses}'
  `;

  const result = await db.query(query);
  return result.count; // ✅ Return jumlah baris yang diperbarui
};
const finishedProsesScan = async (kode_checklist, idproses, data) => {
  const db = getDB();
  const { selesai_formatted, qty_image } = data;

  const query = `
    UPDATE tblcandra
    SET selesai = '${selesai_formatted}', qty_image = ${qty_image}
    WHERE kode_checklist = '${kode_checklist}' AND idproses = '${idproses}'
  `;

  const result = await db.query(query);
  return result.count; // ✅ Return jumlah baris yang diperbarui
};

const updateCandraByMR = async (data) => {
  const db = getDB();
  let { Kode_Checklist, totalPages } = data;
  if (totalPages === null) {
    totalPages = 0;
  }
  const query = `UPDATE tblcandra SET qty_image = ${totalPages} WHERE kode_checklist = '${Kode_Checklist}' AND idproses = '1001'`;
  const result = await db.query(query);
  return result;
};

const deleteCandra = async (id) => {
  const db = getDB();
  const query = `
    DELETE FROM tblcandra WHERE id = ${id}
  `;

  const result = await db.query(query);
  return result.count; // ✅ Return jumlah baris yang dihapus
};

const getCandraByDate1001 = async (date) => {
  // console.log(date);
  const db = getDB();
  const query = `
  SELECT kode_checklist 
  FROM tblcandra 
  WHERE idproses = '1001' 
  AND tanggal < #${date}#
`;
  const result = await db.query(query);
  return result;
};

const getCandraTanpaFilter = async () => {
  const db = getDB();
  // let checklistStr = kodeChecklistList.map((kc) => `'${kc}'`).join(",");

  const query = `
   SELECT 
  c.kode_checklist, 
  c.idproses,
  p.nama_proses,
  FORMAT(c.selesai, 'HH:mm:ss') AS selesai
FROM tblcandra c
LEFT JOIN tblproses p ON c.idproses = p.idproses
  `;

  const result = await db.query(query);
  return result;
};

module.exports = {
  getAllCandra,
  getCandraByKeys,
  createCandra,
  updateCandra,
  deleteCandra,
  dataExisting,
  updateCandraByMR,
  createCandraFromScan,
  finishedProses,
  getAllByDateNow,
  finishedProsesScan,
  getCandraByChecklist,
  getCandraByDate1001,
  getCandraTanpaFilter,
};
