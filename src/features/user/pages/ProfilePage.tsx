import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Mail, Phone, User, Shield, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { updateUserProfile } from '../services/userService';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Local form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // UI state
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Populate local form state when user changes or edit mode opens
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || user.fullName || user.name || '');
      setPhone(user.phone || user.phone_number || '');
    }
  }, [user, isEditing]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500 font-medium">Please log in to view your profile.</p>
      </div>
    );
  }

  const displayName = user.full_name || user.fullName || user.name || 'User';
  const displayEmail = user.email || '';
  const displayPhone = user.phone || user.phone_number || 'Not set';
  const role = user.role || 'USER';

  const handleCancel = () => {
    setIsEditing(false);
    setErrorMsg('');
    setSuccessMsg('');
    // Reset to original values
    setFullName(user.full_name || user.fullName || user.name || '');
    setPhone(user.phone || user.phone_number || '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        full_name: fullName,
        phone: phone,
      };

      // 1. Call API service to update user profile on the backend
      await updateUserProfile(payload);

      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setErrorMsg(
        err?.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 px-4">
      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-sm font-medium animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSave}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">My Profile</h2>
            <button
              type="button"
              onClick={isEditing ? handleCancel : () => setIsEditing(true)}
              className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* User Avatar & Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-extrabold border border-blue-200 flex-shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{displayName}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mt-1 uppercase">
                <Shield className="w-3 h-3 mr-1" />
                {role}
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Full Name */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="mt-1 w-full text-sm bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-900"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{displayName}</p>
                )}
              </div>
            </div>

            {/* Email (Read Only) */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{displayEmail}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="mt-1 w-full text-sm bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-900"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{displayPhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          {isEditing && (
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}