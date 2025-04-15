const model = require("../../models/candra.model");
const modelProses = require("../../models/proses.model");
const api = require("../../tools/common");
const { Parser } = require("json2csv");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const logService = require("../../services/log.service");
const ExcelJS = require("exceljs");

const getAllCandra = async (req, res) => {
  try {
    const data = await model.getAllCandra();
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting all Candra:", error);
    return api.error(res, "Failed to get Candra", 500);
  }
};
const getAllCandraDayNow = async (req, res) => {
  try {
    const data = await model.getAllByDateNow();
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting all Candra:", error);
    return api.error(res, "Failed to get Candra", 500);
  }
};

const getCandraByKeys = async (req, res) => {
  let { kode_checklist, idproses } = req.params;

  // Hindari SQL Injection
  kode_checklist = kode_checklist.replace(/'/g, "''");
  idproses = idproses.replace(/'/g, "''");

  if (!kode_checklist || !idproses)
    return api.error(res, "kode_checklist and idproses are required", 400);

  try {
    const data = await model.getCandraByKeys(kode_checklist, idproses);
    if (!data) return api.error(res, "Candra data not found", 404);
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting Candra by keys:", error);
    return api.error(res, "Failed to get Candra", 500);
  }
};

const createCandra = async (req, res) => {
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
  } = req.body;

  if (
    !kode_checklist ||
    !idproses ||
    !nik ||
    !qty_image ||
    !nama_proses ||
    !nama_karyawan ||
    !tanggal ||
    !mulai ||
    !selesai ||
    !submittedby
  )
    return api.error(res, "All fields are required", 400);

  try {
    const inserted = await model.createCandra(req.body);

    return api.ok(res, { inserted }, "Candra created successfully");
  } catch (error) {
    logService.log("Created Data Candra!", "Failed");
    console.error("❌ Error creating Candra:", error);
    return api.error(res, "Failed to create Candra", 500);
  }
};

const addScanCandra = async (req, res) => {
  const data = req.body;

  try {
    // Cek apakah proses ini sudah ada di tblcandra
    const existingCandra = await model.dataExisting(
      data.kode_checklist,
      data.idproses
    );
    if (existingCandra) {
      return api.error(
        res,
        `Proses ${data.idproses} dengan Kode Checklist ${data.kode_checklist} sudah ada`,
        400
      );
    }

    // Ambil informasi urutan dari tblproses berdasarkan idproses
    const dataProses = await modelProses.getProsesById(data.idproses);
    const urutanProses = parseInt(dataProses.urutan, 10);

    // Jika proses ini urutan pertama, langsung tambahkan
    if (urutanProses === 1) {
      await model.createCandraFromScan(data);

      return api.ok(res, "Candra created successfully");
    }

    // Ambil semua proses dengan urutan sebelumnya
    const prosesSebelumnya = await modelProses.getProsesByUrutan(
      urutanProses - 1
    );

    if (!prosesSebelumnya || prosesSebelumnya.length === 0) {
      return api.error(
        res,
        `Tidak ditemukan proses dengan urutan sebelumnya (${urutanProses - 1})`,
        400
      );
    }

    // Ambil semua data checklist yang berhubungan dengan proses sebelumnya
    const existingPreviousPromises = prosesSebelumnya.map((proses) =>
      model.getCandraByKeys(data.kode_checklist, proses.idproses)
    );
    const finishedPreviousList = await Promise.all(existingPreviousPromises);

    // Cek apakah semua proses sebelumnya sudah selesai
    const prosesBelumSelesai = finishedPreviousList.some((finishedPrevious) => {
      if (!finishedPrevious) return true; // Jika proses sebelumnya tidak ditemukan
      return moment(finishedPrevious.selesai).format("HH:mm:ss") === "00:00:00";
    });

    if (prosesBelumSelesai) {
      return api.error(res, "Selesaikan proses sebelumnya!", 400);
    }

    // Semua proses sebelumnya sudah selesai, tambahkan proses baru
    await model.createCandraFromScan(data);

    return api.ok(res, "Candra created successfully");
  } catch (error) {
    logService.log("Add proses scan", "FAILED");
    console.error("❌ Error creating Candra:", error);
    return api.error(res, "Failed to create Candra", 500);
  }
};

const updateCandra = async (req, res) => {
  let { kode_checklist, idproses } = req.params;
  const data = req.body;

  kode_checklist = kode_checklist.replace(/'/g, "''");
  idproses = idproses.replace(/'/g, "''");

  if (!kode_checklist || !idproses)
    return api.error(res, "kode_checklist and idproses are required", 400);

  try {
    const updated = await model.updateCandra(kode_checklist, idproses, data);
    if (!updated) return api.error(res, "Candra not found or no changes", 404);

    return api.ok(res, "Candra updated successfully");
  } catch (error) {
    logService.log("Created Data Candra!", "FAILED");
    console.error("❌ Error updating Candra:", error);
    return api.error(res, "Failed to update Candra", 500);
  }
};
const finishedProses = async (req, res) => {
  let { kode_checklist, idproses } = req.params;
  const data = req.body;

  kode_checklist = kode_checklist.replace(/'/g, "''");
  idproses = idproses.replace(/'/g, "''");

  if (!kode_checklist || !idproses)
    return api.error(res, "kode_checklist and idproses are required", 400);

  try {
    const updated = await model.finishedProses(kode_checklist, idproses, data);
    if (!updated) return api.error(res, "Candra not found or no changes", 404);

    return api.ok(res, "Candra updated successfully");
  } catch (error) {
    logService.log(
      `Proses dengan Kode Checklist: ${kode_checklist} dan ID Proses: ${idproses}`,
      "Failed"
    );
    console.error("❌ Error updating Candra:", error);
    return api.error(res, "Failed to update Candra", 500);
  }
};

const finishedProsesScan = async (req, res) => {
  let { kode_checklist, idproses } = req.params;
  const data = req.body;

  kode_checklist = kode_checklist.replace(/'/g, "''");
  idproses = idproses.replace(/'/g, "''");

  if (!kode_checklist || !idproses)
    return api.error(res, "kode_checklist and idproses are required", 400);

  if (data.qty_image === 0) return api.error(res, "Qty Image can't 0", 400);
  // Menambahkan properti jam
  data.selesai_formatted = moment().format("HH:mm:ss"); // Format timestamp

  try {
    const updated = await model.finishedProsesScan(
      kode_checklist,
      idproses,
      data
    );
    if (!updated) return api.error(res, "Candra not found or no changes", 404);
    return api.ok(res, "Proses Scan selesai");
  } catch (error) {
    return api.error(res, "Failed to update proses scan", 500);
  }
};

const deleteCandra = async (req, res) => {
  let { id } = req.params;

  try {
    const deleted = await model.deleteCandra(id);
    if (!deleted) return api.error(res, "Candra not found", 404);

    return api.ok(res, { deleted }, "Candra deleted successfully");
  } catch (error) {
    console.error("❌ Error deleting Candra:", error);
    return api.error(res, "Failed to delete Candra", 500);
  }
};

const exportCsv = async (req, res) => {
  const data = req.body;
  try {
    // **Buat Workbook dan Worksheet**
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data Candra");

    // **Definisikan Header dan Tambahkan ke Worksheet**
    const headers = [
      "Kode Checklist",
      "ID Proses",
      "NIK",
      "Qty Image",
      "Nama Proses",
      "Nama Karyawan",
      "Tanggal",
      "Mulai",
      "Selesai",
      "Submitted By",
    ];
    worksheet.addRow(headers);

    // **Tambahkan Data**
    data.forEach((row) => {
      worksheet.addRow([
        row.kode_checklist,
        row.idproses,
        row.nik,
        row.qty_image,
        row.nama_proses,
        row.nama_karyawan,
        row.tanggal,
        row.mulai_formatted,
        row.selesai_formatted,
        row.submittedby,
      ]);
    });

    // **Format Header agar Tebal**
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
    });

    // **Buat Path File Excel**
    const filePath = path.join(__dirname, "../../exports/candra_export.xlsx");

    // **Simpan File**
    await workbook.xlsx.writeFile(filePath);

    // **Kirim File Excel ke Client**
    res.download(filePath, "data_candra.xlsx", (err) => {
      if (err) {
        console.error("Error saat mengirim file:", err);
        res.status(500).json({ message: "Gagal mengunduh file" });
      }

      // **Hapus File Setelah Dikirim (Opsional)**
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error("❌ Error exporting Excel:", error);
    return api.error(res, "Failed to export Excel", 500);
  }
};

const validate1007 = async (req, res) => {
  try {
    let fourDaysAgo = moment().subtract(4, "days").format("YYYY-MM-DD");
    let dataCandra = await model.getCandraByDate1001(fourDaysAgo);

    if (dataCandra.length === 0) {
      return api.ok(res, []);
    }

    // let kodeChecklistList = dataCandra.map((item) => item.kode_checklist);
    let data = await model.getCandraTanpaFilter();

    let kodeUnik = [...new Set(data.map((d) => d.kode_checklist))];

    const targetProses = ["1007", "1005", "1004"];

    // Referensi nama proses
    let prosesData = await modelProses.getAllProses(); // Ambil semua data proses
    let prosesMap = {};

    prosesData.forEach((proses) => {
      prosesMap[proses.idproses] = proses.nama_proses; // Mapping idproses -> nama_proses
    });

    let hasil = [];

    kodeUnik.forEach((kode) => {
      const prosesPerChecklist = data.filter(
        (item) => item.kode_checklist === kode
      );

      const prosesBermasalah = targetProses
        .map((id) => {
          const item = prosesPerChecklist.find(
            (p) => String(p.idproses).trim() === String(id).trim()
          );

          const selesai = item?.selesai?.trim();

          if (!item || selesai === "00:00:00") {
            // console.log(
            //   `kode: ${kode} | idproses: ${id} | nama_proses: ${
            //     item?.nama_proses || prosesMap[id]
            //   }`
            // );
            return {
              idproses: id,
              nama_proses: item?.nama_proses || prosesMap[id] || `Proses ${id}`,
            };
          }

          return null;
        })
        .filter(Boolean);

      if (prosesBermasalah.length > 0) {
        hasil.push({
          kode_checklist: kode,
          proses: prosesBermasalah,
        });
      }
    });

    return api.ok(res, hasil);
  } catch (err) {
    console.error(err);
    return api.error(res, "Validate Error", 500);
  }
};

module.exports = {
  getAllCandra,
  getCandraByKeys,
  createCandra,
  updateCandra,
  deleteCandra,
  exportCsv,
  addScanCandra,
  finishedProses,
  getAllCandraDayNow,
  finishedProsesScan,
  validate1007,
};
