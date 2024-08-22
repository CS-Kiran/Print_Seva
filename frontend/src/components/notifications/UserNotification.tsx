import { useEffect, useState } from "react";
import { useAlert } from "../../context/AlertContext";
import axios from "axios";
import paymentIcon from "../../icons/svg/payment.svg";
import UpdateRequest from "../UpdateRequest";

interface UserNotification {
  id: number;
  status: string;
  action: string;
  file_path: string;
  [key: string]: any; // Add this to allow dynamic key access
}

const UserNotification = () => {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [editingRequestId, setEditingRequestId] = useState<number | null>(null);
  const [expandedNotificationId, setExpandedNotificationId] = useState<
    number | null
  >(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchNotifications();
  }, []);

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
  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      Pending: "text-yellow-500",
      Accepted: "text-green-600",
      Declined: "text-red-500",
    };
    return colors[action] || "text-gray-500";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Pending: "text-yellow-500",
      Responded: "text-blue-500",
      Cancelled: "text-red-500",
    };
    return colors[status] || "text-gray-500";
  };

  const handleEdit = (id: number) => setEditingRequestId(id);
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this request with ID = ${id}?`
    );

    if (confirmed) {
      try {
        const token = localStorage.getItem("user_token");
        if (!token) {
          showAlert("error", "Authorization token not found");
          return;
        }

        const response = await axios.delete(
          `http://127.0.0.1:5000/api/user/requests/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          showAlert("success", "Request deleted successfully");
          setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.id !== id)
          );
        } else {
          showAlert("error", "Failed to delete the request");
        }
      } catch (error) {
        console.error("Error deleting request:", error);
        showAlert("error", "An error occurred while deleting the request");
      }
    }
  };

  const handleToggleExpand = (id: number) => {
    setExpandedNotificationId((prevId) => (prevId === id ? null : id));
  };
  const handleCloseUpdateCard = () => setEditingRequestId(null);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8">
      <h2 className="text-3xl font-bold mb-6">Notifications</h2>
      <div className="w-full max-w-3xl bg-white shadow-md rounded-md p-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications available.</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 mb-4 bg-white border rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 relative"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">
                  Notification ID: {notification.id}
                </h3>
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => handleToggleExpand(notification.id)}
                >
                  {expandedNotificationId === notification.id ? "Less" : "More"}
                </button>
              </div>
              <p
                className={`font-semibold ${getStatusColor(
                  notification.status
                )}`}
              >
                <strong>Status:</strong> {notification.status}
              </p>
              <p
                className={`font-semibold ${getActionColor(
                  notification.action
                )}`}
              >
                <strong>Action:</strong> {notification.action}
              </p>
              <p>
                <strong>File Path:</strong>{" "}
                <a
                  href={notification.file_path}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View File
                </a>
              </p>

              {expandedNotificationId === notification.id && (
                <div className="mt-4">
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
                    <strong>Requested On:</strong>{" "}
                    {new Date(notification.request_time).toLocaleString()}
                  </p>
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(notification.update_time).toLocaleString()}
                  </p>
                </div>
              )}

              {notification.action === "Accepted" &&
                (notification.status === "Responded" ||
                  notification.status === "Printed") && (
                  <div className="absolute bottom-4 right-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2 group">
                      <img
                        src={paymentIcon}
                        alt="Payment Icon"
                        className="w-7 h-7 fill-current text-white filter invert"
                      />
                      <span>Pay Now</span>
                    </button>
                  </div>
                )}

              {notification.action === "Pending" && (
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
                    onClick={() => handleEdit(notification.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
                    onClick={() => handleDelete(notification.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {editingRequestId !== null && (
        <UpdateRequest
          requestId={editingRequestId}
          onClose={handleCloseUpdateCard}
        />
      )}
    </div>
  );
};

export default UserNotification;
