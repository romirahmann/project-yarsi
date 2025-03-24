import { useContext, useEffect, useState } from "react";
import { ApiUrl } from "../../context/Urlapi";
import { SearchComponent } from "../reuse/SearchComponent";
import moment from "moment";
import { PaginationComponent } from "../reuse/PaginationComponent";
import { RemoveModal } from "../reuse/RemoveModal";
import { FaEdit, FaFileExport, FaTrash } from "react-icons/fa";
import { MdOutlineLibraryAdd } from "react-icons/md";
import axios from "axios";
import { ModalEditKCP } from "../reuse/modals/EditKCP";

/* eslint-disable no-unused-vars */
export function KcpPage() {
  const [dataMRt, setDataMRt] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState();
  const [showModalRemove, setShowModalRemove] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState(null);
  const baseUrl = useContext(ApiUrl);

  useEffect(() => {
    fecthDataMRt();
  }, []);

  const fecthDataMRt = async () => {
    try {
      let res = await axios.get(`${baseUrl}/master/datMRt3`);
      let data = res.data.data;
      // console.log(data);
      setDataMRt(data);
      setFilteredData(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = (value) => {
    setShowModalEdit(true);
    setSelectedData(value);
  };
  const handleModalRemove = (value) => {
    setSelectedData(value);
    setShowModalRemove(true);
  };
  const handleRemove = async (data) => {
    try {
      let res = await axios.delete(
        `${baseUrl}/master/dataMRt3/${data?.NoUrut}/${data?.Kode_Checklist}`
      );
      fecthDataMRt();
      setShowModalRemove(false);
      setSuccessMessage("Data KCP berhasil dihapus!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 1500);
    } catch (error) {
      setErrorMessage("Data gagal dihapus");
      setTimeout(() => {
        setErrorMessage("");
      }, 1500);
    }
  };
  const handleQuery = (val) => {
    setQuery(val);
  };
  const handleExport = () => {
    const exportCsv = async () => {
      try {
        const response = await axios.post(
          `${baseUrl}/master/export-mrt3`,
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
          `dataMRt3_${query !== null ? query : dateNow}.xlsx`
        ); // Nama file

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("❌ Error saat mendownload CSV:", error);
      }
    };
    exportCsv();
  };

  return (
    <>
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
        <div className="titlePage flex mt-2 mb-3 items-center">
          <MdOutlineLibraryAdd className="text-3xl text-gray-700" />
          <h1 className="text-3xl ms-3 font-bold text-gray-700">Data KCP</h1>
        </div>

        <div className="searchBar flex my-2 mt-10">
          <button
            onClick={() => handleExport()}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center"
          >
            <FaFileExport size={25} />{" "}
            <span className="ms-2">Export Excell</span>
          </button>

          <div className="ms-auto">
            <SearchComponent
              result={setFilteredData}
              data={dataMRt}
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
                <th className="px-4 py-2">Kode Checklist</th>
                <th className="px-4 py-2">No MR</th>
                <th className="px-4 py-2">Layanan</th>
                <th className="px-4 py-2 lg:w-[15em]">Nama Pasien</th>
                <th className="px-4 py-2">Tanggal</th>
                <th className="px-4 py-2 lg:w-[15em]">Periode Ranap</th>

                <th className="px-4 py-2 lg:w-[15em]">Nama Dokumen</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {paginatedData?.length > 0 ? (
                paginatedData.map((data, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{data.NoUrut}</td>
                    <td className="px-4 py-2">{data.Kode_Checklist}</td>
                    <td className="px-4 py-2">{data.NoMR}</td>
                    <td className="px-4 py-4">{data.Layanan}</td>
                    <td className="px-4 py-2 lg:w-[15em]">{data.NamaPasien}</td>
                    <td className="px-4 py-2">
                      {data.Tanggal
                        ? moment(data.Tanggal, "DDMMYYYY").format("DD-MM-YYYY")
                        : ""}
                    </td>
                    <td className="px-4 py-2 lg:w-[15em]">
                      {data.Periode_Ranap}
                    </td>
                    <td className="px-4 py-2 lg:w-[15em]">
                      {data.namadokumen}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(data)}
                        className="text-green-500 px-1 py-1 rounded-md"
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleModalRemove(data)}
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

        <ModalEditKCP
          isOpen={showModalEdit}
          onClose={() => setShowModalEdit(false)}
          data={selectedData}
          onUpdate={() => fecthDataMRt()}
        />

        <RemoveModal
          isOpen={showModalRemove}
          onClose={() => setShowModalRemove(false)}
          data={selectedData}
          deleted={(id) => handleRemove(id)}
        />
      </div>
    </>
  );
}
