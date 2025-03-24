/* eslint-disable no-unused-vars */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { PaginationComponent } from "../reuse/PaginationComponent";
import { SearchComponent } from "../reuse/SearchComponent";
import { FaCirclePlus, FaTrash } from "react-icons/fa6";
import { motion } from "framer-motion";
import { ApiUrl } from "../../context/Urlapi";
import { RemoveModal } from "../reuse/RemoveModal";
import { FaEdit, FaTasks } from "react-icons/fa";
import { AddProses } from "../reuse/modals/AddProses";
import { EditProses } from "../reuse/modals/EditProses";

export function Proses() {
  const [proses, setProses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState();
  const [showModalRemove, setShowModalRemove] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedProses, setSelectedProses] = useState(null);
  const baseUrl = useContext(ApiUrl);
  const [query, setQuery] = useState("");
  // STATUS
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getProses();
  }, []);

  const getProses = async () => {
    await axios
      .get(`${baseUrl}/master/prosess`)
      .then((res) => {
        setProses(res.data.data);
        setFilteredData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRemove = (proses) => {
    showModalRemove ? setShowModalRemove(false) : setShowModalRemove(true);
    setSelectedProses(proses);
  };
  const handleEdit = (proses) => {
    setShowModalEdit(true);
    setSelectedProses(proses);
  };
  const handleApiDeleted = async (data) => {
    await axios
      .delete(`${baseUrl}/master/proses/${data.id}`)
      .then((res) => {
        setSuccessMessage(`Proses ID ${data.id} berhasil dihapus!`);
        setShowModalRemove(false);
        getProses();
        setTimeout(() => {
          setSuccessMessage("");
        }, 1500);
      })
      .catch((err) => {
        setErrorMessage(`Proses ID ${data.id} gagal dihapus!`);
        setShowModalRemove(false);
        getProses();
        setTimeout(() => {
          setErrorMessage("");
        }, 1500);
        console.log(err);
      });
  };

  const handleQuery = (val) => {
    setQuery(val);
  };

  return (
    <>
      <div className="container-fluid p-4 ">
        {/* Pesan Sukses */}
        {successMessage && (
          <div
            className="p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Pesan Error */}
        {errorMessage && (
          <div
            className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}
        <div className="titlePage mt-2 flex mb-3 items-center">
          <FaTasks className="text-3xl text-gray-700" />
          <h1 className="text-3xl ms-3 font-bold text-gray-700 dark:text-white">
            Data Proses
          </h1>
        </div>
        <div className="searchBar items-center flex my-2 mt-10">
          <button
            onClick={() => setShowModalAdd(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
          >
            <FaCirclePlus /> <span className="ms-2">Add</span>
          </button>
          <div className=" dark:bg-gray-900 ms-auto">
            <SearchComponent
              result={setFilteredData}
              data={proses}
              queryInput={(val) => handleQuery(val)}
              currentQuery={query}
            />
          </div>
        </div>
        <div className="prosesTable">
          <div className="relative overflow-x-auto sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-700 dark:text-gray-500 ">
              <thead className="text-xs font-bold text-gray-300 uppercase bg-[#043A70] dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-2">
                    No
                  </th>
                  <th scope="col" className="px-4 py-2">
                    ID Proses
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Nama Proses
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Urutan
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {paginatedData?.length > 0 ? (
                  paginatedData.map((proses, index) => (
                    <tr
                      key={proses.id}
                      className=" border-b dark:bg-gray-800 dark:border-gray-900 border-gray-300"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {index + 1}
                      </th>
                      <td className="px-4 py-2">{proses.idproses}</td>
                      <td className="px-4 py-2">{proses.nama_proses}</td>
                      <td className="px-4 py-2">{proses.urutan}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleEdit(proses)}
                          className="text-green-500 hover:bg-green-600 hover:text-white text-center font-medium px-1 py-1  rounded-md"
                        >
                          <FaEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleRemove(proses)}
                          className="text-red-600 hover:bg-red-600 hover:text-white text-center font-medium px-1 py-1  rounded-md"
                        >
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center col-span-5 border-b dark:bg-gray-800 dark:border-gray-900 border-gray-300">
                    <td
                      colSpan={5}
                      className=" px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <p className="text-xl ">Data not found !</p>
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
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          {" "}
          <RemoveModal
            isOpen={showModalRemove}
            onClose={() => setShowModalRemove(false)}
            data={selectedProses}
            deleted={(id) => handleApiDeleted(id)}
          />{" "}
        </motion.div>
        <AddProses
          isOpen={showModalAdd}
          onClose={() => setShowModalAdd(false)}
          addProses={() => getProses()}
        />
        <EditProses
          isOpen={showModalEdit}
          onClose={() => setShowModalEdit(false)}
          prosesData={selectedProses}
          updateProses={() => getProses()}
        />
      </div>
    </>
  );
}
