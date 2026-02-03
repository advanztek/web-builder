import { useState, useCallback } from 'react';
import { useUpdatePageWithAI } from '../../../Hooks/projects';
import { showToast } from '../../../Utils/toast';
import { extractBody, extractStyleTag } from '../HTMLHelpers';



export function useAiPrompt(editorRef, project, currentPageIdRef, saveCurrentPage, pageDataStore) {
    const { updatePageWithAI, loading: aiLoading } = useUpdatePageWithAI();
    const [aiPrompt, setAiPrompt] = useState('');

    // ── apply AI result into the live editor ──
    const applyContentToEditor = useCallback((editor, gjsData) => {
        editor.setComponents('');
        editor.setStyle('');

        const htmlToLoad = gjsData.html?.trim() ? extractBody(gjsData.html) : '';

        if (htmlToLoad) editor.setComponents(htmlToLoad);
        else if (gjsData.components?.length > 0) editor.setComponents(gjsData.components);

        const cssToLoad = gjsData.css?.trim() || extractStyleTag(gjsData.html);
        if (cssToLoad) editor.setStyle(cssToLoad);
        else if (gjsData.styles?.length > 0) editor.setStyle(gjsData.styles);

        // update in-memory cache
        pageDataStore.current[currentPageIdRef.current] = {
            html: htmlToLoad || editor.getHtml() || '',
            css: cssToLoad || editor.getCss() || '',
            components: gjsData.components || [],
            styles: gjsData.styles || [],
        };
        console.log('Updated page cache after AI:', { pageId: currentPageIdRef.current });
    }, [currentPageIdRef, pageDataStore]);

    // ── main submit ─
    const handleAiSubmit = useCallback(async () => {
        const editor = editorRef.current;
        if (!aiPrompt.trim() || aiLoading || !editor) return;
        if (!project?.id) { showToast.error('No project loaded'); return; }
        if (!currentPageIdRef.current) { showToast.error('No active page selected'); return; }

        const projectName = project.name || project.data?.name || project.data?.title || 'My Project';
        const websiteType = project.data?.websiteType || project.websiteType || 'landing-page';
        const theme = project.data?.theme || project.theme || {
            font: 'Inter', primaryColor: '#1976d2', secondaryColor: '#0F172A', backgroundColor: '#FFFFFF',
        };

        console.log('AI request:', { projectId: project.id, pageId: currentPageIdRef.current });

        try {
            const result = await updatePageWithAI({
                projectId: project.id, pageId: currentPageIdRef.current,
                prompt: aiPrompt.trim(), websiteName: projectName,
                websiteType, theme, files: [],
            });

            if (!result) { showToast.error('Failed to update page with AI'); return; }
            console.log('AI result:', result);
            setAiPrompt('');

            const content = result.gjsData || result;
            if (content.html || content.css || content.components) {
                applyContentToEditor(editor, content);
                await saveCurrentPage(editor, project);
                showToast.success('Page updated with AI and saved!');
            } else {
                showToast.warning('AI response received but no content generated');
            }
        } catch (error) {
            console.error('AI update failed:', error);
            showToast.error(error.message || 'Failed to update page with AI');
        }
    }, [aiPrompt, aiLoading, editorRef, project, currentPageIdRef, saveCurrentPage, applyContentToEditor]);

    return { aiPrompt, setAiPrompt, handleAiSubmit, aiLoading };
}