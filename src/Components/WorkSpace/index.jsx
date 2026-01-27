import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { Box, CircularProgress, Typography, TextField, InputAdornment, IconButton, Paper } from '@mui/material';
import { AutoAwesome, Send } from '@mui/icons-material';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import { useUpdatePageWithAI, useUpdateProject } from '../../Hooks/projects';
import { showToast } from '../../Utils/toast';

export const Workspace = forwardRef(({ project }, ref) => {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const { updateProject } = useUpdateProject();

  const pageDataStore = useRef({});
  const currentPageIdRef = useRef(null);
  const isSavingRef = useRef(false);
  const lastProjectIdRef = useRef(null);

  const [editorReady, setEditorReady] = useState(false);

  const { updatePageWithAI, loading: aiLoading } = useUpdatePageWithAI();
  const [aiPrompt, setAiPrompt] = useState('');

  useImperativeHandle(ref, () => ({
    getEditor: () => editorInstanceRef.current,
    saveCurrentPage: () => saveCurrentPage()
  }));

 /**
 * ✅ AI SUBMIT HANDLER - FIXED WITH VALIDATION
 */
const handleAiSubmit = async () => {
  if (!aiPrompt.trim() || aiLoading || !editorReady || !editorInstanceRef.current) {
    console.log('❌ AI submit blocked:', {
      hasPrompt: !!aiPrompt.trim(),
      aiLoading,
      editorReady,
      hasEditor: !!editorInstanceRef.current
    });
    return;
  }

  const editor = editorInstanceRef.current;
  const currentPageId = currentPageIdRef.current;

  // ✅ CRITICAL: Validate we have required data
  if (!project?.id) {
    showToast.error('No project loaded');
    console.error('❌ Missing project ID');
    return;
  }

  if (!currentPageId) {
    showToast.error('No active page selected');
    console.error('❌ Missing page ID');
    return;
  }

  console.log('🤖 Submitting AI request:', {
    projectId: project.id,
    pageId: currentPageId,
    prompt: aiPrompt.trim(),
    projectType: typeof project.id,
    pageIdType: typeof currentPageId
  });

  try {
    const result = await updatePageWithAI({
      projectId: project.id,
      pageId: currentPageId,
      prompt: aiPrompt.trim(),
      files: [] // Add file upload functionality later if needed
    });

    if (result) {
      console.log('✅ AI Update Result:', result);

      // Clear the prompt input
      setAiPrompt('');

      // Update the editor with new content
      if (result.gjsData) {
        console.log('📄 Updating editor with AI-generated content');

        // Clear current editor content
        editor.setComponents('');
        editor.setStyle('');

        // Extract and load HTML content
        let htmlToLoad = '';
        
        if (result.gjsData.html && result.gjsData.html.trim()) {
          const html = result.gjsData.html.trim();

          // Check if it's a full HTML document
          if (html.includes('<!DOCTYPE') || html.includes('<html')) {
            console.log('📋 Extracting body from full HTML document');
            const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            if (bodyMatch && bodyMatch[1]) {
              htmlToLoad = bodyMatch[1].trim();
            } else {
              htmlToLoad = html;
            }
          } else {
            htmlToLoad = html;
          }
        }

        // Load HTML content
        if (htmlToLoad) {
          console.log('📝 Setting HTML content');
          editor.setComponents(htmlToLoad);
        } else if (result.gjsData.components && result.gjsData.components.length > 0) {
          console.log('🧩 Setting components');
          editor.setComponents(result.gjsData.components);
        }

        // Extract and load CSS
        let cssToLoad = result.gjsData.css || '';
        if (!cssToLoad && result.gjsData.html) {
          const styleMatch = result.gjsData.html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
          if (styleMatch && styleMatch[1]) {
            cssToLoad = styleMatch[1].trim();
            console.log('✅ Extracted CSS from style tag');
          }
        }

        // Load CSS
        if (cssToLoad && cssToLoad.trim()) {
          console.log('🎨 Setting CSS');
          editor.setStyle(cssToLoad);
        } else if (result.gjsData.styles && result.gjsData.styles.length > 0) {
          console.log('🎨 Setting styles');
          editor.setStyle(result.gjsData.styles);
        }

        // Update cache
        pageDataStore.current[currentPageId] = {
          html: htmlToLoad || editor.getHtml() || '',
          css: cssToLoad || editor.getCss() || '',
          components: result.gjsData.components || [],
          styles: result.gjsData.styles || []
        };

        // Save the updated page
        await saveCurrentPage();

        showToast.success('Page updated with AI!');
      } else {
        console.warn('⚠️ No gjsData in AI response');
        showToast.warning('AI response received but no content generated');
      }
    } else {
      console.error('❌ No result from AI update');
    }
  } catch (error) {
    console.error('❌ AI update failed:', error);
    // Error is already handled in the hook, but we can add additional handling here if needed
  }
};

  const saveCurrentPage = async () => {
    if (!editorInstanceRef.current || !project || !currentPageIdRef.current || isSavingRef.current) {
      return;
    }

    isSavingRef.current = true;
    const editor = editorInstanceRef.current;
    const pageId = currentPageIdRef.current;

    try {
      console.log('💾 Saving page:', pageId);

      const gjsData = {
        html: editor.getHtml() || '',
        css: editor.getCss() || '',
        components: editor.getComponents().toJSON(),
        styles: editor.getStyle().toJSON()
      };

      pageDataStore.current[pageId] = gjsData;

      const currentPages = project.data?.pages || {};
      const updatedPages = {
        ...currentPages,
        [pageId]: {
          ...currentPages[pageId],
          gjsData: gjsData,
          updatedAt: Date.now()
        }
      };

      const updatePayload = {
        pages: updatedPages
      };

      await updateProject(project.id, updatePayload);
      console.log('✅ Save successful');

    } catch (error) {
      console.error('❌ Save error:', error);
      if (!error.message?.includes('Validation')) {
        showToast.error('Failed to save: ' + error.message);
      }
    } finally {
      isSavingRef.current = false;
    }
  };

  /**
   * ✅ LOAD PAGE INTO EDITOR
   */
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

    console.log('📄 Loading page:', {
      id: page.id,
      name: page.name,
      hasGjsData: !!page.gjsData
    });

    // Save current page before switching
    if (currentPageIdRef.current && currentPageIdRef.current !== pageId) {
      const currentData = {
        html: editor.getHtml() || '',
        css: editor.getCss() || '',
        components: editor.getComponents().toJSON(),
        styles: editor.getStyle().toJSON()
      };
      pageDataStore.current[currentPageIdRef.current] = currentData;
    }

    currentPageIdRef.current = pageId;

    // Clear editor
    editor.setComponents('');
    editor.setStyle('');

    // Strategy 1: Load from cache
    if (pageDataStore.current[pageId]) {
      console.log('📂 Loading from cache');
      const cachedData = pageDataStore.current[pageId];

      try {
        if (cachedData.html) editor.setComponents(cachedData.html);
        if (cachedData.css) editor.setStyle(cachedData.css);
        console.log('✅ Loaded from cache');
        return;
      } catch (error) {
        console.error('❌ Error loading from cache:', error);
      }
    }

    // Strategy 2: Load from gjsData
    const gjsData = page.gjsData;

    // ✅ CRITICAL: Check if gjsData actually has content (not just empty strings)
    const hasActualHtml = gjsData?.html && gjsData.html.trim().length > 0;
    const hasActualCss = gjsData?.css && gjsData.css.trim().length > 0;
    const hasActualComponents = gjsData?.components && gjsData.components.length > 0;
    const hasAnyContent = hasActualHtml || hasActualCss || hasActualComponents;

    console.log('🔍 Checking gjsData:', {
      hasGjsData: !!gjsData,
      hasActualHtml,
      hasActualCss,
      hasActualComponents,
      hasAnyContent,
      htmlLength: gjsData?.html?.length || 0,
      htmlPreview: gjsData?.html?.substring(0, 100)
    });

    if (gjsData && hasAnyContent) {
      console.log('🤖 Loading from gjsData');
      console.log('📄 gjsData content:', {
        hasHtml: hasActualHtml,
        htmlLength: gjsData.html?.length || 0,
        htmlPreview: gjsData.html?.substring(0, 200),
        hasCss: hasActualCss,
        cssLength: gjsData.css?.length || 0,
        hasComponents: hasActualComponents
      });

      try {
        let htmlToLoad = '';

        // ✅ Extract body content if it's a full HTML document
        if (gjsData.html && gjsData.html.trim()) {
          const html = gjsData.html.trim();

          // Check if it's a full HTML document
          if (html.includes('<!DOCTYPE') || html.includes('<html')) {
            console.log('📋 Extracting body from full HTML document');
            // Extract content between <body> tags
            const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            if (bodyMatch && bodyMatch[1]) {
              htmlToLoad = bodyMatch[1].trim();
              console.log('✅ Extracted body content:', htmlToLoad.substring(0, 100));
            } else {
              // Fallback: use the HTML as-is
              htmlToLoad = html;
            }
          } else {
            htmlToLoad = html;
          }
        }

        // Load HTML (prioritize extracted body, then components)
        if (htmlToLoad) {
          console.log('📝 Setting HTML content');
          editor.setComponents(htmlToLoad);
        } else if (gjsData.components && gjsData.components.length > 0) {
          console.log('🧩 Setting components');
          editor.setComponents(gjsData.components);
        }

        // ✅ Extract CSS from <style> tags if needed
        let cssToLoad = gjsData.css || '';
        if (!cssToLoad && gjsData.html) {
          const styleMatch = gjsData.html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
          if (styleMatch && styleMatch[1]) {
            cssToLoad = styleMatch[1].trim();
            console.log('✅ Extracted CSS from style tag');
          }
        }

        // Load CSS
        if (cssToLoad && cssToLoad.trim()) {
          console.log('🎨 Setting CSS');
          editor.setStyle(cssToLoad);
        } else if (gjsData.styles && gjsData.styles.length > 0) {
          console.log('🎨 Setting styles');
          editor.setStyle(gjsData.styles);
        }

        // Cache the processed data
        pageDataStore.current[pageId] = {
          html: htmlToLoad || editor.getHtml() || '',
          css: cssToLoad || editor.getCss() || '',
          components: gjsData.components || [],
          styles: gjsData.styles || []
        };

        console.log('✅ Loaded from gjsData');
        return;
      } catch (error) {
        console.error('❌ Error loading gjsData:', error);
        console.error('Error details:', error.message, error.stack);
      }
    }

    // Strategy 3: Load from direct page properties
    if (page.html || page.css) {
      console.log('📋 Loading from page properties');

      try {
        if (page.html) editor.setComponents(page.html);
        if (page.css) editor.setStyle(page.css);

        pageDataStore.current[pageId] = {
          html: page.html || '',
          css: page.css || '',
          components: [],
          styles: []
        };

        console.log('✅ Loaded from page properties');
        return;
      } catch (error) {
        console.error('❌ Error loading page properties:', error);
      }
    }

    // Strategy 4: Default content
    console.log('📝 Loading default content for:', page.name);
    loadDefaultPageContent(editor, page.name);
  };

  /**
   * ✅ LOAD DEFAULT PAGE CONTENT
   */
  const loadDefaultPageContent = (editor, pageName) => {
    const html = `
      <div style="padding: 80px 20px; text-align: center; min-height: 500px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <h1 style="color: white; font-size: 56px; margin-bottom: 24px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${pageName}</h1>
        <p style="color: rgba(255,255,255,0.95); font-size: 20px; max-width: 700px; line-height: 1.8; margin-bottom: 32px;">Start building your page by dragging blocks from the left panel or use the AI prompt below to generate content automatically.</p>
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; backdrop-filter: blur(10px);">
          <p style="color: white; font-size: 16px; margin: 0;">✨ Tip: Use the blocks panel to add sections, or describe what you want with AI!</p>
        </div>
      </div>
    `;

    editor.setComponents(html);

    pageDataStore.current[currentPageIdRef.current] = {
      html: html,
      css: '',
      components: [],
      styles: []
    };
  };

  /**
   * ✅ CLEANUP WHEN PROJECT CHANGES
   */
  useEffect(() => {
    const projectId = project?.id;
    const hasProjectChanged = lastProjectIdRef.current !== projectId;

    if (!hasProjectChanged) {
      return; // Same project, no cleanup needed
    }

    console.log('🔄 Project changed, cleaning up', {
      old: lastProjectIdRef.current,
      new: projectId
    });

    // Destroy old editor
    if (editorInstanceRef.current) {
      try {
        if (currentPageIdRef.current) {
          saveCurrentPage();
        }
        editorInstanceRef.current.destroy();
      } catch (e) {
        console.warn('Error destroying editor:', e);
      }
      editorInstanceRef.current = null;
    }

    // Reset state
    lastProjectIdRef.current = projectId;
    setEditorReady(false);
    pageDataStore.current = {};
    currentPageIdRef.current = null;
  }, [project?.id]);

  /**
   * ✅ INITIALIZE GRAPESJS - SIMPLIFIED TO PREVENT STUCK INITIALIZATION
   */
  useEffect(() => {
    // Guard: No project
    if (!project) {
      console.log('⏸️ No project, skipping init');
      return;
    }

    // Guard: Editor already exists
    if (editorInstanceRef.current) {
      console.log('⏸️ Editor already exists, skipping init');
      return;
    }

    // Guard: Wrong project (cleaned up but effect still running)
    if (lastProjectIdRef.current !== project.id) {
      console.log('⏸️ Stale effect for different project, skipping');
      return;
    }

    console.log('🎨 Initializing GrapeJS for project:', project.id);

    let mounted = true;

    // Small delay to ensure DOM is ready
    const initTimeout = setTimeout(() => {
      if (!mounted) {
        console.log('⏸️ Component unmounted, canceling init');
        return;
      }

      try {
        const container = document.getElementById('gjs-editor');
        if (!container) {
          console.error('❌ Editor container not found');
          return;
        }

        const editor = grapesjs.init({
          container: '#gjs-editor',
          height: '100%',
          width: '100%',
          storageManager: false,
          fromElement: false,
          blockManager: { appendTo: '#gjs-blocks' },
          styleManager: {
            appendTo: '#gjs-styles',
            sectors: [
              {
                name: 'General',
                open: true,
                buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom']
              },
              {
                name: 'Typography',
                open: true,
                buildProps: [
                  'font-family', 'font-size', 'font-weight', 'letter-spacing',
                  'color', 'line-height', 'text-align', 'text-decoration',
                  'font-style', 'text-shadow', 'text-transform'
                ]
              },
              {
                name: 'Decorations',
                open: true,
                buildProps: [
                  'background-color', 'background', 'border-radius', 'border',
                  'box-shadow', 'background-image', 'background-size',
                  'background-position', 'background-repeat', 'opacity'
                ]
              },
              {
                name: 'Dimension',
                open: false,
                buildProps: [
                  'width', 'height', 'max-width', 'min-width', 'max-height',
                  'min-height', 'margin', 'padding'
                ]
              },
              {
                name: 'Flex',
                open: false,
                buildProps: [
                  'flex-direction', 'flex-wrap', 'justify-content', 'align-items',
                  'align-content', 'order', 'flex-basis', 'flex-grow', 'flex-shrink',
                  'align-self'
                ]
              },
              {
                name: 'Extra',
                open: false,
                buildProps: ['transition', 'perspective', 'transform', 'cursor', 'overflow', 'z-index']
              }
            ]
          },
          layerManager: { appendTo: '#gjs-layers' },
          traitManager: { appendTo: '#gjs-traits' },
          selectorManager: { appendTo: '#gjs-selectors' },
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
            [gjsBlocksBasic]: { flexGrid: true }
          },
          canvas: {
            styles: ['https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'],
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

        if (!mounted) {
          editor.destroy();
          return;
        }

        editorInstanceRef.current = editor;
        console.log('✅ Editor instance created');

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
            border-color: #667eea;
          }
        `;
        document.head.appendChild(style);

        // Load initial page
        const pages = project.data?.pages || {};
        const initialPageId = project.data?.activePageId || Object.keys(pages)[0];

        console.log('📄 Loading initial page:', initialPageId);

        if (initialPageId && pages[initialPageId]) {
          loadPage(initialPageId, pages);
        } else {
          console.warn('⚠️ No valid initial page, loading default');
          loadDefaultPageContent(editor, 'Home');
          currentPageIdRef.current = initialPageId || 'page-1';
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

        // Auto-save
        let saveTimeout;
        editor.on('component:update', () => {
          clearTimeout(saveTimeout);
          saveTimeout = setTimeout(() => {
            saveCurrentPage();
          }, 5000);
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
          await saveCurrentPage();
          const pages = project.data?.pages || {};
          loadPage(pageId, pages);
        };

        window.addEventListener('manual-save', handleManualSave);
        window.addEventListener('export-html', handleExportHTML);
        window.addEventListener('change-device', handleDeviceChange);
        window.addEventListener('toggle-borders', handleToggleBorders);
        window.addEventListener('change-page', handlePageChange);

        console.log('✅ Editor ready');
        setEditorReady(true);

        return () => {
          clearTimeout(saveTimeout);
          window.removeEventListener('manual-save', handleManualSave);
          window.removeEventListener('export-html', handleExportHTML);
          window.removeEventListener('change-device', handleDeviceChange);
          window.removeEventListener('toggle-borders', handleToggleBorders);
          window.removeEventListener('change-page', handlePageChange);
        };
      } catch (error) {
        console.error('❌ Failed to initialize GrapeJS:', error);
        setEditorReady(false);
      }
    }, 100);

    return () => {
      mounted = false;
      clearTimeout(initTimeout);
    };
  }, [project?.id]);

  if (!project) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#1e1e1e', color: 'white', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">No project selected</Typography>
        <Typography variant="body2" color="#808080">
          Please select or create a project to continue
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#1e1e1e', overflow: 'hidden' }}>
      <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div id="gjs-editor" style={{ height: '100%', width: '100%' }} />

        {!editorReady && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.8)',
            zIndex: 9999,
            flexDirection: 'column',
            gap: 2
          }}>
            <CircularProgress size={60} sx={{ color: '#667eea' }} />
            <Typography variant="h6" color="#e0e0e0">
              Initializing editor...
            </Typography>
            <Typography variant="body2" color="#808080">
              {project.name}
            </Typography>
          </Box>
        )}
      </Box>

      <Paper elevation={4} sx={{ p: 2, borderTop: '2px solid #667eea', bgcolor: '#0F172A', borderRadius: 0 }}>
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
          disabled={aiLoading || !editorReady}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AutoAwesome sx={{ color: '#667eea' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleAiSubmit}
                  disabled={!aiPrompt.trim() || aiLoading || !editorReady}
                  size="small"
                  sx={{
                    bgcolor: '#667eea',
                    color: 'white',
                    '&:hover': { bgcolor: '#764ba2' },
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
              '&:hover fieldset': { borderColor: '#667eea' },
              '&.Mui-focused fieldset': { borderColor: '#667eea' }
            },
            '& .MuiInputBase-input::placeholder': { color: '#808080', opacity: 1 }
          }}
        />
      </Paper>
    </Box>
  );
});

Workspace.displayName = 'Workspace';