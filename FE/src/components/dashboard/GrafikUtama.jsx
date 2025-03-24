/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { FaChartLine } from "react-icons/fa";
import { ApiUrl } from "../../context/Urlapi";
import axios from "axios";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = () => {
  const [datasetVisibility, setDatasetVisibility] = useState({
    1: false, // Target Qty Image (index dataset ke-1) terlihat sejak awal
    2: false,
  });
  const [chartData, setChartData] = useState({});
  const [selectionDate, setSelectionDate] = useState(
    moment().format("YYYY-MM")
  );
  const [targets, setTarget] = useState();
  const baseUrl = useContext(ApiUrl);

  useEffect(() => {
    fecthDataChart();
  }, [chartData]);

  const fecthDataChart = async () => {
    try {
      let res = await axios.get(
        `${baseUrl}/master/primary-chart/${selectionDate}`
      );
      let data = res.data.data;
      setChartData(data);
      setTarget(data.targets);
    } catch (err) {
      console.log(err);
    }
  };

  const labels = chartData?.dates || [];
  const values1 = chartData?.values1 || [];
  const values2 = chartData?.values2 || [];
  const target_lembar_scan = targets?.[1]?.nilai ?? 0;
  const target_qty_image = targets?.[0]?.nilai ?? 0;

  const filledValues1 = values1.map((val) =>
    val !== null && val !== 0 ? val : null
  );
  const filledValues2 = values2.map((val) =>
    val !== null && val !== 0 ? val : null
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Qty Image",
        data: filledValues1,
        backgroundColor: "#00008B",
        borderColor: "#00008B",
        borderWidth: 1,
        spanGaps: false,
      },
      {
        label: "Target Qty Image",
        data: Array(labels?.length).fill(target_qty_image),
        borderColor: "red",
        type: "line",
        fill: false,
        borderWidth: 1,
        borderDash: [5, 5],
        spanGaps: true,
        hidden: !datasetVisibility[1],
      },
      {
        label: "Qty Lembar Scan",
        data: filledValues2,
        backgroundColor: "black",
        borderColor: "black",
        borderWidth: 1,
        spanGaps: false,
      },
      {
        label: "Target Lembar Scan",
        data: Array(labels?.length).fill(target_lembar_scan),
        borderColor: "#800000",
        type: "line",
        fill: false,
        borderWidth: 2,
        borderDash: [5, 5],
        spanGaps: true,
        hidden: !datasetVisibility[3], // Pastikan default terlihat
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        onClick: (e, legendItem, legend) => {
          const index = legendItem.datasetIndex;
          const newVisibility = {
            ...datasetVisibility,
            [index]: !datasetVisibility[index], // Toggle visibility
          };
          setDatasetVisibility(newVisibility);

          // Update visibility pada dataset di chart
          legend.chart.getDatasetMeta(index).hidden = !newVisibility[index];
          legend.chart.update();
        },
      },
    },
  };

  const handleSelectionMonth = (e) => {
    setSelectionDate(e.target.value);
  };

  return (
    <div className="p-6 bg-white shadow rounded-md">
      <div className="headerChart flex items-center mb-10">
        <span className="flex items-center text-xl sm:me-2  lg:text-2xl ">
          <FaChartLine className="text-blue-800" />
          <h2 className=" font-bold text-wrap ms-3 text-gray-500 ">
            GRAFIK JUMLAH IMAGE
          </h2>
        </span>
        <div className="ms-auto">
          <input
            type="month"
            value={selectionDate}
            onChange={(e) => handleSelectionMonth(e)}
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 bg-white "
          />
        </div>
      </div>
      <Line data={data} options={options} />
    </div>
  );
};

export default ChartComponent;
