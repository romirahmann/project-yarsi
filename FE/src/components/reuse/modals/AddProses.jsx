/* eslint-disable no-unused-vars */
import { useContext, useState, useEffect } from "react";
import { Modal, Button } from "flowbite-react";
import { ApiUrl } from "../../../context/Urlapi";
import axios from "axios";
import { AddLog } from "../../../context/Log";

export function AddProses({ isOpen, onClose, addProses }) {
  const baseUrl = useContext(ApiUrl);
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  // Fungsi untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // State untuk menyimpan input form
  const [formData, setFormData] = useState({
    idproses: "",
    nama_proses: "",
    urutan: "",
    trn_date: getTodayDate(),
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Reset form saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setFormData({
        idproses: "",
        nama_proses: "",
        urutan: "",
        trn_date: getTodayDate(),
      });
    }
  }, [isOpen]);

  // Handle perubahan input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      await axios.post(`${baseUrl}/master/proses`, formData);
      setSuccessMessage(`Proses berhasil ditambahkan!`);
      AddLog(`${userData.username} menambahkan proses baru`);
      setTimeout(() => {
        addProses();
        setSuccessMessage("");
        setFormData({
          idproses: "",
          nama_proses: "",
          urutan: "",
          trn_date: getTodayDate(),
        });
        onClose();
      }, 1500);
    } catch (e) {
      AddLog(`${userData.username} menambahkan proses baru`, "FAILED");
      setErrorMessage("Proses gagal ditambahkan!");
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <Modal.Header>
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          ADD PROSES
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
                htmlFor="idproses"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                ID Proses
              </label>
              <input
                type="text"
                name="idproses"
                id="idproses"
                value={formData.idproses}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="mt-3">
              <label
                htmlFor="nama_proses"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Nama Proses
              </label>
              <input
                type="text"
                name="nama_proses"
                id="nama_proses"
                value={formData.nama_proses}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="mt-3">
              <div>
                <label
                  htmlFor="urutan"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Urutan
                </label>
                <input
                  type="number"
                  name="urutan"
                  id="urutan"
                  value={formData.urutan}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
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
  );
}
