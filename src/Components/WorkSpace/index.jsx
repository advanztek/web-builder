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
      const gjsData = {
        html: editor.getHtml(),
        css: editor.getCss(),
        components: editor.getComponents(),
        styles: editor.getStyle()
      };

      pageDataStore.current[pageId] = gjsData;

      const updatedPages = {
        ...(project.data?.pages || {}),
        [pageId]: {
          ...(project.data?.pages?.[pageId] || {}),
          gjsData: gjsData,
          updatedAt: Date.now()
        }
      };

      await updateProject(project.id, {
        ...(project.data || {}),
        pages: updatedPages
      });

      console.log('✅ Page saved:', pageId);
    } catch (error) {
      console.error('❌ Save error:', error);
    } finally {
      isSavingRef.current = false;
    }
  };

  const loadPage = (pageId, pages) => {
    if (!editorInstanceRef.current || !pages) return;

    const editor = editorInstanceRef.current;
    const page = pages[pageId];

    if (!page) {
      console.error('❌ Page not found:', pageId);
      return;
    }

    console.log('📄 Loading page:', page.name);

    if (currentPageIdRef.current && currentPageIdRef.current !== pageId) {
      const currentData = {
        html: editor.getHtml(),
        css: editor.getCss(),
        components: editor.getComponents()
      };
      pageDataStore.current[currentPageIdRef.current] = currentData;
    }

    currentPageIdRef.current = pageId;

    editor.setComponents('');
    editor.setStyle('');

    if (pageDataStore.current[pageId]) {
      editor.setComponents(pageDataStore.current[pageId].components);
      editor.setStyle(pageDataStore.current[pageId].css || pageDataStore.current[pageId].styles);
    } else if (page.gjsData) {
      editor.setComponents(page.gjsData.components || page.gjsData.html || '');
      editor.setStyle(page.gjsData.styles || page.gjsData.css || '');
      pageDataStore.current[pageId] = page.gjsData;
    } else {
      const html = `
        <div style="padding: 60px 20px; text-align: center; min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <h1 style="color: #1976d2; font-size: 48px; margin-bottom: 20px;">${page.name}</h1>
          <p style="color: #666; font-size: 18px; max-width: 600px;">Start building your page by dragging blocks from the left panel or use the AI prompt below to generate content automatically.</p>
        </div>
      `;
      editor.setComponents(html);
    }

    console.log('✅ Loaded:', page.name);
  };

  useEffect(() => {
    if (!project || editorInstanceRef.current) return;

    console.log('🎨 Initializing GrapeJS...');

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

    // REMOVE THE 3 TOP ICONS
    editor.Panels.removeButton('options', 'sw-visibility');
    editor.Panels.removeButton('options', 'fullscreen');
    editor.Panels.removeButton('views', 'open-layers');

    // Add more custom blocks
    const blockManager = editor.BlockManager;

    // Hero Section
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
      media: '<svg viewBox="0 0 24 24"><rect fill="currentColor" x="2" y="3" width="20" height="10" rx="2"/><rect fill="currentColor" opacity="0.5" x="6" y="14" width="12" height="2" rx="1"/><rect fill="currentColor" opacity="0.5" x="8" y="17" width="8" height="2" rx="1"/></svg>'
    });

    // Feature Card
    blockManager.add('feature-card', {
      label: 'Feature Card',
      category: 'Components',
      content: `
        <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; transition: transform 0.3s;">
          <div style="font-size: 48px; margin-bottom: 15px;">✨</div>
          <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #333;">Amazing Feature</h3>
          <p style="color: #666; line-height: 1.6;">This is a description of an amazing feature that will blow your mind.</p>
        </div>
      `,
      media: '<svg viewBox="0 0 24 24"><rect fill="currentColor" x="4" y="4" width="16" height="16" rx="2"/><circle fill="white" cx="12" cy="10" r="2"/><rect fill="white" x="8" y="14" width="8" height="2" rx="1"/></svg>'
    });

    // Testimonial
    blockManager.add('testimonial', {
      label: 'Testimonial',
      category: 'Components',
      content: `
        <div style="background: #f8f9fa; border-left: 4px solid #1976d2; padding: 30px; margin: 20px 0; border-radius: 5px;">
          <p style="font-size: 18px; font-style: italic; color: #333; margin-bottom: 20px; line-height: 1.6;">"This product has completely transformed the way we work. Highly recommended!"</p>
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

    // CTA Section
    blockManager.add('cta-section', {
      label: 'Call to Action',
      category: 'Sections',
      content: `
        <section style="background: #0F172A; color: white; padding: 80px 20px; text-align: center;">
          <div style="max-width: 800px; margin: 0 auto;">
            <h2 style="font-size: 36px; font-weight: bold; margin-bottom: 20px;">Ready to Get Started?</h2>
            <p style="font-size: 18px; margin-bottom: 30px; opacity: 0.9;">Join thousands of satisfied customers today</p>
            <button style="background: #1976d2; color: white; padding: 15px 40px; border: none; border-radius: 5px; font-size: 18px; font-weight: bold; cursor: pointer;">Sign Up Now</button>
          </div>
        </section>
      `,
      media: '<svg viewBox="0 0 24 24"><rect fill="currentColor" x="2" y="8" width="20" height="8" rx="2"/></svg>'
    });

    // Navbar
    blockManager.add('navbar', {
      label: 'Navigation Bar',
      category: 'Sections',
      content: `
        <nav style="background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 15px 20px;">
          <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 24px; font-weight: bold; color: #1976d2;">Brand</div>
            <div style="display: flex; gap: 30px;">
              <a href="#" style="color: #333; text-decoration: none; font-weight: 500;">Home</a>
              <a href="#" style="color: #333; text-decoration: none; font-weight: 500;">About</a>
              <a href="#" style="color: #333; text-decoration: none; font-weight: 500;">Services</a>
              <a href="#" style="color: #333; text-decoration: none; font-weight: 500;">Contact</a>
            </div>
          </div>
        </nav>
      `,
      media: '<svg viewBox="0 0 24 24"><rect fill="currentColor" x="2" y="4" width="20" height="3" rx="1"/></svg>'
    });

    // Footer
    blockManager.add('footer', {
      label: 'Footer',
      category: 'Sections',
      content: `
        <footer style="background: #0F172A; color: white; padding: 60px 20px 20px;">
          <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; margin-bottom: 40px;">
            <div>
              <h4 style="margin-bottom: 15px;">Company</h4>
              <a href="#" style="color: #aaa; display: block; margin-bottom: 10px; text-decoration: none;">About Us</a>
              <a href="#" style="color: #aaa; display: block; margin-bottom: 10px; text-decoration: none;">Careers</a>
              <a href="#" style="color: #aaa; display: block; margin-bottom: 10px; text-decoration: none;">Contact</a>
            </div>
            <div>
              <h4 style="margin-bottom: 15px;">Products</h4>
              <a href="#" style="color: #aaa; display: block; margin-bottom: 10px; text-decoration: none;">Features</a>
              <a href="#" style="color: #aaa; display: block; margin-bottom: 10px; text-decoration: none;">Pricing</a>
              <a href="#" style="color: #aaa; display: block; margin-bottom: 10px; text-decoration: none;">FAQ</a>
            </div>
          </div>
          <div style="text-align: center; padding-top: 30px; border-top: 1px solid #333; color: #888;">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
          </div>
        </footer>
      `,
      media: '<svg viewBox="0 0 24 24"><rect fill="currentColor" x="2" y="17" width="20" height="3" rx="1"/></svg>'
    });

    // Grid Container
    blockManager.add('grid-container', {
      label: 'Grid Container',
      category: 'Layout',
      content: `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; padding: 20px;">
          <div style="background: #f5f5f5; padding: 30px; border-radius: 8px; min-height: 200px;">
            <h3 style="margin-bottom: 10px;">Grid Item 1</h3>
            <p>Add your content here</p>
          </div>
          <div style="background: #f5f5f5; padding: 30px; border-radius: 8px; min-height: 200px;">
            <h3 style="margin-bottom: 10px;">Grid Item 2</h3>
            <p>Add your content here</p>
          </div>
          <div style="background: #f5f5f5; padding: 30px; border-radius: 8px; min-height: 200px;">
            <h3 style="margin-bottom: 10px;">Grid Item 3</h3>
            <p>Add your content here</p>
          </div>
        </div>
      `,
      media: '<svg viewBox="0 0 24 24"><rect fill="currentColor" x="2" y="2" width="8" height="8"/><rect fill="currentColor" x="14" y="2" width="8" height="8"/><rect fill="currentColor" x="2" y="14" width="8" height="8"/><rect fill="currentColor" x="14" y="14" width="8" height="8"/></svg>'
    });

    // Container
    blockManager.add('container', {
      label: 'Container',
      category: 'Layout',
      content: '<div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">Container content here</div>',
      media: '<svg viewBox="0 0 24 24"><rect fill="none" stroke="currentColor" stroke-width="2" x="3" y="3" width="18" height="18" rx="1"/></svg>'
    });

    // Divider
    blockManager.add('divider', {
      label: 'Divider',
      category: 'Basic',
      content: '<hr style="border: none; border-top: 2px solid #e0e0e0; margin: 40px 0;">',
      media: '<svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2"/></svg>'
    });

    // Spacer
    blockManager.add('spacer', {
      label: 'Spacer',
      category: 'Basic',
      content: '<div style="height: 60px;"></div>',
      media: '<svg viewBox="0 0 24 24"><rect x="10" y="2" width="4" height="20" fill="currentColor" opacity="0.3"/></svg>'
    });

    // Button
    blockManager.add('button', {
      label: 'Button',
      category: 'Basic',
      content: '<button style="background: #1976d2; color: white; padding: 12px 30px; border: none; border-radius: 5px; font-size: 16px; font-weight: 500; cursor: pointer;">Click Me</button>',
      media: '<svg viewBox="0 0 24 24"><rect fill="currentColor" x="4" y="9" width="16" height="6" rx="2"/></svg>'
    });

    // Apply DARK THEME
    const style = document.createElement('style');
    style.innerHTML = `
      /* Dark Theme for GrapeJS */
      .gjs-one-bg { background-color: #1a1a1a; }
      .gjs-two-bg { background-color: #141414; }
      .gjs-three-bg { background-color: #0d0d0d; }
      .gjs-four-bg { background-color: #000000; }
      
      .gjs-one-color { color: #e0e0e0; }
      .gjs-two-color { color: #b0b0b0; }
      .gjs-three-color { color: #808080; }
      .gjs-four-color { color: #ffffff; }
      
      #gjs-blocks .gjs-block {
        background-color: #2a2a2a;
        border: 1px solid #3a3a3a;
        color: #e0e0e0;
        min-height: 90px;
        width: 100%;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 12px;
        border-radius: 4px;
      }
      #gjs-blocks .gjs-block:hover {
        background-color: #3a3a3a;
        border-color: #1976d2;
      }
      
      #gjs-blocks .gjs-block-label { 
        color: #e0e0e0;
        font-size: 12px;
        margin-top: 8px;
        font-weight: 500;
      }
      
      #gjs-blocks .gjs-block svg {
        width: 45px;
        height: 45px;
        color: #1976d2;
      }
      
      #gjs-blocks .gjs-block-category {
        border-bottom: 1px solid #2a2a2a;
      }
      
      #gjs-blocks .gjs-block-category .gjs-title {
        background-color: #0d0d0d;
        color: #b0b0b0;
        padding: 10px 12px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .gjs-sm-sector {
        background-color: #1a1a1a;
        border-bottom: 1px solid #2a2a2a;
      }
      .gjs-sm-sector .gjs-sm-title {
        background-color: #0d0d0d;
        color: #e0e0e0;
        border-bottom: 1px solid #2a2a2a;
      }
      
      .gjs-sm-property { color: #e0e0e0; }
      .gjs-sm-property .gjs-sm-label { color: #b0b0b0; }
      
      .gjs-field input,
      .gjs-field select,
      .gjs-field textarea {
        background-color: #2a2a2a;
        border: 1px solid #3a3a3a;
        color: #e0e0e0;
      }
      
      .gjs-layer {
        background-color: #1a1a1a;
        color: #e0e0e0;
      }
      .gjs-layer:hover {
        background-color: #2a2a2a;
      }
      .gjs-layer.gjs-selected {
        background-color: #1976d2;
      }
      
      .gjs-traits-label { color: #b0b0b0; }
      
      .gjs-selector {
        background-color: #2a2a2a;
        border: 1px solid #3a3a3a;
        color: #e0e0e0;
      }
      
      .gjs-clm-tags { background-color: #1a1a1a; }
      .gjs-clm-tag { 
        background-color: #2a2a2a;
        border: 1px solid #3a3a3a;
        color: #e0e0e0;
      }
      
      .gjs-frame {
        background-color: #ffffff;
      }
      
      #gjs-editor .gjs-cv-canvas {
        background-color: #2a2a2a;
      }
      
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: #1a1a1a;
      }
      ::-webkit-scrollbar-thumb {
        background: #3a3a3a;
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #4a4a4a;
      }
    `;
    document.head.appendChild(style);

    // Load initial page
    const pages = project.data?.pages || {};
    const initialPageId = project.data?.activePageId || Object.keys(pages)[0];
    
    if (initialPageId) {
      loadPage(initialPageId, pages);
    }

    // Load gallery assets
    if (project.data?.gallery && project.data.gallery.length > 0) {
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

    // Auto-save
    let saveTimeout;
    editor.on('component:update', () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(saveCurrentPage, 5000);
    });

    // Event listeners
    const handleManualSave = () => saveCurrentPage();

    const handleExportHTML = () => {
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${project.name || project.data?.name || 'Project'}</title>
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
      a.download = `${project.slug || project.data?.slug || 'page'}.html`;
      a.click();
      URL.revokeObjectURL(url);
      showToast.success('HTML exported!');
    };

    const handleDeviceChange = (e) => editor.setDevice(e.detail);
    
    const handleToggleBorders = () => {
      const commands = editor.Commands;
      commands.isActive('sw-visibility') ? 
        commands.stop('sw-visibility') : 
        commands.run('sw-visibility');
    };

    const handlePageChange = async (e) => {
      const { pageId } = e.detail;
      await saveCurrentPage();
      const pages = project.data?.pages || {};
      loadPage(pageId, pages);
    };

    const handleAddAssets = (e) => {
      const newFiles = e.detail;
      const assetManager = editor.AssetManager;
      newFiles.forEach(file => {
        assetManager.add({
          id: file.id,
          src: file.url,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          name: file.name
        });
      });
    };

    const handleRemoveAsset = (e) => {
      const fileId = e.detail;
      editor.AssetManager.remove(fileId);
    };

    const handleUseAsset = (e) => {
      const file = e.detail;
      const selected = editor.getSelected();
      
      if (file.type.startsWith('image/')) {
        const component = editor.addComponents({
          type: 'image',
          src: file.url,
          attributes: { alt: file.name }
        })[0];
        
        if (selected) {
          selected.append(component);
        }
      } else if (file.type.startsWith('video/')) {
        const component = editor.addComponents({
          type: 'video',
          src: file.url,
          attributes: { controls: true }
        })[0];
        
        if (selected) {
          selected.append(component);
        }
      }
    };

    window.addEventListener('manual-save', handleManualSave);
    window.addEventListener('export-html', handleExportHTML);
    window.addEventListener('change-device', handleDeviceChange);
    window.addEventListener('toggle-borders', handleToggleBorders);
    window.addEventListener('change-page', handlePageChange);
    window.addEventListener('add-assets', handleAddAssets);
    window.addEventListener('remove-asset', handleRemoveAsset);
    window.addEventListener('use-asset', handleUseAsset);

    console.log('✅ Editor initialized');

    return () => {
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
      
      // TODO: Replace with real AI API call
      editor.addComponents(`
        <div style="padding: 50px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 20px; border-radius: 12px; color: white; text-align: center;">
          <h2 style="font-size: 32px; margin-bottom: 15px;">✨ AI Generated Content</h2>
          <p style="font-size: 18px; opacity: 0.9; margin-bottom: 10px;">Prompt: "${aiPrompt}"</p>
          <p style="font-size: 16px; opacity: 0.8;">Connect your AI API to generate real content based on this prompt!</p>
        </div>
      `);

      showToast.success('AI content added! Connect your AI API for real generation.');
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
      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#1e1e1e',
        color: 'white'
      }}>
        <Typography variant="h6">No project selected</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#1e1e1e',
        overflow: 'hidden'
      }}
    >
      {/* Editor Canvas */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <div id="gjs-editor" style={{ height: '100%', width: '100%' }} />
      </Box>

      {/* AI Prompt Panel at Bottom */}
      <Paper 
        elevation={4}
        sx={{ 
          p: 2, 
          borderTop: '2px solid #1976d2',
          bgcolor: '#0F172A',
          borderRadius: 0
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Describe what you want to build or modify... (e.g., 'Add a hero section with blue background', 'Create a pricing table with 3 columns')"
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
              '& fieldset': {
                borderColor: '#2a2a3e'
              },
              '&:hover fieldset': {
                borderColor: '#1976d2'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2'
              }
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#808080',
              opacity: 1
            }
          }}
        />
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            mt: 1, 
            color: '#808080', 
            ml: 5 
          }}
        >
          💡 Tip: Use natural language to describe your design and AI will generate it for you
        </Typography>
      </Paper>
    </Box>
  );
});

Workspace.displayName = 'Workspace';