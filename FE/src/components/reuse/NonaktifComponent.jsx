/* eslint-disable no-unused-vars */
import { Modal } from "flowbite-react";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { AiOutlineStop } from "react-icons/ai";
import { ApiUrl } from "../../context/Urlapi";
import axios from "axios";

export const NonaktifModal = ({ isOpen, onClose, data, nonAktif }) => {
  const baseUrl = useContext(ApiUrl);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleNonaktif = () => {
    const Nonaktif = async () => {
      try {
        if (!data) {
          alert("Data tidak boleh kosong");
        }
        let result = await axios.post(`${baseUrl}/master/nonaktif-mr`, data);
        console.log(result);
        setSuccessMessage("MR berhasil di nonaktifkan!");
        setTimeout(() => {
          setSuccessMessage("");
          onClose();
          nonAktif();
        }, 1500);
      } catch (err) {
        console.log(err);
        setErrorMessage("MR gagal di nonaktifkan!");
        setTimeout(() => {
          setErrorMessage("");
        }, 1500);
      }
    };
    Nonaktif();
  };
  return (
    <>
      <Modal show={isOpen} onClose={onClose} size="md">
        <Modal.Header>
          {" "}
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            Nonaktifkan MR
          </p>
        </Modal.Header>
        <Modal.Body>
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
          <div className="flex flex-col lg:p-2 items-center">
            <motion.span animate={{ scale: 1.2 }}>
              <AiOutlineStop className="text-[6em] text-red-700 my-2 " />
            </motion.span>

            <p className="text-sm text-gray-700 dark:text-gray-300 mt-5 text-wrap">
              Are you sure you want to nonaktif No MR {data?.NoMR} ?
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => handleNonaktif()}
            className="bg-blue-500 px-3 py-2 rounded-md ms-auto font-bold text-white hover:bg-blue-600"
          >
            Nonaktif
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
