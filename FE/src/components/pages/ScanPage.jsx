/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ApiUrl } from "../../context/Urlapi";
import { MdDocumentScanner } from "react-icons/md";
import moment from "moment";
import dayjs from "dayjs";
import { PaginationComponent } from "../reuse/PaginationComponent";
import { SearchComponent } from "../reuse/SearchComponent";
import { FinishedScan } from "../../components/reuse/modals/FinishedScan";
import { useRef } from "react";
import { AddLog } from "../../context/Log";

export function ScanPage() {
  const baseUrl = useContext(ApiUrl);
  const [dataCandra, setDataCandra] = useState([]);
  const kodeChecklistRef = useRef(null);
  const [step, setStep] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const [userLogin, setUserLogin] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [totalItemShow, setTotalItemShow] = useState(10);
  const [proses, setProses] = useState([]);
  const [showModalScan, setShowModalScan] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [filterIdProses, setFilterIdProses] = useState("All");
  const [rsName, setRsName] = useState("");
  const [query, setQuery] = useState("");

  const [formData, setFormData] = useState({
    kode_checklist: "",
    idproses: "",
    nama_proses: "",
    qty_image: 0,
    nik: "",
    nama_karyawan: "",
    mulai: "",
    selesai: "",
    submittedby: "",
    tanggal: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    setUserLogin(user);
  }, []);

  useEffect(() => {
    fetchDataCandra();
    fetchDataProses();
  }, []);

  useEffect(() => {
    if (formData.idproses.trim() && !isLocked) {
      axios
        .get(`${baseUrl}/master/proses/${formData.idproses}`)
        .then((res) =>
          setFormData((prev) => ({
            ...prev,
            nama_proses: res.data.data.nama_proses || "",
          }))
        )
        .catch(() => setFormData((prev) => ({ ...prev, nama_proses: "" })));
    }
  }, [formData.idproses, isLocked]);

  useEffect(() => {
    if (formData.nik.trim() && !isLocked) {
      axios
        .get(`${baseUrl}/master/employee-by-nik/${formData.nik}`)
        .then((res) =>
          setFormData((prev) => ({
            ...prev,
            nama_karyawan: res.data.data.nama_karyawan || "",
          }))
        )
        .catch(() => setFormData((prev) => ({ ...prev, nama_karyawan: "" })));
    }
  }, [formData.nik, isLocked]);

  useEffect(() => {
    // Memastikan totalItemShow tidak null atau NaN
    if (!totalItemShow || isNaN(totalItemShow)) {
      setTotalItemShow(10);
    }
    // Update pagination data saat totalItemShow berubah
    setCurrentPage(1); // Reset ke halaman pertama
  }, [totalItemShow]);

  useEffect(() => {
    if (kodeChecklistRef.current) {
      kodeChecklistRef.current.focus();
    }
  }, []);

  useEffect(() => {
    fecthRSName();
  }, []);

  const fecthRSName = async () => {
    try {
      let res = await axios.get(`${baseUrl}/master/rs-name`);
      // console.log(res.data.data.rumahsakit);
      setRsName(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchDataCandra = async () => {
    try {
      const response = await axios.get(`${baseUrl}/master/candra-now`);
      const newData = response.data.data;
      setDataCandra(newData);

      // Pastikan filteredData tetap sesuai dengan filter yang dipilih
      setFilteredData(
        filterIdProses === "All"
          ? newData
          : newData.filter((item) => item.idproses === filterIdProses)
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataProses = async () => {
    try {
      const res = await axios.get(`${baseUrl}/master/prosess`);
      setProses(res.data.data);
    } catch (err) {
      console.log("Error Fecthing Data Proses");
    }
  };

  const handleChange = (e) => {
    setErrorMessage("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNextStep = (field) => {
    if (formData[field].trim()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dateNow = dayjs().format("YYYY-MM-DD");
    const timestamp = dayjs().format("HH:mm:ss");
    const submittedByUser = userLogin?.username || "";

    const newFormData = {
      ...formData,
      mulai: timestamp,
      selesai: "00:00:00",
      submittedby: submittedByUser,
      tanggal: dateNow,
    };

    try {
      await axios.post(`${baseUrl}/master/add-scan`, newFormData);
      setSuccessMessage("Data berhasil ditambahkan!");

      // Perbarui data dengan filter yang tetap terjaga
      await fetchDataCandra();

      AddLog(
        `Proses dengan Kode Checklist: ${newFormData.kode_checklist} dan ID Proses ${newFormData.idproses} telah ditambahkan oleh ${userLogin?.username}`
      );

      setTimeout(() => {
        setSuccessMessage("");
        kodeChecklistRef.current.focus();
      }, 1500);
    } catch (error) {
      setErrorMessage(error.response.data.data.message);
      setTimeout(() => {
        setErrorMessage("");
      }, 1500);
      AddLog(
        `Gagal menambahkan proses dengan Kode Checklist: ${newFormData.kode_checklist} dan ID Proses ${newFormData.idproses}`,
        "FAILED"
      );
    }

    if (!isLocked) {
      setFormData({
        kode_checklist: "",
        idproses: "",
        nama_proses: "",
        qty_image: 0,
        nik: "",
        nama_karyawan: "",
        mulai: "",
        selesai: "",
        submittedby: "",
        tanggal: "",
      });
    } else {
      setFormData((prev) => ({ ...prev, kode_checklist: "" }));
    }

    setStep(1);
    kodeChecklistRef.current.focus();
  };

  const handleSelesai = (scan) => {
    // console.log(scan);
    const timestamp = moment().format("HH:mm:ss");
    let newData = {
      ...scan,
      selesai_formatted: timestamp,
    };
    if (newData) {
      axios
        .put(
          `${baseUrl}/master/finish-proses/${newData.kode_checklist}/${newData.idproses}`,
          newData
        )
        .then((res) => {
          AddLog(
            `Proses dengan Kode Checklist: ${newData.kode_checklist} dan ID Proses ${newData.idproses} telah diselesaikan oleh ${userLogin?.username}`
          );
          setSuccessMessage(
            `Proses dengan ID ${newData.idproses} dan kode checklist ${newData.kode_checklist} telah selesai`
          );
          fetchDataCandra();
          setTimeout(() => {
            setSuccessMessage("");
            kodeChecklistRef.current.focus();
          }, 2000);
        })
        .catch((err) => {
          AddLog(
            `Proses dengan Kode Checklist: ${newData.kode_checklist} dan ID Proses ${newData.idproses} telah diselesaikan oleh ${userLogin?.username}`,
            "FAILED"
          );
          setErrorMessage(`Silahkan ulangi klik tombol selesai`);
        });
    } else {
      setErrorMessage("Data Not Found!");
      setTimeout(() => {
        setErrorMessage("");
        kodeChecklistRef.current.focus();
      }, 1500);
    }
  };

  const handleShowModalScan = (scan) => {
    setShowModalScan(true);
    setSelectedData(scan);
  };

  const handleFilterChange = (e) => {
    const selectedId = e.target.value;
    setFilterIdProses(selectedId);

    // Terapkan filter langsung ke data yang sudah ada
    if (selectedId === "All") {
      setFilteredData(dataCandra);
    } else {
      setFilteredData(
        dataCandra.filter((item) => item.idproses === selectedId)
      );
    }
  };

  // Gunakan useEffect untuk memperbarui pagination jika filteredData berubah
  useEffect(() => {
    setCurrentPage(1); // Reset ke halaman pertama setiap kali data difilter
  }, [filteredData]);

  const handleEnter = (e) => {
    console.log(e);
    if (!isLocked) {
      setStep((prev) => prev + 1);
      if (e.key === "Enter") {
        e.preventDefault(); // Mencegah form submit default

        const form = e.target.form;
        const index = Array.from(form.elements).indexOf(e.target);
        const nextElement = form.elements[index + 1];

        if (form.elements[index].form.value === "") {
          setErrorMessage("Isi Inputan dengan benar");
        }

        if (nextElement) {
          if (nextElement.disabled) {
            // Jika elemen berikutnya disable, submit form
            form.submit();
          } else {
            // Jika tidak, fokus ke elemen berikutnya
            nextElement.focus();
          }
        }
      }
    }
  };

  const handleQuery = (val) => {
    setQuery(val);
  };

  return (
    <div className="container-fluid">
      {/* Pesan Sukses */}
      {successMessage && (
        <div
          className="p-4 z-40 text-sm text-green-800 rounded-lg bg-green-50"
          role="alert"
        >
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Pesan Error */}
      {errorMessage && (
        <div
          className="p-4 z-40 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}
      <div className="titlePage p-3 flex my-5 items-center">
        <MdDocumentScanner className="text-4xl text-gray-700" />
        <h1 className="text-3xl ms-2 font-bold text-gray-700">
          SCANNING PROSES {rsName.rumahsakit}
        </h1>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 col-1 border rounded-lg shadow-md bg-gray-50">
          <form className="space-y-3 p-4">
            <h2 className="text-2xl text-center font-semibold mb-4">
              SCAN MULAI
            </h2>
            <input
              type="text"
              name="kode_checklist"
              placeholder="Kode Checklist"
              value={formData.kode_checklist || ""}
              onChange={handleChange}
              onBlur={() => handleNextStep("kode_checklist")}
              onKeyDown={(e) => handleEnter(e)}
              ref={kodeChecklistRef}
              className="w-full p-2 border border-gray-200 rounded"
              required
            />
            <input
              type="text"
              name="idproses"
              placeholder="ID Proses"
              value={formData.idproses || ""}
              onChange={handleChange}
              onBlur={() => handleNextStep("idproses")}
              onKeyDown={(e) => handleEnter(e)}
              className={`w-full p-2 border border-gray-200 rounded ${
                isLocked ? "bg-gray-300" : ""
              }`}
              required
              disabled={step < 2 || isLocked}
            />

            <input
              type="text"
              name="nik"
              placeholder="NIK"
              value={formData.nik || ""}
              onChange={handleChange}
              onKeyDown={(e) => handleEnter(e)}
              onBlur={() => handleNextStep("nik")}
              className={`w-full p-2 border border-gray-200 rounded ${
                isLocked ? "bg-gray-300" : ""
              }`}
              required
              disabled={step < 3 || isLocked}
            />
            <input
              type="text"
              name="nama_proses"
              placeholder="Nama Proses"
              value={formData.nama_proses || ""}
              disabled
              className="w-full p-2 border border-gray-200 rounded bg-gray-300"
            />
            <input
              type="text"
              name="nama_karyawan"
              placeholder="Nama Karyawan"
              value={formData.nama_karyawan || ""}
              disabled
              className="w-full p-2 border border-gray-200 rounded bg-gray-300"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="lockValues"
                checked={isLocked}
                onChange={() => setIsLocked(!isLocked)}
              />
              <label htmlFor="lockValues">Kunci ID Proses & NIK</label>
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full hover:bg-blue-800 cursor-pointer bg-blue-600 text-white p-2 rounded"
            >
              Submit
            </button>
          </form>
        </div>
        <div className="col-span-3 border rounded-lg shadow-md overflow-auto p-5 bg-gray-50">
          <h2 className="text-2xl text-center font-semibold mb-4">
            SCAN SELESAI
          </h2>
          <div className="header flex">
            <div className="showItem">
              <label htmlFor="itemShow" className="text-gray-600 me-2">
                Show:
              </label>
              <select
                id="itemShow"
                className="px-2 py-1 border border-gray-300 rounded"
                value={totalItemShow}
                onChange={(e) => {
                  setTotalItemShow(Number(e.target.value));
                }}
              >
                {[10, 20, 50, 100].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            {/* Input Search */}
            <div className="mb-4 flex items-center ms-auto">
              <div className="showItem mx-3">
                <label htmlFor="itemShow" className="text-gray-600 me-2">
                  ID Proses:
                </label>
                <select
                  id="itemShow"
                  className="px-2 py-1 border border-gray-300 rounded"
                  defaultValue="All"
                  onChange={handleFilterChange}
                >
                  <option value="All">All</option>
                  {proses.map((value) => (
                    <option key={value.idproses} value={value.idproses}>
                      {value.idproses}
                    </option>
                  ))}
                </select>
              </div>
              <SearchComponent
                result={setFilteredData}
                data={dataCandra}
                queryInput={(val) => handleQuery(val)}
                currentQuery={query}
              />
            </div>
          </div>
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">No</th>
                <th className="border p-2">Kode Checklist</th>
                <th className="border p-2">ID Proses</th>
                <th className="border p-2">Nama Proses</th>
                <th className="border p-2">Nama Karyawan</th>
                <th className="border p-2">Mulai</th>
                <th className="border p-2">Selesai</th>
                <th className="border p-2">Lembar Scan</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((scan, index) => (
                  <tr key={index} className="text-center">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{scan.kode_checklist}</td>
                    <td className="border p-2">{scan.idproses}</td>
                    <td className="border p-2">{scan.nama_proses}</td>
                    <td className="border p-2">{scan.nama_karyawan}</td>
                    <td className="border p-2">{scan.mulai_formatted}</td>
                    <td className="border p-2">
                      {scan.selesai_formatted !== "00:00:00" ? (
                        scan.selesai_formatted
                      ) : (
                        <div className="button">
                          {scan.idproses == "1003" && scan.qty_image === 0 ? (
                            <button
                              onClick={() => handleShowModalScan(scan)}
                              className="p-2 text-white px-3 bg-blue-700 hover:bg-blue-800 rounded-lg"
                            >
                              Selesai
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSelesai(scan)}
                              className="p-2 px-3 text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
                            >
                              Selesai
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="border p-2">
                      {scan.idproses == "1003" && scan.qty_image === 0
                        ? 0
                        : scan.qty_image}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center border p-4">
                    Data tidak ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}
          <PaginationComponent
            setPaginatedData={setPaginatedData}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            data={filteredData || []}
            itemShow={totalItemShow}
          />
        </div>
      </div>
      <FinishedScan
        isOpen={showModalScan}
        onClose={() => setShowModalScan(false)}
        selectedData={selectedData}
        onUpdate={() => fetchDataCandra()}
      />
    </div>
  );
}
