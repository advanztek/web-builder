import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import { saveProjectData, updateProjectName } from '../../Store/slices/projectsSlice';

const GrapeJSBuilder = () => {
    const dispatch = useDispatch();
    const editorRef = useRef(null);
    const [editor, setEditor] = useState(null);
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

    const activeProjectId = useSelector(state => state.projects.activeProjectId);
    const activeProject = useSelector(state =>
        activeProjectId ? state.projects.projects[activeProjectId] : null
    );

    // Initialize GrapeJS
    useEffect(() => {
        if (!editorRef.current || editor) return;

        const gjs = grapesjs.init({
            container: editorRef.current,
            height: '100vh',
            width: 'auto',
            storageManager: false, // We'll handle storage with Redux
            plugins: [gjsPresetWebpage, gjsBlocksBasic],
            pluginsOpts: {
                gjsPresetWebpage: {
                    blocksBasicOpts: {
                        blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video'],
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
                appendTo: '#blocks',
            },
            styleManager: {
                appendTo: '#styles-container',
                sectors: [{
                    name: 'General',
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
                }]
            },
            layerManager: {
                appendTo: '#layers-container'
            },
            traitManager: {
                appendTo: '#traits-container',
            },
            selectorManager: {
                appendTo: '#selectors-container'
            },
            panels: {
                defaults: [{
                    id: 'basic-actions',
                    el: '.panel__basic-actions',
                    buttons: [{
                        id: 'visibility',
                        active: true,
                        className: 'btn-toggle-borders',
                        label: '<i class="fa fa-clone"></i>',
                        command: 'sw-visibility',
                    }]
                }, {
                    id: 'panel-devices',
                    el: '.panel__devices',
                    buttons: [{
                        id: 'device-desktop',
                        label: '<i class="fa fa-desktop"></i>',
                        command: 'set-device-desktop',
                        active: true,
                        togglable: false,
                    }, {
                        id: 'device-mobile',
                        label: '<i class="fa fa-mobile"></i>',
                        command: 'set-device-mobile',
                        togglable: false,
                    }]
                }]
            },
            deviceManager: {
                devices: [{
                    name: 'Desktop',
                    width: '',
                }, {
                    name: 'Mobile',
                    width: '320px',
                    widthMedia: '480px',
                }]
            }
        });

        // Add custom commands
        gjs.Commands.add('set-device-desktop', {
            run: editor => editor.setDevice('Desktop')
        });

        gjs.Commands.add('set-device-mobile', {
            run: editor => editor.setDevice('Mobile')
        });

        setEditor(gjs);

        // Cleanup
        return () => {
            if (gjs) {
                gjs.destroy();
            }
        };
    }, []);

    // Load project data when active project changes
    useEffect(() => {
        if (editor && activeProject && activeProject.gjsData) {
            try {
                const data = JSON.parse(activeProject.gjsData);
                editor.loadProjectData(data);
            } catch (error) {
                console.error('Error loading project data:', error);
            }
        } else if (editor && activeProject && !activeProject.gjsData) {

            editor.loadProjectData({
                assets: [],
                styles: [],
                pages: [{
                    frames: [{
                        component: {
                            type: 'wrapper',
                            stylable: [
                                'background', 'background-color', 'background-image',
                                'background-repeat', 'background-attachment', 'background-position', 'background-size'
                            ],
                            components: []
                        }
                    }]
                }]
            });
        }
    }, [editor, activeProject]);

    // Auto-save functionality
    useEffect(() => {
        if (!editor || !activeProjectId || !autoSaveEnabled) return;

        const autoSaveInterval = setInterval(() => {
            handleSave();
        }, 30000); // Auto-save every 30 seconds

        return () => clearInterval(autoSaveInterval);
    }, [editor, activeProjectId, autoSaveEnabled]);

    // Manual save function
    const handleSave = () => {
        if (editor && activeProjectId) {
            const projectData = editor.getProjectData();
            dispatch(saveProjectData({
                projectId: activeProjectId,
                gjsData: JSON.stringify(projectData)
            }));
            console.log('Project saved successfully!');
        }
    };

    // Export HTML
    const handleExportHTML = () => {
        if (editor) {
            const html = editor.getHtml();
            const css = editor.getCss();

            const fullHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${activeProject?.name || 'Exported Page'}</title>
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
            link.download = `${activeProject?.name || 'page'}.html`;
            link.click();
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Top Toolbar */}
            <div style={{
                backgroundColor: '#444',
                padding: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ color: 'white', fontSize: '18px' }}>
                    {activeProject?.name || 'No Project Selected'}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input
                            type="checkbox"
                            checked={autoSaveEnabled}
                            onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                        />
                        Auto-save
                    </label>

                    <button
                        onClick={handleSave}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#5cb85c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Save
                    </button>

                    <button
                        onClick={handleExportHTML}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#0275d8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Export HTML
                    </button>
                </div>
            </div>

            {/* Editor Container */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Panels */}
                <div style={{ width: '250px', backgroundColor: '#f8f9fa', overflowY: 'auto' }}>
                    <div className="panel__basic-actions"></div>
                    <div className="panel__devices"></div>
                    <div id="blocks"></div>
                </div>

                {/* Main Canvas */}
                <div ref={editorRef} style={{ flex: 1 }}></div>

                {/* Right Sidebar */}
                <div style={{ width: '300px', backgroundColor: '#f8f9fa', overflowY: 'auto', padding: '10px' }}>
                    <div id="selectors-container"></div>
                    <div id="traits-container"></div>
                    <div id="styles-container"></div>
                    <div id="layers-container"></div>
                </div>
            </div>
        </div>
    );
};

export default GrapeJSBuilder;