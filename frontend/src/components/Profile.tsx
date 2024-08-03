import React from 'react';
import { useUser } from '../context/UserContext';
import { useShopkeeper } from '../context/ShopkeeperContext';
import { useNavigate } from 'react-router-dom';

interface ProfileProps {
  role: 'user' | 'shopkeeper';
}

const Profile: React.FC<ProfileProps> = ({ role }) => {
  const { user } = useUser();
  const { shopkeeper } = useShopkeeper();
  const navigate = useNavigate();

  const profile = role === 'user' ? user : shopkeeper;

  const handleEditProfile = () => {
    if (user) {
      navigate('/user-dashboard/edit-profile');
    } 
    if  (shopkeeper) {
      navigate('/shopkeeper-dashboard/edit-profile');
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-scaleUp">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md text-center">
        <img
          src={role === 'user' ? profile.profile_image : profile.shop_image}
          alt="Profile_Image"
          className="w-full h-52 mb-4 rounded-t-lg transition duration-300 ease-in-out hover:scale-105 object-cover"
        />
        <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
        <p className="text-gray-600 mb-1">Email: {profile.email}</p>
        {role === 'shopkeeper' && (
          <p className="text-gray-600 mb-1">Shop Name: {profile.shop_name}</p>
        )}
        <p className="text-gray-600 mb-1">Contact: {profile.contact || 'Not Available'}</p>
        <p className="text-gray-600 mb-1">Address: {profile.address || 'Not Available'}</p>
        {role === 'shopkeeper' && (
          <> 
              <div className="flex p-4 justify-between">
                <p className="text-gray-600">
                  Single Side: {profile.cost_single_side}
                </p>
                <p className="text-gray-600">
                  Both Sides: {profile.cost_both_sides}
                </p>
              </div>
          </>
        )}
        <button
          onClick={handleEditProfile}
          className="my-6 px-4 py-2 bg-white text-green-900 border-2 border-green-600 rounded-full hover:bg-green-600 hover:text-white font-semibold transition duration-300 ease-in-out"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
