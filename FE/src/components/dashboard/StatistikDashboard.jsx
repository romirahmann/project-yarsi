/* eslint-disable no-unused-vars */
import { FaCalendar, FaNotesMedical } from "react-icons/fa";
import { GrDocumentImage } from "react-icons/gr";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";
import { FaUsers } from "react-icons/fa";
import { GoChecklist } from "react-icons/go";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ApiUrl } from "../../context/Urlapi";
import moment from "moment";

export function StatistikDashboard() {
  const [statistikData, setStatistikData] = useState([]);
  const [rsName, setRsName] = useState("");
  const [selectionDate, setSelectionDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const baseUrl = useContext(ApiUrl);

  useEffect(() => {
    fecthStatistikData();
  }, [statistikData, selectionDate]);

  useEffect(() => {
    fecthRSName();
  }, []);

  const fecthRSName = async () => {
    try {
      let res = await axios.get(`${baseUrl}/master/rs-name`);
      // console.log(res.data.data.rumahsakit);
      setRsName(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fecthStatistikData = async () => {
    try {
      let res = await axios.get(
        `${baseUrl}/master/data-statistik/${selectionDate}`
      );
      // console.log(res.data.data);
      setStatistikData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    let value = e.target.value;
    setSelectionDate(moment(value).format("YYYY-MM-DD"));
  };

  return (
    <>
      <div className="countContent bg-gradient-to-r from-cyan-500 to-blue-500 p-10 rounded-xl">
        <div className="headerChart lg:flex items-center">
          <h1 className="text-2xl font-bold text-white uppercase">
            Statistik Proses Padaprima {rsName?.rumahsakit}
          </h1>
          <div className="flex flex-col mt-5 lg:mt-0 space-y-1 ms-auto">
            <div className="relative ">
              <input
                type="date"
                value={selectionDate}
                onChange={(e) => handleChange(e)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 bg-white"
              />
              <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="dashboard-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mt-10 gap-3">
          {/* Kode Checklist */}
          <div className="max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <GoChecklist className="text-2xl mb-3 text-gray-600" />
            <span>
              <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Kode Checklist
              </h5>
            </span>
            <p className="mb-3 text-2xl font-normal text-gray-500 dark:text-gray-400">
              {statistikData?.total_kode_checklist}
            </p>
          </div>
          {/* No MR */}
          <div className="max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <FaNotesMedical className="text-2xl mb-3 text-gray-600" />
            <span>
              <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                No Medical Record
              </h5>
            </span>
            <p className="mb-3 text-2xl font-normal text-gray-500 dark:text-gray-400">
              {statistikData?.totalMR}
            </p>
          </div>
          {/* Image */}
          <div className="max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <GrDocumentImage className="text-2xl mb-3 text-gray-600" />
            <span>
              <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Image
              </h5>
            </span>
            <p className="mb-3 text-2xl font-normal text-gray-500 dark:text-gray-400">
              {statistikData?.totalImage !== null
                ? statistikData.totalImage
                : 0}
            </p>
          </div>
          {/* Karyawan */}
          <div className="max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <FaUsers className="text-2xl mb-3 text-gray-600" />
            <span>
              <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Karyawan
              </h5>
            </span>
            <p className="mb-3 text-2xl font-normal text-gray-500 dark:text-gray-400">
              {statistikData?.totalNIK}
            </p>
          </div>
          {/* Lembar Scan */}
          <div className="max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <HiOutlineDocumentDuplicate className="text-3xl mb-3 text-gray-600" />
            <span>
              <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Lembar Scan
              </h5>
            </span>
            <p className="mb-3 text-2xl font-normal text-gray-500 dark:text-gray-400">
              {statistikData?.totalLembar !== null
                ? statistikData.totalLembar
                : 0}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
