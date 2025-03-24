/* eslint-disable no-unused-vars */
import { Modal } from "flowbite-react";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
export const RemoveModal = ({ isOpen, onClose, data, deleted }) => {
  return (
    <>
      <Modal show={isOpen} onClose={onClose} size="md">
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div className="flex flex-col lg:p-2 items-center">
            <motion.span animate={{ scale: 1.2 }}>
              <FaTrash className="text-[6em] text-red-700 my-2 " />
            </motion.span>

            <p className="text-gray-700 dark:text-gray-300 mt-5 text-wrap">
              Are you sure you want to delete this data ?
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => deleted(data)}
            className="bg-red-500 px-3 py-2 rounded-md ms-auto font-bold text-white hover:bg-red-600"
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
