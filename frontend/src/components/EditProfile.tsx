import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useShopkeeper } from '../context/ShopkeeperContext';
import { useNavigate } from 'react-router-dom';

const EditProfile = ({ role }) => {
  const { user } = useUser();
  const { shopkeeper } = useShopkeeper();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    old_password: '',
    new_password: '',
    profile_image: null,
    shop_name: '',
    address: '',
    contact: '',
    cost_single_side: '',
    cost_both_sides: ''
  });

  useEffect(() => {
    if (role === 'user' && user) {
      setProfile(user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        old_password: '',
        new_password: '',
        profile_image: null,
        address: user.address || '',
        contact: user.contact || ''
      });
    } else if (role === 'shopkeeper' && shopkeeper) {
      setProfile(shopkeeper);
      setFormData({
        name: shopkeeper.name || '',
        email: shopkeeper.email || '',
        old_password: '',
        new_password: '',
        profile_image: null,
        shop_name: shopkeeper.shop_name || '',
        address: shopkeeper.address || '',
        contact: shopkeeper.contact || '',
        cost_single_side: shopkeeper.cost_single_side || '',
        cost_both_sides: shopkeeper.cost_both_sides || ''
      });
    }
  }, [user, shopkeeper, role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSubmit.append(key, formData[key]);
    });

    console.log('formDataToSubmit', formDataToSubmit);
    try {
      const endpoint = role === 'user' ? '/api/user/update' : '/api/shopkeeper/update';
      await axios.post(`http://127.0.0.1:5000${endpoint}`, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem(role === 'user' ? 'user_token' : 'shopkeeper_token')}`
        }
      });
      navigate(role === 'user' ? '/user-dashboard' : '/shopkeeper-dashboard');
    } catch (error) {
      console.error('Failed to update profile', error.response?.data || error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-xl">
        <h1 className="text-4xl text-center font-bold text-gray-600 mb-4">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          {role === 'shopkeeper' && (
            <div>
              <label className="block text-gray-700">Shop Name</label>
              <input
                type="text"
                name="shop_name"
                value={formData.shop_name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          )}
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
              disabled
            />
          </div>
          <div>
            <label className="block text-gray-700">Old Password</label>
            <input
              type="password"
              name="old_password"
              value={formData.old_password}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required={formData.new_password !== ''}
            />
          </div>
          <div>
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Profile Image</label>
            <input
              type="file"
              name="profile_image"
              onChange={handleFileChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          {role === 'shopkeeper' && (
            <>
              <div>
                <label className="block text-gray-700">Cost of Single Side</label>
                <input
                  type="number"
                  name="cost_single_side"
                  value={formData.cost_single_side}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700">Cost of Both Sides</label>
                <input
                  type="number"
                  name="cost_both_sides"
                  value={formData.cost_both_sides}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </>
          )}
          <div className="text-center">
            <button
              type="submit"
              className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 ease-in-out"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;