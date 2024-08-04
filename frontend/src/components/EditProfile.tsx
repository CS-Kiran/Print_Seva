import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useShopkeeper } from '../context/ShopkeeperContext';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../context/AlertContext';

const FormInput = ({ label, type = 'text', name, value, onChange, required = false, disabled = false }) => (
  <div>
    <label className="block text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
      required={required}
      disabled={disabled}
    />
  </div>
);

const EditProfile = ({ role }) => {
  const { user, setUser } = useUser();
  const { shopkeeper, setShopkeeper } = useShopkeeper();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

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
    const profile = role === 'user' ? user : shopkeeper;
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        old_password: '',
        new_password: '',
        profile_image: null,
        shop_name: role === 'shopkeeper' ? profile.shop_name || '' : '',
        address: profile.address || '',
        contact: profile.contact || '',
        cost_single_side: role === 'shopkeeper' ? profile.cost_single_side || '' : '',
        cost_both_sides: role === 'shopkeeper' ? profile.cost_both_sides || '' : ''
      });
    }
  }, [role, user, shopkeeper]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({ ...prevState, profile_image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSubmit.append(key, value || '');
    });
  
    try {
      const endpoint = role === 'user' ? '/api/user/update' : '/api/shopkeeper/update';
      const response = await axios.post(`http://127.0.0.1:5000${endpoint}`, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem(role === 'user' ? 'user_token' : 'shopkeeper_token')}`
        }
      });

      console.log('API response:', response.data);  // Log the response data
  
      showAlert('success', 'Profile updated successfully');
  
      if (role === 'user') {
        setUser(response.data.user);
      } else {
        setShopkeeper(response.data.shopkeeper);
      }
  
      navigate(role === 'user' ? '/user-dashboard/profile' : '/shopkeeper-dashboard/profile');
  
    } catch (error) {
      console.error('Failed to update profile', error.response?.data || error.message);
      showAlert('error', 'Failed to update profile');
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-xl">
        <h1 className="text-4xl text-center font-bold text-gray-600 mb-4">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput label="Name" name="name" value={formData.name} onChange={handleChange} />
          {role === 'shopkeeper' && <FormInput label="Shop Name" name="shop_name" value={formData.shop_name} onChange={handleChange} />}
          <FormInput label="Email" type="email" name="email" value={formData.email} onChange={handleChange} disabled required />
          <FormInput label="Old Password" type="password" name="old_password" value={formData.old_password} onChange={handleChange} required={formData.new_password !== ''} />
          <FormInput label="New Password" type="password" name="new_password" value={formData.new_password} onChange={handleChange} />
          <div>
            <label className="block text-gray-700">Profile Image</label>
            <input
              type="file"
              name="profile_image"
              onChange={handleFileChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <FormInput label="Address" name="address" value={formData.address} onChange={handleChange} />
          <FormInput label="Contact" name="contact" value={formData.contact} onChange={handleChange} />
          {role === 'shopkeeper' && (
            <>
              <FormInput label="Cost of Single Side" type="number" name="cost_single_side" value={formData.cost_single_side} onChange={handleChange} />
              <FormInput label="Cost of Both Sides" type="number" name="cost_both_sides" value={formData.cost_both_sides} onChange={handleChange} />
            </>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
