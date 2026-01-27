import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, useTheme } from '@mui/material';
import { useCreateProject, useGetProjects } from '../../Hooks/projects';
import { useAuth } from '../../Context/AuthContext';
import DashboardSlider from '../Dashboard/DashboardSlider';
import DashHeading from '../Dashboard/DashHeading';
import DashboardTabs from '../Dashboard/DashboardTabs';
import ProjectsTable from '../Dashboard/ProjectsTable';
import CreateProjectDialog from '../Dashboard/CreateProjectDialog';
import ManualProjectDialog from '../Dashboard/ManualProjectDialog';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { isSuperAdmin } = useAuth();

    const { createProject, loading: creatingProject } = useCreateProject();
    const { getProjects, projects: apiProjects, loading: loadingProjects } = useGetProjects();

    const [activeTab, setActiveTab] = useState(0);
    const [choiceDialogOpen, setChoiceDialogOpen] = useState(false);
    const [manualDialogOpen, setManualDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        primaryColor: '#1976d2',
        secondaryColor: '#0F172A',
        backgroundColor: '#FFFFFF',
        font: 'Inter',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        // Only fetch projects for regular users
        if (!isSuperAdmin()) {
            getProjects();
        }
    }, [isSuperAdmin]);

    const handleTabChange = (event, newValue) => setActiveTab(newValue);

    const handleFormChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError('');
    };

    const handleCreateProject = () => setChoiceDialogOpen(true);
    const handleChoiceClose = () => setChoiceDialogOpen(false);
    const handleChoiceAI = () => {
        setChoiceDialogOpen(false);
        navigate('/dashboard/prompts');
    };
    const handleChoiceManual = () => {
        setChoiceDialogOpen(false);
        setManualDialogOpen(true);
    };

    const handleManualDialogClose = () => {
        if (!creatingProject) {
            setManualDialogOpen(false);
            setError('');
            setFormData({
                name: '',
                description: '',
                primaryColor: '#1976d2',
                secondaryColor: '#0F172A',
                backgroundColor: '#FFFFFF',
                font: 'Inter',
            });
        }
    };

    const handleConfirmManualCreate = async () => {
        if (!formData.name.trim()) {
            setError('Project name is required');
            return;
        }

        setError('');

        const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

        const projectData = {
            mode: 'manual',
            data: {
                name: formData.name.trim(),
                slug: slug,
                title: formData.name.trim(),
                seo: {
                    title: formData.name.trim(),
                    description: formData.description.trim() || `Project: ${formData.name}`,
                    keywords: ['website', 'landing page', formData.name.toLowerCase()],
                },
                theme: {
                    font: formData.font,
                    primaryColor: formData.primaryColor,
                    secondaryColor: formData.secondaryColor,
                    backgroundColor: formData.backgroundColor,
                },
                pages: {
                    'page-1': {
                        id: 'page-1',
                        name: 'Home',
                        slug: 'home',
                        isHome: true,
                        gjsData: { html: '', css: '', components: [], styles: [] },
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                    },
                },
                sections: [],
                settings: {
                    published: false,
                    customDomain: null,
                    analytics: { googleAnalyticsId: null, facebookPixelId: null },
                },
                status: 'draft',
                activePageId: 'page-1',
            },
        };

        try {
            const result = await createProject(projectData);

            if (result) {
                setFormData({
                    name: '',
                    description: '',
                    primaryColor: '#1976d2',
                    secondaryColor: '#0F172A',
                    backgroundColor: '#FFFFFF',
                    font: 'Inter',
                });
                setManualDialogOpen(false);

                const identifier = result.slug || result.data?.slug || result.id;
                navigate(`/dashboard/editor/${identifier}`);
            }
        } catch (err) {
            console.error('Error creating manual project:', err);
            setError(err.message || 'Failed to create project');
        }
    };

    // If user is super admin, show admin dashboard
    if (isSuperAdmin()) {
        return <AdminDashboard />;
    }

    // Regular user dashboard
    const publishedCount =
        apiProjects?.filter((p) => p.data?.settings?.published || p.settings?.published || p.status === 'published').length || 0;
    const favoritesCount = apiProjects?.filter((p) => p.isFavorite || p.data?.isFavorite).length || 0;
    const totalProjects = apiProjects?.length || 0;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default, pt: 12, px: 4, pb: 4 }}>
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                <DashboardSlider />
                <DashHeading />

                <Box sx={{ mb: 4 }}>
                    <Card sx={{ bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
                        <DashboardTabs
                            activeTab={activeTab}
                            onChange={handleTabChange}
                            counts={{ total: totalProjects, published: publishedCount, favorites: favoritesCount }}
                            onCreateProject={handleCreateProject}
                        />

                        <Box sx={{ p: 3 }}>
                            {activeTab === 0 && <ProjectsTable filter="all" apiProjects={apiProjects} loading={loadingProjects} onRefresh={getProjects} />}
                            {activeTab === 1 && <ProjectsTable filter="published" apiProjects={apiProjects} loading={loadingProjects} onRefresh={getProjects} />}
                            {activeTab === 2 && <ProjectsTable filter="favorites" apiProjects={apiProjects} loading={loadingProjects} onRefresh={getProjects} />}
                        </Box>
                    </Card>
                </Box>
            </Box>

            <CreateProjectDialog
                open={choiceDialogOpen}
                onClose={handleChoiceClose}
                onChoiceAI={handleChoiceAI}
                onChoiceManual={handleChoiceManual}
            />

            <ManualProjectDialog
                open={manualDialogOpen}
                onClose={handleManualDialogClose}
                formData={formData}
                onChange={handleFormChange}
                onSubmit={handleConfirmManualCreate}
                loading={creatingProject}
                error={error}
            />
        </Box>
    );
};

export default Dashboard;