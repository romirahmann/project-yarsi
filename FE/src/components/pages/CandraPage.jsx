/* eslint-disable no-unused-vars */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { PaginationComponent } from "../reuse/PaginationComponent";
import { SearchComponent } from "../reuse/SearchComponent";
import { FaCirclePlus, FaTrash } from "react-icons/fa6";
import { motion } from "framer-motion";
import { ApiUrl } from "../../context/Urlapi";
import { RemoveModal } from "../reuse/RemoveModal";
import { FaEdit, FaClipboardList, FaFileExport } from "react-icons/fa";
import moment from "moment";
import { EditCandra } from "../reuse/modals/EditCandra";
import { AddLog } from "../../context/Log";

// import { AddDatacandra } from "../reuse/modals/AddDatacandra";
// import { EditDatacandra } from "../reuse/modals/EditDatacandra";

export function CandraPage() {
  const [datacandra, setDatacandra] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState();
  const [showModalRemove, setShowModalRemove] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const baseUrl = useContext(ApiUrl);
  const [query, setQuery] = useState("");
  const [userLogin, setUserLogin] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    setUserLogin(user);
    getDatacandra();
  }, []);

  const getDatacandra = async () => {
    await axios
      .get(`${baseUrl}/master/candras`)
      .then((res) => {
        setDatacandra(res.data.data);
        setFilteredData(res.data.data);
        setQuery(""); // Reset query setelah update
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRemove = (data) => {
    setShowModalRemove(true);
    setSelectedData(data);
  };

  const handleEdit = (data) => {
    setShowModalEdit(true);
    setSelectedData(data);
  };
  const handleQuery = (query) => {
    setQuery(query);
  };

  const handleApiDeleted = async (data) => {
    // console.log(data.id);
    await axios
      .delete(`${baseUrl}/master/candra/${data.id}`)
      .then(() => {
        setSuccessMessage(`Data dengan ID ${data.id} berhasil dihapus!`);
        setShowModalRemove(false);
        getDatacandra();
        AddLog(
          `${userLogin.username} Delete Data CANDRA dengan Kode Checklist ${data.kode_checklist}`
        );
        setTimeout(() => setSuccessMessage(""), 1500);
      })
      .catch((err) => {
        setErrorMessage(`Data dengan ID ${data.id} gagal dihapus!`);
        setShowModalRemove(false);
        getDatacandra();
        AddLog(
          `${userLogin.username} Delete Data CANDRA dengan Kode Checklist ${data.kode_checklist}`,
          "Failed"
        );
        setTimeout(() => setErrorMessage(""), 1500);
        console.log(err);
      });
  };

  const handleExportCsv = () => {
    const exportCsv = async () => {
      try {
        const response = await axios.post(
          `${baseUrl}/master/export-candra`,
          filteredData,
          {
            responseType: "blob",
          }
        );

        const url = window.URL.createObjectURL(
          new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        );
        let dateNow = moment().format("YYYYMMDD HH:mm:ss");
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `data_CANDRA_${query !== null ? query : dateNow}.xlsx`
        ); // Nama file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        AddLog(`${userLogin.username} Export CSV`);
      } catch (error) {
        AddLog(`${userLogin.username} Export CSV`, "Failed");
        console.error("❌ Error saat mendownload CSV:", error);
      }
    };
    exportCsv();
  };

  return (
    <div className="container-fluid p-4">
      {successMessage && (
        <div className="p-4 mt-4 text-sm text-green-800 bg-green-50">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-4 mt-4 text-sm text-red-800 bg-red-50">
          {errorMessage}
        </div>
      )}

      <div className="titlePage flex mb-3 items-center">
        <FaClipboardList className="text-3xl text-gray-700" />
        <h1 className="text-3xl ms-3 font-bold text-gray-700">Data Candra</h1>
      </div>

      <div className="searchBar flex my-2 mt-10">
        <button
          onClick={() => handleExportCsv()}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <FaFileExport /> <span className="ms-2">Export Excell</span>
        </button>
        <div className="ms-auto">
          <SearchComponent
            result={setFilteredData}
            data={datacandra}
            queryInput={(query) => handleQuery(query)}
            currentQuery={query}
          />
        </div>
      </div>

      <div className="relative overflow-x-auto sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs font-bold text-gray-300 bg-[#043A70]">
            <tr>
              <th className="px-4 py-2">N</th>
              <th className="px-4 py-2">Kode Checklist</th>
              <th className="px-4 py-2">ID Proses</th>
              <th className="px-4 py-2">NIK</th>
              <th className="px-4 py-2">Qty Image</th>
              <th className="px-4 py-2">Nama Proses</th>
              <th className="px-4 py-2">Nama Karyawan</th>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Mulai</th>
              <th className="px-4 py-2">Selesai</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {paginatedData?.length > 0 ? (
              paginatedData.map((data, index) => (
                <tr key={data.id} className="border-b">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{data.kode_checklist}</td>
                  <td className="px-4 py-2">{data.idproses}</td>
                  <td className="px-4 py-2">{data.nik}</td>
                  <td className="px-4 py-2">{data.qty_image}</td>
                  <td className="px-4 py-2">{data.nama_proses}</td>
                  <td className="px-4 py-2">{data.nama_karyawan}</td>
                  <td className="px-4 py-2">
                    {moment(data.tanggal, "YYYY-MM-DD").format("DD-MM-YYYY")}
                  </td>
                  <td className="px-4 py-2">{data.mulai_formatted}</td>
                  <td className="px-4 py-2">{data.selesai_formatted}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(data)}
                      className="text-green-500 px-1 py-1 rounded-md"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleRemove(data)}
                      className="text-red-600 px-1 py-1 rounded-md"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center border-b">
                <td colSpan={13} className="px-6 py-4">
                  Data not found!
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
          data={filteredData}
        />

        <EditCandra
          isOpen={showModalEdit}
          onClose={() => {
            setShowModalEdit(false);
            setQuery("");
          }}
          candraData={selectedData}
          updateCandra={() => getDatacandra()}
        />
        <RemoveModal
          isOpen={showModalRemove}
          onClose={() => setShowModalRemove(false)}
          data={selectedData}
          deleted={(id) => handleApiDeleted(id)}
        />
      </div>
    </div>
  );
}
