/* eslint-disable no-unused-vars */
import { FcProcess } from "react-icons/fc";
import { SearchComponent } from "../reuse/SearchComponent";
import { PaginationComponent } from "../reuse/PaginationComponent";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ApiUrl } from "../../context/Urlapi";

export function TableRealTime() {
  const [checklist, setChecklist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const baseUrl = useContext(ApiUrl);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchChecklist();
  }, []);

  const fetchChecklist = async () => {
    try {
      let res = await axios.get(`${baseUrl}/master/realtime-proses`);

      let data = res.data.data;
      // console.log(data);
      setChecklist(data);
      setFilteredData(data);
    } catch (err) {
      console.log("Error fetching checklist:", err);
    }
  };

  const handleQuery = (val) => {
    setQuery(val);
  };

  return (
    <div className="container-fluid p-5">
      <div className="filter flex my-2">
        <div className="flex items-center text-2xl mb-4">
          <FcProcess />
          <span className="font-bold ms-3 uppercase">Real Time Proses</span>
        </div>
        <div className="searchComponent ms-auto">
          <SearchComponent
            result={setFilteredData}
            data={checklist}
            queryInput={(val) => handleQuery(val)}
            currentQuery={query}
          />
        </div>
      </div>

      <div className="relative overflow-x-auto sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs font-bold text-gray-300 bg-[#043A70]">
            <tr>
              <th className="px-6 py-3">No</th>
              <th className="px-6 py-3">Kode Checklist</th>
              <th className="px-6 py-3">Finished</th>
              <th className="px-6 py-3">On Progress</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((data, index) => (
                <tr key={index} className="border-b">
                  <td className="px-6 py-4 text-wrap">{index + 1}</td>
                  <td className="px-6 py-4 text-wrap">{data.kode_checklist}</td>
                  <td className="px-6 py-4 text-wrap">
                    {data.idproses_array
                      .map((item) => item.nama_proses)
                      .join(", ")}
                  </td>
                  <td className="px-6 py-4 text-wrap">
                    {data.belum_dijalankan
                      .map((item) => item.nama_proses)
                      .join(", ")}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center border-b">
                <td colSpan={4} className="px-6 py-4">
                  Data not found!
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <PaginationComponent
          setPaginatedData={setPaginatedData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          data={filteredData}
        />
      </div>
    </div>
  );
}
