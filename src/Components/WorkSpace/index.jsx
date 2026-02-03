import React, { forwardRef, useImperativeHandle } from 'react';
import { Box, Typography } from '@mui/material';
import { usePageDataStore } from './UsePageDataStore';
import { useAiPrompt } from './UseAiPrompt';
import { useEditorInit } from './UseEditorInit';
import { EditorOverlay } from './EditorOverlay';
import { AiPromptBar } from './AiPromptBar';

export const Workspace = forwardRef(({ project }, ref) => {
  // ── data / persistence layer ──
  const {
    pageDataStore,
    currentPageIdRef,
    saveCurrentPage,
    loadPage,
  } = usePageDataStore();

  // ── GrapeJS lifecycle ───
  const { editorInstanceRef, editorReady } = useEditorInit(
    project,
    loadPage,
    saveCurrentPage,
    currentPageIdRef
  );

  // ── AI prompt ───
  const { aiPrompt, setAiPrompt, handleAiSubmit, aiLoading } = useAiPrompt(
    editorInstanceRef,
    project,
    currentPageIdRef,
    saveCurrentPage,
    pageDataStore
  );

  // ── imperative handle (used by toolbar buttons) ───
  useImperativeHandle(ref, () => ({
    getEditor: () => editorInstanceRef.current,
    saveCurrentPage: () => saveCurrentPage(editorInstanceRef.current, project),
  }));

  // ── empty state ──
  if (!project) {
    return (
      <Box sx={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        bgcolor: '#1e1e1e', color: 'white', flexDirection: 'column', gap: 2,
      }}>
        <Typography variant="h6">No project selected</Typography>
        <Typography variant="body2" color="#808080">
          Please select or create a project to continue
        </Typography>
      </Box>
    );
  }

  // ── main layout ─
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#1e1e1e', overflow: 'hidden' }}>
      {/* editor viewport */}
      <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div id="gjs-editor" style={{ height: '100%', width: '100%' }} />

        {!editorReady && <EditorOverlay projectName={project.name} />}
      </Box>

      {/* AI prompt bar */}
      <AiPromptBar
        value={aiPrompt}
        onChange={(e) => setAiPrompt(e.target.value)}
        onSubmit={handleAiSubmit}
        disabled={!editorReady}
        loading={aiLoading}
      />
    </Box>
  );
});

Workspace.displayName = 'Workspace';