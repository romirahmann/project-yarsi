/* eslint-disable no-unused-vars */
import axios from "axios";
import { Modal } from "flowbite-react";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { FcProcess } from "react-icons/fc";
import { ApiUrl } from "../../context/Urlapi";
export const AktifModal = ({ isOpen, onClose, data, isActive }) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const baseUrl = useContext(ApiUrl);

  const handleAktif = () => {
    const setActive = async () => {
      try {
        if (!data) {
          alert("Data tidak boleh kosong");
        }
        let result = await axios.post(`${baseUrl}/master/aktif-mr`, data);
        console.log(result);
        setSuccessMessage("MR berhasil di aktifkan!");
        setTimeout(() => {
          setSuccessMessage("");
          onClose();
          isActive();
        }, 1500);
      } catch (err) {
        console.log(err);
        setErrorMessage("MR gagal di aktifkan!");
        setTimeout(() => {
          setErrorMessage("");
        }, 1500);
      }
    };
    setActive();
  };
  return (
    <>
      <Modal show={isOpen} onClose={onClose} size="md">
        <Modal.Header>
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
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col lg:p-2 items-center">
            <motion.span
              animate={{ scale: 1.2, rotate: -360 }}
              transition={{ duration: 3, ease: "linear" }}
            >
              <FcProcess className="text-[6em] text-red-700 my-2 " />
            </motion.span>

            <p className="text-sm text-gray-700 dark:text-gray-300 mt-5 text-wrap">
              Are you sure you want to Aktif No MR {data?.NoMR} ?
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => handleAktif()}
            className="bg-blue-500 px-3 py-2 rounded-md ms-auto font-bold text-white hover:bg-blue-600"
          >
            Aktif
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
