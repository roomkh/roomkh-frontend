import axiosInstance from '../../../config/axios';

// POST /api/v1/seller-requests
export const submitSellerRequest = async (formData) => {
  const payload = {
    full_name: formData.fullName,
    email: formData.email,
    phone_number: formData.phone,
    position: formData.position,
    business_name: formData.companyName || '',
    reason: formData.reason,
    agree_terms: formData.agreedTerms,
  };

  return await axiosInstance.post('/seller-requests', payload);
};