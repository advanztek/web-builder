// hooks/useProjects.js - FIXED VERSION
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../Utils/toast';
import { BASE_SERVER_URL } from '../Config/url';

const getAuthToken = () => {
    return localStorage.getItem('token') ||
        localStorage.getItem('authToken') ||
        localStorage.getItem('accessToken');
};

const apiCall = async (endpoint, data, method = 'POST', contentType = 'application/json') => {
    const token = getAuthToken();

    const options = {
        method,
        headers: {
            'Content-Type': contentType,
        },
    };

    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (method !== 'GET' && method !== 'DELETE') {
        if (contentType === 'application/json') {
            options.body = JSON.stringify(data);
        } else if (contentType === 'application/x-www-form-urlencoded') {
            options.body = new URLSearchParams(data);
        }
    }

    try {
        const response = await fetch(`${BASE_SERVER_URL}${endpoint}`, options);

        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
            localStorage.removeItem('accessToken');
            throw new Error('Unauthorized! Please log in again.');
        }

        if (response.status === 404) {
            throw new Error('Resource not found');
        }

        const responseContentType = response.headers.get('content-type');
        if (!responseContentType || !responseContentType.includes('application/json')) {
            const text = await response.text();
            console.error('Non-JSON response:', text.substring(0, 200));
            throw new Error(`Server returned ${response.status}: Expected JSON but got HTML`);
        }

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || `Request failed with status ${response.status}`);
        }

        return result;
    } catch (error) {
        console.error(`API Call Error [${method} ${endpoint}]:`, error);
        throw error;
    }
};

const generateSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Helper to create default page structure
const createDefaultPages = () => {
    const homePageId = 'page_' + Date.now();
    return {
        [homePageId]: {
            id: homePageId,
            name: 'Home',
            slug: 'home',
            isHome: true,
            gjsData: null,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    };
};

const createProjectData = (name, description = '', options = {}) => {
    const slug = options.slug || generateSlug(name);
    const title = options.title || slug.replace(/-/g, '_');
    const pages = createDefaultPages();
    const homePageId = Object.keys(pages)[0];

    return {
        data: {
            title: title,
            name: name,
            slug: slug,
            status: options.status || 'draft',
            seo: {
                title: options.seoTitle || name,
                description: description || `Project: ${name}`,
                keywords: options.keywords || ['website', 'landing page']
            },
            theme: {
                font: options.font || 'Inter',
                primaryColor: options.primaryColor || '#1976d2',
                secondaryColor: options.secondaryColor || '#0F172A',
                backgroundColor: options.backgroundColor || '#FFFFFF'
            },
            pages: pages,
            activePageId: homePageId,
            sections: options.sections || [],
            settings: {
                customDomain: null,
                published: false,
                analytics: {
                    googleAnalyticsId: null,
                    facebookPixelId: null
                }
            }
        }
    };
};

const normalizeProject = (backendProject) => {
    // Ensure pages structure exists
    let pages = backendProject.data?.pages;
    let activePageId = backendProject.data?.activePageId;

    // If no pages exist, create default home page
    if (!pages || Object.keys(pages).length === 0) {
        pages = createDefaultPages();
        activePageId = Object.keys(pages)[0];
    }

    // If no activePageId, set it to the first page
    if (!activePageId && pages) {
        activePageId = Object.keys(pages)[0];
    }

    return {
        id: backendProject.id,
        name: backendProject.data?.name || 'Untitled Project',
        slug: backendProject.data?.slug || '',
        status: backendProject.data?.status || 'draft',
        createdAt: backendProject.created_at,
        updatedAt: backendProject.updated_at,
        ...backendProject,
        data: {
            ...backendProject.data,
            pages: pages,
            activePageId: activePageId
        },
        pages: pages,
        activePageId: activePageId,
        seo: backendProject.data?.seo,
        theme: backendProject.data?.theme,
        sections: backendProject.data?.sections,
        settings: backendProject.data?.settings,
    };
};

export const useCreateProject = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const createProject = async (inputData) => {
        setLoading(true);

        try {
            const projectData = createProjectData(
                inputData.name,
                inputData.description,
                {
                    slug: inputData.slug,
                    status: inputData.status || 'draft',
                    seoTitle: inputData.seoTitle,
                    keywords: inputData.keywords,
                    primaryColor: inputData.primaryColor,
                    secondaryColor: inputData.secondaryColor,
                    backgroundColor: inputData.backgroundColor,
                    font: inputData.font,
                    sections: inputData.sections
                }
            );

            console.log('Sending project data:', projectData);

            const res = await apiCall("/user/project/create", projectData);

            if (!res?.success) {
                throw new Error(res?.message || "Project creation failed");
            }

            showToast.success("Project created successfully!");

            const createdProject = res.data || res.result;

            if (createdProject?.id) {
                navigate(`/dashboard/editor/${createdProject.id}`);
            } else {
                navigate("/dashboard");
            }

            return normalizeProject(createdProject);
        } catch (err) {
            console.error("CREATE PROJECT ERROR:", err);

            if (err.message.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
                return null;
            }

            showToast.error(err.message || "Failed to create project");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { createProject, loading };
};

export const useGetProjects = () => {
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);

    const getProjects = async () => {
        setLoading(true);

        try {
            const res = await apiCall("/user/projects", null, 'GET');

            console.log('GET PROJECTS RESPONSE:', res);

            if (!res?.success) {
                throw new Error(res?.message || "Failed to fetch projects");
            }

            const projectsData = res.result || res.data || [];

            if (!Array.isArray(projectsData)) {
                console.warn('Projects data is not an array:', projectsData);
                setProjects([]);
                return [];
            }

            const normalizedProjects = projectsData.map(normalizeProject);

            console.log('NORMALIZED PROJECTS:', normalizedProjects);

            setProjects(normalizedProjects);
            return normalizedProjects;
        } catch (err) {
            console.error("GET PROJECTS ERROR:", err);

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
            } else if (err.message?.includes('not found')) {
                console.log('Projects endpoint not found, returning empty array');
            } else {
                showToast.error(err.message || "Failed to fetch projects");
            }

            setProjects([]);
            return [];
        } finally {
            setLoading(false);
        }
    };

    return { getProjects, projects, loading };
};

export const useGetProject = () => {
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState(null);

    const getProject = async (projectId) => {
        if (!projectId) {
            console.error('No project ID provided');
            return null;
        }

        setLoading(true);

        try {
            let res;
            let projectData = null;

            // Try primary endpoint
            try {
                res = await apiCall(`/user/project/${projectId}`, null, 'GET');
                projectData = res.result || res.data;
            } catch (err) {
                console.log('Primary endpoint failed, trying alternative...');

                // Try alternative endpoint
                try {
                    res = await apiCall(`/project/${projectId}`, null, 'GET');
                    projectData = res.result || res.data;
                } catch (err2) {
                    console.log('Alternative endpoint failed, fetching all projects...');

                    // Fallback: get all projects and filter
                    const allProjectsRes = await apiCall('/user/projects', null, 'GET');
                    const allProjects = allProjectsRes.result || allProjectsRes.data || [];
                    projectData = allProjects.find(p => p.id === parseInt(projectId) || p.id === projectId);

                    if (!projectData) {
                        throw new Error('Project not found');
                    }
                }
            }

            const normalizedProject = projectData ? normalizeProject(projectData) : null;
            setProject(normalizedProject);
            console.log('Loaded project:', normalizedProject);
            return normalizedProject;
        } catch (err) {
            console.error("GET PROJECT ERROR:", err);

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
            } else if (err.message?.includes('not found')) {
                showToast.error('Project not found');
            } else {
                showToast.error(err.message || "Failed to fetch project");
            }

            setProject(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { getProject, project, loading };
};

export const useUpdateProject = () => {
    const [loading, setLoading] = useState(false);

    const updateProject = async (projectId, updateData) => {
        setLoading(true);

        try {
            const payload = updateData.data ? updateData : { data: updateData };

            console.log('Updating project:', projectId);
            console.log('Update payload:', payload);

            // CORRECT ENDPOINT: /user/project/update/:id with PATCH method
            const res = await apiCall(`/user/project/update/${projectId}`, payload, 'PATCH');

            if (!res?.success) {
                throw new Error(res?.message || "Project update failed");
            }

            showToast.success("Project updated successfully!");

            const resultData = res.result || res.data;
            return resultData ? normalizeProject(resultData) : null;
        } catch (err) {
            console.error("UPDATE PROJECT ERROR:", err);

            if (err.message.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                return null;
            }

            if (err.message.includes('not found') || err.message.includes('Not found')) {
                showToast.error("Project not found");
                return null;
            }

            showToast.error(err.message || "Failed to update project");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateProject, loading };
};


export const useDeleteProject = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const deleteProject = async (projectId) => {
        setLoading(true);

        try {
            const res = await apiCall(`/project/delete/${projectId}`, null, 'DELETE');

            if (!res?.success) {
                throw new Error(res?.message || "Project deletion failed");
            }

            showToast.success("Project deleted successfully!");
            navigate('/projects');
            return true;
        } catch (err) {
            console.error("DELETE PROJECT ERROR:", err);

            if (err.message.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                return false;
            }

            showToast.error(err.message || "Failed to delete project");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { deleteProject, loading };
};