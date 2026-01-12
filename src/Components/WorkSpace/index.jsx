import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography } from '@mui/material';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import { savePageData } from '../../Store/slices/projectsSlice';

export const Workspace = () => {
  const dispatch = useDispatch();
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const editorInstanceRef = useRef(null);

  const activeProjectId = useSelector(state => state.projects.activeProjectId);
  const project = useSelector(state =>
    activeProjectId ? state.projects.projects[activeProjectId] : null
  );
  const activePage = project?.activePageId ? project.pages[project.activePageId] : null;

  // Initialize GrapeJS
  useEffect(() => {
    if (!editorRef.current || editorInstanceRef.current) return;

    const gjs = grapesjs.init({
      container: editorRef.current,
      height: '100%',
      width: '100%',
      storageManager: false,
      fromElement: false,
      plugins: [gjsPresetWebpage, gjsBlocksBasic],
      pluginsOpts: {
        gjsPresetWebpage: {
          blocksBasicOpts: {
            blocks: ['column1', 'column2', 'column3', 'text', 'link', 'image', 'video'],
            flexGrid: true,
          },
          blocks: ['link-block', 'quote', 'text-basic'],
        }
      },
      canvas: {
        styles: [
          'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'
        ],
      },
      blockManager: {
        appendTo: '#gjs-blocks',
        custom: true
      },
      styleManager: {
        appendTo: '#gjs-styles',
        sectors: [{
          name: 'General',
          open: true,
          properties: [
            'float', 'display', 'position', 'top', 'right', 'left', 'bottom'
          ]
        }, {
          name: 'Dimension',
          open: false,
          properties: [
            'width', 'height', 'max-width', 'min-height', 'margin', 'padding'
          ]
        }, {
          name: 'Typography',
          open: false,
          properties: [
            'font-family', 'font-size', 'font-weight', 'letter-spacing',
            'color', 'line-height', 'text-align', 'text-shadow'
          ]
        }, {
          name: 'Decorations',
          open: false,
          properties: [
            'border-radius', 'border', 'background-color', 'box-shadow'
          ]
        }, {
          name: 'Extra',
          open: false,
          properties: ['transition', 'transform', 'cursor']
        }]
      },
      layerManager: {
        appendTo: '#gjs-layers'
      },
      traitManager: {
        appendTo: '#gjs-traits',
      },
      selectorManager: {
        appendTo: '#gjs-selectors'
      },
      panels: {
        defaults: []
      },
      deviceManager: {
        devices: [{
          name: 'Desktop',
          width: '',
        }, {
          name: 'Tablet',
          width: '768px',
          widthMedia: '992px',
        }, {
          name: 'Mobile',
          width: '320px',
          widthMedia: '480px',
        }]
      }
    });

    // Add custom components
    addCustomComponents(gjs);
    
    // Add custom blocks
    addCustomBlocks(gjs);

    // Apply dark theme
    applyDarkTheme();

    editorInstanceRef.current = gjs;
    setEditor(gjs);
    window.__grapesjsEditor = gjs;

    return () => {
      if (gjs) {
        gjs.destroy();
      }
      editorInstanceRef.current = null;
      window.__grapesjsEditor = null;
    };
  }, []);

  // Custom Components Definition
  const addCustomComponents = (editor) => {
    // Button Component
    editor.DomComponents.addType('button', {
      isComponent: el => el.tagName === 'BUTTON',
      model: {
        defaults: {
          tagName: 'button',
          attributes: { type: 'button', class: 'btn btn-primary' },
          components: 'Click me',
          styles: `
            .btn {
              display: inline-block;
              padding: 12px 24px;
              font-size: 16px;
              font-weight: 500;
              text-align: center;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              transition: all 0.3s ease;
            }
            .btn-primary {
              background-color: #1976d2;
              color: white;
            }
            .btn-primary:hover {
              background-color: #1565c0;
              transform: translateY(-2px);
            }
          `,
          traits: [
            { type: 'text', label: 'Text', name: 'text', changeProp: 1 },
            { type: 'select', label: 'Type', name: 'type', options: [
              { value: 'button', name: 'Button' },
              { value: 'submit', name: 'Submit' },
              { value: 'reset', name: 'Reset' }
            ]}
          ]
        }
      }
    });

    // Hero Section Component
    editor.DomComponents.addType('hero', {
      model: {
        defaults: {
          tagName: 'section',
          attributes: { class: 'hero-section' },
          components: `
            <div class="hero-content">
              <h1 class="hero-title">Welcome to Our Website</h1>
              <p class="hero-subtitle">Building amazing experiences together</p>
              <button type="button" class="btn btn-primary">Get Started</button>
            </div>
          `,
          styles: `
            .hero-section {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 500px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 60px 20px;
              text-align: center;
            }
            .hero-content {
              max-width: 800px;
            }
            .hero-title {
              font-size: 48px;
              font-weight: 700;
              margin-bottom: 20px;
            }
            .hero-subtitle {
              font-size: 20px;
              margin-bottom: 30px;
              opacity: 0.9;
            }
          `
        }
      }
    });

    // Card Component
    editor.DomComponents.addType('card', {
      model: {
        defaults: {
          tagName: 'div',
          attributes: { class: 'card' },
          components: `
            <img src="https://via.placeholder.com/400x250" alt="Card image" class="card-img">
            <div class="card-body">
              <h3 class="card-title">Card Title</h3>
              <p class="card-text">This is a card description. Add your content here.</p>
              <button type="button" class="btn btn-primary">Learn More</button>
            </div>
          `,
          styles: `
            .card {
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              overflow: hidden;
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .card:hover {
              transform: translateY(-5px);
              box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            }
            .card-img {
              width: 100%;
              height: 200px;
              object-fit: cover;
            }
            .card-body {
              padding: 20px;
            }
            .card-title {
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 10px;
              color: #333;
            }
            .card-text {
              color: #666;
              margin-bottom: 20px;
              line-height: 1.6;
            }
          `
        }
      }
    });

    // Navbar Component
    editor.DomComponents.addType('navbar', {
      model: {
        defaults: {
          tagName: 'nav',
          attributes: { class: 'navbar' },
          components: `
            <div class="navbar-container">
              <a href="#" class="navbar-brand">Brand</a>
              <div class="navbar-menu">
                <a href="#home" class="nav-link">Home</a>
                <a href="#about" class="nav-link">About</a>
                <a href="#services" class="nav-link">Services</a>
                <a href="#contact" class="nav-link">Contact</a>
              </div>
            </div>
          `,
          styles: `
            .navbar {
              background-color: #fff;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              padding: 15px 0;
              position: sticky;
              top: 0;
              z-index: 1000;
            }
            .navbar-container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 0 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .navbar-brand {
              font-size: 24px;
              font-weight: 700;
              color: #1976d2;
              text-decoration: none;
            }
            .navbar-menu {
              display: flex;
              gap: 30px;
            }
            .nav-link {
              color: #333;
              text-decoration: none;
              font-weight: 500;
              transition: color 0.3s ease;
            }
            .nav-link:hover {
              color: #1976d2;
            }
          `
        }
      }
    });

    // Footer Component
    editor.DomComponents.addType('footer', {
      model: {
        defaults: {
          tagName: 'footer',
          attributes: { class: 'footer' },
          components: `
            <div class="footer-container">
              <div class="footer-column">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Careers</a>
                <a href="#">Contact</a>
              </div>
              <div class="footer-column">
                <h4>Products</h4>
                <a href="#">Features</a>
                <a href="#">Pricing</a>
                <a href="#">FAQ</a>
              </div>
              <div class="footer-column">
                <h4>Legal</h4>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">License</a>
              </div>
            </div>
            <div class="footer-bottom">
              <p>&copy; 2024 Your Company. All rights reserved.</p>
            </div>
          `,
          styles: `
            .footer {
              background-color: #1a1a1a;
              color: #fff;
              padding: 60px 20px 20px;
            }
            .footer-container {
              max-width: 1200px;
              margin: 0 auto;
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 40px;
              margin-bottom: 40px;
            }
            .footer-column h4 {
              margin-bottom: 15px;
              font-size: 18px;
            }
            .footer-column a {
              display: block;
              color: #aaa;
              text-decoration: none;
              margin-bottom: 10px;
              transition: color 0.3s ease;
            }
            .footer-column a:hover {
              color: #1976d2;
            }
            .footer-bottom {
              text-align: center;
              padding-top: 30px;
              border-top: 1px solid #333;
              color: #888;
            }
          `
        }
      }
    });

    // Feature Box Component
    editor.DomComponents.addType('feature-box', {
      model: {
        defaults: {
          tagName: 'div',
          attributes: { class: 'feature-box' },
          components: `
            <div class="feature-icon">✨</div>
            <h3 class="feature-title">Feature Title</h3>
            <p class="feature-description">Description of this amazing feature goes here.</p>
          `,
          styles: `
            .feature-box {
              text-align: center;
              padding: 30px;
              border-radius: 8px;
              transition: transform 0.3s ease;
            }
            .feature-box:hover {
              transform: translateY(-5px);
            }
            .feature-icon {
              font-size: 48px;
              margin-bottom: 15px;
            }
            .feature-title {
              font-size: 22px;
              font-weight: 600;
              margin-bottom: 10px;
              color: #333;
            }
            .feature-description {
              color: #666;
              line-height: 1.6;
            }
          `
        }
      }
    });

    // Container Component
    editor.DomComponents.addType('container', {
      model: {
        defaults: {
          tagName: 'div',
          attributes: { class: 'container' },
          styles: `
            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 0 20px;
            }
          `
        }
      }
    });

    // Grid Component
    editor.DomComponents.addType('grid', {
      model: {
        defaults: {
          tagName: 'div',
          attributes: { class: 'grid' },
          components: `
            <div class="grid-item">Grid Item 1</div>
            <div class="grid-item">Grid Item 2</div>
            <div class="grid-item">Grid Item 3</div>
          `,
          styles: `
            .grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 20px;
              padding: 20px;
            }
            .grid-item {
              background: #f5f5f5;
              padding: 20px;
              border-radius: 8px;
              min-height: 150px;
            }
          `
        }
      }
    });
  };

  // Custom Blocks Definition
  const addCustomBlocks = (editor) => {
    const blockManager = editor.BlockManager;

    // Button Block
    blockManager.add('button', {
      label: 'Button',
      category: 'Basic',
      content: { type: 'button' },
      media: `<svg viewBox="0 0 24 24" width="100%"><rect x="4" y="9" width="16" height="6" rx="2" fill="currentColor"/></svg>`
    });

    // Hero Section Block
    blockManager.add('hero', {
      label: 'Hero Section',
      category: 'Sections',
      content: { type: 'hero' },
      media: `<svg viewBox="0 0 24 24" width="100%"><rect x="2" y="4" width="20" height="16" rx="2" fill="currentColor"/></svg>`
    });

    // Card Block
    blockManager.add('card', {
      label: 'Card',
      category: 'Components',
      content: { type: 'card' },
      media: `<svg viewBox="0 0 24 24" width="100%"><rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor"/><rect x="6" y="6" width="12" height="6" fill="white"/></svg>`
    });

    // Navbar Block
    blockManager.add('navbar', {
      label: 'Navigation Bar',
      category: 'Sections',
      content: { type: 'navbar' },
      media: `<svg viewBox="0 0 24 24" width="100%"><rect x="2" y="4" width="20" height="3" rx="1" fill="currentColor"/></svg>`
    });

    // Footer Block
    blockManager.add('footer', {
      label: 'Footer',
      category: 'Sections',
      content: { type: 'footer' },
      media: `<svg viewBox="0 0 24 24" width="100%"><rect x="2" y="17" width="20" height="3" rx="1" fill="currentColor"/></svg>`
    });

    // Feature Box Block
    blockManager.add('feature-box', {
      label: 'Feature Box',
      category: 'Components',
      content: { type: 'feature-box' },
      media: `<svg viewBox="0 0 24 24" width="100%"><circle cx="12" cy="9" r="3" fill="currentColor"/><rect x="6" y="14" width="12" height="2" rx="1" fill="currentColor"/></svg>`
    });

    // Container Block
    blockManager.add('container', {
      label: 'Container',
      category: 'Layout',
      content: { type: 'container' },
      media: `<svg viewBox="0 0 24 24" width="100%"><rect x="3" y="3" width="18" height="18" rx="1" fill="none" stroke="currentColor" stroke-width="2"/></svg>`
    });

    // Grid Block
    blockManager.add('grid', {
      label: 'Grid Layout',
      category: 'Layout',
      content: { type: 'grid' },
      media: `<svg viewBox="0 0 24 24" width="100%"><rect x="2" y="2" width="8" height="8" fill="currentColor"/><rect x="14" y="2" width="8" height="8" fill="currentColor"/><rect x="2" y="14" width="8" height="8" fill="currentColor"/></svg>`
    });

    // Divider Block
    blockManager.add('divider', {
      label: 'Divider',
      category: 'Basic',
      content: '<hr style="border: 1px solid #e0e0e0; margin: 20px 0;">',
      media: `<svg viewBox="0 0 24 24" width="100%"><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2"/></svg>`
    });

    // Spacer Block
    blockManager.add('spacer', {
      label: 'Spacer',
      category: 'Basic',
      content: '<div style="height: 50px;"></div>',
      media: `<svg viewBox="0 0 24 24" width="100%"><rect x="10" y="2" width="4" height="20" fill="currentColor" opacity="0.3"/></svg>`
    });
  };

  const applyDarkTheme = () => {
    const style = document.createElement('style');
    style.innerHTML = `
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
        min-height: 80px;
        width: 100%;
        margin-bottom: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10px;
      }
      #gjs-blocks .gjs-block:hover {
        background-color: #3a3a3a;
        border-color: #1976d2;
      }
      
      #gjs-blocks .gjs-block-label { 
        color: #e0e0e0;
        font-size: 12px;
        margin-top: 5px;
      }
      
      #gjs-blocks .gjs-block svg {
        width: 40px;
        height: 40px;
        color: #1976d2;
      }
      
      #gjs-blocks .gjs-block-category {
        border-bottom: 1px solid #2a2a2a;
      }
      
      #gjs-blocks .gjs-block-category .gjs-title {
        background-color: #0d0d0d;
        color: #b0b0b0;
        padding: 8px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
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
      
      #gjs-editor-workspace .gjs-cv-canvas {
        background-color: #2a2a2a;
        width: 100%;
        height: 100%;
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
  };

  // Load page data when active page changes
  useEffect(() => {
    const gjs = editorInstanceRef.current;
    if (gjs && activePage) {
      try {
        if (activePage.gjsData) {
          const data = JSON.parse(activePage.gjsData);
          gjs.loadProjectData(data);
        } else {
          gjs.loadProjectData({
            assets: [],
            styles: [],
            pages: [{
              frames: [{
                component: {
                  type: 'wrapper',
                  components: []
                }
              }]
            }]
          });
        }
      } catch (error) {
        console.error('Error loading page:', error);
      }
    }
  }, [activePage]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const gjs = editorInstanceRef.current;
    if (!gjs || !activeProjectId || !activePage) return;

    const autoSaveInterval = setInterval(() => {
      const projectData = gjs.getProjectData();
      dispatch(savePageData({
        projectId: activeProjectId,
        pageId: activePage.id,
        gjsData: JSON.stringify(projectData)
      }));
      console.log('Auto-saved page:', activePage.name);
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [activeProjectId, activePage, dispatch]);

  // Handle custom events from EditorPage
  useEffect(() => {
    const gjs = editorInstanceRef.current;
    if (!gjs) return;

    const handleManualSave = () => {
      if (activeProjectId && activePage) {
        const projectData = gjs.getProjectData();
        dispatch(savePageData({
          projectId: activeProjectId,
          pageId: activePage.id,
          gjsData: JSON.stringify(projectData)
        }));
        console.log('Page manually saved!');
      }
    };

    const handleExportHTML = () => {
      const html = gjs.getHtml();
      const css = gjs.getCss();

      const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${activePage?.name || 'Exported Page'}</title>
    <style>${css}</style>
</head>
<body>
    ${html}
</body>
</html>`;

      const blob = new Blob([fullHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${activePage?.name || 'page'}.html`;
      link.click();
      URL.revokeObjectURL(url);
    };

    const handleDeviceChange = (event) => {
      const device = event.detail;
      gjs.setDevice(device);
    };

    const handleToggleBorders = () => {
      gjs.runCommand('sw-visibility');
    };

    window.addEventListener('manual-save', handleManualSave);
    window.addEventListener('export-html', handleExportHTML);
    window.addEventListener('change-device', handleDeviceChange);
    window.addEventListener('toggle-borders', handleToggleBorders);

    return () => {
      window.removeEventListener('manual-save', handleManualSave);
      window.removeEventListener('export-html', handleExportHTML);
      window.removeEventListener('change-device', handleDeviceChange);
      window.removeEventListener('toggle-borders', handleToggleBorders);
    };
  }, [activeProjectId, activePage, dispatch]);

  if (!project) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#2a2a2a'
        }}
      >
        <Typography variant="h6" sx={{ color: '#808080' }}>
          No project selected. Create or select a project to begin.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#2a2a2a'
      }}
    >
      <div
        ref={editorRef}
        id="gjs-editor-workspace"
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
};