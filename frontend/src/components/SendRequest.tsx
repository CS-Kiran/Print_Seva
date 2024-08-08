import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from '../context/UserContext';
import { useAlert } from "../context/AlertContext";
import trackRequestIcon from "../icons/svg/track_request.svg";

interface FormData {
  totalPages: number;
  printType: string;
  printSide: string;
  pageSize: string;
  no_of_copies: number;
  shop_name: string;
  file: File | null;
  comments: string;
}

interface Shop {
  shop_name: string;
  shopkeeper_id: number;
  address: string;
  shop_image: string | null;
  name: string;
  cost_single_side: number;
  cost_both_sides: number;
}

const initialFormData: FormData = {
  totalPages: 1,
  printType: "black&white",
  printSide: "single",
  pageSize: "A4",
  no_of_copies: 1,
  shop_name: "",
  file: null,
  comments: ""
};

const SendRequest = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const { user } = useUser();
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/shops');
        setShops(response.data);
      } catch (error) {
        showAlert("warning", "Error fetching shops.");
        console.error('Error fetching shops:', error);
      }
    };

    fetchShops();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData({ ...formData, file });
      setFileSize(file.size);
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setFileSize(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { totalPages, printType, printSide, pageSize, no_of_copies, shop_name, file, comments } = formData;

    if (!file) {
      console.error('No file selected');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('total_pages', String(totalPages));
    formDataToSend.append('print_type', printType);
    formDataToSend.append('print_side', printSide);
    formDataToSend.append('page_size', pageSize);
    formDataToSend.append('no_of_copies', String(no_of_copies));
    formDataToSend.append('shop_name', shop_name);
    formDataToSend.append('file', file);
    formDataToSend.append('comments', comments);

    const token = localStorage.getItem("user_token");

    if (!token) {
      console.error('No user token found');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/user_request', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.status === 201) {
        showAlert("success", "Print request submitted successfully");
        setFormData(initialFormData);
        setFileSize(null);
      } else {
        showAlert("warning", "Error submitting print request");
        console.error('Error submitting print request:', response.statusText);
      }
    } catch (error) {
      showAlert("warning", "Error submitting print request");
      console.error('Error submitting print request:', error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <button className="absolute animate-fadeIn flex flex-col justify-center items-center top-0 right-4 p-2 bg-transparent">
          <img src={trackRequestIcon} alt="Send Request" className="w-12 h-12 group-hover:filter group-hover:invert p-2 rounded-full hover:animate-rotate"/>
          <p className="font-medium text-sm">Track request</p>
        </button>
        <div className="w-[40rem] animate-scaleUp max-h-full overflow-y-auto mx-auto mt-7 p-6 bg-white rounded-md shadow-md border-2 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-center text-[#373a40]">
            Send Request
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Total Pages</label>
              <input
                type="number"
                name="totalPages"
                value={formData.totalPages}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-full"
                placeholder="Enter total pages"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Print Type</label>
              <select
                name="printType"
                value={formData.printType}
                onChange={handleChange}
                className="w-full px-4 py-2 border bg-transparent rounded-full"
              >
                <option value="color" className="my-2">Color</option>
                <option value="black&white" className="my-2">Black & White</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Print Side</label>
              <select
                name="printSide"
                value={formData.printSide}
                onChange={handleChange}
                className="w-full px-4 py-2 border bg-transparent rounded-full"
              >
                <option value="single">Single Sided</option>
                <option value="double">Double Sided</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Page Size</label>
              <select
                name="pageSize"
                value={formData.pageSize}
                onChange={handleChange}
                className="w-full px-4 py-2 border bg-transparent rounded-full"
              >
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Number of Copies</label>
              <input
                type="number"
                name="no_of_copies"
                value={formData.no_of_copies}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-full"
                placeholder="Enter number of copies"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Choose Shop</label>
              <select
                name="shop_name"
                value={formData.shop_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border bg-transparent rounded-full"
                required
              >
                <option value="">Select Shop</option>
                {shops.map((shop, index) => (
                  <option key={index} value={shop.shop_name}>{shop.shop_name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Comments</label>
              <textarea
                name="comments"
                value={formData.comments}
                rows={1}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-full"
                placeholder="Enter any comments or special instructions"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Upload File</label>
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                className="cursor-pointer w-full rounded-full px-4 py-2 border file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                required
              />
              {fileSize !== null && (
                <p className="text-sm text-gray-500 mt-2">
                  File size: {(fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>
            <div className="flex justify-between font-semibold">
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Submit
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SendRequest;
