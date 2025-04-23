const model = require("../../models/mr.model");
const api = require("../../tools/common");
const { Parser } = require("json2csv");
const fs = require("fs");
const path = require("path");
const bwipJs = require("bwip-js");
const PdfPrinter = require("pdfmake");

const moment = require("moment");
const ExcelJS = require("exceljs");

const getAllDataMR = async (req, res) => {
  try {
    const data = await model.getAllDataMR();
    // data.sort((a, b) => {
    //   const getNumber = (str) => parseInt(str.replace("PBL-", ""), 10);
    //   return getNumber(a.NoUrut) - getNumber(b.NoUrut);
    // });
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting DataMR:", error);
    return api.error(res, "Failed to get DataMR", 500);
  }
};
const getAllNonaktifMR = async (req, res) => {
  try {
    const data = await model.getAllNonaktifMR();
    data.sort((a, b) => {
      const aParts = a.NoUrut.split("-").map((num) => parseInt(num, 10));
      const bParts = b.NoUrut.split("-").map((num) => parseInt(num, 10));

      // Urutkan berdasarkan angka setelah "PBL-"
      if (aParts[1] !== bParts[1]) {
        return aParts[1] - bParts[1];
      }

      // Jika sama, urutkan berdasarkan angka terakhir setelah "PBL-X-"
      return aParts[2] - bParts[2];
    });
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting DataMR:", error);
    return api.error(res, "Failed to get DataMR", 500);
  }
};
const getDataMRByKeys = async (req, res) => {
  let { nourut, kode_checklist } = req.params;

  nourut = nourut.replace(/'/g, "''");
  kode_checklist = kode_checklist.replace(/'/g, "''");

  if (!nourut || !kode_checklist)
    return api.error(res, "NoUrut and Kode_Checklist are required", 400);

  try {
    const data = await model.getDataMRByKeys(nourut, kode_checklist);
    if (!data) return api.error(res, "DataMR not found", 404);
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting DataMR by keys:", error);
    return api.error(res, "Failed to get DataMR", 500);
  }
};

const createDataMR = async (req, res) => {
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
    filePath,
  } = req.body;

  if (
    !NoUrut ||
    !Kode_Checklist ||
    !NoMR ||
    !NamaPasien ||
    !Tanggal ||
    !Qty_Image ||
    !Urut ||
    !Mulai ||
    !Selesai ||
    !rumahsakit ||
    !nobox ||
    !filePath
  ) {
    return api.error(res, "All fields are required", 400);
  }

  try {
    const result = await model.createDataMR(req.body);
    if (result > 0) return api.ok(res, "DataMR successfully added");
    return api.error(res, "Failed to add DataMR", 500);
  } catch (error) {
    console.error("❌ Error creating DataMR:", error);
    return api.error(res, "Failed to add DataMR", 500);
  }
};

const updateDataMR = async (req, res) => {
  const { nourut, kode_checklist } = req.params;
  const { NoMR, NamaPasien, Tanggal, nobox } = req.body;

  if (!nourut || !kode_checklist) {
    return api.error(res, "NoUrut and Kode_Checklist are required", 400);
  }

  if (!NoMR || !NamaPasien || !Tanggal || !nobox) {
    return api.error(
      res,
      "All fields (NoMR, NamaPasien, Tanggal, nobox) are required",
      400
    );
  }

  let formatedTanggal = moment(Tanggal, "YYYY-MM-DD").format("DDMMYYYY");

  try {
    const result = await model.updateDataMR(nourut, kode_checklist, {
      NoMR,
      NamaPasien,
      formatedTanggal,
      nobox,
    });

    return api.ok(res, "Data MR successfully updated");
  } catch (error) {
    console.error("❌ Error updating Data MR:", error);
    return api.error(res, "An error occurred while updating Data MR", 500);
  }
};

const deleteDataMR = async (req, res) => {
  const { nourut, kode_checklist } = req.params;
  if (!nourut || !kode_checklist)
    return api.error(res, "NoUrut and Kode_Checklist are required", 400);

  try {
    const result = await model.deleteDataMR(nourut, kode_checklist);
    return api.ok(res, "DataMR successfully deleted");
  } catch (error) {
    console.error("❌ Error deleting DataMR:", error);
    return api.error(res, "Failed to delete DataMR", 500);
  }
};

const exportCsv = async (req, res) => {
  const data = req.body;
  try {
    // **Buat Workbook dan Worksheet**
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data MR");

    // **Definisikan Header**
    const headers = [
      "NoUrut",
      "NoMR",
      "Kode_Checklist",
      "NamaPasien",
      "Tanggal",
      "Qty_Image",
      "Urut",
      "Mulai",
      "Selesai",
      "rumahsakit",
      "FilePath",
    ];

    // **Tambahkan Header ke Worksheet**
    worksheet.addRow(headers);

    // **Tambahkan Data**
    data.forEach((row) => {
      worksheet.addRow([
        row.NoUrut,
        row.NoMR,
        row.Kode_Checklist,
        row.NamaPasien,
        row.Tanggal,
        row.Qty_Image,
        row.Urut,
        row.Mulai,
        row.Selesai,

        row.rumahsakit,
        row.FilePath,
      ]);
    });

    // **Buat Path File Excel**
    const filePath = path.join(__dirname, "../../exports/candra_export.xlsx");

    // **Simpan File**
    await workbook.xlsx.writeFile(filePath);

    // **Kirim File Excel ke Client**
    res.download(filePath, "data_MR.xlsx", (err) => {
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

const nonaktifMR = async (req, res) => {
  const data = req.body;
  try {
    if (!data) {
      return api.error(res, "Data Not Found!", 400);
    }

    // CREATE TO TABLE MR_DOUBLE
    const [resultCreate, deleteMR] = await Promise.all([
      model.createDataMR_Double(data),
      model.deleteDataMR(data.NoUrut, data.Kode_Checklist),
    ]);

    return api.ok(res, { resultCreate, deleteMR });
  } catch (err) {
    console.error("Error nonaktifMR:", err);
    return api.error(res, "Failed to nonaktifMR", 500);
  }
};

const aktifkanMR = async (req, res) => {
  const data = req.body;

  try {
    if (!data) {
      return api.error(res, "Data Not Found!", 400);
    }

    const [resultCreate, deleteMR] = await Promise.all([
      model.createDataMR(data),
      model.deleteMRDouble(data.NoUrut, data.Kode_Checklist),
    ]);

    return api.ok(res, { resultCreate, deleteMR });
  } catch (err) {
    console.error("Error nonaktifMR:", err);
    return api.error(res, "Failed to nonaktifMR", 500);
  }
};

// MRT 3
const getAllDataMRt3 = async (req, res) => {
  try {
    let data = await model.getAllMRt3();

    // Sorting berdasarkan angka di NoUrut (PBL-1-X)
    data.sort((a, b) => {
      const aParts = a.NoUrut.split("-").map((num) => parseInt(num, 10));
      const bParts = b.NoUrut.split("-").map((num) => parseInt(num, 10));

      // Urutkan berdasarkan angka setelah "PBL-"
      if (aParts[1] !== bParts[1]) {
        return aParts[1] - bParts[1];
      }

      // Jika sama, urutkan berdasarkan angka terakhir setelah "PBL-X-"
      return aParts[2] - bParts[2];
    });
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting DataMR:", error);
    return api.error(res, "Failed to get DataMR", 500);
  }
};

const generateFinishinCheecksheet = async (req, res) => {
  try {
    const { kode_checklist } = req.params;
    if (!kode_checklist)
      return res.status(400).json({ message: "Kode checklist diperlukan!" });

    let data = await model.getMRt3ByKodeChecklist(kode_checklist);
    if (!data || data.length === 0)
      return res.status(404).json({ message: "Data tidak ditemukan!" });

    data.sort((a, b) => {
      const aParts = a.NoUrut.split("-").map((num) => parseInt(num, 10));
      const bParts = b.NoUrut.split("-").map((num) => parseInt(num, 10));

      if (aParts[1] !== bParts[1]) return aParts[1] - bParts[1];
      return aParts[2] - bParts[2];
    });

    const fonts = {
      Roboto: {
        normal: path.resolve("src/fonts/Roboto-Regular.ttf"),
        bold: path.resolve("src/fonts/Roboto-Bold.ttf"),
        italics: path.resolve("src/fonts/Roboto-Italic.ttf"),
        bolditalics: path.resolve("src/fonts/Roboto-BoldItalic.ttf"),
      },
    };

    let barcodeBase64 = null;
    try {
      const barcodeBuffer = await bwipJs.toBuffer({
        bcid: "code39",
        text: kode_checklist,
        scale: 3,
        height: 20,
        includetext: true,
        textxalign: "center",
      });

      barcodeBase64 = `data:image/png;base64,${barcodeBuffer.toString(
        "base64"
      )}`;
    } catch (err) {
      console.error("⚠️ Gagal membuat barcode:", err);
    }

    const barcodeImage = barcodeBase64
      ? { image: barcodeBase64, width: 150, alignment: "right" }
      : {
          text: "Barcode tidak tersedia",
          style: "subheader",
          alignment: "right",
        };

    const displayedEntries = new Set();

    const tableBody = [
      [
        { text: "No Urut", bold: true, fillColor: "#D3D3D3" },
        { text: "NO MR", bold: true, fillColor: "#D3D3D3" },
        { text: "Nama Pasien", bold: true, fillColor: "#D3D3D3" },
        { text: "Tanggal", bold: true, fillColor: "#D3D3D3" },
        { text: "Layanan", bold: true, fillColor: "#D3D3D3" },
        { text: "Periode Ranap", bold: true, fillColor: "#D3D3D3" },
        { text: "Nama Dokumen", bold: true, fillColor: "#D3D3D3" },
        { text: "Cheked", bold: true, fillColor: "#D3D3D3" },
      ],
      ...data.map((item) => {
        const key = `${item.NamaPasien}-${item.NoMR}-${item.Tanggal}`;

        if (displayedEntries.has(key)) {
          return [
            item.NoUrut || "-",
            "",
            "",
            "",
            item.Layanan || "-",
            item.Periode_Ranap || "-",
            item.namadokumen || "-",
            "",
          ];
        } else {
          displayedEntries.add(key);
          return [
            item.NoUrut || "-",
            item.NoMR || "-",
            item.NamaPasien || "-",
            moment(item.Tanggal, "DDMMYYYY").format("DD-MM-YYYY") || "-",
            item.Layanan || "-",
            item.Periode_Ranap || "-",
            item.namadokumen || "-",
            "",
          ];
        }
      }),
    ];

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [10, 20, 10, 20],
      content: [
        { text: "FINISHING CHECK SHEET", style: "header" },

        {
          table: {
            widths: ["70%", "30%"],
            body: [
              [
                {
                  text: `Kode Checklist: ${kode_checklist}`,
                  style: "table",
                  alignment: "left",
                },
              ],
            ],
          },
          layout: "noBorders",
          margin: [0, 10, 0, 0],
        },

        {
          table: {
            widths: ["45%", "15%", "40%"],
            body: [
              [
                {
                  table: {
                    widths: ["*", "*", "*", "*", "*"],
                    body: [
                      [
                        {
                          text: "Proses",
                          bold: true,
                          fillColor: "#D3D3D3",
                          fontSize: 6,
                        },
                        {
                          text: "Nama",
                          bold: true,
                          fillColor: "#D3D3D3",
                          fontSize: 6,
                        },
                        {
                          text: "Tanggal",
                          bold: true,
                          fillColor: "#D3D3D3",
                          fontSize: 6,
                        },
                        {
                          text: "Mulai",
                          bold: true,
                          fillColor: "#D3D3D3",
                          fontSize: 6,
                        },
                        {
                          text: "Selesai",
                          bold: true,
                          fillColor: "#D3D3D3",
                          fontSize: 6,
                        },
                      ],
                      [{ text: "QC Image", fontSize: 6 }, "", "", "", ""],
                    ],
                    alignment: "left",
                    style: "table",
                  },
                },
                "",
                barcodeImage,
              ],
            ],
          },
          layout: "noBorders",
        },

        {
          table: {
            widths: ["7%", "7%", "15%", "7%", "7%", "8%", "42%", "6%"],
            body: tableBody,
          },
          margin: [0, 10, 0, 0],
          style: "table",
        },
      ],

      styles: {
        header: {
          fontSize: 15,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        table: {
          fontSize: 6,
        },
      },

      // ✨ Tambahkan Footer Halaman
      footer: function (currentPage, pageCount) {
        return {
          text: `Page ${currentPage} of ${pageCount}`,
          alignment: "right",
          margin: [0, 10, 20, 0],
          fontSize: 8,
        };
      },
    };

    const printer = new PdfPrinter(fonts);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Finishing_Checklist_${kode_checklist}.pdf"`
    );
    res.setHeader("Content-Type", "application/pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
    console.log("Exports Successfully");
  } catch (err) {
    console.error("❌ Error generate Finishing Checksheet:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const generateQcChecksheet = async (req, res) => {
  try {
    const { kode_checklist } = req.params;
    if (!kode_checklist)
      return res.status(400).json({ message: "Kode checklist diperlukan!" });

    // 🔍 Ambil data dari database
    let data = await model.getMRt3ByKodeChecklist(kode_checklist);
    if (!data || data.length === 0)
      return res.status(404).json({ message: "Data tidak ditemukan!" });

    // Urutakan Berdasarkan No URUT
    data.sort((a, b) => {
      const aParts = a.NoUrut.split("-").map((num) => parseInt(num, 10));
      const bParts = b.NoUrut.split("-").map((num) => parseInt(num, 10));

      if (aParts[1] !== bParts[1]) return aParts[1] - bParts[1];
      return aParts[2] - bParts[2];
    });

    // 🖋️ Definisi font yang benar
    const fonts = {
      Roboto: {
        normal: path.resolve("src/fonts/Roboto-Regular.ttf"),
        bold: path.resolve("src/fonts/Roboto-Bold.ttf"),
        italics: path.resolve("src/fonts/Roboto-Italic.ttf"),
        bolditalics: path.resolve("src/fonts/Roboto-BoldItalic.ttf"),
      },
    };

    // 🖨️ Inisialisasi PdfPrinter
    const printer = new PdfPrinter(fonts);

    // 🏷️ Generate Barcode
    let barcodeBase64 = null;
    try {
      const barcodeBuffer = await bwipJs.toBuffer({
        bcid: "code39",
        text: kode_checklist,
        scale: 3,
        height: 20,
        includetext: true,
        textxalign: "center",
      });

      barcodeBase64 = `data:image/png;base64,${barcodeBuffer.toString(
        "base64"
      )}`;
    } catch (err) {
      console.error("⚠️ Gagal membuat barcode:", err);
    }

    // Pastikan barcode valid, jika tidak, tampilkan teks alternatif
    const barcodeImage = barcodeBase64
      ? { image: barcodeBase64, width: 150, alignment: "right" }
      : {
          text: "Barcode tidak tersedia",
          style: "subheader",
          alignment: "right",
        };

    const displayedEntries = new Set();
    const tableBody = [
      [
        { text: "No Urut", bold: true, fillColor: "#D3D3D3" },
        { text: "NO MR", bold: true, fillColor: "#D3D3D3" },
        { text: "Nama Pasien", bold: true, fillColor: "#D3D3D3" },
        { text: "Tanggal", bold: true, fillColor: "#D3D3D3" },
        {
          text: "Layanan",
          bold: true,
          fillColor: "#D3D3D3",
          alignment: "center",
        },
        { text: "Periode Ranap", bold: true, fillColor: "#D3D3D3" },

        { text: "Nama Dokumen", bold: true, fillColor: "#D3D3D3" },
        { text: "Cek Ouput", bold: true, fillColor: "#D3D3D3" },
        { text: "Cek QC", bold: true, fillColor: "#D3D3D3" },
      ],
      ...data.map((item) => {
        const key = `${item.NamaPasien || "-"}-${item.NoMR || "-"}-${
          item.Tanggal || "-"
        }`;

        if (displayedEntries.has(key)) {
          return [
            item.NoUrut || "-",
            "",
            "",
            "",
            item.Layanan || "-",
            item.Periode_Ranap || "-",
            item.namadokumen || "-",
            "",
            "",
          ];
        } else {
          displayedEntries.add(key);
          return [
            item.NoUrut || "-",
            item.NoMR || "-",
            item.NamaPasien || "-",
            moment(item.Tanggal, "DDMMYYYY").format("DD-MM-YYYY") || "-",
            item.Layanan || "-",
            item.Periode_Ranap || "-",
            item.namadokumen || "-",
            "",
            "",
          ];
        }
      }),
    ];

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [10, 20, 10, 20],
      content: [
        { text: "QC CHECK SHEET", style: "header" },

        {
          table: {
            widths: ["70%", "30%"],
            body: [
              [
                {
                  text: `Kode Checklist: ${kode_checklist}`,
                  style: "table",
                  alignment: "left",
                },
              ],
            ],
          },
          layout: "noBorders",
          margin: [0, 10, 0, 0],
        },

        {
          table: {
            widths: ["45%", "15%", "40%"],
            body: [
              [
                {
                  table: {
                    widths: ["*", "*", "*", "*", "*"],
                    body: [
                      [
                        {
                          text: "Proses",
                          bold: true,
                          fillColor: "#D3D3D3",
                          fontSize: 6,
                        },
                        {
                          text: "Nama",
                          bold: true,
                          fillColor: "#D3D3D3",
                          fontSize: 6,
                        },
                        {
                          text: "Tanggal",
                          bold: true,
                          fillColor: "#D3D3D3",
                          fontSize: 6,
                        },
                        {
                          text: "Mulai",
                          bold: true,
                          fillColor: "#D3D3D3",
                          fontSize: 6,
                        },
                        {
                          text: "Selesai",
                          bold: true,
                          fillColor: "#D3D3D3",
                          fontSize: 6,
                        },
                      ],
                      [{ text: "Output", fontSize: 6 }, "", "", "", ""],
                      [{ text: "QC", fontSize: 6 }, "", "", "", ""],
                    ],
                    alignment: "left",
                    style: "table",
                  },
                },
                "",
                barcodeImage,
              ],
            ],
          },
          layout: "noBorders",
        },

        // 📌 Table Utama (Data)
        {
          table: {
            widths: ["7%", "7%", "15%", "7%", "9%", "7%", "38%", "5%", "5%"],
            body: tableBody,
          },
          margin: [0, 10, 0, 0], //
          style: "table",
        },
      ],
      styles: {
        header: {
          fontSize: 15,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        table: {
          fontSize: 6,
        },
      },
      // ✨ Tambahkan Footer Halaman
      footer: function (currentPage, pageCount) {
        return {
          text: `Page ${currentPage} of ${pageCount}`,
          alignment: "right",
          margin: [0, 10, 20, 0],
          fontSize: 8,
        };
      },
    };

    // 📄 Generate PDF dan kirim langsung ke response
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Finishing_Checklist_${kode_checklist}.pdf"`
    );
    res.setHeader("Content-Type", "application/pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (err) {
    console.error("❌ Error generate Finishing Checksheet:", err);
    return api.error(res, "Internal Server Error", 500);
  }
};

const updateMRt3 = async (req, res) => {
  const data = req.body;
  try {
    let result = await model.updateDataMRt3(data);
    return api.ok(res, result);
  } catch (error) {
    console.log(error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const removeMRt3 = async (req, res) => {
  const { NoUrut, Kode_Checklist } = req.params;
  try {
    let result = await model.deleteMRt3({ NoUrut, Kode_Checklist });
    return api.ok(res, "Delete Successfully!");
  } catch (err) {
    console.log(err);
    return api.error(res, "Internal Server Error", 500);
  }
};

const exportCSVMRt3 = async (req, res) => {
  // const { Kode_Checklist } = req.params;
  try {
    let data = req.body;

    if (!data || data.length === 0) {
      return api.error(res, "Data Not Found!", 400);
    }

    // **Buat Workbook dan Worksheet**
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data MRt3");

    // **Definisikan Header**
    const headers = [
      "No Urut",
      "Period Ranap",
      "No MR",
      "Kode Checklist",
      "Nama Pasien",
      "Tanggal",
      "Layanan",
      "Nama Dokumen",
    ];
    worksheet.addRow(headers);

    // **Tambahkan Data**
    data.forEach((row) => {
      worksheet.addRow([
        row.NoUrut || "-",
        row.Periode_Ranap || "-",
        row.NoMR || "-",
        row.Kode_Checklist || "-",
        row.NamaPasien || "-",
        row.Tanggal || "-",
        row.Layanan || "-",
        row.namadokumen || "-",
      ]);
    });

    // **Format Header Agar Tebal**
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
    });

    // **Buat Path File Excel**
    const filePath = path.join(__dirname, "../../exports/MRt3_export.xlsx");

    // **Simpan File**
    await workbook.xlsx.writeFile(filePath);

    // **Kirim File Excel ke Client**
    res.download(filePath, "data_MRt3.xlsx", (err) => {
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

const getRsNameYarsi = async (req, res) => {
  try {
    let data = await model.getRsName();
    return api.ok(res, data);
  } catch (e) {
    return api.error(res, e, 500);
  }
};

module.exports = {
  getAllDataMR,
  getDataMRByKeys,
  createDataMR,
  updateDataMR,
  deleteDataMR,
  exportCsv,
  getAllDataMRt3,
  generateFinishinCheecksheet,
  generateQcChecksheet,
  updateMRt3,
  removeMRt3,
  exportCSVMRt3,
  getAllNonaktifMR,
  nonaktifMR,
  aktifkanMR,
  getRsNameYarsi,
};
