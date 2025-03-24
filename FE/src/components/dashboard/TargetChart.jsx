/* eslint-disable no-unused-vars */
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ApiUrl } from "../../context/Urlapi";
import { TbTargetArrow } from "react-icons/tb";

ChartJS.register(ArcElement, Tooltip, Legend);

export function TargetChart() {
  // State untuk persentase scan dan harian
  const [persentaseScan, setPersentaseScan] = useState(0);
  const [persentaseHarian, setPersentaseHarian] = useState(0);
  const [totalScan, setTotalScan] = useState(0);
  const [totalHarian, setTotalHarian] = useState(0);
  const [targetScan, setTargetScan] = useState(0);
  const [targetHarian, setTargetHarian] = useState(0);
  const [summary, setSummary] = useState([]);

  const baseUrl = useContext(ApiUrl);

  useEffect(() => {
    fecthTarget();
    fecthSummary();
  }, [totalScan, targetScan, summary]);

  const fecthTarget = async () => {
    try {
      let res = await axios.get(`${baseUrl}/master/data-pie`);
      // console.log(res.data.data);
      let data = res.data.data;
      setTargetHarian(data.targetHarian);
      setTargetScan(data.targetImage);
    } catch (err) {
      console.log(err);
    }
  };
  const fecthSummary = async () => {
    try {
      let res = await axios.get(`${baseUrl}/master/data-summary`);
      let data = res.data.data;
      setSummary(data);
      setTotalHarian(data.dates);
      setTotalScan(data.image1003);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setPersentaseScan(
      targetScan > 0
        ? Math.min(100, Math.round((totalScan / targetScan) * 100))
        : 0
    );
    setPersentaseHarian(
      targetHarian > 0
        ? Math.min(100, Math.round((totalHarian / targetHarian) * 100))
        : 0
    );
  }, [totalScan, targetScan, totalHarian, targetHarian]);

  // Data untuk Pie Chart Scan
  const dataScan = {
    labels: ["Tercapai", "Belum Tercapai"],
    datasets: [
      {
        data: [persentaseScan, 100 - persentaseScan],
        backgroundColor: ["#10B981", "#D3D3D3"], // Hijau & Abu-Abu
        hoverBackgroundColor: ["#059669", "#A9A9A9"],
        borderWidth: 0,
      },
    ],
  };

  // Data untuk Pie Chart Harian
  const dataHarian = {
    labels: ["Tercapai", "Belum Tercapai"],
    datasets: [
      {
        data: [persentaseHarian, 100 - persentaseHarian],
        backgroundColor: ["#3B82F6", "#D3D3D3"], // Biru & Abu-Abu
        hoverBackgroundColor: ["#2563EB", "#A9A9A9"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "70%", // Membuat efek radial bar
    plugins: {
      legend: { display: false }, // Sembunyikan legend
      tooltip: {
        callbacks: {
          label: (context) => context.raw + "%",
        },
      },
    },
  };

  return (
    <div className="flex md:flex-wrap justify-center gap-6 ">
      <span className="bg-white px-4 py-3 rounded-md w-full text-center font-bold text-gray-500">
        Estimasi Penyelesaian Proyek
      </span>
      {/* Pie Chart Target Scan */}
      <div className="flex flex-col items-center p-5 bg-white shadow-lg rounded-lg w-[8em] lg:w-[16em]">
        <span className=" text-md md:text-lg text-center text-red-800 flex items-center mb-4">
          <TbTargetArrow />
          <h3 className=" text-gray-500 font-semibold ms-1 md:ms-2">
            Target Image
          </h3>
        </span>

        <div className="relative w-full">
          <Doughnut data={dataScan} options={options} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">{persentaseScan}%</span>
          </div>
        </div>
      </div>

      {/* Pie Chart Target Harian */}
      <div className="flex flex-col items-center p-5 bg-white shadow-lg rounded-lg w-[8em] lg:w-[16em]">
        <span className="text-md md:text-lg text-center text-red-800 flex items-center mb-4">
          <TbTargetArrow />
          <h3 className=" font-semibold text-gray-500 ms-2 ">Target Harian</h3>
        </span>
        <div className="relative w-full">
          <Doughnut data={dataHarian} options={options} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">{persentaseHarian}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
