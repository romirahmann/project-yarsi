/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { FaCalendarDay, FaImages } from "react-icons/fa";

import { MdDocumentScanner } from "react-icons/md";
import { ApiUrl } from "../../context/Urlapi";
import axios from "axios";

export function SummaryDashboard() {
  const [summary, setSummary] = useState([]);
  const baseUrl = useContext(ApiUrl);

  useEffect(() => {
    fecthSummary();
  }, [summary]);

  const fecthSummary = async () => {
    try {
      let res = await axios.get(`${baseUrl}/master/data-summary`);
      let data = res.data.data;
      setSummary(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {/* Total Semua Lembar Scan */}
      <div className="max-w-full p-6 bg-gradient-to-r from-cyan-500 to-blue-500 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <MdDocumentScanner className="text-2xl mb-3 text-gray-50" />
        <a href="#">
          <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-50 dark:text-white">
            Total Semua Lembar Scan
          </h5>
        </a>
        <p className="mb-3 text-2xl font-normal text-gray-50 dark:text-gray-400">
          {summary?.image1003}
        </p>
      </div>
      {/* Total Semua Image */}
      <div className="max-w-full mt-3 p-6 bg-gradient-to-r from-cyan-500 to-blue-500 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <FaImages className="text-2xl mb-3 text-gray-50" />
        <a href="#">
          <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-50 dark:text-white">
            Total Semua Image
          </h5>
        </a>
        <p className="mb-3 text-2xl font-normal text-gray-50 dark:text-gray-400">
          {summary?.image1001}
        </p>
      </div>
      {/* Total Jumlah Hari */}
      <div className="max-w-full mt-3 p-6 bg-gradient-to-r from-cyan-500 to-blue-500 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <FaCalendarDay className="text-2xl mb-3 text-gray-50" />
        <a href="#">
          <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-50 dark:text-white">
            Total Jumlah Hari
          </h5>
        </a>
        <p className="mb-3 text-2xl font-normal text-gray-50 dark:text-gray-400">
          {summary?.dates}
        </p>
      </div>
    </>
  );
}
