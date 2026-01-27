import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setActiveProject } from '../../../../Store/slices/projectsSlice';
import { normalizeProjectData } from '../ProjectUtils';

export const useProjectLoader = (slug, getProject) => {
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const location = useLocation();
    const dispatch = useDispatch();
    const loadedSlugRef = useRef(null);

    useEffect(() => {
        if (loadedSlugRef.current === slug && project) {
            console.log('Already loaded this slug, skipping');
            return;
        }

        if (!slug) {
            setIsLoading(false);
            return;
        }

        let mounted = true;

        const loadProject = async () => {
            console.log('Loading project:', slug);
            setIsLoading(true);

            try {
                let projectData = null;

                // Strategy 1: Navigation state
                if (location.state?.createdProject) {
                    console.log('Loading from navigation state');
                    projectData = location.state.createdProject;
                }

                // Strategy 2: pending_project
                if (!projectData) {
                    try {
                        const pending = sessionStorage.getItem('pending_project');
                        if (pending) {
                            const parsed = JSON.parse(pending);
                            if (parsed.slug === slug || parsed.id === slug) {
                                console.log('Loading from pending_project');
                                projectData = parsed;
                                sessionStorage.removeItem('pending_project');
                            }
                        }
                    } catch (e) {
                        console.warn('Failed to parse pending_project:', e);
                    }
                }

                // Strategy 3: current_project
                if (!projectData) {
                    try {
                        const current = sessionStorage.getItem('current_project');
                        if (current) {
                            const parsed = JSON.parse(current);
                            if (parsed.slug === slug || parsed.id === slug) {
                                console.log('Loading from current_project');
                                projectData = parsed;
                            }
                        }
                    } catch (e) {
                        console.warn('Failed to parse current_project:', e);
                    }
                }

                // Strategy 4: API
                if (!projectData) {
                    console.log('Loading from API');
                    projectData = await getProject(slug, false);
                }

                if (!projectData) {
                    throw new Error('Project not found');
                }

                // Normalize
                const normalized = normalizeProjectData(projectData);

                if (mounted && normalized) {
                    setProject(normalized);
                    dispatch(setActiveProject(normalized.id));

                    try {
                        sessionStorage.setItem('current_project', JSON.stringify(normalized));
                    } catch (e) {
                        console.warn('Could not store in sessionStorage:', e);
                    }

                    setRefreshKey(prev => prev + 1);
                    loadedSlugRef.current = slug;
                    console.log('Project loaded successfully');
                }

                if (mounted) {
                    setIsLoading(false);
                }

            } catch (error) {
                console.error('Error loading project:', error);
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        loadProject();

        return () => {
            mounted = false;
        };
    }, [slug]);

    return { project, isLoading, refreshKey };
};