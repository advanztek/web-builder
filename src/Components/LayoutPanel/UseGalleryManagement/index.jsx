import { useState } from 'react';
import {
    useGetGalleryFiles,
    useCreateGalleryFile,
    useUpdateGalleryFile,
    useDeleteGalleryFile,
    useGetSortedGalleryFiles
} from '../../../Hooks/gallery';
import { showToast } from '../../../Utils/toast';

export const useGalleryManagement = () => {
    const { getGalleryFiles, files: galleryFiles, pagination, loading: loadingGallery } = useGetGalleryFiles();
    const { createGalleryFile, loading: uploadingFile } = useCreateGalleryFile();
    const { updateGalleryFile, loading: updatingFile } = useUpdateGalleryFile();
    const { deleteGalleryFile, loading: deletingFile } = useDeleteGalleryFile();
    const { getSortedFiles, files: sortedFiles, loading: loadingSorted } = useGetSortedGalleryFiles();

    const [editFileDialog, setEditFileDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileTitle, setFileTitle] = useState('');
    const [fileDescription, setFileDescription] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [currentPage, setCurrentPage] = useState(0);
    const [sortingEnabled, setSortingEnabled] = useState(true);

    const loadGalleryFiles = async () => {
        if (filterType === 'all' || !sortingEnabled) {
            await getGalleryFiles(currentPage * 10, 10);
        } else {
            try {
                await getSortedFiles(filterType);
            } catch (error) {
                console.warn('Sort endpoint failed, falling back to all files');
                setSortingEnabled(false);
                await getGalleryFiles(currentPage * 10, 10);
            }
        }
    };

    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);

        if (files.length === 0) {
            return;
        }

        try {
            let successCount = 0;
            let errorCount = 0;

            for (const file of files) {
                const validTypes = [
                    'image/jpeg', 'image/jpg', 'image/png',
                    'image/gif', 'image/webp', 'video/mp4', 'video/webm'
                ];

                if (!validTypes.includes(file.type)) {
                    showToast.error(`${file.name} is not a supported file type`);
                    errorCount++;
                    continue;
                }

                if (file.size > 10 * 1024 * 1024) {
                    showToast.error(`${file.name} is too large. Max size is 10MB`);
                    errorCount++;
                    continue;
                }

                const fileData = {
                    file: file,
                    title: file.name.replace(/\.[^/.]+$/, ''),
                    description: ''
                };

                const result = await createGalleryFile(fileData);

                if (result) {
                    successCount++;
                } else {
                    errorCount++;
                }
            }

            if (files.length > 1) {
                if (successCount > 0) {
                    showToast.success(`${successCount} file(s) uploaded successfully`);
                }
                if (errorCount > 0) {
                    showToast.error(`${errorCount} file(s) failed to upload`);
                }
            }

            await loadGalleryFiles();
            event.target.value = '';

        } catch (error) {
            console.error('File upload error:', error);
            showToast.error('Upload failed');
        }
    };

    const handleEditFile = (file) => {
        setSelectedFile(file);
        setFileTitle(file.title || '');
        setFileDescription(file.description || '');
        setEditFileDialog(true);
    };

    const handleUpdateFile = async () => {
        if (!selectedFile) return;

        const updateData = {
            title: fileTitle.trim(),
            description: fileDescription.trim(),
            status: true
        };

        const result = await updateGalleryFile(selectedFile.id, updateData);

        if (result) {
            setEditFileDialog(false);
            setSelectedFile(null);
            setFileTitle('');
            setFileDescription('');
            await loadGalleryFiles();
        }
    };

    const handleDeleteFile = async (fileId) => {
        const confirmed = window.confirm('Are you sure you want to delete this file?');
        if (!confirmed) return;

        const result = await deleteGalleryFile(fileId);

        if (result) {
            await loadGalleryFiles();
        }
    };

    const handleUseFile = (file) => {
        const event = new CustomEvent('use-asset', {
            detail: {
                url: file.file_url,
                type: file.file_type,
                name: file.title || 'Untitled'
            }
        });
        window.dispatchEvent(event);
        showToast.success(`Added ${file.title || 'file'} to canvas`);
    };

    const handleFilterChange = (type) => {
        setFilterType(type);
        setCurrentPage(0);
    };

    const handleLoadMore = () => {
        setCurrentPage(prev => prev + 1);
    };

    const displayFiles = filterType === 'all' ? galleryFiles : sortedFiles;

    return {
        // State
        displayFiles,
        loadingGallery,
        loadingSorted,
        uploadingFile,
        updatingFile,
        filterType,
        sortingEnabled,
        editFileDialog,
        fileTitle,
        fileDescription,

        // Functions
        loadGalleryFiles,
        handleFileUpload,
        handleEditFile,
        handleUpdateFile,
        handleDeleteFile,
        handleUseFile,
        handleFilterChange,
        handleLoadMore,
        setEditFileDialog,
        setFileTitle,
        setFileDescription
    };
};