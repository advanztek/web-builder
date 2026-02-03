import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsBlocksBasic from 'grapesjs-blocks-basic';

export const EDITOR_CONFIG = {
    container: '#gjs-editor',
    height: '100%',
    width: '100%',
    storageManager: false,
    fromElement: false,

    blockManager: { appendTo: '#gjs-blocks' },
    layerManager: { appendTo: '#gjs-layers' },
    traitManager: { appendTo: '#gjs-traits' },
    selectorManager: { appendTo: '#gjs-selectors' },

    styleManager: {
        appendTo: '#gjs-styles',
        sectors: [
            { name: 'General', open: true, buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'] },
            { name: 'Typography', open: true, buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'font-style', 'text-shadow', 'text-transform'] },
            { name: 'Decorations', open: true, buildProps: ['background-color', 'background', 'border-radius', 'border', 'box-shadow', 'background-image', 'background-size', 'background-position', 'background-repeat', 'opacity'] },
            { name: 'Dimension', open: false, buildProps: ['width', 'height', 'max-width', 'min-width', 'max-height', 'min-height', 'margin', 'padding'] },
            { name: 'Flex', open: false, buildProps: ['flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-content', 'order', 'flex-basis', 'flex-grow', 'flex-shrink', 'align-self'] },
            { name: 'Extra', open: false, buildProps: ['transition', 'perspective', 'transform', 'cursor', 'overflow', 'z-index'] },
        ],
    },

    assetManager: {
        upload: false,
        assets: [],
        multiUpload: true,
        uploadText: 'Drop files or click to upload',
    },

    plugins: [gjsPresetWebpage, gjsBlocksBasic],
    pluginsOpts: {
        [gjsPresetWebpage]: {
            blocksBasicOpts: {
                blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video', 'map'],
                flexGrid: true,
            },
            blocks: ['link-block', 'quote', 'text-basic'],
        },
        [gjsBlocksBasic]: { flexGrid: true },
    },

    canvas: {
        styles: ['https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'],
        scripts: [],
    },

    deviceManager: {
        devices: [
            { name: 'Desktop', width: '' },
            { name: 'Tablet', width: '768px', widthMedia: '992px' },
            { name: 'Mobile', width: '320px', widthMedia: '480px' },
        ],
    },
};