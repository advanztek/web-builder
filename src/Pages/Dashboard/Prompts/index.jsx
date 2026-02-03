import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
} from '@mui/material';
import {
  ArrowUpward,
  ArrowBack,
  Close,
  PictureAsPdf,
  AttachFile,
  Book,
  Mic,
  InsertDriveFile,
} from '@mui/icons-material';

import { useCreateProject } from '../../../Hooks/projects';
import { setActiveProject } from '../../../Store/slices/projectsSlice';

// ---------------- HELPERS ----------------
const deriveWebsiteName = (prompt = '', hasFiles = false) => {
  if (!prompt.trim()) {
    return hasFiles ? 'AI Generated Website' : 'AI Website';
  }
  const words = prompt
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 4)
    .join(' ');
  return words || 'AI Website';
};

// Convert file to base64
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

// Format file size for display
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// ---------------- TYPEWRITER PLACEHOLDER ----------------
const TypewriterPlaceholder = () => {
  const texts = [
    'Build a modern e-commerce platform with shopping cart and payment integration...',
    'Create a portfolio website with animated transitions and dark mode...',
    'Design a restaurant website with online ordering and reservation system...',
    'Develop a fitness tracking app with workout plans and progress charts...',
    'Build a social media dashboard with real-time analytics and notifications...',
  ];

  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    const typingSpeed = isDeleting ? 30 : 50;

    if (!isDeleting && charIndex < currentText.length) {
      const timer = setTimeout(() => {
        setDisplayText(currentText.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, typingSpeed);
      return () => clearTimeout(timer);
    }

    if (!isDeleting && charIndex === currentText.length) {
      const timer = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timer);
    }

    if (isDeleting && charIndex > 0) {
      const timer = setTimeout(() => {
        setDisplayText(currentText.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, typingSpeed);
      return () => clearTimeout(timer);
    }

    if (isDeleting && charIndex === 0) {
      const timer = setTimeout(() => {
        setIsDeleting(false);
        setTextIndex((textIndex + 1) % texts.length);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [charIndex, isDeleting, textIndex]);

  return (
    <Box sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>
      {displayText}
      <Box
        component="span"
        sx={{
          display: 'inline-block',
          width: '2px',
          height: '1em',
          backgroundColor: 'rgba(255,255,255,0.4)',
          ml: 0.5,
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

// ---------------- MAIN PROMPTS PAGE ----------------
const PromptsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { createProject, loading } = useCreateProject();

  const [inputValue, setInputValue] = useState('');
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);

  // ---------------- SUGGESTIONS ----------------
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
    'Video Conference Platform',
  ];

  const displayedSuggestions = showAllSuggestions
    ? suggestions
    : suggestions.slice(0, 6);

  // ---------------- FILE UPLOAD HANDLER ----------------
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;

    setIsProcessingFiles(true);
    const validFiles = [];
    const errors = [];

    try {
      for (const file of files) {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          errors.push(`${file.name} is too large (max 10MB)`);
          continue;
        }

        // Validate file type
        const validTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
        ];

        if (!validTypes.includes(file.type)) {
          errors.push(`${file.name} has unsupported file type`);
          continue;
        }

        try {
          // Convert to base64
          const base64Data = await fileToBase64(file);
          
          // Create file object
          const fileObj = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            type: file.type,
            size: file.size,
            data: base64Data,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
            isPDF: file.type === 'application/pdf',
            isImage: file.type.startsWith('image/'),
            isDocument: file.type.includes('document') || file.type.includes('msword') || file.type === 'text/plain',
          };

          validFiles.push(fileObj);
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          errors.push(`Failed to process ${file.name}`);
        }
      }

      // Add valid files to state
      if (validFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...validFiles]);
        setSnackbar({
          open: true,
          message: `${validFiles.length} file(s) uploaded successfully`,
          severity: 'success',
        });
      }

      // Show errors if any
      if (errors.length > 0) {
        setSnackbar({
          open: true,
          message: errors.join(', '),
          severity: 'warning',
        });
      }

    } catch (error) {
      console.error('File upload error:', error);
      setSnackbar({
        open: true,
        message: 'Error uploading files. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsProcessingFiles(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // ---------------- REMOVE FILE ----------------
  const handleRemoveFile = (id) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });

    setSnackbar({
      open: true,
      message: 'File removed',
      severity: 'info',
    });
  };

  // ---------------- VOICE RECORDING ----------------
  const handleVoiceRecord = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setSnackbar({
        open: true,
        message: 'Voice recording feature coming soon',
        severity: 'info',
      });
    }, 2000);
  };

  // ---------------- VALIDATION ----------------
  const validateInput = () => {
    const prompt = inputValue.trim();
    const hasFiles = uploadedFiles.length > 0;

    if (!prompt && !hasFiles) {
      setSnackbar({
        open: true,
        message: 'Please enter a prompt or upload files to continue',
        severity: 'warning',
      });
      return false;
    }

    if (prompt && prompt.length < 10) {
      setSnackbar({
        open: true,
        message: 'Prompt must be at least 10 characters long',
        severity: 'warning',
      });
      return false;
    }

    return true;
  };

  // ---------------- AI GENERATE ----------------
  const handleGenerate = async () => {
    if (loading || isProcessingFiles) return;

    if (!validateInput()) return;

    const prompt = inputValue.trim();
    const hasFiles = uploadedFiles.length > 0;

    const websiteName = deriveWebsiteName(prompt, hasFiles);

    console.log('🚀 STARTING PROJECT CREATION');
    console.log('Prompt:', prompt || '(none - files only)');
    console.log('Files count:', uploadedFiles.length);
    console.log('Website name:', websiteName);

    try {
      const payload = {
        mode: "prompt",
        prompt: prompt || "Create a website based on the uploaded files",
        websiteName: websiteName,
        websiteType: "ai-generated",
        pages: ["Home"],
        theme: {
          font: "Inter",
          primaryColor: "#1976d2",
          secondaryColor: "#0F172A",
          backgroundColor: "#FFFFFF"
        }
      };

      if (hasFiles) {
        payload.files = uploadedFiles.map((file) => ({
          name: file.name,
          type: file.type,
          data: file.data
        }));
        console.log('📎 Attaching files:', payload.files.map(f => ({ name: f.name, type: f.type })));
      }

      console.log('📤 PAYLOAD:', { ...payload, files: payload.files ? `${payload.files.length} files` : 'none' });

      const project = await createProject(payload);

      if (project && project.id) {
        console.log('✅ PROJECT CREATED:', project);

        dispatch(setActiveProject(project.id));
        sessionStorage.setItem('pending_project', JSON.stringify(project));

        try {
          const recentProjects = JSON.parse(localStorage.getItem('recent_projects') || '[]');
          recentProjects.unshift(project);
          localStorage.setItem('recent_projects', JSON.stringify(recentProjects.slice(0, 10)));
        } catch (e) {
          console.warn('Could not store in localStorage:', e);
        }

        // Clean up file previews
        uploadedFiles.forEach(file => {
          if (file.preview) {
            URL.revokeObjectURL(file.preview);
          }
        });

        const routeId = project.slug || project.id;
        console.log('➡️ NAVIGATING TO:', `/dashboard/editor/${routeId}`);

      } else if (project === null) {
        // Error already handled in hook
        console.log('Project creation returned null');
      }

    } catch (err) {
      console.error('❌ PROJECT CREATION ERROR:', err);

      let errorMessage = 'Failed to create project. Please try again.';
      
      if (err.response) {
        errorMessage = err.response.data?.message || err.response.data?.error || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  const canGenerate = (inputValue.trim().length >= 10 || uploadedFiles.length > 0) && !loading && !isProcessingFiles;

  // ---------------- UI RENDER ----------------
  return (
    <Box sx={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <Container maxWidth="md" sx={{ pt: 6, pb: 6 }}>
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.txt"
          hidden
          multiple
          onChange={handleFileUpload}
        />

        {/* Back Button */}
        <Button 
          startIcon={<ArrowBack />} 
          sx={{ color: 'white', mb: 4 }} 
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>

        {/* Header */}
        <Typography
          variant="h1"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #051075ff, #1481e7ff, #48dbfb)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Build Your Project with AI
        </Typography>

        <Typography sx={{ textAlign: 'center', mb: 4, color: 'rgba(255,255,255,0.7)' }}>
          Describe what you want or upload files — AI will design and build it
        </Typography>

        {/* Main Input Area */}
        <Paper
          sx={{
            p: 3,
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 3,
            position: 'relative',
          }}
        >
          {!inputValue && uploadedFiles.length === 0 && (
            <Box sx={{ position: 'absolute', top: 20, left: 20, right: 20, pointerEvents: 'none' }}>
              <TypewriterPlaceholder />
            </Box>
          )}

          <TextField
            multiline
            rows={5}
            fullWidth
            variant="standard"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={uploadedFiles.length > 0 ? "Add a description (optional)" : ""}
            InputProps={{ 
              disableUnderline: true, 
              sx: { color: 'white', fontSize: 16 } 
            }}
            sx={{
              '& .MuiInputBase-input': {
                color: 'white',
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'rgba(255,255,255,0.5)',
                opacity: 1,
              }
            }}
          />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <IconButton 
                sx={{ 
                  px: 1.2, 
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }} 
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingFiles}
              >
                {isProcessingFiles ? <CircularProgress size={20} /> : <AttachFile />}
              </IconButton>
              <Button 
                startIcon={<Book />} 
                variant="outlined" 
                sx={{ 
                  py: 0.4,
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                Learn
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <IconButton 
                sx={{ 
                  px: 1.2, 
                  color: isRecording ? '#191cccff' : 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }} 
                onClick={handleVoiceRecord}
                disabled={loading}
              >
                <Mic />
              </IconButton>

              <IconButton
                onClick={handleGenerate}
                disabled={!canGenerate}
                sx={{ 
                  px: 1.1,
                  color: canGenerate ? '#ff6b9d' : 'rgba(255,107,157,0.3)', 
                  border: '1px solid rgba(255,107,157,0.5)',
                  backgroundColor: canGenerate ? 'rgba(255,107,157,0.1)' : 'rgba(255,107,157,0.05)',
                  '&:hover': {
                    backgroundColor: canGenerate ? 'rgba(255,107,157,0.2)' : 'rgba(255,107,157,0.05)',
                  },
                  '&:disabled': {
                    color: 'rgba(255,107,157,0.3)',
                    borderColor: 'rgba(255,107,157,0.3)',
                  }
                }}
              >
                {loading ? <CircularProgress size={20} sx={{ color: '#ff6b9d' }} /> : <ArrowUpward />}
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* FILE PREVIEW SECTION */}
        {uploadedFiles.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachFile fontSize="small" />
              Uploaded Files ({uploadedFiles.length})
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {uploadedFiles.map((file) => (
                <Paper
                  key={file.id}
                  sx={{
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    position: 'relative',
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.2)',
                    minWidth: 220,
                    maxWidth: 300,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.15)',
                    }
                  }}
                >
                  {/* File Icon/Preview */}
                  <Box sx={{ flexShrink: 0 }}>
                    {file.preview ? (
                      <Box 
                        component="img" 
                        src={file.preview} 
                        alt={file.name}
                        sx={{ 
                          width: 50, 
                          height: 50, 
                          borderRadius: 1, 
                          objectFit: 'cover',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }} 
                      />
                    ) : file.isPDF ? (
                      <PictureAsPdf sx={{ fontSize: 50, color: '#f44336' }} />
                    ) : file.isDocument ? (
                      <InsertDriveFile sx={{ fontSize: 50, color: '#2196f3' }} />
                    ) : (
                      <InsertDriveFile sx={{ fontSize: 50, color: '#9e9e9e' }} />
                    )}
                  </Box>

                  {/* File Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="body2" 
                      noWrap 
                      sx={{ 
                        fontWeight: 500,
                        mb: 0.5
                      }}
                      title={file.name}
                    >
                      {file.name}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.6)',
                        display: 'block'
                      }}
                    >
                      {formatFileSize(file.size)}
                    </Typography>
                  </Box>

                  {/* Remove Button */}
                  <IconButton
                    size="small"
                    sx={{ 
                      color: 'white',
                      flexShrink: 0,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: '#f44336',
                      }
                    }}
                    onClick={() => handleRemoveFile(file.id)}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Paper>
              ))}
            </Box>
          </Box>
        )}

        {/* SUGGESTIONS SECTION */}
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
            Or try these suggestions
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {displayedSuggestions.map((s, i) => (
              <Chip
                key={i}
                label={s}
                onClick={() => setInputValue(s)}
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                  }
                }}
              />
            ))}
          </Box>

          <Button 
            sx={{ 
              mt: 3, 
              color: '#ff6b9d',
              '&:hover': {
                backgroundColor: 'rgba(255,107,157,0.1)',
              }
            }} 
            onClick={() => setShowAllSuggestions((v) => !v)}
          >
            {showAllSuggestions ? 'Show Less' : 'Show All Suggestions'}
          </Button>
        </Box>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PromptsPage;