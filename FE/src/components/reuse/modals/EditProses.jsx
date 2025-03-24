/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ApiUrl } from "../../../context/Urlapi";
import { Modal, Button } from "flowbite-react";
import { AddLog } from "../../../context/Log";

export function EditProses({ isOpen, onClose, prosesData, updateProses }) {
  const [formData, setFormData] = useState({
    idproses: "",
    nama_proses: "",
    urutan: "",
  });
  const baseUrl = useContext(ApiUrl);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  useEffect(() => {
    if (prosesData) {
      setFormData({
        idproses: prosesData.idproses || "",
        nama_proses: prosesData.nama_proses || "",
        urutan: prosesData.urutan || "",
        trn_date: prosesData?.trn_date,
      });
    }
  }, [prosesData]);

  const handleChange = (e) => {
    setErrorMessage("");
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    try {
      await axios.put(`${baseUrl}/master/proses/${prosesData.id}`, formData);
      setSuccessMessage(
        `Proses dengan ID ${prosesData.id} berhasil diperbarui.`
      );
      AddLog(
        `${userData.username} edit data Proses dengan ID ${prosesData.idproses}`
      );
      setTimeout(() => {
        updateProses();
        setSuccessMessage("");
        onClose();
      }, 1500);
    } catch (error) {
      AddLog(
        `${userData.username} edit data Proses dengan ID ${prosesData.idproses}`,
        "FAILED"
      );
      setErrorMessage(
        error.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui proses."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
