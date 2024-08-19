import { useState, useEffect } from "react";
import axios from "axios";
import { useShopkeeper } from "../context/ShopkeeperContext";
import { useAlert } from '../context/AlertContext';
import refreshIcon from "../icons/svg/refresh.svg";

interface Request {
  id: number;
  sender_email: string;
  file_path: string;
  status: string;
  request_time?: string;
}

const PendingRequest = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [readyToPrintIndex, setReadyToPrintIndex] = useState<number | null>(null);
  const [downloadedIndexes, setDownloadedIndexes] = useState<Set<number>>(new Set());
  const { shopkeeper } = useShopkeeper();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (shopkeeper?.shopkeeper_id) {
      fetchPendingRequests();
    }
  }, [shopkeeper?.shopkeeper_id]);

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/api/shopkeeper/pending_requests",
        {
          params: { shopkeeper_id: shopkeeper?.shopkeeper_id },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("shopkeeper_token")}`,
          },
        }
      );
      const requestsData = response.data;

      if (Array.isArray(requestsData)) {
        setRequests(requestsData);
      } else {
        showAlert("info", "No pending requests available at the moment.");
      }
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      showAlert("error", "Failed to fetch pending requests. Please try again later.");
    }
  };

  const handleStatusChange = async (index: number) => {
    if (!downloadedIndexes.has(index)) {
      showAlert("error", "Please download the file first.");
      return;
    }

    const requestId = requests[index].id;
    try {
      await axios.post(
        "http://127.0.0.1:5000/api/shopkeeper/update_status",
        { id: requestId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("shopkeeper_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      updateRequestStatus(index, "Printed");
      showAlert("success", `Request ${index + 1} status changed to Printed`);
    } catch (error) {
      console.error("Error updating request status:", error);
      showAlert("error", "Failed to update request status. Please try again.");
    }
  };

  const updateRequestStatus = (index: number, status: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((request, i) =>
        i === index
          ? { ...request, status, request_time: new Date().toLocaleString() }
          : request
      )
    );
    setReadyToPrintIndex(null);
  };

  const downloadFile = async (filePath: string) => {
    try {
      const url = `http://127.0.0.1:5000/api/download/${encodeURIComponent(filePath)}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('shopkeeper_token')}`,
        },
        responseType: 'blob',
      });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filePath);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);

      setDownloadedIndexes((prev) => new Set(prev).add(requests.findIndex(request => request.file_path === filePath)));
      showAlert("success", "File downloaded successfully.");
    } catch (error) {
      console.error('Error downloading file:', error);
      showAlert('error', 'Error downloading file.');
    }
  };

  return (
    <section className="p-4 px-4 mx-auto my-4">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Pending Requests</h2>
        <button
          onClick={fetchPendingRequests}
          className="hover:animate-rotate px-2 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 flex items-center group"
        >
          <img
            src={refreshIcon}
            alt="Refresh"
            className="w-7 h-7 filter invert"
          />
        </button>
      </div>
      <div className="mt-6 overflow-hidden">
        {requests.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>No pending requests available at the moment.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3.5 text-lg font-normal text-left text-gray-500">
                  Sender's Email
                </th>
                <th className="px-4 py-3.5 text-lg font-normal text-left text-gray-500">
                  File
                </th>
                <th className="px-4 py-3.5 text-lg font-normal text-left text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3.5 text-lg font-normal text-left text-gray-500">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request, index) => (
                <tr key={request.id}>
                  <td className="px-4 py-4 text-sm font-medium text-gray-700">
                    {request.sender_email}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    <a
                      href="#"
                      onClick={() => downloadFile(request.file_path)}
                      className="text-blue-500 hover:underline"
                    >
                      {request.file_path}
                    </a>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {request.status === "Responded" ? (
                      readyToPrintIndex === index ? (
                        <button
                          onClick={() => handleStatusChange(index)}
                          className="px-3 py-1 text-white bg-green-500 border border-green-500 rounded-lg transition-colors duration-300 hover:bg-green-600"
                        >
                          Ready to Print
                        </button>
                      ) : (
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            onChange={() => setReadyToPrintIndex(index)}
                            className="form-checkbox h-5 w-5 text-yellow-600 transition duration-150 ease-in-out"
                            disabled={!downloadedIndexes.has(index)}
                          />
                          <span
                            className={`text-sm ${
                              downloadedIndexes.has(index)
                                ? "text-yellow-600"
                                : "text-gray-400"
                            }`}
                          >
                            {downloadedIndexes.has(index)
                              ? "Pending"
                              : "Download file first"}
                          </span>
                        </label>
                      )
                    ) : (
                      <span className="text-md text-green-600 font-semibold">
                        {request.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {request.request_time || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default PendingRequest;
