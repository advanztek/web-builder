import React, { useState, useEffect } from 'react';
import {
    Box,
    Drawer,
    Typography,
    Divider,
    TextField,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
} from '@mui/material';
import {
    ExpandMore,
    Palette,
    FormatSize,
    BorderStyle,
    WidthFull,
    SpaceBar,
    Close,
} from '@mui/icons-material';

const PropSidebar = ({ open, onClose, editor }) => {
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [dimensions, setDimensions] = useState({ width: '100%', height: 'auto' });
    const [spacing, setSpacing] = useState({ padding: '0px', margin: '0px' });
    const [colors, setColors] = useState({ background: '#ffffff', text: '#000000' });
    const [typography, setTypography] = useState({
        fontFamily: 'Arial',
        fontSize: '16px',
        fontWeight: '400',
    });
    const [border, setBorder] = useState({
        borderRadius: '0px',
        borderWidth: '0px',
        opacity: '1',
    });

    useEffect(() => {
        if (!editor) return;

        const handleSelection = (component) => {
            setSelectedComponent(component);
            updatePropertiesFromComponent(component);
        };

        editor.on('component:selected', handleSelection);
        editor.on('component:update', () => {
            if (selectedComponent) {
                updatePropertiesFromComponent(selectedComponent);
            }
        });

        return () => {
            editor.off('component:selected', handleSelection);
        };
    }, [editor, selectedComponent]);

    const updatePropertiesFromComponent = (component) => {
        if (!component) return;

        const styles = component.getStyle();

        setDimensions({
            width: styles.width || '100%',
            height: styles.height || 'auto',
        });

        setSpacing({
            padding: styles.padding || '0px',
            margin: styles.margin || '0px',
        });

        setColors({
            background: styles['background-color'] || '#ffffff',
            text: styles.color || '#000000',
        });

        setTypography({
            fontFamily: styles['font-family'] || 'Arial',
            fontSize: styles['font-size'] || '16px',
            fontWeight: styles['font-weight'] || '400',
        });

        setBorder({
            borderRadius: styles['border-radius'] || '0px',
            borderWidth: styles['border-width'] || '0px',
            opacity: styles.opacity || '1',
        });
    };

    const handleDimensionChange = (property, value) => {
        if (!selectedComponent) return;
        setDimensions({ ...dimensions, [property]: value });
        selectedComponent.addStyle({ [property]: value });
    };

    const handleSpacingChange = (property, value) => {
        if (!selectedComponent) return;
        setSpacing({ ...spacing, [property]: value });
        selectedComponent.addStyle({ [property]: value });
    };

    const handleColorChange = (property, value) => {
        if (!selectedComponent) return;
        const styleProperty = property === 'background' ? 'background-color' : 'color';
        setColors({ ...colors, [property]: value });
        selectedComponent.addStyle({ [styleProperty]: value });
    };

    const handleTypographyChange = (property, value) => {
        if (!selectedComponent) return;
        const styleProperty =
            property === 'fontFamily'
                ? 'font-family'
                : property === 'fontSize'
                    ? 'font-size'
                    : 'font-weight';
        setTypography({ ...typography, [property]: value });
        selectedComponent.addStyle({ [styleProperty]: value });
    };

    const handleBorderChange = (property, value) => {
        if (!selectedComponent) return;
        const styleProperty =
            property === 'borderRadius'
                ? 'border-radius'
                : property === 'borderWidth'
                    ? 'border-width'
                    : 'opacity';
        setBorder({ ...border, [property]: value });
        selectedComponent.addStyle({ [styleProperty]: value });
    };

    const colorOptions = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
        '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#AAB7B8',
    ];

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            variant="persistent"
            sx={{
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 320,
                    boxSizing: 'border-box',
                    bgcolor: '#141924',
                    borderLeft: '1px solid #1f2937',
                    top: 0,
                    height: '100vh',
                    overflowY: 'auto',
                    position: 'fixed',
                    right: 0,
                    zIndex: 1300,
                    '&::-webkit-scrollbar': {
                        width: '7px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: '#0f1419',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#374151',
                        borderRadius: '4px',
                    },
                },
            }}
        >
            <Box sx={{ p: 2 }}>
                {/* Header with Close Button */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                        Properties
                    </Typography>
                    <IconButton 
                        onClick={onClose} 
                        size="small" 
                        sx={{ 
                            color: '#64748b',
                            '&:hover': { color: '#fff', bgcolor: '#1f2937' }
                        }}
                    >
                        <Close />
                    </IconButton>
                </Box>

                {!selectedComponent ? (
                    <Typography sx={{ color: '#64748b', textAlign: 'center', mt: 4 }}>
                        Select an element to edit its properties
                    </Typography>
                ) : (
                    <>
                        {/* Dimensions Section */}
                        <Accordion
                            defaultExpanded
                            sx={{
                                bgcolor: '#1a1f2e',
                                color: '#fff',
                                boxShadow: 'none',
                                '&:before': { display: 'none' },
                                mb: 1,
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMore sx={{ color: '#64748b' }} />}
                                sx={{
                                    '&:hover': { bgcolor: '#1f2937' },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <WidthFull sx={{ fontSize: 20, color: '#64748b' }} />
                                    <Typography>Dimensions</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextField
                                        label="Width"
                                        value={dimensions.width}
                                        onChange={(e) => handleDimensionChange('width', e.target.value)}
                                        size="small"
                                        fullWidth
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: '#fff',
                                                '& fieldset': { borderColor: '#374151' },
                                                '&:hover fieldset': { borderColor: '#4b5563' },
                                            },
                                            '& .MuiInputLabel-root': { color: '#64748b' },
                                        }}
                                    />
                                    <TextField
                                        label="Height"
                                        value={dimensions.height}
                                        onChange={(e) => handleDimensionChange('height', e.target.value)}
                                        size="small"
                                        fullWidth
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: '#fff',
                                                '& fieldset': { borderColor: '#374151' },
                                                '&:hover fieldset': { borderColor: '#4b5563' },
                                            },
                                            '& .MuiInputLabel-root': { color: '#64748b' },
                                        }}
                                    />
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        <Divider sx={{ my: 1, borderColor: '#1f2937' }} />

                        {/* Spacing Section */}
                        <Accordion
                            sx={{
                                bgcolor: '#1a1f2e',
                                color: '#fff',
                                boxShadow: 'none',
                                '&:before': { display: 'none' },
                                mb: 1,
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMore sx={{ color: '#64748b' }} />}
                                sx={{
                                    '&:hover': { bgcolor: '#1f2937' },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <SpaceBar sx={{ fontSize: 20, color: '#64748b' }} />
                                    <Typography>Spacing</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextField
                                        label="Padding"
                                        value={spacing.padding}
                                        onChange={(e) => handleSpacingChange('padding', e.target.value)}
                                        size="small"
                                        fullWidth
                                        placeholder="e.g., 10px or 10px 20px"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: '#fff',
                                                '& fieldset': { borderColor: '#374151' },
                                                '&:hover fieldset': { borderColor: '#4b5563' },
                                            },
                                            '& .MuiInputLabel-root': { color: '#64748b' },
                                        }}
                                    />
                                    <TextField
                                        label="Margin"
                                        value={spacing.margin}
                                        onChange={(e) => handleSpacingChange('margin', e.target.value)}
                                        size="small"
                                        fullWidth
                                        placeholder="e.g., 10px or 10px 20px"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: '#fff',
                                                '& fieldset': { borderColor: '#374151' },
                                                '&:hover fieldset': { borderColor: '#4b5563' },
                                            },
                                            '& .MuiInputLabel-root': { color: '#64748b' },
                                        }}
                                    />
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        <Divider sx={{ my: 1, borderColor: '#1f2937' }} />

                        {/* Colors Section */}
                        <Accordion
                            defaultExpanded
                            sx={{
                                bgcolor: '#1a1f2e',
                                color: '#fff',
                                boxShadow: 'none',
                                '&:before': { display: 'none' },
                                mb: 1,
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMore sx={{ color: '#64748b' }} />}
                                sx={{
                                    '&:hover': { bgcolor: '#1f2937' },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Palette sx={{ fontSize: 20, color: '#64748b' }} />
                                    <Typography>Colors</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box>
                                        <Typography sx={{ color: '#64748b', fontSize: 14, mb: 1 }}>
                                            Background Color
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                            {colorOptions.map((color, index) => (
                                                <Box
                                                    key={index}
                                                    onClick={() => handleColorChange('background', color)}
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        bgcolor: color,
                                                        borderRadius: 1,
                                                        cursor: 'pointer',
                                                        border: `2px solid ${colors.background === color ? '#2563eb' : '#374151'}`,
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            transform: 'scale(1.1)',
                                                            borderColor: '#2563eb',
                                                        },
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <input
                                                type="color"
                                                value={colors.background}
                                                onChange={(e) => handleColorChange('background', e.target.value)}
                                                style={{
                                                    width: '50px',
                                                    height: '40px',
                                                    border: '1px solid #374151',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    backgroundColor: 'transparent',
                                                }}
                                            />
                                            <TextField
                                                value={colors.background}
                                                onChange={(e) => handleColorChange('background', e.target.value)}
                                                size="small"
                                                fullWidth
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        color: '#fff',
                                                        '& fieldset': { borderColor: '#374151' },
                                                        '&:hover fieldset': { borderColor: '#4b5563' },
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ color: '#64748b', fontSize: 14, mb: 1 }}>
                                            Text Color
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <input
                                                type="color"
                                                value={colors.text}
                                                onChange={(e) => handleColorChange('text', e.target.value)}
                                                style={{
                                                    width: '50px',
                                                    height: '40px',
                                                    border: '1px solid #374151',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    backgroundColor: 'transparent',
                                                }}
                                            />
                                            <TextField
                                                value={colors.text}
                                                onChange={(e) => handleColorChange('text', e.target.value)}
                                                size="small"
                                                fullWidth
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        color: '#fff',
                                                        '& fieldset': { borderColor: '#374151' },
                                                        '&:hover fieldset': { borderColor: '#4b5563' },
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        <Divider sx={{ my: 1, borderColor: '#1f2937' }} />

                        {/* Typography Section */}
                        <Accordion
                            sx={{
                                bgcolor: '#1a1f2e',
                                color: '#fff',
                                boxShadow: 'none',
                                '&:before': { display: 'none' },
                                mb: 1,
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMore sx={{ color: '#64748b' }} />}
                                sx={{
                                    '&:hover': { bgcolor: '#1f2937' },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <FormatSize sx={{ fontSize: 20, color: '#64748b' }} />
                                    <Typography>Typography</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel sx={{ color: '#64748b' }}>Font Family</InputLabel>
                                        <Select
                                            value={typography.fontFamily}
                                            onChange={(e) => handleTypographyChange('fontFamily', e.target.value)}
                                            sx={{
                                                color: '#fff',
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#374151' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4b5563' },
                                                '& .MuiSvgIcon-root': { color: '#64748b' },
                                            }}
                                        >
                                            <MenuItem value="Arial">Arial</MenuItem>
                                            <MenuItem value="Helvetica">Helvetica</MenuItem>
                                            <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                                            <MenuItem value="Georgia">Georgia</MenuItem>
                                            <MenuItem value="Courier New">Courier New</MenuItem>
                                            <MenuItem value="Verdana">Verdana</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        label="Font Size"
                                        value={typography.fontSize}
                                        onChange={(e) => handleTypographyChange('fontSize', e.target.value)}
                                        size="small"
                                        fullWidth
                                        placeholder="e.g., 16px"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: '#fff',
                                                '& fieldset': { borderColor: '#374151' },
                                                '&:hover fieldset': { borderColor: '#4b5563' },
                                            },
                                            '& .MuiInputLabel-root': { color: '#64748b' },
                                        }}
                                    />
                                    <FormControl fullWidth size="small">
                                        <InputLabel sx={{ color: '#64748b' }}>Font Weight</InputLabel>
                                        <Select
                                            value={typography.fontWeight}
                                            onChange={(e) => handleTypographyChange('fontWeight', e.target.value)}
                                            sx={{
                                                color: '#fff',
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#374151' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4b5563' },
                                                '& .MuiSvgIcon-root': { color: '#64748b' },
                                            }}
                                        >
                                            <MenuItem value="300">Light (300)</MenuItem>
                                            <MenuItem value="400">Normal (400)</MenuItem>
                                            <MenuItem value="500">Medium (500)</MenuItem>
                                            <MenuItem value="600">Semi Bold (600)</MenuItem>
                                            <MenuItem value="700">Bold (700)</MenuItem>
                                            <MenuItem value="900">Black (900)</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        <Divider sx={{ my: 1, borderColor: '#1f2937' }} />

                        {/* Border & Effects Section */}
                        <Accordion
                            sx={{
                                bgcolor: '#1a1f2e',
                                color: '#fff',
                                boxShadow: 'none',
                                '&:before': { display: 'none' },
                                mb: 1,
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMore sx={{ color: '#64748b' }} />}
                                sx={{
                                    '&:hover': { bgcolor: '#1f2937' },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BorderStyle sx={{ fontSize: 20, color: '#64748b' }} />
                                    <Typography>Border & Effects</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextField
                                        label="Border Radius"
                                        value={border.borderRadius}
                                        onChange={(e) => handleBorderChange('borderRadius', e.target.value)}
                                        size="small"
                                        fullWidth
                                        placeholder="e.g., 4px"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: '#fff',
                                                '& fieldset': { borderColor: '#374151' },
                                                '&:hover fieldset': { borderColor: '#4b5563' },
                                            },
                                            '& .MuiInputLabel-root': { color: '#64748b' },
                                        }}
                                    />
                                    <TextField
                                        label="Border Width"
                                        value={border.borderWidth}
                                        onChange={(e) => handleBorderChange('borderWidth', e.target.value)}
                                        size="small"
                                        fullWidth
                                        placeholder="e.g., 1px"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: '#fff',
                                                '& fieldset': { borderColor: '#374151' },
                                                '&:hover fieldset': { borderColor: '#4b5563' },
                                            },
                                            '& .MuiInputLabel-root': { color: '#64748b' },
                                        }}
                                    />
                                    <TextField
                                        label="Opacity"
                                        value={border.opacity}
                                        onChange={(e) => handleBorderChange('opacity', e.target.value)}
                                        size="small"
                                        fullWidth
                                        placeholder="0 to 1"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: '#fff',
                                                '& fieldset': { borderColor: '#374151' },
                                                '&:hover fieldset': { borderColor: '#4b5563' },
                                            },
                                            '& .MuiInputLabel-root': { color: '#64748b' },
                                        }}
                                    />
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        {/* Layers Section */}
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1, fontWeight: 600 }}>
                                Layers
                            </Typography>
                            <Box
                                className="layers-container"
                                sx={{
                                    bgcolor: '#1a1f2e',
                                    borderRadius: 1,
                                    p: 1,
                                    minHeight: '100px',
                                    color: '#fff',
                                }}
                            />
                        </Box>

                        {/* Traits Section */}
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1, fontWeight: 600 }}>
                                Traits
                            </Typography>
                            <Box
                                className="traits-container"
                                sx={{
                                    bgcolor: '#1a1f2e',
                                    borderRadius: 1,
                                    p: 1,
                                    minHeight: '100px',
                                    color: '#fff',
                                }}
                            />
                        </Box>
                    </>
                )}
            </Box>
        </Drawer>
    );
};

export default PropSidebar;