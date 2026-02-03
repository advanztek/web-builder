import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../Utils/toast';
import { useLoader } from '../Context/LoaderContext';
import { apiCall } from '../Utils/ApiCall';

// Helper function to convert File to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};


export const useGetGalleryFiles = () => {
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [pagination, setPagination] = useState({ offset: 0, limit: 10 });
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    const getGalleryFiles = useCallback(async (offset = 0, limit = 10) => {
        setLoading(true);

        try {
            const res = await apiCall(`/V1/user/gallery/files?offset=${offset}&limit=${limit}`, null, 'GET');

            console.log('📥 Gallery Files Response:', res);

            if (!res?.success) {
                throw new Error(res?.message || "Failed to fetch gallery files");
            }

            let filesData = [];
            let paginationData = { offset, limit };

            // Handle different response structures
            if (res.result?.data && Array.isArray(res.result.data)) {
                filesData = res.result.data;
                paginationData = res.result.pagination || paginationData;
            } else if (Array.isArray(res.result)) {
                filesData = res.result;
            } else if (res.data && Array.isArray(res.data)) {
                filesData = res.data;
            }

            console.log('Processed gallery files:', filesData.length);

            setFiles(filesData);
            setPagination(paginationData);
            return { files: filesData, pagination: paginationData };

        } catch (err) {
            console.error("GET GALLERY FILES ERROR:", err);

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else {
                showToast.error(err.message || 'Failed to load gallery files');
            }

            setFiles([]);
            return { files: [], pagination };

        } finally {
            setLoading(false);
        }
    }, [navigate, showLoader, hideLoader]);

    return { getGalleryFiles, files, pagination, loading };
};

export const useGetSortedGalleryFiles = () => {
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    const getSortedFiles = useCallback(async (type = 'image') => {
        setLoading(true);

        try {
            const res = await apiCall(`/V1/user/gallery/files/sort?type=${type}`, null, 'GET');

            console.log('Sorted Files Response:', res);

            if (!res?.success) {
                throw new Error(res?.message || "Failed to fetch sorted files");
            }

            let filesData = [];

            if (res.result?.data && Array.isArray(res.result.data)) {
                filesData = res.result.data;
            } else if (Array.isArray(res.result)) {
                filesData = res.result;
            } else if (res.data && Array.isArray(res.data)) {
                filesData = res.data;
            }

            console.log('Processed sorted files:', filesData.length);

            setFiles(filesData);
            return filesData;

        } catch (err) {
            console.error("❌ GET SORTED FILES ERROR:", err);

            // If endpoint doesn't exist, return empty array
            if (err.message?.includes('404') || err.message?.includes('not found')) {
                console.warn('⚠️ Sort endpoint not available');
                setFiles([]);
                return [];
            }

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else {
                showToast.error(err.message || 'Failed to load sorted files');
            }

            setFiles([]);
            return [];

        } finally {
            setLoading(false);
        }
    }, [navigate, showLoader, hideLoader]);

    return { getSortedFiles, files, loading };
};


export const useCreateGalleryFile = () => {
    const [loading, setLoading] = useState(false);
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    const createGalleryFile = useCallback(async (fileData) => {
        setLoading(true);

        try {
            // Verify file exists
            if (!fileData.file || !(fileData.file instanceof File)) {
                throw new Error('Invalid file object');
            }

            console.log('📤 Converting file to base64:', fileData.file.name);
            console.log('📦 File size:', (fileData.file.size / 1024).toFixed(2), 'KB');
            console.log('📦 File type:', fileData.file.type);

            // Convert file to base64
            const base64String = await fileToBase64(fileData.file);

            console.log('✅ Base64 conversion complete, length:', base64String.length);
            console.log('📦 Base64 preview:', base64String.substring(0, 100) + '...');

            // Create JSON payload with base64 file
            const payload = {
                file: base64String,
                title: fileData.title?.trim() || '',
                description: fileData.description?.trim() || ''
            };

            console.log('📦 Sending JSON payload with file length:', base64String.length);

            // Send as JSON (application/json is the default)
            const res = await apiCall(
                "/V1/user/gallery/file/create", 
                payload, 
                "POST"
                // contentType defaults to 'application/json'
            );

            console.log('✅ Upload Response:', res);

            if (!res?.success) {
                throw new Error(res?.message || "Failed to upload file");
            }

            showToast.success(res?.message || 'File uploaded successfully');
            return res.result;

        } catch (err) {
            console.error("CREATE GALLERY FILE ERROR:", err);

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else if (err.message?.includes('File is required')) {
                showToast.error('Please select a file to upload');
            } else if (err.message?.includes('File upload failed')) {
                // This might be a server-side issue with processing the file
                showToast.error('Server failed to process the file. Try a different file or contact support.');
            } else {
                showToast.error(err.message || 'Failed to upload file');
            }

            return null;

        } finally {
            setLoading(false);
        }
    }, [navigate, showLoader, hideLoader]);

    return { createGalleryFile, loading };
};


export const useUpdateGalleryFile = () => {
    const [loading, setLoading] = useState(false);
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    const updateGalleryFile = useCallback(async (fileId, updateData) => {
        setLoading(true);

        try {
            const res = await apiCall(`/V1/user/gallery/file/update/${fileId}`, updateData, 'PATCH');

            console.log('Update Response:', res);

            if (!res?.success) {
                throw new Error(res?.message || "Failed to update file");
            }

            showToast.success(res?.message || 'File updated successfully');
            return res.result;

        } catch (err) {
            console.error("UPDATE GALLERY FILE ERROR:", err);

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else {
                showToast.error(err.message || 'Failed to update file');
            }

            return null;

        } finally {
            setLoading(false);
        }
    }, [navigate, showLoader, hideLoader]);

    return { updateGalleryFile, loading };
};

export const useDeleteGalleryFile = () => {
    const [loading, setLoading] = useState(false);
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    const deleteGalleryFile = useCallback(async (fileId) => {
        setLoading(true);
        showLoader('Deleting file...', 'dots');

        try {
            const res = await apiCall(`/V1/user/gallery/file/delete/${fileId}`, null, 'DELETE');

            console.log('Delete Response:', res);

            if (!res?.success) {
                throw new Error(res?.message || "Failed to delete file");
            }

            hideLoader();
            showToast.success(res?.message || 'File deleted successfully');
            return true;

        } catch (err) {
            console.error("❌ DELETE GALLERY FILE ERROR:", err);
            hideLoader();

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else {
                showToast.error(err.message || 'Failed to delete file');
            }

            return false;

        } finally {
            setLoading(false);
        }
    }, [navigate, showLoader, hideLoader]);

    return { deleteGalleryFile, loading };
};