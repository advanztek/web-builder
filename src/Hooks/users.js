import { useState } from 'react';
import { showToast } from '../Utils/toast';
import { useLoader } from '../Context/LoaderContext';
import { apiCall } from '../Utils/ApiCall';

export const useGetAllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const { showLoader, hideLoader } = useLoader();

    const getAllUsers = async () => {
        setLoading(true);
        showLoader('Loading users...', 'dots');
        try {
            const result = await apiCall('/V1/admin/users', null, 'GET');
            
            const mappedUsers = (result.result || []).map(user => ({
                id: user.id,
                name: `${user.firstname} ${user.lastname}`,
                email: user.email,
                avatar: null, 
                projectCount: 0, 
                credits: user.balance || 0,
                status: user.status ? 'active' : 'inactive',
                role: user.role,
                created_at: user.created_at
            }));
            
            setUsers(mappedUsers);
            return result;
        } catch (error) {
            hideLoader();
            showToast.error(error.message || 'Failed to fetch users');
            console.error('Error fetching users:', error);
            return null;
        } finally {
            hideLoader();
            setLoading(false);
        }
    };

    return { getAllUsers, users, loading };
};


// Get user details with projects
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

