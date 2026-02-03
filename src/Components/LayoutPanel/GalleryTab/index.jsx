import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    CircularProgress,
    Chip,
    Button,
    Tooltip
} from '@mui/material';
import {
    Collections,
    Upload,
    VideoLibrary,
    InsertDriveFile,
    Edit,
    Delete,
    Image as ImageIcon
} from '@mui/icons-material';

export const GalleryTab = ({
    displayFiles,
    loadingGallery,
    loadingSorted,
    uploadingFile,
    filterType,
    sortingEnabled,
    onFileUpload,
    onFilterChange,
    onEditFile,
    onDeleteFile,
    onUseFile,
    onLoadMore
}) => {
    return (
        <>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                bgcolor: '#0d0d0d'
            }}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: 600,
                        color: '#b0b0b0',
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px'
                    }}
                >
                    Media ({displayFiles.length})
                </Typography>
                <Tooltip title="Upload Files">
                    <IconButton
                        size="small"
                        component="label"
                        sx={{ color: '#1976d2' }}
                        disabled={uploadingFile}
                    >
                        {uploadingFile ? <CircularProgress size={20} /> : <Upload fontSize="small" />}
                        <input
                            type="file"
                            hidden
                            multiple
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/webm"
                            onChange={onFileUpload}
                        />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Filter Chips */}
            <Box sx={{ px: 2, pb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                    label="All"
                    size="small"
                    onClick={() => onFilterChange('all')}
                    color={filterType === 'all' ? 'primary' : 'default'}
                    sx={{ fontSize: '0.75rem' }}
                />
                <Chip
                    label="Images"
                    size="small"
                    icon={<ImageIcon />}
                    onClick={() => onFilterChange('image')}
                    color={filterType === 'image' ? 'primary' : 'default'}
                    disabled={!sortingEnabled}
                    sx={{ fontSize: '0.75rem' }}
                />
                <Chip
                    label="Videos"
                    size="small"
                    icon={<VideoLibrary />}
                    onClick={() => onFilterChange('video')}
                    color={filterType === 'video' ? 'primary' : 'default'}
                    disabled={!sortingEnabled}
                    sx={{ fontSize: '0.75rem' }}
                />
                {!sortingEnabled && (
                    <Typography variant="caption" sx={{ color: '#808080', alignSelf: 'center', ml: 1 }}>
                        (Filters unavailable)
                    </Typography>
                )}
            </Box>

            {/* Files Grid */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                {loadingGallery || loadingSorted ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress size={40} />
                    </Box>
                ) : displayFiles.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Collections sx={{ fontSize: 48, color: '#404040', mb: 2 }} />
                        <Typography variant="caption" sx={{ color: '#808080' }}>
                            No files uploaded yet
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ color: '#606060', mt: 1 }}>
                            Click the upload button to add images or videos
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: 1
                        }}>
                            {displayFiles.map((file) => (
                                <FileCard
                                    key={file.id}
                                    file={file}
                                    onEdit={onEditFile}
                                    onDelete={onDeleteFile}
                                    onUse={onUseFile}
                                />
                            ))}
                        </Box>

                        {/* Load More Button */}
                        {filterType === 'all' && displayFiles.length >= 10 && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Button
                                    size="small"
                                    onClick={onLoadMore}
                                    disabled={loadingGallery}
                                    sx={{ color: '#1976d2' }}
                                >
                                    {loadingGallery ? <CircularProgress size={20} /> : 'Load More'}
                                </Button>
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </>
    );
};

const FileCard = ({ file, onEdit, onDelete, onUse }) => {
    return (
        <Box
            sx={{
                position: 'relative',
                bgcolor: '#0d0d0d',
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                '&:hover .file-actions': {
                    opacity: 1
                }
            }}
            onClick={() => onUse(file)}
        >
            {/* File Preview */}
            {file.file_type === 'image' ? (
                <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/${file.file_url}`}
                    alt={file.title || 'Image'}
                    style={{
                        width: '100%',
                        height: 100,
                        objectFit: 'cover'
                    }}
                />
            ) : file.file_type === 'video' ? (
                <Box sx={{
                    width: '100%',
                    height: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#1a1a1a'
                }}>
                    <VideoLibrary sx={{ fontSize: 40, color: '#606060' }} />
                </Box>
            ) : (
                <Box sx={{
                    width: '100%',
                    height: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#1a1a1a'
                }}>
                    <InsertDriveFile sx={{ fontSize: 40, color: '#606060' }} />
                </Box>
            )}

            {/* Action Buttons */}
            <Box
                className="file-actions"
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    display: 'flex'
                }}
            >
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(file);
                    }}
                    sx={{ color: '#4caf50' }}
                >
                    <Edit fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(file.id);
                    }}
                    sx={{ color: '#ff5252' }}
                >
                    <Delete fontSize="small" />
                </IconButton>
            </Box>

            {/* File Info */}
            <Box sx={{ p: 0.5, bgcolor: '#0d0d0d' }}>
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        color: '#808080',
                        fontSize: '0.65rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {file.title || file.file_url.split('/').pop()}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        color: '#606060',
                        fontSize: '0.6rem'
                    }}
                >
                    {file.file_size}
                </Typography>
            </Box>
        </Box>
    );
};