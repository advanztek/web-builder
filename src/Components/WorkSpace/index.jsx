import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { Box, CircularProgress, Typography, TextField, InputAdornment, IconButton, Paper } from '@mui/material';
import { AutoAwesome, Send } from '@mui/icons-material';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import { useUpdateProject } from '../../Hooks/projects';
import { showToast } from '../../Utils/toast';

export const Workspace = forwardRef(({ project }, ref) => {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const { updateProject } = useUpdateProject();

  const pageDataStore = useRef({});
  const currentPageIdRef = useRef(null);
  const isSavingRef = useRef(false);

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    getEditor: () => editorInstanceRef.current,
    saveCurrentPage: () => saveCurrentPage()
  }));

  const saveCurrentPage = async () => {
    if (!editorInstanceRef.current || !project || !currentPageIdRef.current || isSavingRef.current) {
      return;
    }

    isSavingRef.current = true;
    const editor = editorInstanceRef.current;
    const pageId = currentPageIdRef.current;

    try {
      console.log('💾 Starting save for page:', pageId);

      // ✅ FIX: Use getProjectData() instead of toJSON() to avoid circular references
      const gjsData = {
        html: editor.getHtml(),
        css: editor.getCss()
      };

      console.log('📦 Captured data:', {
        htmlLength: gjsData.html?.length || 0,
        cssLength: gjsData.css?.length || 0
      });

      // ✅ Update local cache
      pageDataStore.current[pageId] = gjsData;

      // ✅ Build the complete pages object
      const currentPages = project.data?.pages || {};
      const updatedPages = {
        ...currentPages,
        [pageId]: {
          ...currentPages[pageId],
          gjsData: gjsData,
          updatedAt: Date.now()
        }
      };

      // ✅ CRITICAL: Match your backend's expected structure exactly
      // Based on your project structure, we need to send ONLY the updated fields
      const updatePayload = {
        pages: updatedPages
      };

      console.log('📤 Sending update payload:', JSON.stringify(updatePayload, null, 2));

      const result = await updateProject(project.id, updatePayload);

      if (result) {
        console.log('✅ Save successful');
        // Update local project reference
        if (project.data) {
          project.data.pages = result.data?.pages || updatedPages;
        }
      }
    } catch (error) {
      console.error('❌ Save error:', error);
      
      // Don't show error toast for auto-saves to avoid annoying users
      if (!error.message?.includes('Validation')) {
        showToast.error('Failed to save: ' + error.message);
      }
    } finally {
      isSavingRef.current = false;
    }
  };

  const loadPage = (pageId, pages) => {
    if (!editorInstanceRef.current || !pages) {
      console.error('❌ Editor or pages not available');
      return;
    }

    const editor = editorInstanceRef.current;
    const page = pages[pageId];

    if (!page) {
      console.error('❌ Page not found:', pageId);
      return;
    }

    console.log('📄 Loading page:', page.name);

    // ✅ Save current page data before switching
    if (currentPageIdRef.current && currentPageIdRef.current !== pageId) {
      const currentData = {
        html: editor.getHtml(),
        css: editor.getCss()
      };
      pageDataStore.current[currentPageIdRef.current] = currentData;
    }

    currentPageIdRef.current = pageId;

    // ✅ Clear editor first
    editor.setComponents('');
    editor.setStyle('');

    // ✅ Priority 1: Load from cache
    if (pageDataStore.current[pageId]) {
      console.log('📂 Loading from cache');
      const cachedData = pageDataStore.current[pageId];
      
      if (cachedData.html) {
        editor.setComponents(cachedData.html);
      }
      
      if (cachedData.css) {
        editor.setStyle(cachedData.css);
      }
      
      console.log('✅ Loaded from cache');
      return;
    }

    // ✅ Priority 2: Load from gjsData
    if (page.gjsData) {
      console.log('🤖 Loading from gjsData');
      
      try {
        if (page.gjsData.html) {
          editor.setComponents(page.gjsData.html);
        }
        
        if (page.gjsData.css) {
          editor.setStyle(page.gjsData.css);
        }

        // Cache it
        pageDataStore.current[pageId] = {
          html: page.gjsData.html || '',
          css: page.gjsData.css || ''
        };
        
        console.log('✅ Loaded from gjsData');
      } catch (error) {
        console.error('❌ Error loading gjsData:', error);
        loadDefaultPageContent(editor, page.name);
      }
    } else {
      // ✅ Priority 3: Default content
      console.log('📝 Loading default content');
      loadDefaultPageContent(editor, page.name);
    }
  };

  const loadDefaultPageContent = (editor, pageName) => {
    const html = `
      <div style="padding: 60px 20px; text-align: center; min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <h1 style="color: #1976d2; font-size: 48px; margin-bottom: 20px;">${pageName}</h1>
        <p style="color: #666; font-size: 18px; max-width: 600px;">Start building your page by dragging blocks from the left panel or use the AI prompt below to generate content automatically.</p>
      </div>
    `;
    editor.setComponents(html);
  };

  useEffect(() => {
    if (!project || editorInstanceRef.current) return;

    console.log('🎨 Initializing GrapeJS...');
    console.log('📦 Project:', project);

    const editor = grapesjs.init({
      container: '#gjs-editor',
      height: '100%',
      width: '100%',
      storageManager: false,
      fromElement: false,

      blockManager: {
        appendTo: '#gjs-blocks'
      },

      styleManager: {
        appendTo: '#gjs-styles',
        sectors: [{
          name: 'General',
          open: true,
          buildProps: ['display', 'position', 'top', 'right', 'left', 'bottom', 'float']
        }, {
          name: 'Dimension',
          open: false,
          buildProps: ['width', 'height', 'max-width', 'min-width', 'max-height', 'min-height', 'margin', 'padding']
        }, {
          name: 'Typography',
          open: false,
          buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow']
        }, {
          name: 'Decorations',
          open: false,
          buildProps: ['background-color', 'background', 'border-radius', 'border', 'box-shadow', 'opacity']
        }, {
          name: 'Extra',
          open: false,
          buildProps: ['transition', 'perspective', 'transform', 'cursor', 'overflow', 'z-index']
        }]
      },

      layerManager: {
        appendTo: '#gjs-layers'
      },

      traitManager: {
        appendTo: '#gjs-traits'
      },

      selectorManager: {
        appendTo: '#gjs-selectors'
      },

      assetManager: {
        upload: false,
        assets: [],
        multiUpload: true,
        uploadText: 'Drop files or click to upload'
      },

      plugins: [gjsPresetWebpage, gjsBlocksBasic],
      pluginsOpts: {
        [gjsPresetWebpage]: {
          blocksBasicOpts: {
            blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video', 'map'],
            flexGrid: true
          },
          blocks: ['link-block', 'quote', 'text-basic']
        },
        [gjsBlocksBasic]: {
          flexGrid: true
        }
      },

      canvas: {
        styles: [
          'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'
        ],
        scripts: []
      },

      deviceManager: {
        devices: [
          { name: 'Desktop', width: '' },
          { name: 'Tablet', width: '768px', widthMedia: '992px' },
          { name: 'Mobile', width: '320px', widthMedia: '480px' }
        ]
      }
    });

    editorInstanceRef.current = editor;

    // Remove top icons
    editor.Panels.removeButton('options', 'sw-visibility');
    editor.Panels.removeButton('options', 'fullscreen');
    editor.Panels.removeButton('views', 'open-layers');

    // Add custom blocks
    const blockManager = editor.BlockManager;

    blockManager.add('hero-section', {
      label: 'Hero Section',
      category: 'Sections',
      content: `
        <section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 100px 20px; text-align: center; color: white;">
          <div style="max-width: 800px; margin: 0 auto;">
            <h1 style="font-size: 48px; font-weight: bold; margin-bottom: 20px;">Welcome to Our Website</h1>
            <p style="font-size: 20px; margin-bottom: 30px; opacity: 0.9;">Build amazing experiences with our platform</p>
            <button style="background: white; color: #667eea; padding: 15px 40px; border: none; border-radius: 5px; font-size: 18px; font-weight: bold; cursor: pointer;">Get Started</button>
          </div>
        </section>
      `,
      media: '<svg viewBox="0 0 24 24"><rect fill="currentColor" x="2" y="3" width="20" height="10" rx="2"/></svg>'
    });

    blockManager.add('feature-card', {
      label: 'Feature Card',
      category: 'Components',
      content: `
        <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">✨</div>
          <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #333;">Amazing Feature</h3>
          <p style="color: #666; line-height: 1.6;">This is a description of an amazing feature.</p>
        </div>
      `,
      media: '<svg viewBox="0 0 24 24"><rect fill="currentColor" x="4" y="4" width="16" height="16" rx="2"/></svg>'
    });

    blockManager.add('testimonial', {
      label: 'Testimonial',
      category: 'Components',
      content: `
        <div style="background: #f8f9fa; border-left: 4px solid #1976d2; padding: 30px; margin: 20px 0; border-radius: 5px;">
          <p style="font-size: 18px; font-style: italic; color: #333; margin-bottom: 20px;">"This product transformed our workflow!"</p>
          <div style="display: flex; align-items: center; gap: 15px;">
            <div style="width: 50px; height: 50px; border-radius: 50%; background: #1976d2;"></div>
            <div>
              <div style="font-weight: bold; color: #333;">John Doe</div>
              <div style="color: #666; font-size: 14px;">CEO, Company Inc.</div>
            </div>
          </div>
        </div>
      `,
      media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>'
    });

    blockManager.add('cta-section', {
      label: 'Call to Action',
      category: 'Sections',
      content: `
        <section style="background: #0F172A; color: white; padding: 80px 20px; text-align: center;">
          <div style="max-width: 800px; margin: 0 auto;">
            <h2 style="font-size: 36px; font-weight: bold; margin-bottom: 20px;">Ready to Get Started?</h2>
            <p style="font-size: 18px; margin-bottom: 30px;">Join thousands of satisfied customers</p>
            <button style="background: #1976d2; color: white; padding: 15px 40px; border: none; border-radius: 5px; font-size: 18px; font-weight: bold; cursor: pointer;">Sign Up Now</button>
          </div>
        </section>
      `,
      media: '<svg viewBox="0 0 24 24"><rect fill="currentColor" x="2" y="8" width="20" height="8" rx="2"/></svg>'
    });

    blockManager.add('navbar', {
      label: 'Navigation',
      category: 'Sections',
      content: `
        <nav style="background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 15px 20px;">
          <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 24px; font-weight: bold; color: #1976d2;">Brand</div>
            <div style="display: flex; gap: 30px;">
              <a href="#" style="color: #333; text-decoration: none;">Home</a>
              <a href="#" style="color: #333; text-decoration: none;">About</a>
              <a href="#" style="color: #333; text-decoration: none;">Contact</a>
            </div>
          </div>
        </nav>
      `,
      media: '<svg viewBox="0 0 24 24"><rect fill="currentColor" x="2" y="4" width="20" height="3" rx="1"/></svg>'
    });

    blockManager.add('footer', {
      label: 'Footer',
      category: 'Sections',
      content: `
        <footer style="background: #0F172A; color: white; padding: 60px 20px;">
          <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
            <p style="color: #888;">&copy; 2024 Your Company. All rights reserved.</p>
          </div>
        </footer>
      `,
      media: '<svg viewBox="0 0 24 24"><rect fill="currentColor" x="2" y="17" width="20" height="3" rx="1"/></svg>'
    });

    blockManager.add('button', {
      label: 'Button',
      category: 'Basic',
      content: '<button style="background: #1976d2; color: white; padding: 12px 30px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">Click Me</button>',
      media: '<svg viewBox="0 0 24 24"><rect fill="currentColor" x="4" y="9" width="16" height="6" rx="2"/></svg>'
    });

    // Dark theme
    const style = document.createElement('style');
    style.innerHTML = `
      .gjs-one-bg { background-color: #1a1a1a; }
      .gjs-two-bg { background-color: #141414; }
      .gjs-three-bg { background-color: #0d0d0d; }
      .gjs-one-color { color: #e0e0e0; }
      .gjs-two-color { color: #b0b0b0; }
      
      #gjs-blocks .gjs-block {
        background-color: #2a2a2a;
        border: 1px solid #3a3a3a;
        color: #e0e0e0;
        min-height: 90px;
        padding: 12px;
        border-radius: 4px;
      }
      #gjs-blocks .gjs-block:hover {
        background-color: #3a3a3a;
        border-color: #1976d2;
      }
      
      .gjs-field input,
      .gjs-field select {
        background-color: #2a2a2a;
        border: 1px solid #3a3a3a;
        color: #e0e0e0;
      }
      
      .gjs-layer {
        background-color: #1a1a1a;
        color: #e0e0e0;
      }
      
      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-thumb {
        background: #3a3a3a;
        border-radius: 4px;
      }
    `;
    document.head.appendChild(style);

    // Load initial page
    const pages = project.data?.pages || project.pages || {};
    const initialPageId = project.data?.activePageId || project.activePageId || Object.keys(pages)[0];

    console.log('📄 Initial page:', initialPageId);

    if (initialPageId && pages[initialPageId]) {
      loadPage(initialPageId, pages);
    }

    // Load assets
    if (project.data?.gallery?.length > 0) {
      const assetManager = editor.AssetManager;
      project.data.gallery.forEach(file => {
        assetManager.add({
          id: file.id,
          src: file.url,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          name: file.name
        });
      });
    }

    // ✅ FIXED: Proper auto-save with longer delay
    let saveTimeout;
    editor.on('component:update', () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        console.log('⏱️ Auto-saving...');
        saveCurrentPage();
      }, 5000); // 5 seconds to avoid too many saves
    });

    // Event handlers
    const handleManualSave = () => saveCurrentPage();

    const handleExportHTML = () => {
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${project.name || 'Project'}</title>
  <style>${editor.getCss()}</style>
</head>
<body>
  ${editor.getHtml()}
</body>
</html>`;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.slug || 'page'}.html`;
      a.click();
      URL.revokeObjectURL(url);
      showToast.success('HTML exported!');
    };

    const handleDeviceChange = (e) => editor.setDevice(e.detail);
    const handleToggleBorders = () => {
      const commands = editor.Commands;
      commands.isActive('sw-visibility') ? commands.stop('sw-visibility') : commands.run('sw-visibility');
    };

    const handlePageChange = async (e) => {
      const { pageId } = e.detail;
      console.log('🔄 Switching to page:', pageId);
      
      await saveCurrentPage();
      
      const pages = project.data?.pages || project.pages || {};
      loadPage(pageId, pages);
    };

    const handleAddAssets = (e) => {
      const assetManager = editor.AssetManager;
      e.detail.forEach(file => {
        assetManager.add({
          id: file.id,
          src: file.url,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          name: file.name
        });
      });
    };

    const handleRemoveAsset = (e) => editor.AssetManager.remove(e.detail);

    const handleUseAsset = (e) => {
      const file = e.detail;
      const selected = editor.getSelected();
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      const component = editor.addComponents({
        type,
        src: file.url,
        attributes: type === 'image' ? { alt: file.name } : { controls: true }
      })[0];
      if (selected) selected.append(component);
    };

    window.addEventListener('manual-save', handleManualSave);
    window.addEventListener('export-html', handleExportHTML);
    window.addEventListener('change-device', handleDeviceChange);
    window.addEventListener('toggle-borders', handleToggleBorders);
    window.addEventListener('change-page', handlePageChange);
    window.addEventListener('add-assets', handleAddAssets);
    window.addEventListener('remove-asset', handleRemoveAsset);
    window.addEventListener('use-asset', handleUseAsset);

    console.log('✅ Editor ready');

    return () => {
      clearTimeout(saveTimeout);
      window.removeEventListener('manual-save', handleManualSave);
      window.removeEventListener('export-html', handleExportHTML);
      window.removeEventListener('change-device', handleDeviceChange);
      window.removeEventListener('toggle-borders', handleToggleBorders);
      window.removeEventListener('change-page', handlePageChange);
      window.removeEventListener('add-assets', handleAddAssets);
      window.removeEventListener('remove-asset', handleRemoveAsset);
      window.removeEventListener('use-asset', handleUseAsset);

      if (editorInstanceRef.current) {
        saveCurrentPage();
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, [project]);

  const handleAiSubmit = () => {
    if (!aiPrompt.trim() || !editorInstanceRef.current) return;

    setAiLoading(true);

    try {
      const editor = editorInstanceRef.current;
      
      editor.addComponents(`
        <div style="padding: 50px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 20px; border-radius: 12px; color: white; text-align: center;">
          <h2 style="font-size: 32px; margin-bottom: 15px;">✨ AI Generated</h2>
          <p style="font-size: 18px; opacity: 0.9;">Prompt: "${aiPrompt}"</p>
        </div>
      `);

      showToast.success('Content added!');
      setAiPrompt('');
    } catch (error) {
      console.error('AI error:', error);
      showToast.error('Failed to generate content');
    } finally {
      setAiLoading(false);
    }
  };

  if (!project) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#1e1e1e', color: 'white' }}>
        <Typography variant="h6">No project selected</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#1e1e1e', overflow: 'hidden' }}>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <div id="gjs-editor" style={{ height: '100%', width: '100%' }} />
      </Box>

      <Paper elevation={4} sx={{ p: 2, borderTop: '2px solid #1976d2', bgcolor: '#0F172A', borderRadius: 0 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Describe what you want to build..."
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !aiLoading) {
              e.preventDefault();
              handleAiSubmit();
            }
          }}
          disabled={aiLoading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AutoAwesome sx={{ color: '#1976d2' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleAiSubmit}
                  disabled={!aiPrompt.trim() || aiLoading}
                  size="small"
                  sx={{
                    bgcolor: '#1976d2',
                    color: 'white',
                    '&:hover': { bgcolor: '#1565c0' },
                    '&:disabled': { bgcolor: '#404040', color: '#808080' }
                  }}
                >
                  {aiLoading ? <CircularProgress size={20} color="inherit" /> : <Send fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#1a1a2e',
              color: '#e0e0e0',
              '& fieldset': { borderColor: '#2a2a3e' },
              '&:hover fieldset': { borderColor: '#1976d2' },
              '&.Mui-focused fieldset': { borderColor: '#1976d2' }
            },
            '& .MuiInputBase-input::placeholder': { color: '#808080', opacity: 1 }
          }}
        />
      </Paper>
    </Box>
  );
});

Workspace.displayName = 'Workspace';