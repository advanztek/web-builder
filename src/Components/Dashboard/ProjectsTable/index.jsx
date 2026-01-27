import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    useTheme,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { setActiveProject, deleteProject as deleteProjectRedux, duplicateProject, updateProjectName } from '../../../Store/slices/projectsSlice';
import { useDeleteProject } from '../../../Hooks/projects';
import ProjectTableRow from '../ProjectsTableRow';
import ProjectActionsMenu from '../ProjectActionMenu';
import RenameProjectDialog from '../RenameProjectsDialog';
import EmptyProjectsState from '../EmptyProjectState';

const ProjectsTable = ({ filter = 'all', apiProjects, loading, onRefresh }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { deleteProject: deleteProjectAPI } = useDeleteProject();

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editName, setEditName] = useState('');

    const filteredProjects = useMemo(() => {
        if (!apiProjects || apiProjects.length === 0) return [];
        if (filter === 'all') return apiProjects;
        if (filter === 'published') {
            return apiProjects.filter(p => p.data?.settings?.published || p.settings?.published || p.status === 'published');
        }
        if (filter === 'favorites') {
            return apiProjects.filter(p => p.isFavorite || p.data?.isFavorite);
        }
        return apiProjects;
    }, [apiProjects, filter]);

    const handleMenuOpen = (event, project) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedProject(project);
    };

    const handleMenuClose = () => setAnchorEl(null);

    const handleOpenProject = (project) => {
        dispatch(setActiveProject(project.id));
        const identifier = project.slug || project.data?.slug || project.id;
        navigate(`/dashboard/editor/${identifier}`);
        handleMenuClose();
    };

    const handleEditProject = () => {
        setEditName(selectedProject.name || selectedProject.data?.name || '');
        setEditDialogOpen(true);
        handleMenuClose();
    };

    const handleSaveEdit = () => {
        if (editName.trim() && selectedProject) {
            dispatch(updateProjectName({ projectId: selectedProject.id, name: editName }));
            setEditDialogOpen(false);
            setSelectedProject(null);
            setEditName('');
        }
    };

    const handleDuplicate = () => {
        dispatch(duplicateProject({ projectId: selectedProject.id }));
        handleMenuClose();
        setTimeout(() => onRefresh(), 500);
    };

    const handleDelete = async () => {
        const projectName = selectedProject.name || selectedProject.data?.name || 'this project';
        if (window.confirm(`Are you sure you want to delete "${projectName}"?`)) {
            try {
                await deleteProjectAPI(selectedProject.id);
                dispatch(deleteProjectRedux(selectedProject.id));
                await onRefresh();
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
        handleMenuClose();
    };

    if (loading && filteredProjects.length === 0) {
        return (
            <Box sx={{ mt: 6, textAlign: 'center', py: 8 }}>
                <CircularProgress />
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    Loading projects...
                </Typography>
            </Box>
        );
    }

    if (filteredProjects.length === 0) {
        return <EmptyProjectsState filter={filter} onRefresh={onRefresh} loading={loading} />;
    }

    const sortedProjects = [...filteredProjects].sort((a, b) => {
        const aTime = a.updatedAt || a.updated_at || a.createdAt || a.created_at || 0;
        const bTime = b.updatedAt || b.updated_at || b.createdAt || b.created_at || 0;
        const aDate = typeof aTime === 'string' ? new Date(aTime).getTime() : aTime;
        const bDate = typeof bTime === 'string' ? new Date(bTime).getTime() : bTime;
        return bDate - aDate;
    });

    return (
        <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    {filter === 'all' ? `All Projects (${filteredProjects.length})` :
                        filter === 'published' ? `Published Projects (${filteredProjects.length})` :
                            `Favorite Projects (${filteredProjects.length})`}
                </Typography>
                <Button
                    startIcon={loading ? <CircularProgress size={16} /> : <Refresh />}
                    onClick={onRefresh}
                    disabled={loading}
                    size="small"
                >
                    {loading ? 'Refreshing...' : 'Refresh'}
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Project Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Last Modified</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedProjects.map((project) => (
                            <ProjectTableRow
                                key={project.id}
                                project={project}
                                onClick={handleOpenProject}
                                onMenuOpen={handleMenuOpen}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <ProjectActionsMenu
                anchorEl={anchorEl}
                onClose={handleMenuClose}
                onOpen={() => handleOpenProject(selectedProject)}
                onEdit={handleEditProject}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
            />

            <RenameProjectDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                value={editName}
                onChange={setEditName}
                onSave={handleSaveEdit}
            />
        </Box>
    );
};

export default ProjectsTable;