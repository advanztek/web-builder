import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProject } from '../../../../Hooks/projects';

const initialFormData = {
    name: '',
    description: '',
    primaryColor: '#1976d2',
    secondaryColor: '#0F172A',
    backgroundColor: '#FFFFFF',
    font: 'Inter'
};

export const useProjectCreation = () => {
    const navigate = useNavigate();
    const { createProject, loading: creatingProject } = useCreateProject();

    const [choiceDialogOpen, setChoiceDialogOpen] = useState(false);
    const [manualDialogOpen, setManualDialogOpen] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState('');

    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        setError('');
    };

    const handleCreateProjectClick = () => {
        setChoiceDialogOpen(true);
    };

    const handleChoiceClose = () => {
        setChoiceDialogOpen(false);
    };

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
            setFormData(initialFormData);
        }
    };

    const handleCreateProject = async () => {
        if (!formData.name.trim()) {
            setError('Project name is required');
            return;
        }

        setError('');

        const slug = formData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const projectData = {
            mode: 'manual',
            data: {
                name: formData.name.trim(),
                slug: slug,
                title: formData.name.trim(),
                seo: {
                    title: formData.name.trim(),
                    description: formData.description.trim() || `Project: ${formData.name}`,
                    keywords: ['website', 'landing page', formData.name.toLowerCase()]
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
                        gjsData: {
                            html: '',
                            css: '',
                            components: [],
                            styles: []
                        },
                        createdAt: Date.now(),
                        updatedAt: Date.now()
                    }
                },
                sections: [],
                settings: {
                    published: false,
                    customDomain: null,
                    analytics: {
                        googleAnalyticsId: null,
                        facebookPixelId: null
                    }
                },
                status: 'draft',
                activePageId: 'page-1'
            }
        };

        try {
            await createProject(projectData);
            setFormData(initialFormData);
            setManualDialogOpen(false);
            setError('');
        } catch (err) {
            console.error('Error in handleCreateProject:', err);
            setError(err.message || 'Failed to create project');
        }
    };

    return {
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
    };
};