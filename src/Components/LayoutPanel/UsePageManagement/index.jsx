import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setActivePage } from '../../../Store/slices/projectsSlice';
import { useUpdateProject } from '../../../Hooks/projects';
import { showToast } from '../../../Utils/toast';

export const usePageManagement = (project) => {
  const dispatch = useDispatch();
  const { updateProject, loading: updatingProject } = useUpdateProject();

  const [addPageDialog, setAddPageDialog] = useState(false);
  const [editPageDialog, setEditPageDialog] = useState(false);
  const [pageName, setPageName] = useState('');
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPageId, setMenuPageId] = useState(null);
  const [currentPageId, setCurrentPageId] = useState(null);

  // Load active page from project data
  useEffect(() => {
    if (project) {
      const pages = project.data?.pages || project.pages || {};
      const pageIds = Object.keys(pages);
      const activeId = project.data?.activePageId || project.activePageId;

      if (activeId && pages[activeId]) {
        setCurrentPageId(activeId);
      } else if (pageIds.length > 0) {
        const homePage = pageIds.find(id => pages[id].isHome);
        const firstPage = homePage || pageIds[0];
        setCurrentPageId(firstPage);
      }
    }
  }, [project?.id]);

  const handleAddPage = async () => {
    if (!pageName.trim()) {
      showToast.error('Page name is required');
      return;
    }

    if (!project) {
      showToast.error('No project found');
      return;
    }

    try {
      const newPageId = 'page_' + Date.now();
      const slug = pageName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

      const newPage = {
        id: newPageId,
        name: pageName.trim(),
        slug: slug,
        isHome: false,
        gjsData: { html: '', css: '', components: [], styles: [] },
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const currentPages = project.data?.pages || project.pages || {};
      const updatedPages = { ...currentPages, [newPageId]: newPage };

      const result = await updateProject(project.id, { pages: updatedPages });

      if (result) {
        setPageName('');
        setAddPageDialog(false);
        showToast.success(`Page "${newPage.name}" added successfully!`);
        window.dispatchEvent(new CustomEvent('project-updated'));
      }
    } catch (error) {
      console.error('Error adding page:', error);
      showToast.error('Failed to add page');
    }
  };

  const handlePageClick = (pageId) => {
    if (!project?.id) return;

    setCurrentPageId(pageId);
    dispatch(setActivePage({ projectId: project.id, pageId }));

    const event = new CustomEvent('change-page', { detail: { pageId } });
    window.dispatchEvent(event);
  };

  const handleMenuOpen = (event, pageId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuPageId(pageId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPageId(null);
  };

  const handleEditPage = () => {
    const pages = project?.data?.pages || project?.pages || {};
    const page = pages[menuPageId];

    if (page && !page.isHome) {
      setPageName(page.name);
      setSelectedPageId(menuPageId);
      setEditPageDialog(true);
      handleMenuClose();
    }
  };

  const handleUpdatePageName = async () => {
    if (!pageName.trim() || !selectedPageId || !project) return;

    try {
      const currentPages = project.data?.pages || project.pages || {};

      const updatedPages = {
        ...currentPages,
        [selectedPageId]: {
          ...currentPages[selectedPageId],
          name: pageName.trim(),
          slug: pageName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
          updatedAt: Date.now()
        }
      };

      const result = await updateProject(project.id, { pages: updatedPages });

      if (result) {
        setPageName('');
        setSelectedPageId(null);
        setEditPageDialog(false);
        showToast.success('Page renamed successfully!');
        window.dispatchEvent(new CustomEvent('project-updated'));
      }
    } catch (error) {
      console.error('Error updating page name:', error);
      showToast.error('Failed to rename page');
    }
  };

  const handleDeletePage = async () => {
    if (!menuPageId || !project) return;

    try {
      const pages = project.data?.pages || project.pages || {};
      const page = pages[menuPageId];

      if (page && !page.isHome) {
        const updatedPages = { ...pages };
        delete updatedPages[menuPageId];

        const result = await updateProject(project.id, { pages: updatedPages });

        if (result) {
          showToast.success(`Page "${page.name}" deleted`);

          if (currentPageId === menuPageId) {
            const remainingPages = Object.keys(updatedPages);
            if (remainingPages.length > 0) {
              handlePageClick(remainingPages[0]);
            }
          }

          window.dispatchEvent(new CustomEvent('project-updated'));
        }
      }
      handleMenuClose();
    } catch (error) {
      console.error('Error deleting page:', error);
      showToast.error('Failed to delete page');
    }
  };

  return {
    // State
    addPageDialog,
    editPageDialog,
    pageName,
    currentPageId,
    updatingProject,
    anchorEl,
    
    // Functions
    setAddPageDialog,
    setEditPageDialog,
    setPageName,
    handleAddPage,
    handlePageClick,
    handleMenuOpen,
    handleMenuClose,
    handleEditPage,
    handleUpdatePageName,
    handleDeletePage
  };
};