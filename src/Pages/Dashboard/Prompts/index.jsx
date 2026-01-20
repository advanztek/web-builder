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
  Backdrop,
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

// ---------------- SLUG / NAME HELPERS ----------------
const slugify = (text = '') =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 32) || 'website';

const deriveWebsiteName = (prompt = '') => {
  if (!prompt.trim()) return 'AI Website';
  const words = prompt
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 4)
    .join(' ');
  return words || 'AI Website';
};

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

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

  const { createProject } = useCreateProject();

  const [inputValue, setInputValue] = useState('');
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [isRecording, setIsRecording] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

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

  // ---------------- FILES ----------------
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    const validFiles = [];

    for (const file of files) {
      const base64 = await fileToBase64(file);
      validFiles.push({
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        data: base64,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        isPDF: file.type === 'application/pdf',
      });
    }

    setUploadedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (id) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // ---------------- VOICE ----------------
  const handleVoiceRecord = () => {
    setIsRecording(true);
    setTimeout(() => setIsRecording(false), 2000);
  };

  // ---------------- AI GENERATE - BACKEND SCHEMA COMPLIANT ----------------
  const handleGenerate = async () => {
    if (isGenerating) return;

    // Validate input
    const prompt = inputValue.trim();
    
    if (!prompt && uploadedFiles.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please enter a prompt or upload files',
        severity: 'warning'
      });
      return;
    }

    // Backend requires minimum 10 characters for prompt
    if (prompt.length < 10) {
      setSnackbar({
        open: true,
        message: 'Prompt must be at least 10 characters long',
        severity: 'warning'
      });
      return;
    }

    setIsGenerating(true);
    setLoadingMessage('AI is creating your project...');

    const websiteName = deriveWebsiteName(prompt);

    console.log('🚀 STARTING PROJECT CREATION');
    console.log('Prompt length:', prompt.length);
    console.log('Website name:', websiteName);

    try {
      // EXACT BACKEND SCHEMA COMPLIANT PAYLOAD
      const payload = {
        mode: "prompt",
        prompt: prompt,  // min 10, max 5000 characters
        websiteName: websiteName,
        websiteType: "ai-generated", // optional
        pages: ["Home"], // optional array of strings
        theme: {
          font: "Inter",
          primaryColor: "#1976d2",
          secondaryColor: "#0F172A",
          backgroundColor: "#FFFFFF"
        }
      };

      // Add files if any
      if (uploadedFiles.length > 0) {
        payload.files = uploadedFiles.map((f) => ({
          name: f.name,
          type: f.type,
          data: f.data  // Base64 string
        }));
      }

      console.log('📤 PAYLOAD:', payload);

      const project = await createProject(payload);

      if (project && project.id) {
        console.log('✅ PROJECT CREATED:', project);

        // Store in Redux
        dispatch(setActiveProject(project.id));

        // Store in sessionStorage for editor
        sessionStorage.setItem('pending_project', JSON.stringify(project));

        // Store in localStorage as recent
        try {
          const recentProjects = JSON.parse(localStorage.getItem('recent_projects') || '[]');
          recentProjects.unshift(project);
          localStorage.setItem('recent_projects', JSON.stringify(recentProjects.slice(0, 10)));
        } catch (e) {
          console.warn('Could not store in localStorage');
        }

        setSnackbar({
          open: true,
          message: 'Project created successfully!',
          severity: 'success'
        });

        setIsGenerating(false);
        setLoadingMessage('');

        // Navigate to editor
        const routeId = project.slug || project.id;
        console.log('➡️ NAVIGATING TO:', `/dashboard/editor/${routeId}`);

        setTimeout(() => {
          navigate(`/dashboard/editor/${routeId}`, {
            state: {
              projectId: project.id,
              createdProject: project,
              fromPrompts: true
            }
          });
        }, 500);

      } else {
        throw new Error('No project data returned from server');
      }

    } catch (err) {
      console.error('❌ PROJECT CREATION ERROR:', err);

      setSnackbar({
        open: true,
        message: err.message || 'Failed to create project. Please try again.',
        severity: 'error'
      });

      setIsGenerating(false);
      setLoadingMessage('');
    }
  };

  // ---------------- UI ----------------
  return (
    <Box sx={{ minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Loading Backdrop */}
      <Backdrop
        open={isGenerating}
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: '#ff6b9d', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
            {loadingMessage}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            This may take a few moments...
          </Typography>
        </Box>
      </Backdrop>

      <Container maxWidth="md" sx={{ pt: 6, pb: 6 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.txt"
          hidden
          multiple
          onChange={handleFileUpload}
        />

        <Button 
          startIcon={<ArrowBack />} 
          sx={{ color: 'white', mb: 4 }} 
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>

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
          Describe what you want — AI will design and build it
        </Typography>

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
            InputProps={{ disableUnderline: true, sx: { color: 'white', fontSize: 16 } }}
            sx={{
              '& .MuiInputBase-input': {
                color: 'white',
              }
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                sx={{ px:1.2, color: 'white' }} 
                onClick={() => fileInputRef.current?.click()}
              >
                <AttachFile />
              </IconButton>
              <Button 
                startIcon={<Book />} 
                variant="outlined" 
                sx={{ 
                  py:0.4,
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

            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                sx={{ px: 1.2, color: isRecording ? '#191cccff' : 'white' }} 
                onClick={handleVoiceRecord}
              >
                <Mic />
              </IconButton>

              <IconButton
                onClick={handleGenerate}
                disabled={isGenerating}
                sx={{ 
                  px:1.1,
                  color: '#ff6b9d', 
                  border: '1px solid rgba(255,107,157,0.5)',
                  backgroundColor: 'rgba(255,107,157,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,107,157,0.2)',
                  },
                  '&:disabled': {
                    color: 'rgba(255,107,157,0.5)',
                  }
                }}
              >
                {isGenerating ? <CircularProgress size={20} /> : <ArrowUpward />}
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* FILE PREVIEW */}
        {uploadedFiles.length > 0 && (
          <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {uploadedFiles.map((file) => (
              <Paper
                key={file.id}
                sx={{
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  position: 'relative',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.2)',
                  minWidth: 200,
                }}
              >
                {file.preview ? (
                  <Box 
                    component="img" 
                    src={file.preview} 
                    sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }} 
                  />
                ) : file.isPDF ? (
                  <PictureAsPdf sx={{ fontSize: 40, color: '#f44336' }} />
                ) : (
                  <InsertDriveFile sx={{ fontSize: 40, color: '#2196f3' }} />
                )}

                <Typography variant="body2" noWrap sx={{ flex: 1, maxWidth: 120 }}>
                  {file.name}
                </Typography>

                <IconButton
                  size="small"
                  sx={{ 
                    color: 'white', 
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    }
                  }}
                  onClick={() => handleRemoveFile(file.id)}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Paper>
            ))}
          </Box>
        )}

        {/* SUGGESTIONS */}
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