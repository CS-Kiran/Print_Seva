import { useEffect, useState } from 'react';
import { useShopkeeper } from '../../context/ShopkeeperContext';
import axios from 'axios';

interface UserRequest {
  id: number;
  total_pages: number;
  print_type: string;
  print_side: string;
  page_size: string;
  no_of_copies: number;
  file_path: string;
  comments: string;
  sender_email: string;
}

const ShopkeeperNotification = () => {
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { shopkeeper } = useShopkeeper();

  useEffect(() => {
    const fetchRequests = async () => {
        try {
          if (!shopkeeper) {
            setError('Shopkeeper ID is not available');
            return;
          }
      
          const response = await axios.post(
            `http://127.0.0.1:5000/api/shopkeeper/requests`,
            { shopkeeper_id: shopkeeper.shopkeeper_id },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('shopkeeper_token')}`,
              },
            }
          );
          console.log(response.data);
          if (Array.isArray(response.data)) {
            setRequests(response.data);
          } else {
            setRequests([]);  // Set to an empty array if unexpected format
            setError('Unexpected response format');
          }
        } catch (error) {
          console.error('Error fetching requests:', error);
          setRequests([]);  // Ensure requests is an array
          setError('Error fetching requests');
        }
      };
      

    fetchRequests();
  }, [shopkeeper]);

  const handleAction = async (id: number, action: 'accept' | 'decline') => {
    try {
      await axios.post(`http://127.0.0.1:5000/api/shopkeeper/requests/${id}/${action}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('shopkeeper_token')}`,
        },
      });
      setRequests(requests.filter(request => request.id !== id));
    } catch (error) {
      console.error(`Error ${action} request:`, error);
      setError(`Error ${action} request`);
    }
  };

  const downloadFile = async (filePath: string) => {
    try {
      const url = `http://127.0.0.1:5000/api/shopkeeper/download/${encodeURIComponent(filePath)}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('shopkeeper_token')}`,
        },
        responseType: 'blob',  // Ensure the response is treated as a file
      });

      // Create a link element, set its href to a blob URL, and programmatically click it to trigger a download
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filePath); // Use the file name for download
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl); // Clean up the URL object
    } catch (error) {
      console.error('Error downloading file:', error);
      setError('Error downloading file');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold mt-10 mb-6 animate-scaleUp">Notifications</h2>
      <div className="w-[50%] max-w-4xl p-6 bg-white shadow-md rounded-md animate-fadeIn">
        {requests.length === 0 ? (
          <p className="text-gray-500">No requests available.</p>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="p-4 mb-4 bg-gray-50 border rounded-md">
              <p className='font-bold'><strong>Request ID:</strong> {request.id}</p>
              <p><strong>Sender's Email:</strong> {request.sender_email}</p>
              <p><strong>Total Pages:</strong> {request.total_pages}</p>
              <p><strong>Print Type:</strong> {request.print_type.toUpperCase()}</p>
              <p><strong>Print Side:</strong> {request.print_side.toUpperCase()}</p>
              <p><strong>Page Size:</strong> {request.page_size}</p>
              <p><strong>Number of Copies:</strong> {request.no_of_copies}</p>
              <p><strong>Comments:</strong> {request.comments.toUpperCase() || 'No Comments Added'}</p>
              <p><strong>File Path:</strong> 
                <button 
                  onClick={() => downloadFile(request.file_path)}
                  className="text-blue-500 underline"
                >
                  View File
                </button>
              </p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleAction(request.id, 'accept')}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAction(request.id, 'decline')}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShopkeeperNotification;
