// ============================================
// PropertiesPanel.jsx - COMPLETE FIX
// ============================================
import React, { useEffect } from 'react';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { customScrollbarStyles } from '../ProjectUtils';

const PropertiesPanel = ({ collapsed, onToggle }) => {
  useEffect(() => {
    // Add comprehensive styling for GrapesJS panels
    const style = document.createElement('style');
    style.id = 'gjs-properties-styles';
    style.innerHTML = `
      /* ===== STYLE MANAGER ===== */
      #gjs-styles {
        background: #0d0d0d !important;
        color: #e0e0e0 !important;
      }
      
      #gjs-styles .gjs-sm-sector {
        border-bottom: 1px solid #2a2a2a;
        margin-bottom: 0;
      }
      
      #gjs-styles .gjs-sm-sector .gjs-sm-title {
        background: #1a1a2e !important;
        color: #e0e0e0 !important;
        padding: 12px 15px !important;
        font-size: 0.85rem !important;
        font-weight: 600 !important;
        border: none !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
      }
      
      #gjs-styles .gjs-sm-sector .gjs-sm-title:hover {
        background: #252540 !important;
      }
      
      #gjs-styles .gjs-sm-properties {
        padding: 15px 12px !important;
        background: #0d0d0d !important;
      }
      
      #gjs-styles .gjs-sm-property {
        margin-bottom: 12px !important;
        color: #e0e0e0 !important;
      }
      
      #gjs-styles .gjs-sm-label {
        color: #a0a0a0 !important;
        font-size: 0.75rem !important;
        margin-bottom: 5px !important;
        display: block !important;
        text-transform: capitalize !important;
      }
      
      #gjs-styles input[type="text"],
      #gjs-styles input[type="number"],
      #gjs-styles select,
      #gjs-styles .gjs-field {
        background: #1a1a2e !important;
        color: #e0e0e0 !important;
        border: 1px solid #2a2a2a !important;
        border-radius: 4px !important;
        padding: 6px 10px !important;
        width: 100% !important;
        font-size: 0.8rem !important;
        transition: border-color 0.2s !important;
      }
      
      #gjs-styles input:focus,
      #gjs-styles select:focus,
      #gjs-styles .gjs-field:focus {
        border-color: #667eea !important;
        outline: none !important;
      }
      
      #gjs-styles input[type="color"] {
        height: 32px !important;
        padding: 2px !important;
        cursor: pointer !important;
      }
      
      #gjs-styles .gjs-field-color-picker {
        background: #1a1a2e !important;
        border: 1px solid #2a2a2a !important;
      }
      
      #gjs-styles .gjs-field-units,
      #gjs-styles .gjs-field-integer,
      #gjs-styles .gjs-field-composite {
        display: flex !important;
        gap: 5px !important;
      }
      
      #gjs-styles .gjs-field-integer input {
        flex: 1 !important;
      }
      
      #gjs-styles .gjs-field-units select {
        min-width: 60px !important;
        flex-shrink: 0 !important;
      }

      /* Radio/Checkbox styles */
      #gjs-styles .gjs-radio-item,
      #gjs-styles .gjs-field-radio {
        background: #1a1a2e !important;
        border: 1px solid #2a2a2a !important;
        color: #e0e0e0 !important;
        padding: 5px 10px !important;
        margin-right: 5px !important;
        border-radius: 4px !important;
        cursor: pointer !important;
      }
      
      #gjs-styles .gjs-radio-item:hover {
        border-color: #667eea !important;
      }
      
      #gjs-styles .gjs-radio-item.gjs-radio-item-active {
        background: #667eea !important;
        border-color: #667eea !important;
      }

      /* Composite fields (margin, padding with 4 inputs) */
      #gjs-styles .gjs-field-composite {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 5px !important;
      }

      /* ===== TRAITS MANAGER ===== */
      #gjs-traits {
        background: #0d0d0d !important;
        padding: 0 !important;
      }
      
      #gjs-traits .gjs-trt-header {
        background: #1a1a2e !important;
        color: #e0e0e0 !important;
        padding: 12px 15px !important;
        font-size: 0.85rem !important;
        font-weight: 600 !important;
        border-bottom: 1px solid #2a2a2a !important;
      }
      
      #gjs-traits .gjs-trt-traits {
        padding: 15px 12px !important;
      }
      
      #gjs-traits .gjs-trt-trait {
        margin-bottom: 12px !important;
      }
      
      #gjs-traits .gjs-label-wrp {
        color: #a0a0a0 !important;
        font-size: 0.75rem !important;
        margin-bottom: 5px !important;
        display: block !important;
      }
      
      #gjs-traits input,
      #gjs-traits select,
      #gjs-traits textarea {
        background: #1a1a2e !important;
        color: #e0e0e0 !important;
        border: 1px solid #2a2a2a !important;
        border-radius: 4px !important;
        padding: 6px 10px !important;
        width: 100% !important;
        font-size: 0.8rem !important;
      }
      
      #gjs-traits input:focus,
      #gjs-traits select:focus,
      #gjs-traits textarea:focus {
        border-color: #667eea !important;
        outline: none !important;
      }

      /* ===== LAYERS MANAGER ===== */
      #gjs-layers {
        background: #0d0d0d !important;
        color: #e0e0e0 !important;
      }
      
      #gjs-layers .gjs-layer {
        color: #e0e0e0 !important;
        padding: 8px 12px !important;
        font-size: 0.8rem !important;
        border-bottom: 1px solid #1a1a1a !important;
      }
      
      #gjs-layers .gjs-layer:hover {
        background: #1a1a2e !important;
      }
      
      #gjs-layers .gjs-layer.gjs-selected {
        background: #667eea !important;
        color: white !important;
      }
      
      #gjs-layers .gjs-layer__icon {
        opacity: 0.6 !important;
      }
      
      #gjs-layers .gjs-layer-count {
        color: #a0a0a0 !important;
        font-size: 0.7rem !important;
      }

      /* ===== SELECTORS MANAGER ===== */
      #gjs-selectors {
        background: #0d0d0d !important;
        padding: 12px !important;
      }
      
      #gjs-selectors .gjs-clm-tags {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 6px !important;
      }
      
      #gjs-selectors .gjs-clm-tag {
        background: #1a1a2e !important;
        color: #e0e0e0 !important;
        padding: 5px 10px !important;
        border-radius: 4px !important;
        font-size: 0.75rem !important;
        border: 1px solid #2a2a2a !important;
        cursor: pointer !important;
      }
      
      #gjs-selectors .gjs-clm-tag:hover {
        background: #667eea !important;
        border-color: #667eea !important;
      }
      
      #gjs-selectors .gjs-clm-tag.gjs-clm-tag-active {
        background: #667eea !important;
        border-color: #667eea !important;
      }

      /* Scrollbar styling */
      #gjs-styles::-webkit-scrollbar,
      #gjs-traits::-webkit-scrollbar,
      #gjs-layers::-webkit-scrollbar {
        width: 8px;
      }
      
      #gjs-styles::-webkit-scrollbar-track,
      #gjs-traits::-webkit-scrollbar-track,
      #gjs-layers::-webkit-scrollbar-track {
        background: #0d0d0d;
      }
      
      #gjs-styles::-webkit-scrollbar-thumb,
      #gjs-traits::-webkit-scrollbar-thumb,
      #gjs-layers::-webkit-scrollbar-thumb {
        background: #2a2a2a;
        border-radius: 4px;
      }
      
      #gjs-styles::-webkit-scrollbar-thumb:hover,
      #gjs-traits::-webkit-scrollbar-thumb:hover,
      #gjs-layers::-webkit-scrollbar-thumb:hover {
        background: #667eea;
      }
    `;
    
    if (!document.getElementById('gjs-properties-styles')) {
      document.head.appendChild(style);
    }

    return () => {
      const existingStyle = document.getElementById('gjs-properties-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return (
    <Box
      sx={{
        width: collapsed ? 50 : 320,
        bgcolor: '#141924',
        borderLeft: '1px solid rgba(102, 126, 234, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        color: '#e0e0e0',
        overflow: 'hidden',
        transition: 'width 0.3s ease',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '1px',
          background: 'linear-gradient(180deg, rgba(102, 126, 234, 0.5) 0%, rgba(118, 75, 162, 0.5) 50%, rgba(102, 126, 234, 0.5) 100%)',
          boxShadow: '0 0 10px rgba(102, 126, 234, 0.3)',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #2a2a2a',
          bgcolor: '#0d0d0d',
          background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 100%)',
        }}
      >
        {!collapsed && (
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{
              color: '#e0e0e0',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '1rem',
            }}
          >
            Properties
          </Typography>
        )}
        <IconButton
          onClick={onToggle}
          size="small"
          sx={{
            color: '#e0e0e0',
            '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.1)', color: '#667eea' },
          }}
        >
          {collapsed ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      {/* Content */}
      <Collapse in={!collapsed} orientation="horizontal" sx={{ flex: 1, overflow: 'hidden' }}>
        <Box sx={{ width: 320, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Style Manager - TOP & LARGEST (Colors, Fonts, Backgrounds) */}
          <Box
            id="gjs-styles"
            sx={{
              height: '45%', 
              flexShrink: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
              bgcolor: '#0d0d0d',
              borderBottom: '1px solid #2a2a2a',
              ...customScrollbarStyles,
            }}
          />

          {/* Traits Manager - SMALLER (ID, Title, etc) */}
          <Box
            id="gjs-traits"
            sx={{
              height: '20%', 
              flexShrink: 0,
              borderBottom: '1px solid #2a2a2a',
              overflowY: 'auto',
              overflowX: 'hidden',
              bgcolor: '#0d0d0d',
              ...customScrollbarStyles,
            }}
          />

          {/* Layers Manager */}
          <Box
            id="gjs-layers"
            sx={{
              height: '25%', 
              flexShrink: 0,
              borderBottom: '1px solid #2a2a2a',
              overflowY: 'auto',
              overflowX: 'hidden',
              bgcolor: '#0d0d0d',
              ...customScrollbarStyles,
            }}
          />

          {/* Selectors Manager - SMALLEST */}
          <Box
            id="gjs-selectors"
            sx={{
              height: '10%', 
              flexShrink: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
              bgcolor: '#0d0d0d',
              ...customScrollbarStyles,
            }}
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default PropertiesPanel;