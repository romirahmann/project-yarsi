/* eslint-disable no-unused-vars */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FaRecycle } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { ApiUrl } from "../../context/Urlapi";
import { AddLog } from "../../context/Log";
import { PaginationComponent } from "../reuse/PaginationComponent";
import { SearchComponent } from "../reuse/SearchComponent";

export function UpdatePage() {
  const [loading, setLoading] = useState(false);
  const [fileCandra, setFileCandra] = useState(null);
  const [fileQty, setFileQty] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userLogin, setUserLogin] = useState(null);
  const [candraNotComplete, setCandraNotComplete] = useState([]);
  const baseUrl = useContext(ApiUrl);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    setUserLogin(user);
  }, []);

  useEffect(() => {
    fecthDataCandra();
  }, []);

  const fecthDataCandra = async () => {
    try {
      let res = await axios.get(`${baseUrl}/master/validate-proses`);
      console.log(res.data.data);
      setCandraNotComplete(res.data.data);
      setFilteredData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (type === "candra") {
      setFileCandra(file);
    } else if (type === "qty") {
      setFileQty(file);
    }
  };

  const handleUpload = async (type) => {
    setLoading(true);
    // console.log(type);
    const file = type === "candra" ? fileCandra : fileQty;

    if (!file) {
      setErrorMessage("Please Upload File First!");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${baseUrl}/master/upload-mdb`, formData);
      setSuccessMessage("Upload File Successfully!");
      AddLog(`User ${userLogin.username} update database ${type} !`);
      type === "candra" ? setFileCandra(null) : setFileQty(null);
      setLoading(false);
    } catch (error) {
      setErrorMessage("Upload File Failed!", error);
      AddLog(`User ${userLogin.username} update database ${type} !`, "FAILED");
    } finally {
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 1500);
      setLoading(false);
    }
  };

  const handleQuery = (val) => {
    setQuery(val);
  };

  return (
    <div className="container-fluid p-4">
      {/* Pesan Sukses */}
      {successMessage && (
        <div
          className="p-4 text-sm text-green-800 rounded-lg bg-green-50"
          role="alert"
        >
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Pesan Error */}
      {errorMessage && (
        <div
          className="p-4 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      <div className="titlePage flex my-5 items-center">
        <FaRecycle className="text-4xl text-gray-700" />
        <h1 className="text-3xl ms-2 font-bold text-gray-700">
          UPDATE DATABASE
        </h1>
      </div>

      <div className="container grid grid-cols-2 gap-4">
        {/* Update Database */}
        <div className="updateCandra bg-gray-100 p-5">
          <h1 className="font-bold text-2xl">UPDATE DATABASE</h1>
          <div className="fileInput mt-5">
            <label
              className="block text-sm mb-2 font-medium"
              htmlFor="file_candra"
            >
              Upload file
            </label>
            <input
              onChange={(e) => handleFileChange(e, "candra")}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
              id="file_candra"
              type="file"
            />
            <p className="mt-1 text-sm text-gray-500">
              Format file: .mdb, Filename: dbData.mdb
            </p>
          </div>
          <div className="btn flex items-center">
            <button
              onClick={() => handleUpload("candra")}
              disabled={loading || candraNotComplete.length !== 0}
              className={`mt-5 text-white ${
                candraNotComplete.length === 0
                  ? "bg-blue-700 hover:bg-blue-800"
                  : "bg-gray-300 "
              } focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5`}
            >
              {loading ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                "Upload"
              )}
            </button>
            {candraNotComplete.length !== 0 && (
              <span className="mt-4 ms-3 text-red-600">
                Selesaikan proses terlebih dahulu !
              </span>
            )}
          </div>
        </div>

        {/* Update Data Qty */}
        <div className="updateQty bg-gray-100 p-5">
          <h1 className="font-bold text-2xl">UPDATE DATA QTY</h1>
          <div className="fileInput mt-5">
            <label
              className="block text-sm mb-2 font-medium"
              htmlFor="file_qty"
            >
              Upload file
            </label>
            <input
              onChange={(e) => handleFileChange(e, "qty")}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
              id="file_qty"
              type="file"
            />
            <p className="mt-1 text-sm text-gray-500">
              Format file: .mdb, Filename: dbQty.mdb
            </p>
          </div>
          <div className="btn flex items-center">
            <button
              onClick={() => handleUpload("qty")}
              disabled={loading || candraNotComplete.length !== 0}
              className={`mt-5 text-white ${
                candraNotComplete.length === 0
                  ? "bg-blue-700 hover:bg-blue-800"
                  : "bg-gray-300"
              } focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5`}
            >
              {loading ? (
                <div role="status flex">
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                "Upload"
              )}
            </button>
            {candraNotComplete.length !== 0 && (
              <span className="mt-4 ms-3 text-red-600">
                Selesaikan proses terlebih dahulu !
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="proses mt-5">
        <div className="dataProses bg-white p-5">
          <div className="header flex items-center">
            <span className="text-xl font-bold flex items-center">
              <IoIosWarning className="text-red-700 me-3 text-2xl" />
              <span className="text-gray-800 ">SCAN PROSES BELUM SELESAI</span>
            </span>
            <div className="search ms-auto">
              <SearchComponent
                result={setFilteredData}
                data={candraNotComplete}
                queryInput={(val) => handleQuery(val)}
                currentQuery={query}
              />
            </div>
          </div>
          <div className="mt-5 relative overflow-x-auto sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs font-bold text-gray-300 bg-[#043A70]">
                <tr>
                  <th className="px-6 py-3">No</th>
                  <th className="px-6 py-3">Kode Checklist</th>
                  <th className="px-6 py-3">Finished</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((data, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-6 py-4 text-wrap">{index + 1}</td>
                      <td className="px-6 py-4 text-wrap">
                        {data.kode_checklist}
                      </td>
                      <td className="px-6 py-4">
                        {data.proses.map((p) => p.nama_proses).join(", ")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center border-b">
                    <td colSpan={4} className="px-6 py-4">
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
        </div>
      </div>
    </div>
  );
}
