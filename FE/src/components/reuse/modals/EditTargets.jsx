/* eslint-disable no-unused-vars */
import axios from "axios";
import { Button, Modal } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { ApiUrl } from "../../../context/Urlapi";
import { AddLog } from "../../../context/Log";

export function EditTarget({ isOpen, onClose, data, onEdit }) {
  const [formData, setFormData] = useState({
    nama: "",
    nilai: 0,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const baseUrl = useContext(ApiUrl);
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  useEffect(() => {
    if (data) {
      setFormData({
        nama: data.nama || "",
        nilai: data.nilai || 0,
      });
    }
  }, [data]);

  const handleSubmit = async () => {
    try {
      let res = await axios.put(
        `${baseUrl}/master/target/${data?.id}`,
        formData
      );
      // console.log(res);
      AddLog(`${userData.username} edit data Target dengan ID ${data.id}`);
      setSuccessMessage("Data Berhasil Di Update!");
      setTimeout(() => {
        setSuccessMessage("");
        onEdit();
      }, 1500);
    } catch (error) {
      AddLog(
        `${userData.username} edit data Target dengan ID ${data.id}`,
        "FAILED"
      );
      setErrorMessage("Data Gagal di Update!");
      setTimeout(() => {
        setErrorMessage("");
      }, 1500);
    }
  };
  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <Modal show={isOpen} onClose={onClose} size="2xl">
        <Modal.Header>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            Edit Target
          </p>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* ID Proses & Nama Proses */}
            <div className="mt-3">
              <div>
                <label
                  htmlFor="nama"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nama Target
                </label>
                <input
                  type="text"
                  name="nama"
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => handleChange(e)}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div className="mt-3">
                <label
                  htmlFor="nilai"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nilai
                </label>
                <input
                  type="number"
                  name="nilai"
                  id="nilai"
                  value={formData.nilai}
                  onChange={(e) => handleChange(e)}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer className="flex justify-end">
          <Button color="gray" onClick={onClose}>
            Cancel
          </Button>
          <Button color="blue" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
