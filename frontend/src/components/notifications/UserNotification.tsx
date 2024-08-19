import { useEffect, useState } from "react";
import { useAlert } from '../../context/AlertContext';
import axios from "axios";
import paymentIcon from "../../icons/svg/payment.svg";
import UpdateRequest from '../UpdateRequest';

interface UserNotification {
  id: number;
  status: string;
  action: string;
  file_path: string;
}

const UserNotification = () => {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [editingRequestId, setEditingRequestId] = useState<number | null>(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("user_token");
        if (!token) {
          showAlert('error', 'Authorization token not found');
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
          showAlert('warning', 'No notifications found');
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        showAlert('warning', 'Error fetching notifications');
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
    setEditingRequestId(id);
  };

  const handleDelete = (id: number) => {
    console.log(`Deleting request with ID: ${id}`);
    // Implement delete functionality here
  };

  const handleCloseUpdateCard = () => {
    setEditingRequestId(null);
  };

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
              <div className="flex items-center mb-2">
                <h3 className="text-xl font-semibold">
                  Notification ID: {notification.id}
                </h3>
              </div>
              <p className={`font-semibold ${getStatusColor(notification.status)}`}>
                <strong>Status:</strong> {notification.status}
              </p>
              <p className={`font-semibold ${getActionColor(notification.action)}`}>
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
              {notification.action === "Accepted" &&
                (notification.status === "Responded" || notification.status === "Printed") && (
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
