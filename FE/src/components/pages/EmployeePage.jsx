/* eslint-disable no-unused-vars */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { PaginationComponent } from "../reuse/PaginationComponent";
import { SearchComponent } from "../reuse/SearchComponent";
import { FaCirclePlus, FaTrash } from "react-icons/fa6";
import { motion } from "framer-motion";
import { ApiUrl } from "../../context/Urlapi";
import { RemoveModal } from "../reuse/RemoveModal";
import { FaEdit, FaUsers } from "react-icons/fa";
import { AddEmployee } from "../reuse/modals/AddEmployee";
import { EditEmployee } from "../reuse/modals/EditEmployee";

export function EmployeePage() {
  const [karyawan, setKaryawan] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState();
  const [showModalRemove, setShowModalRemove] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedKaryawan, setSelectedKaryawan] = useState(null);
  const baseUrl = useContext(ApiUrl);
  const [query, setQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getKaryawan();
  }, []);

  const getKaryawan = async () => {
    await axios
      .get(`${baseUrl}/master/employees`)
      .then((res) => {
        setKaryawan(res.data.data);
        setFilteredData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRemove = (karyawan) => {
    setShowModalRemove(true);
    setSelectedKaryawan(karyawan);
  };

  const handleEdit = (karyawan) => {
    setShowModalEdit(true);
    setSelectedKaryawan(karyawan);
  };

  const handleApiDeleted = async (data) => {
    // console.log(data.id);
    await axios
      .delete(`${baseUrl}/master/employee/${data.id}`)
      .then(() => {
        setSuccessMessage(`Karyawan ID ${data.id} berhasil dihapus!`);
        setShowModalRemove(false);
        getKaryawan();
        setTimeout(() => setSuccessMessage(""), 1500);
      })
      .catch((err) => {
        setErrorMessage(`Karyawan ID ${data.id} gagal dihapus!`);
        setShowModalRemove(false);
        getKaryawan();
        setTimeout(() => setErrorMessage(""), 1500);
        console.log(err);
      });
  };

  const handleQuery = (val) => {
    setQuery(val);
  };

  return (
    <div className="container-fluid p-4">
      {successMessage && (
        <div className="p-4 text-sm text-green-800 bg-green-50">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-4 text-sm text-red-800 bg-red-50">{errorMessage}</div>
      )}

      <div className="titlePage flex mb-3 items-center">
        <FaUsers className="text-3xl text-gray-700" />
        <h1 className="text-3xl ms-3 font-bold text-gray-700">Data Karyawan</h1>
      </div>

      <div className="searchBar flex my-2 mt-10">
        <button
          onClick={() => setShowModalAdd(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <FaCirclePlus /> <span className="ms-2">Add</span>
        </button>
        <div className="ms-auto">
          <SearchComponent
            result={setFilteredData}
            data={karyawan}
            queryInput={(val) => handleQuery(val)}
            currentQuery={query}
          />
        </div>
      </div>

      <div className="relative overflow-x-auto sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs font-bold text-gray-300 bg-[#043A70]">
            <tr>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">NIK</th>
              <th className="px-4 py-2">Nama Karyawan</th>
              <th className="px-4 py-2">Submitted By</th>

              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {paginatedData?.length > 0 ? (
              paginatedData.map((karyawan, index) => (
                <tr key={karyawan.id} className="border-b">
                  <th className="px-4 py-2">{index + 1}</th>
                  <td className="px-4 py-2">{karyawan.nik}</td>
                  <td className="px-4 py-2">{karyawan.nama_karyawan}</td>
                  <td className="px-4 py-2">{karyawan.submittedby}</td>

                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(karyawan)}
                      className="text-green-500 px-1 py-1 rounded-md"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleRemove(karyawan)}
                      className="text-red-600 px-1 py-1 rounded-md"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center border-b">
                <td colSpan={7} className="px-6 py-4">
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

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <RemoveModal
          isOpen={showModalRemove}
          onClose={() => setShowModalRemove(false)}
          data={selectedKaryawan}
          deleted={(id) => handleApiDeleted(id)}
        />
      </motion.div>
      <AddEmployee
        isOpen={showModalAdd}
        onClose={() => setShowModalAdd(false)}
        addEmployee={getKaryawan}
      />
      <EditEmployee
        isOpen={showModalEdit}
        onClose={() => setShowModalEdit(false)}
        employeeData={selectedKaryawan}
        updateEmployee={getKaryawan}
      />
    </div>
  );
}
