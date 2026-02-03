import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { Workspace } from '../../../Components/WorkSpace';
import { LayoutPanel } from '../../../Components/LayoutPanel';
import { useGetProject } from '../../../Hooks/projects';
import LoadingScreen from './LoadingScreen';
import EditorToolbar from './EditorToolbar';
import PropertiesPanel from './PropertiesPanel';
import ProjectChoiceDialog from './ProjectDialog';
import ManualProjectDialog from '../../../Components/Dashboard/ManualProjectDialog';
import { useProjectLoader } from './UseProjectLoader';
import { useEditorActions } from './UseEditorActions';
import { useProjectCreation } from './UseProjectCreation';

function EditorPage() {
  const { slug } = useParams();
  const { getProject } = useGetProject();
  const workspaceRef = useRef(null);
  const [creditBalance] = useState(2500);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  const { project, isLoading, refreshKey } = useProjectLoader(slug, getProject);

  const {
    deviceMode,
    handleSave,
    handleExportHTML,
    handleDeviceChange,
    toggleBorders,
    handleBackToDashboard,
    handleBuyCredits,
  } = useEditorActions();

  const {
    choiceDialogOpen,
    manualDialogOpen,
    formData,
    error,
    creatingProject,
    handleInputChange,
    handleCreateProjectClick,
    handleChoiceClose,
    handleChoiceAI,
    handleChoiceManual,
    handleManualDialogClose,
    handleCreateProject,
  } = useProjectCreation();

  if (isLoading) {
    return <LoadingScreen slug={slug} />;
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0d0d0d' }}>
      <EditorToolbar
        project={project}
        creditBalance={creditBalance}
        deviceMode={deviceMode}
        creatingProject={creatingProject}
        onBack={handleBackToDashboard}
        onBuyCredits={handleBuyCredits}
        onDeviceChange={handleDeviceChange}
        onToggleBorders={toggleBorders}
        onSave={handleSave}
        onExport={handleExportHTML}
        onNewProject={handleCreateProjectClick}
      />

      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <LayoutPanel key={`layout-${refreshKey}`} project={project} />
        <Workspace
          ref={workspaceRef}
          project={project}
          key={`workspace-${project?.id}-${refreshKey}`}
        />
        <PropertiesPanel
          collapsed={rightPanelCollapsed}
          onToggle={() => setRightPanelCollapsed(!rightPanelCollapsed)}
        />
      </Box>

      <ProjectChoiceDialog
        open={choiceDialogOpen}
        onClose={handleChoiceClose}
        onAI={handleChoiceAI}
        onManual={handleChoiceManual}
      />

      <ManualProjectDialog
        open={manualDialogOpen}
        onClose={handleManualDialogClose}
        formData={formData}
        error={error}
        loading={creatingProject}
        onChange={handleInputChange}
        onCreate={handleCreateProject}
      />
    </Box>
  );
}

export default EditorPage;