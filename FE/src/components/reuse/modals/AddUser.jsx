/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { Modal, Button } from "flowbite-react";
import { ApiUrl } from "../../../context/Urlapi";
import axios from "axios";
import { AddLog } from "../../../context/Log";

export function AddUser({ isOpen, onClose, addUser }) {
  const baseUrl = useContext(ApiUrl);
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  // State untuk menyimpan input form
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    jabatan: "",
    password: "",
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
      await axios.post(`${baseUrl}/master/register`, formData);
      setSuccessMessage(`User berhasil ditambahkan!.`);
      AddLog(`${userData.username} menambahkan user ${formData.username} !`);
      // console.log(res.data.data);
      setTimeout(() => {
        addUser();
        setSuccessMessage("");
        setFormData({
          username: "",
          email: "",
          jabatan: "",
          password: "",
        });
        onClose();
      }, 1500);
    } catch (e) {
      AddLog(
        `${userData.username} menambahkan user ${formData.username} `,
        "FAILED"
      );
      setErrorMessage("User gagal ditambahkan!");
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <Modal.Header>
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          ADD USER
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
          {/* Username & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Role & Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="jabatan"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Select a Role
              </label>
              <select
                id="jabatan"
                name="jabatan"
                value={formData.jabatan}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Choose a role</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                <option value="Leader">Leader</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
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
  );
}
