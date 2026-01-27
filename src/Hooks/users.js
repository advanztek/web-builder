// import { useState } from 'react';
// import { showToast } from '../Utils/toast';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// // Generic API call function
// const apiCall = async (endpoint, method = 'GET', data = null) => {
//     const token = localStorage.getItem('token');

//     const options = {
//         method,
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//         },
//     };

//     if (data && method !== 'GET') {
//         options.body = JSON.stringify(data);
//     }

//     const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
//     const result = await response.json();

//     if (!response.ok) {
//         throw new Error(result.message || 'API request failed');
//     }

//     return result;
// };

// // Get all users (Super Admin only)
// export const useGetAllUsers = () => {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const getAllUsers = async () => {
//         setLoading(true);
//         try {
//             const result = await apiCall('/V1/admin/users', 'GET');
//             setUsers(result.users || result.data || []);
//             return result;
//         } catch (error) {
//             showToast.error(error.message || 'Failed to fetch users');
//             console.error('Error fetching users:', error);
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     return { getAllUsers, users, loading };
// };

// // Get credit packages
// export const useGetCreditPackages = () => {
//     const [packages, setPackages] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const getCreditPackages = async () => {
//         setLoading(true);
//         try {
//             const result = await apiCall('/V1/admin/credit-packages', 'GET');
//             setPackages(result.packages || result.data || []);
//             return result;
//         } catch (error) {
//             showToast.error(error.message || 'Failed to fetch credit packages');
//             console.error('Error fetching packages:', error);
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     return { getCreditPackages, packages, loading };
// };

// // Create credit package
// export const useCreateCreditPackage = () => {
//     const [loading, setLoading] = useState(false);

//     const createPackage = async (packageData) => {
//         setLoading(true);
//         try {
//             const result = await apiCall('/V1/admin/credit-packages', 'POST', packageData);
//             showToast.success('Credit package created successfully!');
//             return result;
//         } catch (error) {
//             showToast.error(error.message || 'Failed to create credit package');
//             console.error('Error creating package:', error);
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     return { createPackage, loading };
// };

// // Update credit package
// export const useUpdateCreditPackage = () => {
//     const [loading, setLoading] = useState(false);

//     const updatePackage = async (packageId, packageData) => {
//         setLoading(true);
//         try {
//             const result = await apiCall(`/V1/admin/credit-packages/${packageId}`, 'PUT', packageData);
//             showToast.success('Credit package updated successfully!');
//             return result;
//         } catch (error) {
//             showToast.error(error.message || 'Failed to update credit package');
//             console.error('Error updating package:', error);
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     return { updatePackage, loading };
// };

// // Delete credit package
// export const useDeleteCreditPackage = () => {
//     const [loading, setLoading] = useState(false);

//     const deletePackage = async (packageId) => {
//         setLoading(true);
//         try {
//             const result = await apiCall(`/V1/admin/credit-packages/${packageId}`, 'DELETE');
//             showToast.success('Credit package deleted successfully!');
//             return result;
//         } catch (error) {
//             showToast.error(error.message || 'Failed to delete credit package');
//             console.error('Error deleting package:', error);
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     return { deletePackage, loading };
// };

// // Get user details with projects
// export const useGetUserDetails = () => {
//     const [userDetails, setUserDetails] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const getUserDetails = async (userId) => {
//         setLoading(true);
//         try {
//             const result = await apiCall(`/V1/admin/users/${userId}`, 'GET');
//             setUserDetails(result.user || result.data);
//             return result;
//         } catch (error) {
//             showToast.error(error.message || 'Failed to fetch user details');
//             console.error('Error fetching user details:', error);
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     return { getUserDetails, userDetails, loading };
// };

// // Update user credits (Super Admin only)
// export const useUpdateUserCredits = () => {
//     const [loading, setLoading] = useState(false);

//     const updateCredits = async (userId, credits) => {
//         setLoading(true);
//         try {
//             const result = await apiCall(`/V1/admin/users/${userId}/credits`, 'PUT', { credits });
//             showToast.success('User credits updated successfully!');
//             return result;
//         } catch (error) {
//             showToast.error(error.message || 'Failed to update user credits');
//             console.error('Error updating credits:', error);
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     return { updateCredits, loading };
// };