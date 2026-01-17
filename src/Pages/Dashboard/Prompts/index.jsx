import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    Box,
    Container,
    Typography,
    Button,
    TextField,
    Chip,
    IconButton,
    useTheme,
    useMediaQuery,
    CircularProgress,
    Alert,
    Snackbar,
    Paper,
} from '@mui/material';
import {
    Attach20Regular,
    BookOpen20Regular,
    Mic20Regular,
} from '@fluentui/react-icons';
import { ArrowUpward, ArrowBack, Close, PictureAsPdf, Image } from '@mui/icons-material';
import { useGetProjectBySlug, useUpdateProject } from '../../../Hooks/projects';
import { setActiveProject } from '../../../Store/slices/projectsSlice';

const TypewriterPlaceholder = ({ theme }) => {
    const texts = [
        "Build a modern e-commerce platform with shopping cart and payment integration...",
        "Create a portfolio website with animated transitions and dark mode...",
        "Design a restaurant website with online ordering and reservation system...",
        "Develop a fitness tracking app with workout plans and progress charts...",
        "Build a social media dashboard with real-time analytics and notifications...",
    ];

    const [textIndex, setTextIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentText = texts[textIndex];
        const typingSpeed = isDeleting ? 30 : 50;
        const pauseBeforeDelete = 2000;
        const pauseBeforeNext = 500;

        if (!isDeleting && charIndex < currentText.length) {
            const timer = setTimeout(() => {
                setDisplayText(currentText.slice(0, charIndex + 1));
                setCharIndex(charIndex + 1);
            }, typingSpeed);
            return () => clearTimeout(timer);
        } else if (!isDeleting && charIndex === currentText.length) {
            const timer = setTimeout(() => {
                setIsDeleting(true);
            }, pauseBeforeDelete);
            return () => clearTimeout(timer);
        } else if (isDeleting && charIndex > 0) {
            const timer = setTimeout(() => {
                setDisplayText(currentText.slice(0, charIndex - 1));
                setCharIndex(charIndex - 1);
            }, typingSpeed);
            return () => clearTimeout(timer);
        } else if (isDeleting && charIndex === 0) {
            const timer = setTimeout(() => {
                setIsDeleting(false);
                setTextIndex((textIndex + 1) % texts.length);
            }, pauseBeforeNext);
            return () => clearTimeout(timer);
        }
    }, [charIndex, isDeleting, textIndex, texts]);

    return (
        <Box
            sx={{
                color: theme.palette.text.disabled,
                fontSize: { xs: '14px', md: '16px' },
                fontFamily: 'inherit',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
            }}
        >
            {displayText}
            <Box
                component="span"
                sx={{
                    display: 'inline-block',
                    width: '2px',
                    height: '1em',
                    backgroundColor: theme.palette.text.disabled,
                    marginLeft: '2px',
                    animation: 'blink 1s infinite',
                    '@keyframes blink': {
                        '0%, 49%': { opacity: 1 },
                        '50%, 100%': { opacity: 0 },
                    },
                }}
            />
        </Box>
    );
};

const PromptsPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { getProjectBySlug, project, loading } = useGetProjectBySlug();
    const { updateProject, loading: updating } = useUpdateProject();

    const fileInputRef = useRef(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('apps');
    const [inputValue, setInputValue] = useState('');
    const [showAllSuggestions, setShowAllSuggestions] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [isRecording, setIsRecording] = useState(false);

    const suggestions = [
        'Modern SaaS Landing Page',
        'Corporate Business Website',
        'Creative Portfolio Website',
        'Restaurant Website',
        'Healthcare Clinic Website',
        'Digital Marketing Agency',
        'Real Estate Website',
        'Fitness & Wellness Website',
        'Educational Platform',
        'E-commerce Store',
        'Travel Booking Website',
        'Music Streaming App',
        'Project Management Tool',
        'Food Delivery App',
        'Social Networking Site',
        'Video Conference Platform'
    ];

    const initialDisplayCount = 6;
    const displayedSuggestions = showAllSuggestions
        ? suggestions
        : suggestions.slice(0, initialDisplayCount);

    useEffect(() => {
        const loadProject = async () => {
            try {
                setError(null);
                const loadedProject = await getProjectBySlug(slug);

                if (loadedProject) {
                    dispatch(setActiveProject(loadedProject.id));
                    if (loadedProject.seo?.description) {
                        setInputValue(loadedProject.seo.description);
                    }
                } else {
                    setError('Project not found');
                }
            } catch (err) {
                console.error('Error loading project:', err);
                setError(err.message || 'Failed to load project');
            }
        };

        if (slug) {
            loadProject();
        }
    }, [slug]);

    const handleBack = () => {
        navigate('/dashboard');
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const validFiles = [];
        const maxSize = 10 * 1024 * 1024; // 10MB

        files.forEach(file => {
            // Check file type
            const isImage = file.type.startsWith('image/');
            const isPDF = file.type === 'application/pdf';

            if (!isImage && !isPDF) {
                setSnackbar({
                    open: true,
                    message: `${file.name} is not a valid file type. Only images and PDFs are allowed.`,
                    severity: 'error'
                });
                return;
            }

            // Check file size
            if (file.size > maxSize) {
                setSnackbar({
                    open: true,
                    message: `${file.name} is too large. Maximum size is 10MB.`,
                    severity: 'error'
                });
                return;
            }

            validFiles.push({
                file,
                id: Date.now() + Math.random(),
                name: file.name,
                type: file.type,
                size: file.size,
                preview: isImage ? URL.createObjectURL(file) : null
            });
        });

        if (validFiles.length > 0) {
            setUploadedFiles(prev => [...prev, ...validFiles]);
            setSnackbar({
                open: true,
                message: `${validFiles.length} file(s) uploaded successfully`,
                severity: 'success'
            });
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveFile = (fileId) => {
        setUploadedFiles(prev => {
            const updated = prev.filter(f => f.id !== fileId);
            const removedFile = prev.find(f => f.id === fileId);
            if (removedFile?.preview) {
                URL.revokeObjectURL(removedFile.preview);
            }
            return updated;
        });
    };

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    const handleVoiceRecord = () => {
        if (!isRecording) {
            setIsRecording(true);
            setSnackbar({
                open: true,
                message: 'Voice recording started...',
                severity: 'info'
            });
            // TODO: Implement actual voice recording
            setTimeout(() => {
                setIsRecording(false);
                setSnackbar({
                    open: true,
                    message: 'Voice recording feature coming soon!',
                    severity: 'info'
                });
            }, 2000);
        } else {
            setIsRecording(false);
        }
    };

    const handleGenerate = async () => {
        if (!inputValue.trim() && uploadedFiles.length === 0) {
            setSnackbar({
                open: true,
                message: 'Please enter a prompt or upload files',
                severity: 'warning'
            });
            return;
        }

        if (!project) return;

        try {
            const updatedData = {
                ...project.data,
                seo: {
                    ...project.data.seo,
                    description: inputValue.trim()
                }
            };

            await updateProject(project.id, updatedData);
            
            console.log('Generating with:', {
                prompt: inputValue,
                files: uploadedFiles.map(f => ({ name: f.name, type: f.type }))
            });

            setSnackbar({
                open: true,
                message: 'Generation started!',
                severity: 'success'
            });

            // TODO: Add your actual generation logic here
        } catch (err) {
            console.error('Error generating:', err);
            setSnackbar({
                open: true,
                message: 'Failed to generate',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    background: `linear-gradient(135deg, 
                        ${theme.palette.background.default} 0%, 
                        ${theme.palette.primary.bg} 20%,
                        #1a0b2e 40%,
                        #2d1b4e 60%,
                        ${theme.palette.primary.bg} 80%,
                        ${theme.palette.background.default} 100%)`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} />
                    <Typography variant="body1" sx={{ mt: 2, color: 'white' }}>
                        Loading project...
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (error || !project) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    background: `linear-gradient(135deg, 
                        ${theme.palette.background.default} 0%, 
                        ${theme.palette.primary.bg} 20%,
                        #1a0b2e 40%,
                        #2d1b4e 60%,
                        ${theme.palette.primary.bg} 80%,
                        ${theme.palette.background.default} 100%)`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    px: 2,
                }}
            >
                <Container maxWidth="md">
                    <Alert
                        severity="error"
                        action={
                            <Button color="inherit" size="small" onClick={handleBack}>
                                Go Back
                            </Button>
                        }
                    >
                        {error || 'Project not found'}
                    </Alert>
                </Container>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, 
                    ${theme.palette.background.default} 0%, 
                    ${theme.palette.primary.bg} 20%,
                    #1a0b2e 40%,
                    #2d1b4e 60%,
                    ${theme.palette.primary.bg} 80%,
                    ${theme.palette.background.default} 100%)`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255, 99, 132, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 80% 70%, rgba(54, 162, 235, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 40% 80%, rgba(255, 206, 86, 0.1) 0%, transparent 50%)`,
                    pointerEvents: 'none',
                }
            }}
        >
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, pt: { xs: 4, md: 8 }, pb: 4 }}>
                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                />

                {/* Back Button */}
                <Box sx={{ mb: 4 }}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                        sx={{
                            color: 'white',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                            }
                        }}
                    >
                        Back to Dashboard
                    </Button>
                </Box>

                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Typography
                            variant={isMobile ? 'h4' : 'h2'}
                            sx={{
                                fontWeight: 'bold',
                                background: `linear-gradient(135deg, #ff6b9d 0%, #feca57 50%, #48dbfb 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                lineHeight: 1.2,
                            }}
                        >
                            {project.name}
                        </Typography>
                        <Chip
                            label={(() => {
                                if (typeof project.status === 'string') {
                                    return project.status.toUpperCase();
                                }
                                if (typeof project.status === 'boolean') {
                                    return project.status ? 'ACTIVE' : 'INACTIVE';
                                }
                                if (project.data?.status && typeof project.data.status === 'string') {
                                    return project.data.status.toUpperCase();
                                }
                                return 'DRAFT';
                            })()}
                            size="small"
                            sx={{
                                backgroundColor: (() => {
                                    const status = typeof project.status === 'string' 
                                        ? project.status 
                                        : project.data?.status || 'draft';
                                    return status.toLowerCase() === 'published' 
                                        ? theme.palette.success.main 
                                        : theme.palette.warning.main;
                                })(),
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                height: '24px',
                            }}
                        />
                    </Box>
                    <Typography
                        variant={isMobile ? 'body1' : 'h6'}
                        sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            mt: 2,
                            fontWeight: 400,
                        }}
                    >
                        {project.seo?.title || 'Design and build your project'}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    <Box
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            mb: 4,
                            p: 0.5,
                            borderRadius: "999px",
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        {[
                            { key: "apps", label: "Build Apps" },
                            { key: "comic", label: "Create Comic Book" },
                        ].map((tab) => {
                            const isActive = activeTab === tab.key;

                            return (
                                <Box
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    sx={{
                                        px: 3.5,
                                        py: 1,
                                        borderRadius: "999px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        whiteSpace: "nowrap",
                                        transition: "all 0.25s ease",
                                        backgroundColor: isActive
                                            ? theme.palette.action.selected
                                            : "transparent",
                                        color: isActive
                                            ? theme.palette.text.primary
                                            : theme.palette.text.secondary,
                                        "&:hover": {
                                            backgroundColor: isActive
                                                ? theme.palette.action.selected
                                                : theme.palette.action.hover,
                                        },
                                    }}
                                >
                                    {tab.label}
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                {/* Uploaded Files Display */}
                {uploadedFiles.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            {uploadedFiles.map((file) => (
                                <Paper
                                    key={file.id}
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        backgroundColor: theme.palette.background.paper,
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 2,
                                        position: 'relative',
                                        maxWidth: 250,
                                    }}
                                >
                                    {file.preview ? (
                                        <Box
                                            component="img"
                                            src={file.preview}
                                            alt={file.name}
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                objectFit: 'cover',
                                                borderRadius: 1,
                                            }}
                                        />
                                    ) : (
                                        <PictureAsPdf sx={{ fontSize: 50, color: theme.palette.error.main }} />
                                    )}
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography
                                            variant="body2"
                                            noWrap
                                            sx={{ fontWeight: 500 }}
                                        >
                                            {file.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatFileSize(file.size)}
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemoveFile(file.id)}
                                        sx={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                        }}
                                    >
                                        <Close fontSize="small" />
                                    </IconButton>
                                </Paper>
                            ))}
                        </Box>
                    </Box>
                )}

                <Box
                    sx={{
                        backgroundColor: theme.palette.background.glass,
                        backdropFilter: 'blur(10px)',
                        borderRadius: 4,
                        p: { xs: 2, md: 4 },
                        border: `1px solid ${theme.palette.divider}`,
                        mb: 4,
                        position: 'relative',
                    }}
                >
                    {!inputValue && uploadedFiles.length === 0 && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: { xs: 16, md: 32 },
                                left: { xs: 16, md: 32 },
                                right: { xs: 16, md: 32 },
                                pointerEvents: 'none',
                                zIndex: 1,
                            }}
                        >
                            <TypewriterPlaceholder theme={theme} />
                        </Box>
                    )}
                    <TextField
                        multiline
                        rows={isMobile ? 4 : 5}
                        fullWidth
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                            sx: {
                                color: theme.palette.text.primary,
                                fontSize: { xs: '14px', md: '16px' },
                            }
                        }}
                    />
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 1,
                        mb: 0,
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2
                    }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                                onClick={handleAttachClick}
                                sx={{
                                    color: theme.palette.text.secondary,
                                    '&:hover': { backgroundColor: theme.palette.action.hover }
                                }}
                            >
                                <Attach20Regular />
                            </IconButton>
                            <Button
                                startIcon={<BookOpen20Regular />}
                                variant="outlined"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    borderColor: theme.palette.divider,
                                    textTransform: 'none',
                                    borderRadius: '24px',
                                    py: 0.5,
                                    px: 3,
                                    fontSize: { xs: '12px', sm: '14px' }
                                }}
                            >
                                Learn
                            </Button>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    borderColor: theme.palette.divider,
                                    textTransform: 'none',
                                    borderRadius: '24px',
                                    minWidth: 'auto',
                                    py: 0.5,
                                    px: 2,
                                    fontSize: { xs: '12px', sm: '14px' }
                                }}
                            >
                                us English (US)
                            </Button>
                            <IconButton
                                onClick={handleVoiceRecord}
                                sx={{
                                    color: isRecording ? theme.palette.error.main : theme.palette.text.secondary,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: '8px',
                                    animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                                    '@keyframes pulse': {
                                        '0%, 100%': { opacity: 1 },
                                        '50%': { opacity: 0.5 },
                                    },
                                }}
                            >
                                <Mic20Regular />
                            </IconButton>
                            <IconButton
                                onClick={handleGenerate}
                                disabled={(!inputValue.trim() && uploadedFiles.length === 0) || updating}
                                sx={{
                                    color: (inputValue.trim() || uploadedFiles.length > 0) ? theme.palette.primary.main : theme.palette.text.secondary,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: '8px',
                                    '&:disabled': {
                                        color: theme.palette.text.disabled,
                                    }
                                }}
                            >
                                {updating ? <CircularProgress size={20} /> : <ArrowUpward sx={{ fontSize: '20px' }} />}
                            </IconButton>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ mb: 8 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 3 }}>
                        {displayedSuggestions.map((suggestion, index) => (
                            <Chip
                                key={index}
                                label={suggestion}
                                onClick={() => setInputValue(suggestion)}
                                sx={{
                                    backgroundColor: theme.palette.background.paper,
                                    color: theme.palette.text.primary,
                                    borderRadius: 4,
                                    border: `1px solid ${theme.palette.divider}`,
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.lightBg,
                                        cursor: 'pointer',
                                    },
                                    fontSize: { xs: '12px', sm: '14px' },
                                    px: { xs: 1, sm: 2 },
                                    py: { xs: 2, sm: 2.5 }
                                }}
                            />
                        ))}
                    </Box>

                    {suggestions.length > initialDisplayCount && (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                                variant="outlined"
                                sx={{
                                    textTransform: 'none',
                                    borderColor: theme.palette.divider,
                                    color: theme.palette.text.secondary,
                                    borderRadius: '50px',
                                    px: 4,
                                    py: 0.8,
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main,
                                        backgroundColor: theme.palette.primary.lightBg,
                                    }
                                }}
                            >
                                {showAllSuggestions ? 'Show Less' : `Show All (${suggestions.length - initialDisplayCount} more)`}
                            </Button>
                        </Box>
                    )}
                </Box>

                {/* Project Info - Optional Debug Info */}
                {process.env.NODE_ENV === 'development' && (
                    <Box
                        sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 2,
                            p: 2,
                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block', mb: 1 }}>
                            <strong>Debug Info:</strong>
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>
                            Slug: {project.slug} | ID: {project.id}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>
                            Theme: {project.theme?.primaryColor} / {project.theme?.font}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>
                            Uploaded Files: {uploadedFiles.length}
                        </Typography>
                    </Box>
                )}
            </Container>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PromptsPage;