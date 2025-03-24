/* eslint-disable no-unused-vars */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FaUsersGear, FaCirclePlus, FaTrash } from "react-icons/fa6";
import { SearchComponent } from "../reuse/SearchComponent";
import { PaginationComponent } from "../reuse/PaginationComponent";
import { motion } from "framer-motion";
import { RemoveModal } from "../reuse/RemoveModal";
import { ApiUrl } from "../../context/Urlapi";
import { FaEdit } from "react-icons/fa";
import { AddUser } from "../reuse/modals/AddUser";
import { EditUser } from "../reuse/modals/editUser";

export function Userpage() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState();
  const baseUrl = useContext(ApiUrl);
  const [query, setQuery] = useState("");
  // MODAL
  const [showModalAdd, setModalAdd] = useState(false);
  const [showModalEdit, setModalEdit] = useState(false);
  const [showModalRemove, setShowModalRemove] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  // STATUS
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    await axios
      .get(`${baseUrl}/master/users`)
      .then((res) => {
        setUsers(res.data.data);
        setFilteredData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalEdit(true);
  };

  const handleApiDeleted = async (data) => {
    try {
      // console.log(id);
      await axios.delete(`${baseUrl}/master/user/${data.id}`);
      setSuccessMessage(`User ID ${data.id} berhasil dihapus!`);
      setShowModalRemove(false);
      getUsers();
      setTimeout(() => {
        setSuccessMessage("");
      }, 1500);
    } catch (err) {
      setErrorMessage(`User ID ${data.id} berhasil dihapus!`);
      setShowModalRemove(false);
      getUsers();
      setTimeout(() => {
        setErrorMessage("");
      }, 1500);
      console.log(err);
    }
  };

  const handleRemove = (user) => {
    setSelectedUser(user);
    setShowModalRemove(true);
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
        <div className="titlePage flex mb-3 items-center">
          <FaUsersGear className="text-4xl text-gray-700" />
          <h1 className="text-3xl ms-2 font-bold text-gray-700 dark:text-white">
            Data Users
          </h1>
        </div>
        <div className="searchBar items-center flex my-2 mt-10">
          <button
            onClick={() => setModalAdd(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
          >
            <FaCirclePlus /> <span className="ms-2">Add</span>
          </button>
          <div className=" dark:bg-gray-900 ms-auto">
            <SearchComponent
              result={setFilteredData}
              data={users}
              queryInput={(val) => handleQuery(val)}
              currentQuery={query}
            />
          </div>
        </div>
        <div className="usersTable">
          <div className="relative overflow-x-auto sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-700 dark:text-gray-500 ">
              <thead className="text-xs font-bold text-gray-300 uppercase bg-[#043A70] dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-2">
                    No
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Username
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Email
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Jabatan
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {paginatedData?.length > 0 ? (
                  paginatedData.map((user, index) => (
                    <tr
                      key={user.id}
                      className=" border-b dark:bg-gray-800 dark:border-gray-900 border-gray-300"
                    >
                      <th
                        scope="row"
                        className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {index + 1}
                      </th>
                      <td className="px-4 py-2">{user.username}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.jabatan}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-green-500 hover:bg-green-600 hover:text-white text-center font-medium px-1 py-1  rounded-md"
                        >
                          <FaEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleRemove(user)}
                          className="text-red-600 hover:bg-red-600 hover:text-white text-center font-medium px-1 py-1  rounded-md"
                        >
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className=" border-b dark:bg-gray-800 dark:border-gray-900 border-gray-300">
                    <td
                      scope="row"
                      className="col-span-5 px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <p>Users not found !</p>
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
            data={selectedUser}
            deleted={(id) => handleApiDeleted(id)}
          />{" "}
        </motion.div>
        {/* MODAL ADD */}
        <AddUser
          isOpen={showModalAdd}
          onClose={() => setModalAdd(false)}
          addUser={() => {
            getUsers();
          }}
        />
        <EditUser
          isOpen={showModalEdit}
          onClose={() => setModalEdit(false)}
          userData={selectedUser}
          updateUser={() => {
            getUsers();
          }}
        />
      </div>
    </>
  );
}
