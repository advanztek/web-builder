import { createSlice } from '@reduxjs/toolkit';

// Load projects from localStorage on initialization
const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem('websiteBuilderProjects');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return { projects: {}, activeProjectId: null, lastSaved: null };
};

const initialState = loadFromStorage();

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    createProject: (state, action) => {
      const projectId = action.payload.id || `project_${Date.now()}`;
      state.projects[projectId] = {
        id: projectId,
        name: action.payload.name || 'Untitled Project',
        pages: {
          'page_home': {
            id: 'page_home',
            name: 'Home',
            gjsData: null,
            isHome: true,
            createdAt: Date.now()
          }
        },
        activePageId: 'page_home',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      state.activeProjectId = projectId;
    },
    
    setActiveProject: (state, action) => {
      state.activeProjectId = action.payload;
    },
    
    updateProjectName: (state, action) => {
      const { projectId, name } = action.payload;
      if (state.projects[projectId]) {
        state.projects[projectId].name = name;
        state.projects[projectId].updatedAt = Date.now();
      }
    },
    
    // Page management
    addPage: (state, action) => {
      const { projectId, pageName } = action.payload;
      if (state.projects[projectId]) {
        const pageId = `page_${Date.now()}`;
        state.projects[projectId].pages[pageId] = {
          id: pageId,
          name: pageName || 'New Page',
          gjsData: null,
          isHome: false,
          createdAt: Date.now()
        };
        state.projects[projectId].updatedAt = Date.now();
      }
    },
    
    deletePage: (state, action) => {
      const { projectId, pageId } = action.payload;
      if (state.projects[projectId] && !state.projects[projectId].pages[pageId].isHome) {
        delete state.projects[projectId].pages[pageId];
        if (state.projects[projectId].activePageId === pageId) {
          state.projects[projectId].activePageId = 'page_home';
        }
        state.projects[projectId].updatedAt = Date.now();
      }
    },
    
    setActivePage: (state, action) => {
      const { projectId, pageId } = action.payload;
      if (state.projects[projectId] && state.projects[projectId].pages[pageId]) {
        state.projects[projectId].activePageId = pageId;
      }
    },
    
    updatePageName: (state, action) => {
      const { projectId, pageId, name } = action.payload;
      if (state.projects[projectId] && state.projects[projectId].pages[pageId]) {
        state.projects[projectId].pages[pageId].name = name;
        state.projects[projectId].updatedAt = Date.now();
      }
    },
    
    savePageData: (state, action) => {
      const { projectId, pageId, gjsData } = action.payload;
      if (state.projects[projectId] && state.projects[projectId].pages[pageId]) {
        state.projects[projectId].pages[pageId].gjsData = gjsData;
        state.projects[projectId].updatedAt = Date.now();
        state.lastSaved = Date.now();
      }
    },
    
    deleteProject: (state, action) => {
      const projectId = action.payload;
      delete state.projects[projectId];
      if (state.activeProjectId === projectId) {
        state.activeProjectId = null;
      }
    },
    
    duplicateProject: (state, action) => {
      const { projectId } = action.payload;
      const originalProject = state.projects[projectId];
      if (originalProject) {
        const newProjectId = `project_${Date.now()}`;
        state.projects[newProjectId] = {
          ...originalProject,
          id: newProjectId,
          name: `${originalProject.name} (Copy)`,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
      }
    }
  }
});

export const { 
  createProject, 
  setActiveProject,
  updateProjectName,
  addPage,
  deletePage,
  setActivePage,
  updatePageName,
  savePageData,
  deleteProject,
  duplicateProject
} = projectsSlice.actions;

// Middleware to save to localStorage on every state change
export const localStorageMiddleware = store => next => action => {
  const result = next(action);
  
  // Save to localStorage after every projects action
  if (action.type.startsWith('projects/')) {
    const state = store.getState();
    try {
      localStorage.setItem('websiteBuilderProjects', JSON.stringify(state.projects));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
  
  return result;
};

export default projectsSlice.reducer;