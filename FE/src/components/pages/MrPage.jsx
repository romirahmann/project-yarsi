/* eslint-disable no-unused-vars */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { PaginationComponent } from "../reuse/PaginationComponent";
import { SearchComponent } from "../reuse/SearchComponent";
import { FaClipboardList, FaEdit, FaTrash, FaFileExport } from "react-icons/fa";
import { AiOutlineStop } from "react-icons/ai";
import moment from "moment";
import { ApiUrl } from "../../context/Urlapi";
import { EditMr } from "../reuse/modals/EditMr";
import { RemoveModal } from "../reuse/RemoveModal";
import { NonaktifModal } from "../reuse/NonaktifComponent";
import { AddLog } from "../../context/Log";

export function MrPage() {
  const [dataMr, setDataMr] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState();
  const [showModalRemove, setShowModalRemove] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalNonaktif, setShowModalNonaktif] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [query, setQuery] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const baseUrl = useContext(ApiUrl);
  const [loading, setLoading] = useState(false);
  const [userLogin, setUserLogin] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    setUserLogin(user);
    getDataMr();
  }, []);

  const getDataMr = async () => {
    try {
      const res = await axios.get(`${baseUrl}/master/datamrs`);
      setDataMr(res.data.data);
      setFilteredData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemove = (data) => {
    setShowModalRemove(true);
    setSelectedData(data);
  };

  const handleEdit = (data) => {
    setShowModalEdit(true);
    setSelectedData(data);
  };
  const handleModalNonaktif = (data) => {
    setShowModalNonaktif(true);
    setSelectedData(data);
  };

  const handleQuery = (val) => {
    setQuery(val);
  };

  const handleExportCsv = () => {
    setLoading(true);
    const exportCsv = async () => {
      try {
        console.log(filteredData.length);
        const response = await axios.post(
          `${baseUrl}/master/export-datamr/`,
          filteredData,
          {
            responseType: "blob",
          }
        );

        setLoading(false);

        const url = window.URL.createObjectURL(
          new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        );

        AddLog(`${userLogin.username} Export Data MR`);
        let dateNow = moment().format("YYYYMMDD HH:mm:ss");
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `data_MR_${query !== null ? query : dateNow}.xlsx`
        ); // Nama file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("❌ Error saat mendownload CSV:", error);
        AddLog(`${userLogin.username} Export Data MR`, "FAILED");
        setErrorMessage("Gagal Export CSV ", error);
        setLoading(false);
        setTimeout(() => {
          setErrorMessage("");
        }, 1500);
      }
    };
    exportCsv();
  };

  const handleDelete = (data) => {
    const deleteData = async () => {
      await axios
        .delete(
          `${baseUrl}/master/datamr/${data.NoUrut}/${data.Kode_Checklist}`
        )
        .then(() => {
          setSuccessMessage(`Data dengan No MR ${data.NoMR} berhasil dihapus!`);
          setShowModalRemove(false);
          getDataMr();
          AddLog(`${userLogin.username} Delete Data MR`);
          setTimeout(() => setSuccessMessage(""), 1500);
        })
        .catch((err) => {
          setErrorMessage(`Data dengan No MR ${data.NoMR} gagal dihapus!`);
          AddLog(`${userLogin.username} Delete Data MR`, "FAILED");
          setShowModalRemove(false);
          getDataMr();
          setTimeout(() => setErrorMessage(""), 1500);
          console.log(err);
        });
    };
    deleteData();
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
        <h1 className="text-3xl ms-3 font-bold text-gray-700">Data MR</h1>
      </div>

      <div className="searchBar flex my-2 mt-10">
        <button
          onClick={() => handleExportCsv()}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center"
        >
          {loading ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <FaFileExport />
          )}
          <span className="ms-2">Export Excell</span>
        </button>
        <div className="ms-auto">
          <SearchComponent
            result={setFilteredData}
            data={dataMr}
            queryInput={(val) => handleQuery(val)}
            currentQuery={query}
          />
        </div>
      </div>

      <div className="relative overflow-x-auto sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs font-bold text-gray-300 bg-[#043A70]">
            <tr>
              <th className="px-4 py-2">No Urut</th>
              <th className="px-5 py-2">Kode Checklist</th>
              <th className="px-4 py-2">No MR</th>
              {/* <th className="px-6 py-3">No Box</th> */}
              <th className="px-5 py-2 ">Nama Pasien</th>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Qty Image</th>
              <th className="px-4 py-2">Mulai</th>
              <th className="px-4 py-2">Selesai</th>
              <th className="px-2 py-2 lg:w-[5em]">File Path</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {paginatedData?.length > 0 ? (
              paginatedData.map((data, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 ">{data.NoUrut}</td>
                  <td className="px-5 py-2 ">{data.Kode_Checklist}</td>
                  <td className="px-4 py-2 ">{data.NoMR}</td>
                  {/* <td className="px-6 py-4">{data.nobox}</td> */}
                  <td className="px-5 py-2 ">{data.NamaPasien}</td>
                  <td className="px-4 py-2 ">
                    {data.Tanggal
                      ? moment(data.Tanggal, "DDMMYYYY").format("DD/MM/YYYY")
                      : ""}
                  </td>
                  <td className="px-4 py- ">{data.Qty_Image}</td>

                  <td className="px-4 py-2 ">{data.Mulai}</td>
                  <td className="px-4 py-2 ">{data.Selesai}</td>

                  <td className="px-2 py-2 break-words">{data.FilePath}</td>
                  <td className="px-4 py-2 ">
                    <button
                      onClick={() => handleEdit(data)}
                      className="text-green-500 px-1 py-1 rounded-md"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleModalNonaktif(data)}
                      className="text-red-600 px-1 py-1 rounded-md"
                    >
                      <AiOutlineStop size={18} />
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
                <td colSpan={11} className="px-6 py-4">
                  Data not found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <PaginationComponent
          setPaginatedData={setPaginatedData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          data={filteredData}
        />
      </div>

      <NonaktifModal
        isOpen={showModalNonaktif}
        onClose={() => setShowModalNonaktif(false)}
        data={selectedData}
        nonAktif={() => getDataMr()}
      />

      <EditMr
        isOpen={showModalEdit}
        onClose={() => setShowModalEdit(false)}
        mrData={selectedData}
        updateMR={() => getDataMr()}
      />
      <RemoveModal
        isOpen={showModalRemove}
        onClose={() => setShowModalRemove(false)}
        data={selectedData}
        deleted={(data) => handleDelete(data)}
      />
    </div>
  );
}
