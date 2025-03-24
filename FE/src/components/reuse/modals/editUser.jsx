import { useContext, useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { ApiUrl } from "../../../context/Urlapi";
import axios from "axios";
import { AddLog } from "../../../context/Log";

export function EditUser({ isOpen, onClose, userData, updateUser }) {
  const baseUrl = useContext(ApiUrl);
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    email: "",
    jabatan: "",
    password: "",
    trn_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Update formData saat userData berubah
  useEffect(() => {
    if (userData) {
      setFormData({
        id: userData.id,
        username: userData.username || "",
        email: userData.email || "",
        jabatan: userData.jabatan || "User",
        password: userData.password,
        trn_date: userData.trn_date,
      });
    }
  }, [userData]);

  // Handle perubahan input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit perubahan
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await axios.put(`${baseUrl}/master/user/${userData.id}`, formData);
      setSuccessMessage(`User dengan ID ${formData.id} berhasil diperbarui.`);
      AddLog(`${userData.username} edit data User dengan ID ${userData.id}`);
      setTimeout(() => {
        updateUser();
        setSuccessMessage("");
        onClose();
      }, 1500);
    } catch (error) {
      AddLog(
        `${userData.username} edit data Target dengan ID ${userData.id}`,
        "FAILED"
      );
      setErrorMessage(
        error.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui user."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <Modal.Header>
        <p className="text-xl font-bold text-gray-800 dark:text-white">
          Edit User
        </p>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* Username */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Role
            </label>
            <select
              name="jabatan"
              value={formData.jabatan}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button
          onClick={handleSubmit}
          className={`text-white px-4 py-2 rounded-lg ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          disabled={loading}
        >
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
}
