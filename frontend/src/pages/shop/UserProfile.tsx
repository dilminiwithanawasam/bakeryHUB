import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { User, Mail, Phone, MapPin, LogOut, Edit2, Save, AlertCircle } from 'lucide-react';
import api from '../../api/axios';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  contact_number?: string;
  address?: string;
}

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    address: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setProfile(userData);
        setFormData({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          contact_number: userData.contact_number || userData.phone_number || '',
          address: userData.address || '',
        });
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.patch('/customer/profile/', formData).catch(() => ({ data: null }));
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header cartCount={0} />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
              <User size={40} className="text-orange-600" />
              My Profile
            </h1>
            <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg mb-6">
              <AlertCircle size={20} className="text-red-600" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg mb-6">
              <AlertCircle size={20} className="text-green-600" />
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Name Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed focus:border-orange-500 focus:outline-none transition font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed focus:border-orange-500 focus:outline-none transition font-medium"
                  />
                </div>
              </div>

              {/* Email Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Mail size={18} className="text-orange-600" /> Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed focus:border-orange-500 focus:outline-none transition font-medium"
                />
              </div>

              {/* Phone Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone size={18} className="text-orange-600" /> Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.contact_number}
                  onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed focus:border-orange-500 focus:outline-none transition font-medium"
                />
              </div>

              {/* Address Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={18} className="text-orange-600" /> Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed focus:border-orange-500 focus:outline-none transition font-medium"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-6 border-t">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
                  >
                    <Edit2 size={18} /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                    >
                      <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        fetchProfile();
                      }}
                      className="px-6 py-3 bg-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="ml-auto flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </form>
          </div>

          {/* Account Info Card */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-2">Account Created</h3>
              <p className="text-gray-600">Join date: {profile?.id ? 'Active Member' : 'Recently'}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-2">Total Orders</h3>
              <p className="text-orange-600 font-bold text-2xl">0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
