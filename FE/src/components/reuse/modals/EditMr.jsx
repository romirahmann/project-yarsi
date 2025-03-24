/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ApiUrl } from "../../../context/Urlapi";
import { Modal, Button } from "flowbite-react";
import moment from "moment";
import { AddLog } from "../../../context/Log";

export function EditMr({ isOpen, onClose, mrData, updateMR }) {
  const [formData, setFormData] = useState({
    NoUrut: "",
    NoMR: "",
    NamaPasien: "",
    Tanggal: "",
    Kode_Checklist: "",
    nobox: "",
  });
  const baseUrl = useContext(ApiUrl);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  useEffect(() => {
    if (mrData) {
      setFormData({
        NoUrut: mrData.NoUrut || "",
        NoMR: mrData.NoMR || "",
        NamaPasien: mrData.NamaPasien || "",
        Tanggal: moment(mrData.Tanggal, "DDMMYYYY").format("yyyy-MM-DD") || "",
        Kode_Checklist: mrData.Kode_Checklist || "",
        nobox: mrData.nobox || "",
      });
    }
  }, [mrData]);

  const handleChange = (e) => {
    setErrorMessage("");
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(formData);
    try {
      await axios.put(
        `${baseUrl}/master/datamr/${mrData.NoUrut}/${mrData.Kode_Checklist}`,
        formData
      );
      AddLog(
        `${userData.username} edit data MR dengan Kode Checklist ${formData.Kode_Checklist} dan No Urut ${formData.NoUrut}`
      );
      setSuccessMessage(`Data MR ${mrData.NoMR} berhasil diperbarui.`);
      setTimeout(() => {
        updateMR();
        setSuccessMessage("");
        onClose();
      }, 1500);
    } catch (error) {
      AddLog(
        `${userData.username} edit data MR dengan Kode Checklist ${formData.Kode_Checklist} dan No Urut ${formData.NoUrut}`,
        "FAILED"
      );
      setErrorMessage(
        error.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui data MR."
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
          EDIT MR
        </p>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage && (
            <div
              className="p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
              role="alert"
            >
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div
              className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="NoUrut"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              NoUrut
            </label>
            <input
              type="text"
              name="NoUrut"
              id="NoUrut"
              value={formData.NoUrut}
              disabled
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="Kode_Checklist"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Kode_Checklist
            </label>
            <input
              type="text"
              name="Kode_Checklist"
              id="Kode_Checklist"
              value={formData.Kode_Checklist}
              disabled
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="NoMR"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              NoMR
            </label>
            <input
              type="text"
              name="NoMR"
              id="NoMR"
              value={formData.NoMR}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label
              htmlFor="NamaPasien"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              NamaPasien
            </label>
            <input
              type="text"
              name="NamaPasien"
              id="NamaPasien"
              value={formData.NamaPasien}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label
              htmlFor="Tanggal"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Tanggal
            </label>
            <input
              type="date"
              name="Tanggal"
              id="Tanggal"
              value={formData.Tanggal}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label
              htmlFor="nobox"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              NoBox
            </label>
            <input
              type="text"
              name="nobox"
              id="nobox"
              value={formData.nobox}
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
