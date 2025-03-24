/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ApiUrl } from "../../../context/Urlapi";
import { Modal, Button } from "flowbite-react";
import { AddLog } from "../../../context/Log";

export function EditEmployee({
  isOpen,
  onClose,
  employeeData,
  updateEmployee,
}) {
  const [formData, setFormData] = useState({
    nik: "",
    nama_karyawan: "",
    submittedby: "",
    trn_date: "",
  });
  const baseUrl = useContext(ApiUrl);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  useEffect(() => {
    if (employeeData) {
      setFormData({
        nik: employeeData.nik || "",
        nama_karyawan: employeeData.nama_karyawan || "",
        submittedby: employeeData.submittedby || "",
        trn_date: employeeData?.trn_date,
      });
    }
  }, [employeeData]);

  const handleChange = (e) => {
    setErrorMessage("");
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `${baseUrl}/master/employee/${employeeData.id}`,
        formData
      );
      AddLog(
        `${userData.username} edit data karyawan dengan id ${employeeData.id}`
      );
      setSuccessMessage(
        `Karyawan dengan NIK ${employeeData.nik} berhasil diperbarui.`
      );
      setTimeout(() => {
        updateEmployee();
        setSuccessMessage("");
        onClose();
      }, 1500);
    } catch (error) {
      AddLog(
        `${userData.username} edit data karyawan dengan id ${employeeData.id}`,
        "FAILED"
      );
      setErrorMessage(
        error.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui karyawan."
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
          EDIT EMPLOYEE
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

          {/* NIK (Read-only) */}
          <div>
            <label
              htmlFor="nik"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              NIK
            </label>
            <input
              type="text"
              name="nik"
              id="nik"
              value={formData.nik}
              disabled
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-not-allowed"
            />
          </div>

          {/* Nama Karyawan */}
          <div>
            <label
              htmlFor="nama_karyawan"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Nama Karyawan
            </label>
            <input
              type="text"
              name="nama_karyawan"
              id="nama_karyawan"
              value={formData.nama_karyawan}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer className="flex justify-end">
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button color="blue" onClick={handleSubmit} disabled={loading}>
          {loading ? "Updating..." : "Submit"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
