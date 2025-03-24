/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { Modal, Button } from "flowbite-react";
import { ApiUrl } from "../../../context/Urlapi";
import axios from "axios";
import { AddLog } from "../../../context/Log";

export function AddEmployee({ isOpen, onClose, addEmployee }) {
  const baseUrl = useContext(ApiUrl);

  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  // State untuk menyimpan input form
  const [formData, setFormData] = useState({
    nik: "",
    nama_karyawan: "",
    submittedby: userData.username || "Unknown",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    try {
      await axios.post(`${baseUrl}/master/employee`, formData);
      setSuccessMessage("Karyawan berhasil ditambahkan!");
      AddLog(`${userData.username} menambahkan karyawan baru`);
      setTimeout(() => {
        addEmployee();
        setSuccessMessage("");
        setFormData({
          nik: "",
          nama_karyawan: "",

          submittedby: userData.username || "Unknown",
        });
        onClose();
      }, 1500);
    } catch (e) {
      setFormData({
        nik: "",
        nama_karyawan: "",
        submittedby: userData.username || "Unknown",
      });
      AddLog(`${userData.username} menambahkan karyawan baru`, "FAILED");
      setErrorMessage("Karyawan gagal ditambahkan!");
      setTimeout(() => {
        setErrorMessage("");
      }, 1500);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <Modal.Header>
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          ADD EMPLOYEE
        </p>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pesan Sukses */}
          {successMessage && (
            <div
              className="p-4 text-sm text-green-800 rounded-lg bg-green-50"
              role="alert"
            >
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* Pesan Error */}
          {errorMessage && (
            <div
              className="p-4 text-sm text-red-800 rounded-lg bg-red-50"
              role="alert"
            >
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* NIK */}
          <div>
            <label
              htmlFor="nik"
              className="block text-sm font-medium text-gray-900"
            >
              NIK
            </label>
            <input
              type="text"
              name="nik"
              id="nik"
              value={formData.nik}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Nama Karyawan */}
          <div>
            <label
              htmlFor="nama_karyawan"
              className="block text-sm font-medium text-gray-900"
            >
              Nama Karyawan
            </label>
            <input
              type="text"
              name="nama_karyawan"
              id="nama_karyawan"
              value={formData.nama_karyawan}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
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
