import { useEffect, useState } from "react";
import { useAlert } from "../context/AlertContext";
import axios from "axios";
import paymentIcon from "../icons/svg/payment.svg";

interface TrackRequest {
  id: number;
  total_pages: number;
  print_type: string;
  print_side: string;
  page_size: string;
  no_of_copies: number;
  file_path: string;
  comments: string;
  status: string;
  action: string;
  request_time: string;
  update_time: string;
}

const TrackRequest = () => {
  const [notifications, setNotifications] = useState<TrackRequest[]>([]);
  const [expandedNotificationId, setExpandedNotificationId] = useState<
    number | null
  >(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("user_token");
        if (!token) {
          showAlert("error", "Authorization token not found");
          return;
        }

        const response = await axios.get(
          "http://127.0.0.1:5000/api/user/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setNotifications(response.data);
        } else {
          showAlert("warning", "No notifications found");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        showAlert("warning", "Error fetching notifications");
      }
    };

    fetchNotifications();
  }, []);

  const getStatusProgress = (status: string) => {
    switch (status) {
      case "Pending":
        return "w-1/3 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-300";
      case "Responded":
        return "w-2/3 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-300";
      case "Printed":
        return "w-full bg-gradient-to-r from-green-600 via-green-500 to-green-300";
      default:
        return "w-0 bg-gray-200";
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "Accepted":
        return "text-green-600";
      case "Declined":
        return "text-red-600";
      case "Pending":
        return "text-yellow-700";
      default:
        return "text-gray-600";
    }
  };

  const toggleMoreDetails = (id: number) => {
    setExpandedNotificationId((prevId) => (prevId === id ? null : id));
  };

  const downloadFile = async (filePath: string) => {
    try {
      const url = `http://127.0.0.1:5000/api/download/${encodeURIComponent(
        filePath
      )}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
        responseType: "blob", // Ensure the response is treated as a file
      });

      // Create a link element, set its href to a blob URL, and programmatically click it to trigger a download
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", filePath); // Use the file name for download
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl); // Clean up the URL object
    } catch (error) {
      console.error("Error downloading file:", error);
      showAlert("error", "Error downloading file");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h2 className="text-4xl font-bold mb-6 text-gray-800">Track Requests</h2>
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        {notifications.length === 0 ? (
          <p className="text-center py-4 text-gray-600">
            No notifications available.
          </p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-6 border-b last:border-b-0 bg-white flex flex-col gap-4 hover:bg-gray-50 transition-colors duration-300 relative"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-700">
                  Notification ID: {notification.id}
                </h3>
                <button
                  onClick={() => toggleMoreDetails(notification.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {expandedNotificationId === notification.id ? " " : "More"}
                </button>
              </div>
              <div className="relative mt-4 mb-4">
                <span className="mb-2 font-bold text-lg">Status</span>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`transition-all duration-1000 ${getStatusProgress(
                      notification.status
                    )} h-3 rounded-full animate-fluidProgress`}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1 text-gray-500 font-bold">
                  <span className="text-yellow-600">Pending</span>
                  <span className="text-blue-600">Responded</span>
                  <span className="text-green-600">Printed</span>
                </div>
              </div>
              <div className="flex">
                <strong className="mx-2">Action:</strong>
                <p
                  className={`font-semibold ${getActionColor(
                    notification.action
                  )} text-md`}
                >
                  {notification.action}
                </p>
              </div>
              {expandedNotificationId === notification.id && (
                <div className="relative mt-4 p-4 bg-gray-100 rounded-md shadow-inner">
                  <button
                    onClick={() => toggleMoreDetails(notification.id)}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <strong>Total Pages:</strong> {notification.total_pages}
                    </p>
                    <p>
                      <strong>Print Type:</strong> {notification.print_type}
                    </p>
                    <p>
                      <strong>Print Side:</strong> {notification.print_side}
                    </p>
                    <p>
                      <strong>Page Size:</strong> {notification.page_size}
                    </p>
                    <p>
                      <strong>Number of Copies:</strong>{" "}
                      {notification.no_of_copies}
                    </p>
                    <p>
                      <strong>Comments:</strong>{" "}
                      {notification.comments || "No Comments Added"}
                    </p>
                    <p>
                      <strong>File Path:</strong>{" "}
                      <button
                        onClick={() => downloadFile(notification.file_path)}
                        className="text-blue-500 underline"
                      >
                        View File
                      </button>
                    </p>
                    <p>
                      <strong>Requested On:</strong>{" "}
                      {new Date(notification.request_time).toLocaleString()}
                    </p>
                    <p>
                      <strong>Last Updated:</strong>{" "}
                      {new Date(notification.update_time).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {notification.action === "Accepted" &&
                (notification.status === "Responded" ||
                  notification.status === "Printed") && (
                  <div className="absolute bottom-4 right-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2">
                      <img
                        src={paymentIcon}
                        alt="Payment Icon"
                        className="w-5 h-5 text-white"
                        style={{ filter: "invert(100%)" }}
                      />
                      <span className="font-semibold">Pay Now</span>
                    </button>
                  </div>
                )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrackRequest;
