import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAlert } from '../context/AlertContext';

interface UpdateRequestProps {
  requestId: number;
  onClose: () => void;
}

// Define interfaces for request data and form data
interface RequestData {
  total_pages: number;
  print_type: string;
  print_side: string;
  page_size: string;
  no_of_copies: number;
  comments: string;
}

const UpdateRequest = ({ requestId, onClose }: UpdateRequestProps) => {
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState<RequestData>({
    total_pages: 0,
    print_type: 'black&white',
    print_side: 'single',
    page_size: 'A4',
    no_of_copies: 0,
    comments: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRequestData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('user_token');
        const response = await axios.get(
          `http://127.0.0.1:5000/api/user/requests/${requestId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log('Request data:', response.data);

        // Update formData with the fetched request data
        setFormData({
          total_pages: response.data.total_pages || 0,
          print_type: response.data.print_type || 'black&white',
          print_side: response.data.print_side || 'single',
          page_size: response.data.page_size || 'A4',
          no_of_copies: response.data.no_of_copies || 0,
          comments: response.data.comments || '',
        });
      } catch (error) {
        console.error('Error fetching request data:', error);
        showAlert('error', 'Failed to fetch request data.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequestData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'date_field') {
      setFormData(prev => ({
        ...prev,
        [name]: new Date(value).toISOString(),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Filter out empty or null values from formData
    const updatedData = Object.fromEntries(
      Object.entries(formData).filter(([value]) => value !== '' && value !== null)
    );

    try {
      const token = localStorage.getItem('user_token');
      await axios.put(
        `http://127.0.0.1:5000/api/user/requests/update/${requestId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showAlert('success', 'Request updated successfully.');
      onClose(); 
    } catch (error) {
      console.error('Error updating request:', error);
      showAlert('error', 'Failed to update request.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <h2 className="text-2xl font-bold mb-4">Update Request</h2>
        <button
          onClick={onClose}
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
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Total Pages</label>
            <input
              type="number"
              name="total_pages"
              value={formData.total_pages}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Print Type</label>
            <select
              name="print_type"
              value={formData.print_type}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="color">Color</option>
              <option value="black&white">Black & White</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Print Side</label>
            <select
              name="print_side"
              value={formData.print_side}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="single">Single Sided</option>
              <option value="double">Double Sided</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Page Size</label>
            <select
              name="page_size"
              value={formData.page_size}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="A4">A4</option>
              <option value="A3">A3</option>
              <option value="Letter">Letter</option>
              <option value="Legal">Legal</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Number of Copies</label>
            <input
              type="number"
              name="no_of_copies"
              value={formData.no_of_copies}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Comments</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRequest;
