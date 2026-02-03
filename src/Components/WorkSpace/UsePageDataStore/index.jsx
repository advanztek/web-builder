import { useRef, useCallback } from 'react';
import { useUpdateProject }    from '../../../Hooks/projects';
import { showToast }           from '../../../Utils/toast';
import { extractBody, extractStyleTag } from '../HTMLHelpers';


export function usePageDataStore() {
  const { updateProject } = useUpdateProject();

  const pageDataStore    = useRef({});
  const currentPageIdRef = useRef(null);
  const isSavingRef      = useRef(false);

  // ── snapshot helper ──
  const snapshot = (editor) => ({
    html:       editor.getHtml()            || '',
    css:        editor.getCss()             || '',
    components: editor.getComponents().toJSON(),
    styles:     editor.getStyle().toJSON(),
  });

  // ── save ───
  const saveCurrentPage = useCallback(async (editor, project) => {
    if (!editor || !project || !currentPageIdRef.current || isSavingRef.current) return;

    isSavingRef.current = true;
    const pageId = currentPageIdRef.current;

    try {
      console.log('Saving page:', pageId);
      const gjsData = snapshot(editor);
      pageDataStore.current[pageId] = gjsData;

      const currentPages = project.data?.pages || {};
      await updateProject(project.id, {
        pages: {
          ...currentPages,
          [pageId]: { ...currentPages[pageId], gjsData, updatedAt: Date.now() },
        },
      });
      console.log('Save successful');
    } catch (error) {
      console.error('Save error:', error);
      if (!error.message?.includes('Validation')) showToast.error('Failed to save: ' + error.message);
    } finally {
      isSavingRef.current = false;
    }
  }, [updateProject]);

  // ── default content ──
  const loadDefaultPageContent = useCallback((editor, pageName) => {
    const html = `
      <div style="padding:80px 20px;text-align:center;min-height:500px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);">
        <h1 style="color:white;font-size:56px;margin-bottom:24px;font-weight:bold;text-shadow:0 2px 4px rgba(0,0,0,0.2);">${pageName}</h1>
        <p style="color:rgba(255,255,255,0.95);font-size:20px;max-width:700px;line-height:1.8;margin-bottom:32px;">Start building your page by dragging blocks or use the AI prompt below.</p>
        <div style="background:rgba(255,255,255,0.1);padding:20px;border-radius:8px;backdrop-filter:blur(10px);">
          <p style="color:white;font-size:16px;margin:0;">✨ Tip: Use the blocks panel or describe what you want with AI!</p>
        </div>
      </div>`;
    editor.setComponents(html);
    pageDataStore.current[currentPageIdRef.current] = { html, css: '', components: [], styles: [] };
  }, []);

  // ── load ──
  const loadPage = useCallback((pageId, pages, editor) => {
    if (!editor || !pages) { console.error('Editor or pages not available'); return; }
    const page = pages[pageId];
    if (!page)             { console.error('Page not found:', pageId);       return; }

    console.log('Loading page:', { id: page.id, name: page.name });

    // persist current before switching
    if (currentPageIdRef.current && currentPageIdRef.current !== pageId) {
      pageDataStore.current[currentPageIdRef.current] = snapshot(editor);
    }

    currentPageIdRef.current = pageId;
    editor.setComponents('');
    editor.setStyle('');

    // 1) cache
    if (pageDataStore.current[pageId]) {
      try {
        const c = pageDataStore.current[pageId];
        if (c.html) editor.setComponents(c.html);
        if (c.css)  editor.setStyle(c.css);
        console.log('Loaded from cache'); return;
      } catch (e) { console.error('cache error:', e); }
    }

    // 2) gjsData
    const g = page.gjsData;
    if (g && (g.html?.trim() || g.css?.trim() || g.components?.length)) {
      try {
        const htmlToLoad = g.html?.trim() ? extractBody(g.html) : '';
        if (htmlToLoad)                      editor.setComponents(htmlToLoad);
        else if (g.components?.length)       editor.setComponents(g.components);

        const cssToLoad = g.css?.trim() || extractStyleTag(g.html);
        if (cssToLoad)                       editor.setStyle(cssToLoad);
        else if (g.styles?.length)           editor.setStyle(g.styles);

        pageDataStore.current[pageId] = {
          html: htmlToLoad || editor.getHtml() || '', css: cssToLoad || editor.getCss() || '',
          components: g.components || [], styles: g.styles || [],
        };
        console.log('Loaded from gjsData'); return;
      } catch (e) { console.error('gjsData error:', e); }
    }

    // 3) bare props
    if (page.html || page.css) {
      try {
        if (page.html) editor.setComponents(page.html);
        if (page.css)  editor.setStyle(page.css);
        pageDataStore.current[pageId] = { html: page.html || '', css: page.css || '', components: [], styles: [] };
        console.log('Loaded from page props'); return;
      } catch (e) { console.error('page-props error:', e); }
    }

    // 4) fallback
    loadDefaultPageContent(editor, page.name);
  }, [loadDefaultPageContent]);

  return { pageDataStore, currentPageIdRef, isSavingRef, saveCurrentPage, loadPage, loadDefaultPageContent };
}