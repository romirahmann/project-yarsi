/* eslint-disable no-unused-vars */
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { ApiUrl } from "../../context/Urlapi";

import { MdOutlineLibraryAddCheck, MdOutlineFactCheck } from "react-icons/md";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { SearchComponent } from "../reuse/SearchComponent";
import { PaginationComponent } from "../reuse/PaginationComponent";
import { RemoveModal } from "../reuse/RemoveModal";
import axios from "axios";

import { AddLog } from "../../context/Log";

export function CheecksheetPage() {
  const [dataMRt, setDataMRt] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState();
  const [showModalRemove, setShowModalRemove] = useState(false);

  const [selectedData, setSelectedData] = useState(null);
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const baseUrl = useContext(ApiUrl);
  const [loading, setLoading] = useState(false);
  const [userLogin, setUserLogin] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    setUserLogin(user);
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

  const handleExportFinishing = async () => {
    setLoading(true);
    if (!selectedChecklist) {
      alert("Please search kode checklist first");
      setLoading(false);
      return;
    }

    try {
      // Menggunakan `responseType: 'blob'` agar menerima file PDF dalam bentuk binary
      let res = await axios.get(
        `${baseUrl}/master/finishing-checksheet/${selectedChecklist}`,
        { responseType: "blob" }
      );

      setLoading(false);

      // Buat URL dari Blob
      const fileURL = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );

      AddLog(
        `User ${userLogin?.username} Export Finishing Checksheet`,
        "SUCCESSFULLY"
      );

      // Buka di tab baru
      window.open(fileURL, "_blank");
    } catch (e) {
      AddLog(
        `User ${userLogin?.username} Export Finishing Checksheet`,
        "FAILED"
      );
      console.error("Error exporting PDF:", e);
    }
  };

  const handleExportQc = async () => {
    setLoading(true);
    if (!selectedChecklist) {
      alert("Please search kode checklist first");
      setLoading(false);
      return;
    }

    try {
      // Menggunakan `responseType: 'blob'` agar menerima file PDF dalam bentuk binary
      let res = await axios.get(
        `${baseUrl}/master/qc-checksheet/${selectedChecklist}`,
        { responseType: "blob" }
      );

      setLoading(false);

      // Buat URL dari Blob
      const fileURL = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );
      AddLog(
        `User ${userLogin?.username} Export QC Checksheet`,
        "SUCCESSFULLY"
      );
      // Buka di tab baru
      window.open(fileURL, "_blank");
    } catch (e) {
      AddLog(`User ${userLogin?.username} Export QC Checksheet`, "FAILED");
      console.error("Error exporting PDF:", e);
    }
  };

  const handleSelectedChecklist = (value) => {
    setSelectedChecklist(value);
  };

  return (
    <>
      <div className="container-fluid p-4">
        <div className="titlePage flex mb-3 items-center">
          <MdOutlineLibraryAddCheck className="text-3xl text-gray-700" />
          <h1 className="text-3xl ms-3 font-bold text-gray-700">
            Data Checksheet
          </h1>
        </div>

        <div className="searchBar flex my-2 mt-10">
          <button
            onClick={() => handleExportFinishing()}
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
              <IoCheckmarkDoneCircleSharp size={25} />
            )}
            <span className="ms-2">Export Finishing</span>
          </button>
          <button
            onClick={() => handleExportQc()}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center ms-2"
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
              <MdOutlineFactCheck size={25} />
            )}
            <span className="ms-2">Export QC</span>
          </button>
          <div className="ms-auto">
            <SearchComponent
              result={setFilteredData}
              data={dataMRt}
              queryInput={(e) => handleSelectedChecklist(e)}
              currentQuery={selectedChecklist}
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
                <th className="px-4 py-2">Nama Pasien</th>
                <th className="px-4 py-2">Tanggal</th>
                <th className="px-4 py-2">Periode Ranap</th>
                <th className="px-4 py-2">Nama Dokumen</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {paginatedData?.length > 0 ? (
                paginatedData.map((data, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{data.NoUrut}</td>
                    <td className="px-4 py-2">{data.Kode_Checklist}</td>
                    <td className="px-4 py-2">{data.NoMR}</td>
                    <td className="px-6 py-4">{data.Layanan}</td>
                    <td className="px-4 py-2">{data.NamaPasien}</td>
                    <td className="px-4 py-2">
                      {data.Tanggal
                        ? moment(data.Tanggal, "DDMMYYYY").format("DD-MM-YYYY")
                        : ""}
                    </td>
                    <td className="px-4 py-2">{data.Periode_Ranap}</td>
                    <td className="px-4 py-2">{data.namadokumen}</td>
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

        <RemoveModal
          isOpen={showModalRemove}
          onClose={() => setShowModalRemove(false)}
          data={selectedData}
          deleted={() => fecthDataMRt()}
        />
      </div>
    </>
  );
}
