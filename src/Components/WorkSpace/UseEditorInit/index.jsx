import { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import { showToast } from '../../../Utils/toast';
import { DARK_THEME_CSS } from '../DarkThemeCss';
import { exportHTML } from '../HTMLHelpers';
import { EDITOR_CONFIG } from '../EditorConfig';
import { CUSTOM_BLOCKS } from '../CustomBlocks';


export function useEditorInit(project, loadPage, saveCurrentPage, currentPageIdRef) {
    const editorInstanceRef = useRef(null);
    const lastProjectIdRef = useRef(null);
    const [editorReady, setEditorReady] = useState(false);

    // ── destroy on project change ──
    useEffect(() => {
        if (lastProjectIdRef.current === project?.id) return;
        console.log('Project changed', { old: lastProjectIdRef.current, new: project?.id });

        if (editorInstanceRef.current) {
            try {
                if (currentPageIdRef.current) saveCurrentPage(editorInstanceRef.current, project);
                editorInstanceRef.current.destroy();
            } catch (e) { console.warn('Destroy warning:', e); }
            editorInstanceRef.current = null;
        }
        lastProjectIdRef.current = project?.id;
        setEditorReady(false);
    }, [project?.id]);                                    // eslint-disable-line

    // ── init ──
    useEffect(() => {
        if (!project || editorInstanceRef.current || lastProjectIdRef.current !== project.id) return;
        let mounted = true;

        const initTimeout = setTimeout(() => {
            if (!mounted) return;
            try {
                if (!document.getElementById('gjs-editor')) { console.error('#gjs-editor missing'); return; }

                const editor = grapesjs.init(EDITOR_CONFIG);
                if (!mounted) { editor.destroy(); return; }
                editorInstanceRef.current = editor;

                // strip default top-left icons
                editor.Panels.removeButton('options', 'sw-visibility');
                editor.Panels.removeButton('options', 'fullscreen');
                editor.Panels.removeButton('views', 'open-blocks');

                // register custom blocks + theme
                CUSTOM_BLOCKS.forEach(b => editor.BlockManager.add(b.id, b));
                const styleEl = document.createElement('style');
                styleEl.innerHTML = DARK_THEME_CSS;
                document.head.appendChild(styleEl);

                // load the first / active page
                const pages = project.data?.pages || {};
                const initialPageId = project.data?.activePageId || Object.keys(pages)[0];
                if (initialPageId && pages[initialPageId]) loadPage(initialPageId, pages, editor);

                // ── window events ─
                const onSave = () => saveCurrentPage(editor, project);
                const onExport = () => { exportHTML(editor, project); showToast.success('HTML exported!'); };
                const onDevice = (e) => editor.setDevice(e.detail);
                const onBorders = () => {
                    const c = editor.Commands;
                    c.isActive('sw-visibility') ? c.stop('sw-visibility') : c.run('sw-visibility');
                };
                const onPageChange = async (e) => {
                    await saveCurrentPage(editor, project);
                    loadPage(e.detail.pageId, project.data?.pages || {}, editor);
                };
                const onUseAsset = (e) => {
                    const { url, type } = e.detail;
                    editor.setComponents(
                        type === 'image'
                            ? `<img src="${url}" style="max-width:100%;">`
                            : `<video src="${url}" controls style="max-width:100%;"></video>`
                    );
                };

                window.addEventListener('manual-save', onSave);
                window.addEventListener('export-html', onExport);
                window.addEventListener('change-device', onDevice);
                window.addEventListener('toggle-borders', onBorders);
                window.addEventListener('change-page', onPageChange);
                window.addEventListener('use-asset', onUseAsset);

                // auto-save
                let saveTimeout;
                editor.on('component:update', () => {
                    clearTimeout(saveTimeout);
                    saveTimeout = setTimeout(() => saveCurrentPage(editor, project), 5000);
                });

                setEditorReady(true);
                console.log('Editor ready');

                // cleanup
                return () => {
                    clearTimeout(saveTimeout);
                    window.removeEventListener('manual-save', onSave);
                    window.removeEventListener('export-html', onExport);
                    window.removeEventListener('change-device', onDevice);
                    window.removeEventListener('toggle-borders', onBorders);
                    window.removeEventListener('change-page', onPageChange);
                    window.removeEventListener('use-asset', onUseAsset);
                };
            } catch (error) {
                console.error('GrapeJS init failed:', error);
                setEditorReady(false);
            }
        }, 100);

        return () => { mounted = false; clearTimeout(initTimeout); };
    }, [project?.id]);   // eslint-disable-line

    return { editorInstanceRef, editorReady };
}