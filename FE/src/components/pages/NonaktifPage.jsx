/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { ApiUrl } from "../../context/Urlapi";
import moment from "moment";
import { FaClipboardList } from "react-icons/fa";
import { FcProcess } from "react-icons/fc";
import { SearchComponent } from "../reuse/SearchComponent";
import { PaginationComponent } from "../reuse/PaginationComponent";
import axios from "axios";
import { AktifModal } from "../reuse/AktifComponent";

export function NonaktifPage() {
  const [dataMr, setDataMr] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState();
  const [query, setQuery] = useState("");
  const [showModalAktif, setShowModalAktif] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const baseUrl = useContext(ApiUrl);

  useEffect(() => {
    getDataMr();
  }, []);

  const getDataMr = async () => {
    try {
      const res = await axios.get(`${baseUrl}/master/nonaktif-mr`);
      setDataMr(res.data.data);
      setFilteredData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleAktif = (data) => {
    setShowModalAktif(true);
    setSelectedData(data);
  };
  const handleQuery = (val) => {
    setQuery(val);
  };

  return (
    <>
      <div className="container-fluid p-4">
        <div className="titlePage flex mb-3 items-center">
          <FaClipboardList className="text-3xl text-gray-700" />
          <h1 className="text-3xl ms-3 font-bold text-gray-700">
            Data MR Nonaktif
          </h1>
        </div>

        <div className="searchBar flex my-2 mt-10">
          <div className="ms-auto">
            <SearchComponent
              result={setFilteredData}
              data={dataMr}
              queryInput={(val) => handleQuery(val)}
              currentQuery={query}
            />
          </div>
        </div>

        <div className="relative overflow-x-auto sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs font-bold text-gray-300 bg-[#043A70]">
              <tr>
                <th className="px-4 py-2 w-4">No Urut</th>
                <th className="px-4 py-2 w-4">Kode Checklist</th>
                <th className="px-4 py-2 w-4">No MR</th>
                {/* <th className="px-6 py-3">No Box</th> */}
                <th className="px-4 py-2 w-4">Nama Pasien</th>
                <th className="px-4 py-2 w-4">Tanggal</th>
                <th className="px-4 py-2 w-4">Qty Image</th>
                <th className="px-4 py-2 w-4">Mulai</th>
                <th className="px-4 py-2 w-4">Selesai</th>
                <th className="px-4 py-2 w-2">File Path</th>
                <th className="px-4 py-2 w-4">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {paginatedData?.length > 0 ? (
                paginatedData.map((data, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2 w-4">{data.NoUrut}</td>
                    <td className="px-4 py-2 w-4">{data.Kode_Checklist}</td>
                    <td className="px-4 py-2 w-4">{data.NoMR}</td>
                    {/* <td className="px-6 py-4">{data.nobox}</td> */}
                    <td className="px-4 py-2 w-4">{data.NamaPasien}</td>
                    <td className="px-4 py-2 w-4">
                      {data.Tanggal
                        ? moment(data.Tanggal).format("DD/MM/YYYY")
                        : ""}
                    </td>
                    <td className="px-4 py- w-4">{data.Qty_Image}</td>

                    <td className="px-4 py-2 w-4">{data.Mulai}</td>
                    <td className="px-4 py-2 w-4">{data.Selesai}</td>

                    <td className="px-4 py-2 w-2 break-words">
                      {data.FilePath}
                    </td>
                    <td className="px-4 py-2 w-4">
                      <button
                        onClick={() => handleAktif(data)}
                        className="text-green-500 px-1 py-1 rounded-md"
                      >
                        <FcProcess size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-center border-b">
                  <td colSpan={11} className="px-6 py-4">
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
          <AktifModal
            isOpen={showModalAktif}
            onClose={() => setShowModalAktif(false)}
            data={selectedData}
            isActive={() => getDataMr()}
          />
        </div>
      </div>
    </>
  );
}
