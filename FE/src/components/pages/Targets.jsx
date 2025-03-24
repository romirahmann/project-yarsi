import { useContext, useEffect, useState } from "react";
import { ApiUrl } from "../../context/Urlapi";
import axios from "axios";
import { SearchComponent } from "../reuse/SearchComponent";
import { RemoveModal } from "../reuse/RemoveModal";
import { FaCirclePlus, FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";
import { PaginationComponent } from "../reuse/PaginationComponent";
import { EditTarget } from "../reuse/modals/EditTargets";
import { AddTarget } from "../reuse/modals/AddTarget";

/* eslint-disable no-unused-vars */
export function TargetsPage() {
  const [targets, setTarget] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState();
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [showModalRemove, setShowModalRemove] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  // STATUS
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const baseUrl = useContext(ApiUrl);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fecthTarget();
  }, []);

  const fecthTarget = async () => {
    let res = await axios.get(`${baseUrl}/master/targets`);

    let data = res.data.data;
    setTarget(data);
    setFilteredData(data);
  };

  const handleEdit = (target) => {
    setShowModalEdit(true);
    setSelectedTarget(target);
  };
  const handleModalRemove = (target) => {
    setShowModalRemove(true);
    setSelectedTarget(target);
  };

  const handleRemove = async (data) => {
    setShowModalRemove(false);
    try {
      let res = await axios.delete(`${baseUrl}/master/target/${data.id}`);
      console.log(res.data.data);
      fecthTarget();
      setSuccessMessage(`Data target ${data.id} berhasil dihapus!`);
      setTimeout(() => {
        setSuccessMessage("");
      }, 1500);
    } catch (err) {
      console.log(err);
      fecthTarget();
      setErrorMessage(`Gagal menghapus target dengan id ${data.id}`);
      setTimeout(() => {
        setErrorMessage("");
      }, 1500);
    }
  };

  const handleUpdate = async () => {
    fecthTarget();
    setShowModalEdit(false);
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
            className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <span className="font-medium">{successMessage}</span>
          </div>
        )}
        {/* Pesan Error */}
        {errorMessage && (
          <div
            className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}
        <div className="titlePage flex mb-3 items-center">
          <TbTargetArrow className="text-3xl text-gray-700" />
          <h1 className="text-3xl ms-3 font-bold text-gray-700 dark:text-white">
            Data Target
          </h1>
        </div>
        <div className="searchBar items-center flex my-2 mt-10">
          <div className="btnAdd">
            <button
              onClick={() => setShowModalAdd(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
            >
              <FaCirclePlus /> <span className="ms-2">Add</span>
            </button>
          </div>
          <div className=" dark:bg-gray-900 ms-auto">
            <SearchComponent
              result={setFilteredData}
              data={targets}
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
                  <th scope="col" className="px-4 py-2 ">
                    Rincian Target
                  </th>
                  <th scope="col" className="px-4 py-2 ">
                    Nilai
                  </th>

                  <th scope="col" className="px-4 py-2 ">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {paginatedData?.length > 0 ? (
                  paginatedData.map((target, index) => (
                    <tr
                      key={target.id}
                      className=" border-b dark:bg-gray-800 dark:border-gray-900 border-gray-300"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {index + 1}
                      </th>
                      <td className="px-4 py-2">{target.nama}</td>
                      <td className="px-4 py-2">
                        {target.nilai.toLocaleString("id-ID")}
                      </td>

                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleEdit(target)}
                          className="text-green-500 hover:bg-green-600 hover:text-white text-center font-medium px-1 py-1  rounded-md"
                        >
                          <FaEdit size={20} />
                        </button>
                        {/* <button
                          onClick={() => handleModalRemove(target)}
                          className="text-red-600 hover:bg-red-600 hover:text-white text-center font-medium px-1 py-1  rounded-md"
                        >
                          <FaTrash size={18} />
                        </button> */}
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
        <AddTarget
          isOpen={showModalAdd}
          onClose={() => setShowModalAdd(false)}
          onAdd={() => fecthTarget()}
        />
        <EditTarget
          isOpen={showModalEdit}
          data={selectedTarget}
          onClose={() => setShowModalEdit(false)}
          onEdit={() => handleUpdate()}
        />
        <RemoveModal
          isOpen={showModalRemove}
          onClose={() => setShowModalRemove(false)}
          data={selectedTarget}
          deleted={(id) => handleRemove(id)}
        />{" "}
      </div>
    </>
  );
}
