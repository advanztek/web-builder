import React from 'react';
import { Box } from '@mui/material';
import PanelSection from '../PanelSection';
import PropertyField from '../PropertyField';
import EmptySelectionState from '../EmptySelectorState';

const PropertiesContent = ({ selectedElement, onPropertyChange }) => {
    if (!selectedElement) {
        return <EmptySelectionState />;
    }

    const handleChange = (property, value) => {
        onPropertyChange?.(selectedElement.id, property, value);
    };

    return (
        <Box sx={{ height: '100%', overflowY: 'auto' }}>
            {/* Typography Section */}
            <PanelSection title="Typography" defaultExpanded>
                <PropertyField
                    label="Font Size"
                    type="number"
                    value={selectedElement.fontSize || 16}
                    onChange={(val) => handleChange('fontSize', val)}
                />
                <PropertyField
                    label="Font Weight"
                    type="select"
                    value={selectedElement.fontWeight || 'normal'}
                    onChange={(val) => handleChange('fontWeight', val)}
                    options={[
                        { value: 'normal', label: 'Normal' },
                        { value: 'bold', label: 'Bold' },
                        { value: '600', label: 'Semi Bold' },
                        { value: '300', label: 'Light' },
                    ]}
                />
                <PropertyField
                    label="Text Color"
                    type="color"
                    value={selectedElement.color || '#000000'}
                    onChange={(val) => handleChange('color', val)}
                />
            </PanelSection>

            {/* Background Section */}
            <PanelSection title="Background" defaultExpanded>
                <PropertyField
                    label="Background Color"
                    type="color"
                    value={selectedElement.backgroundColor || '#ffffff'}
                    onChange={(val) => handleChange('backgroundColor', val)}
                />
            </PanelSection>

            {/* Spacing Section */}
            <PanelSection title="Spacing">
                <PropertyField
                    label="Padding"
                    type="number"
                    value={selectedElement.padding || 0}
                    onChange={(val) => handleChange('padding', val)}
                />
                <PropertyField
                    label="Margin"
                    type="number"
                    value={selectedElement.margin || 0}
                    onChange={(val) => handleChange('margin', val)}
                />
            </PanelSection>

            {/* Border Section */}
            <PanelSection title="Border">
                <PropertyField
                    label="Border Width"
                    type="number"
                    value={selectedElement.borderWidth || 0}
                    onChange={(val) => handleChange('borderWidth', val)}
                />
                <PropertyField
                    label="Border Color"
                    type="color"
                    value={selectedElement.borderColor || '#000000'}
                    onChange={(val) => handleChange('borderColor', val)}
                />
                <PropertyField
                    label="Border Radius"
                    type="number"
                    value={selectedElement.borderRadius || 0}
                    onChange={(val) => handleChange('borderRadius', val)}
                />
            </PanelSection>

            {/* Dimensions Section */}
            <PanelSection title="Dimensions">
                <PropertyField
                    label="Width"
                    type="text"
                    value={selectedElement.width || 'auto'}
                    onChange={(val) => handleChange('width', val)}
                />
                <PropertyField
                    label="Height"
                    type="text"
                    value={selectedElement.height || 'auto'}
                    onChange={(val) => handleChange('height', val)}
                />
            </PanelSection>
        </Box>
    );
};

export default PropertiesContent;