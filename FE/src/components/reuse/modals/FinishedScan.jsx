/* eslint-disable no-unused-vars */
import axios from "axios";
import { Modal } from "flowbite-react";
import { useContext, useEffect, useRef, useState } from "react";
import { ApiUrl } from "../../../context/Urlapi";

export function FinishedScan({ isOpen, onClose, selectedData, onUpdate }) {
  const [formData, setFormData] = useState({
    qty_image: 0,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const baseUrl = useContext(ApiUrl);
  // Referensi untuk input Qty Images
  const qtyImageRef = useRef(null);

  // Fokus otomatis ke input qty_image ketika modal dibuka
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        qtyImageRef.current?.focus();
      }, 100); // Delay kecil untuk memastikan modal sudah terbuka
    }
  }, [isOpen]);

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    console.log(formData);
    if (formData) {
      try {
        const res = await axios.put(
          `${baseUrl}/master/finish-proses-scan/${selectedData?.kode_checklist}/${selectedData?.idproses}`,
          formData
        );
        console.log(res.data.data);
        setSuccessMessage(res.data.data);
        setTimeout(() => {
          setSuccessMessage("");
          onUpdate();
          onClose();
        }, 1500);
      } catch (err) {
        console.log(err);
        setErrorMessage(err.data.data);
        setTimeout(() => {
          setFormData({
            qty_image: 0,
          });
          setErrorMessage("");
        }, 1500);
      }
    }
  };

  return (
    <>
      <Modal show={isOpen} onClose={onClose}>
        <Modal.Header>Add Qty Image</Modal.Header>
        <Modal.Body>
          <div className="container-fluid">
            {/* Pesan Sukses */}
            {successMessage && (
              <div
                className="p-4 z-40 text-sm text-green-800 rounded-lg bg-green-50"
                role="alert"
              >
                <span className="font-medium">{successMessage}</span>
              </div>
            )}

            {/* Pesan Error */}
            {errorMessage && (
              <div
                className="p-4 z-40 text-sm text-red-800 rounded-lg bg-red-50"
                role="alert"
              >
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}
            <div className="my-2">
              <label className="block text-sm font-medium">
                Kode Checklist
              </label>
              <input
                type="text"
                name="kode_checklist"
                value={selectedData?.kode_checklist}
                onChange={(e) => handleOnChange(e)}
                disabled
                className="w-full border-gray-100 p-2 border rounded-lg bg-gray-200"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">ID Proses</label>
              <input
                type="text"
                name="idproses"
                value={selectedData?.idproses}
                onChange={(e) => handleOnChange(e)}
                disabled
                className="w-full p-2 border border-gray-100 rounded-lg bg-gray-200"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Qty Images</label>
              <input
                type="number"
                name="qty_image"
                ref={qtyImageRef}
                onChange={(e) => handleOnChange(e)}
                className="w-full p-2 border border-gray-200 rounded-lg "
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => handleSubmit()}
            className="px-2 py-1 bg-blue-700 hover:bg-blue-800 rounded-md text-white text-md"
          >
            {" "}
            Submit{" "}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
