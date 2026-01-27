import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useEditorActions = () => {
    const navigate = useNavigate();
    const [deviceMode, setDeviceMode] = useState('Desktop');
    const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

    const handleSave = () => {
        const event = new CustomEvent('manual-save');
        window.dispatchEvent(event);
    };

    const handleExportHTML = () => {
        const event = new CustomEvent('export-html');
        window.dispatchEvent(event);
    };

    const handleDeviceChange = (device) => {
        setDeviceMode(device);
        const event = new CustomEvent('change-device', { detail: device });
        window.dispatchEvent(event);
    };

    const toggleBorders = () => {
        const event = new CustomEvent('toggle-borders');
        window.dispatchEvent(event);
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const toggleRightPanel = () => {
        setRightPanelCollapsed(!rightPanelCollapsed);
    };

    const handleBuyCredits = () => {
        navigate('/dashboard/buy-credits');
    };

    return {
        deviceMode,
        rightPanelCollapsed,
        handleSave,
        handleExportHTML,
        handleDeviceChange,
        toggleBorders,
        handleBackToDashboard,
        toggleRightPanel,
        handleBuyCredits,
    };
};