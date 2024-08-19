import { useEffect, useState } from "react";
import axios from "axios";
import paymentIcon from "../../icons/svg/payment.svg";

interface UserNotification {
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

const UserNotification = () => {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("user_token");
        if (!token) {
          setError("Authorization token not found");
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
          setError("No notifications found");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Error fetching notifications");
      }
    };

    fetchNotifications();
  }, []);

  const getActionColor = (action: string) => {
    switch (action) {
      case "Pending":
        return "text-yellow-500";
      case "Accepted":
        return "text-green-600";
      case "Declined":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-yellow-500";
      case "Responded":
        return "text-blue-500";
      case "Cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const handleEdit = (id: number) => {
    // Implement edit functionality here
    console.log(`Editing request with ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    // Implement delete functionality here
    console.log(`Deleting request with ID: ${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold mt-10 mb-6 animate-scaleUp">
        Notifications
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-md animate-fadeIn">
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications available.</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 mb-4 bg-white border rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 relative"
            >
              <div className="flex items-center mb-2">
                <h3 className="text-xl font-semibold">
                  Notification ID: {notification.id}
                </h3>
              </div>
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
                <strong>Number of Copies:</strong> {notification.no_of_copies}
              </p>
              <p>
                <strong>Comments:</strong>{" "}
                {notification.comments || "No Comments Added"}
              </p>
              <p>
                <strong>File Path:</strong>{" "}
                <a
                  href={notification.file_path}
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View File
                </a>
              </p>
              <p
                className={`mt-2 ${getStatusColor(
                  notification.status
                )} font-semibold`}
              >
                <strong>Status:</strong> {notification.status}
              </p>
              <p
                className={`mt-2 ${getActionColor(
                  notification.action
                )} font-semibold`}
              >
                <strong>Action:</strong> {notification.action}
              </p>
              <p>
                <strong>Request Time:</strong>{" "}
                {new Date(notification.request_time).toLocaleString()}
              </p>
              <p>
                <strong>Update Time:</strong>{" "}
                {new Date(notification.update_time).toLocaleString()}
              </p>
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
              {notification.action === "Pending" &&
                notification.status === "Pending" && (
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
    </div>
  );
};

export default UserNotification;
