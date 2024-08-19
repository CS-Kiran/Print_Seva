import { useState, useEffect } from "react";
import axios from "axios";
import { useShopkeeper } from "../context/ShopkeeperContext";

interface Request {
  id: number;
  sender_email: string;
  file_path: string;
  status: string;
  request_time?: string;
}

const PendingRequest = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [readyToPrintIndex, setReadyToPrintIndex] = useState<number | null>(
    null
  );
  const [downloadedIndexes, setDownloadedIndexes] = useState<Set<number>>(
    new Set()
  );
  const { shopkeeper } = useShopkeeper();

  useEffect(() => {
    if (shopkeeper?.shopkeeper_id) {
      fetchPendingRequests();
    }
  }, [shopkeeper?.shopkeeper_id]);

  const fetchPendingRequests = async () => {
    if (!shopkeeper?.shopkeeper_id) {
      console.error("Shopkeeper ID is not available.");
      return;
    }

    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/api/shopkeeper/pending_requests",
        {
          params: { shopkeeper_id: shopkeeper.shopkeeper_id },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("shopkeeper_token")}`,
          },
        }
      );

      const requestsData = response.data;

      if (Array.isArray(requestsData)) {
        setRequests(requestsData);
      } else {
        console.error("Unexpected response format:", requestsData);
      }
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      alert("Failed to fetch pending requests. Please try again later.");
    }
  };

  const handleStatusChange = async (index: number) => {
    if (!downloadedIndexes.has(index)) {
      alert("Please download the file first.");
      return;
    }

    const requestId = requests[index].id;
    try {
      await axios.post(
        "http://127.0.0.1:5000/api/shopkeeper/update_status",
        { id: requestId }, // Passing the request ID in the request body
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("shopkeeper_token")}`,
            "Content-Type": "application/json", // Ensure the request is sent as JSON
          },
        }
      );

      updateRequestStatus(index, "Printed");
      console.log(`Request ${index} status changed to Printed`);
    } catch (error) {
      console.error("Error updating request status:", error);
      alert("Failed to update request status. Please try again.");
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

  const handleDownload = (index: number) => {
    setDownloadedIndexes((prev) => new Set(prev).add(index));
  };

  return (
    <section className="p-4 px-4 mx-auto my-4">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Pending Requests</h2>
        <button
          className="text-lg text-white bg-blue-500 border border-blue-500 rounded-lg px-3 py-1 transition-colors duration-300 hover:bg-blue-600"
          onClick={fetchPendingRequests}
        >
          Refresh
        </button>
      </div>
      <div className="mt-6 overflow-hidden">
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
                    href={request.file_path}
                    download={request.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                    onClick={() => handleDownload(index)}
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
      </div>
    </section>
  );
};

export default PendingRequest;
