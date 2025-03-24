/* eslint-disable no-unused-vars */
import axios from "axios";
import { Button, Modal } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { ApiUrl } from "../../../context/Urlapi";
import { AddLog } from "../../../context/Log";

export function AddTarget({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    nama: "",
    nilai: 0,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const baseUrl = useContext(ApiUrl);

  const handleSubmit = async () => {
    try {
      let res = await axios.post(`${baseUrl}/master/target`, formData);
      console.log(res.data.data);
      setSuccessMessage("Data Berhasil Ditambahkan");
      AddLog(`${userData.username} menambahkan data target baru!`);
      setTimeout(() => {
        setSuccessMessage("");
        onAdd();
        onClose();
      }, 1500);
    } catch (err) {
      console.log(err);
      setErrorMessage("Data target gagal ditambahkan");
      AddLog(`${userData.username} menambahkan data target baru!`, "FAILED");
      setTimeout(() => {
        setErrorMessage("");
        setFormData({
          nama: "",
          nilai: 0,
        });
      }, 1500);
    }
  };
  const handleChange = (e) => {
    setFormData((formData) => ({
      ...formData,
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
            <div className="mt-5">
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
