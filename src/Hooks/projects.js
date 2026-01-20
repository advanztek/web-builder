// hooks/useProjects.js - DIAGNOSTIC VERSION WITH FIXED URL HANDLING
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../Utils/toast';
import { BASE_SERVER_URL } from '../Config/url';
import { useLoader } from '../Context/LoaderContext';

const getAuthToken = () => {
    return localStorage.getItem('token') ||
        localStorage.getItem('authToken') ||
        localStorage.getItem('accessToken');
};

const apiCall = async (endpoint, data, method = 'POST', contentType = 'application/json') => {
    const token = getAuthToken();

    // Build the full URL
    const fullUrl = `${BASE_SERVER_URL}${endpoint}`;

    console.log('🌐 API CALL DEBUG:');
    console.log('BASE_SERVER_URL:', BASE_SERVER_URL);
    console.log('Endpoint:', endpoint);
    console.log('Full URL:', fullUrl);
    console.log('Method:', method);

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
        console.log('📡 Sending request to:', fullUrl);
        const response = await fetch(fullUrl, options);

        console.log('📥 Response status:', response.status);
        console.log('📥 Response ok:', response.ok);

        if (response.status === 401) {
            localStorage.clear();
            throw new Error('Unauthorized! Please log in again.');
        }

        if (response.status === 404) {
            throw new Error('Resource not found');
        }

        const responseContentType = response.headers.get('content-type');
        console.log('📥 Response content-type:', responseContentType);

        if (!responseContentType || !responseContentType.includes('application/json')) {
            const text = await response.text();
            console.error('❌ Non-JSON response:', text.substring(0, 500));
            throw new Error(`Server error: Expected JSON but got ${response.status}`);
        }

        const result = await response.json();
        console.log('📥 Response data:', result);

        // Don't throw on !response.ok - just return the result
        return result;

    } catch (error) {
        console.error(`❌ API Error [${method} ${endpoint}]:`, error);

        // Special handling for network errors
        if (error.message === 'Failed to fetch') {
            console.error('🔴 NETWORK ERROR DETAILS:');
            console.error('- Check if backend is running');
            console.error('- Check if BASE_SERVER_URL is correct:', BASE_SERVER_URL);
            console.error('- Check CORS settings on backend');
            console.error('- Check your internet connection');

            throw new Error(`Cannot connect to server at ${BASE_SERVER_URL}. Please check your connection and backend URL.`);
        }

        throw error;
    }
};

const createDefaultPages = () => {
    const homePageId = 'home';
    return {
        [homePageId]: {
            id: homePageId,
            name: 'Home',
            slug: '',
            isHome: true,
            gjsData: null,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    };
};

const normalizeProject = (backendProject) => {
    let pages = backendProject.data?.pages;
    let activePageId = backendProject.data?.activePageId;

    if (!pages || Object.keys(pages).length === 0) {
        pages = createDefaultPages();
        activePageId = Object.keys(pages)[0];
    }

    if (!activePageId && pages) {
        activePageId = Object.keys(pages)[0];
    }

    return {
        id: backendProject.id,
        name: backendProject.data?.name || 'Untitled Project',
        slug: backendProject.data?.slug || backendProject.slug || `project-${backendProject.id}`,
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

// ✅ CREATE PROJECT
export const useCreateProject = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const createProject = async (input) => {
        setLoading(true);

        try {
            let payload;

            // ---------------------------
            // PROMPT MODE
            // ---------------------------
            if (input.mode === "prompt") {
                payload = {
                    mode: "prompt",
                    websiteName: input.websiteName,
                    websiteType: input.websiteType || undefined,
                    prompt: input.prompt,
                    pages: input.pages?.length ? input.pages : undefined,
                    theme: input.theme || undefined,
                    files: input.files?.length ? input.files : undefined
                };

                console.log("📤 PROMPT PAYLOAD:", payload);

                const res = await apiCall("/V1/user/project/create", payload);
                console.log("📥 FULL RESPONSE:", res);

                // Try multiple possible response structures
                let created = null;

                if (res?.result?.data) {
                    created = res.result.data;
                } else if (res?.data) {
                    created = res.data;
                } else if (res?.result) {
                    created = res.result;
                } else if (res?.project) {
                    created = res.project;
                } else if (res?.id) {
                    created = res;
                }

                console.log("✅ EXTRACTED PROJECT:", created);

                if (!created) {
                    console.error("❌ No valid project in response");
                    return null;
                }

                // If no id, use slug or generate one
                if (!created.id) {
                    console.warn("⚠️ Project has no ID, using slug or generating one");
                    created.id = created.slug || created.data?.slug || `project-${Date.now()}`;
                }

                const normalized = normalizeProject(created);

                // Store in localStorage for fallback
                try {
                    const recentProjects = JSON.parse(localStorage.getItem('recent_projects') || '[]');
                    recentProjects.unshift(normalized);
                    localStorage.setItem('recent_projects', JSON.stringify(recentProjects.slice(0, 10)));
                } catch (e) {
                    console.warn('Could not store in localStorage:', e);
                }

                return normalized;
            }

            // ---------------------------
            // MANUAL MODE
            // ---------------------------
            payload = {
                mode: "manual",
                data: input.data
            };

            console.log("📤 MANUAL PAYLOAD:", payload);

            const res = await apiCall("/V1/user/project/create", payload);
            console.log("📥 MANUAL RESPONSE:", res);

            let created = null;

            if (res?.data) {
                created = res.data;
            } else if (res?.result?.data) {
                created = res.result.data;
            } else if (res?.result) {
                created = res.result;
            } else if (res?.id) {
                created = res;
            }

            console.log("✅ CREATED PROJECT:", created);

            if (!created) {
                throw new Error("Invalid response from server");
            }

            // If no id, use slug or generate one
            if (!created.id) {
                console.warn("⚠️ Project has no ID, using slug or generating one");
                created.id = created.slug || created.data?.slug || `project-${Date.now()}`;
            }

            const normalized = normalizeProject(created);

            const slug = normalized.slug || normalized.id;
            console.log("➡️ Navigating to:", `/dashboard/editor/${slug}`);
            navigate(`/dashboard/editor/${slug}`);

            return normalized;

        } catch (err) {
            console.error("❌ CREATE PROJECT ERROR:", err);
            console.error("ERROR STACK:", err.stack);

            if (err.message.includes("Unauthorized")) {
                showToast.error("Session expired. Please log in again.");
                navigate("/login");
                return null;
            }

            if (input.mode !== "prompt") {
                showToast.error(err.message || "Failed to create project");
            }

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
    const { showLoader, hideLoader } = useLoader();

    const getProjects = async (showGlobalLoader = false) => {
        setLoading(true);
        if (showGlobalLoader) {
            showLoader('Loading projects...', 'dots');
        }

        try {
            const res = await apiCall("/V1/user/projects", null, 'GET');

            if (!res?.success) {
                throw new Error(res?.message || "Failed to fetch projects");
            }

            const projectsData = res.result || res.data || [];

            if (!Array.isArray(projectsData)) {
                console.warn('Projects not array:', projectsData);
                setProjects([]);
                return [];
            }

            const normalized = projectsData.map(normalizeProject);
            setProjects(normalized);
            return normalized;

        } catch (err) {
            console.error("GET PROJECTS ERROR:", err);

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired.');
            }

            setProjects([]);
            return [];

        } finally {
            setLoading(false);
            if (showGlobalLoader) {
                hideLoader();
            }
        }
    };

    return { getProjects, projects, loading };
};

// ✅ GET PROJECT
export const useGetProject = () => {
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState(null);
    const { showLoader, hideLoader } = useLoader();

    const getProject = async (projectId, showGlobalLoader = false) => {
        if (!projectId) {
            console.warn('No projectId provided to getProject');
            return null;
        }

        setLoading(true);
        if (showGlobalLoader) {
            showLoader('Loading project...', 'spinner');
        }

        try {
            console.log(`🔍 Looking for project: ${projectId}`);

            // Strategy 1: Try direct fetch
            try {
                const res = await apiCall(`/V1/user/project/${projectId}`, null, 'GET');

                if (res?.success && (res.result || res.data)) {
                    const projectData = res.result || res.data;
                    console.log('✅ Found via direct fetch');
                    const normalized = normalizeProject(projectData);
                    setProject(normalized);
                    return normalized;
                }
            } catch (directError) {
                console.warn(`⚠️ Direct fetch failed:`, directError.message);
            }

            // Strategy 2: Get all projects
            console.log('🔍 Trying to find in all projects...');
            const allProjectsRes = await apiCall('/V1/user/projects', null, 'GET');

            if (allProjectsRes?.success) {
                const allProjects = allProjectsRes.result || allProjectsRes.data || [];

                const found = allProjects.find(p => {
                    const pId = String(p.id);
                    const pSlug = p.data?.slug || p.slug;
                    const searchTerm = String(projectId);

                    return pId === searchTerm || pSlug === searchTerm;
                });

                if (found) {
                    console.log('✅ Found in all projects list');
                    const normalized = normalizeProject(found);
                    setProject(normalized);
                    return normalized;
                }
            }

            // Strategy 3: Check sessionStorage
            console.log('🔍 Checking sessionStorage...');
            const pendingProject = sessionStorage.getItem('pending_project');
            if (pendingProject) {
                try {
                    const parsed = JSON.parse(pendingProject);
                    if (String(parsed.id) === String(projectId) ||
                        String(parsed.slug) === String(projectId)) {
                        console.log('✅ Found in sessionStorage');
                        const normalized = normalizeProject(parsed);
                        setProject(normalized);
                        sessionStorage.removeItem('pending_project');
                        return normalized;
                    }
                } catch (e) {
                    console.warn('Failed to parse sessionStorage:', e);
                }
            }

            // Strategy 4: Check localStorage
            console.log('🔍 Checking localStorage...');
            try {
                const recentProjects = JSON.parse(localStorage.getItem('recent_projects') || '[]');
                const found = recentProjects.find(p =>
                    String(p.id) === String(projectId) ||
                    String(p.slug) === String(projectId)
                );

                if (found) {
                    console.log('✅ Found in localStorage');
                    const normalized = normalizeProject(found);
                    setProject(normalized);
                    return normalized;
                }
            } catch (e) {
                console.warn('Failed to check localStorage:', e);
            }

            console.error('❌ Project not found anywhere');
            throw new Error('Project not found');

        } catch (err) {
            console.error("GET PROJECT ERROR:", err);

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
            } else if (!err.message?.includes('not found')) {
                showToast.error(err.message || 'Failed to load project');
            }

            setProject(null);
            return null;

        } finally {
            setLoading(false);
            if (showGlobalLoader) {
                hideLoader();
            }
        }
    };

    return { getProject, project, loading };
};

// ✅ UPDATE PROJECT
export const useUpdateProject = () => {
    const [loading, setLoading] = useState(false);
    const { showLoader, hideLoader } = useLoader();

    const updateProject = async (projectId, updateData, showGlobalLoader = false) => {
        setLoading(true);
        if (showGlobalLoader) {
            showLoader('Saving changes...', 'pulse');
        }

        try {
            const payload = {
                mode: 'manual',
                data: updateData
            };

            const res = await apiCall(`/V1/user/project/update/${projectId}`, payload, 'PATCH');

            if (!res?.success) {
                throw new Error(res?.message || "Update failed");
            }

            const result = res.result || res.data;
            return result ? normalizeProject(result) : null;

        } catch (err) {
            console.error("❌ UPDATE ERROR:", err);

            if (!err.message.includes('Validation')) {
                showToast.error(err.message || "Failed to save");
            }

            return null;

        } finally {
            setLoading(false);
            if (showGlobalLoader) {
                hideLoader();
            }
        }
    };

    return { updateProject, loading };
};

// ✅ AI UPDATE PROJECT
export const useAIUpdateProject = () => {
    const [loading, setLoading] = useState(false);
    const { showLoader, hideLoader } = useLoader();

    const aiUpdateProject = async (projectId, updateData, showGlobalLoader = false) => {
        setLoading(true);
        if (showGlobalLoader) {
            showLoader('AI is updating your page...', 'orbit');
        }

        try {
            const payload = {
                mode: 'prompt',
                pageId: updateData.pageId,
                updates: {
                    html: updateData.html,
                    css: updateData.css,
                    components: updateData.components,
                    styles: updateData.styles
                }
            };

            const res = await apiCall(`/V1/project/ai-update-page/${projectId}`, payload, 'PATCH');

            if (!res?.success) {
                throw new Error(res?.message || "AI update failed");
            }

            const result = res.result || res.data;
            return result ? normalizeProject(result) : null;

        } catch (err) {
            console.error("❌ AI UPDATE ERROR:", err);

            if (!err.message.includes('Validation')) {
                showToast.error(err.message || "Failed to save AI updates");
            }

            return null;

        } finally {
            setLoading(false);
            if (showGlobalLoader) {
                hideLoader();
            }
        }
    };

    return { aiUpdateProject, loading };
};

// ✅ DELETE PROJECT
export const useDeleteProject = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();

    const deleteProject = async (projectId) => {
        setLoading(true);
        showLoader('Deleting project...', 'pulse');

        try {
            const res = await apiCall(`/V1/project/delete/${projectId}`, null, 'DELETE');

            if (!res?.success) {
                throw new Error(res?.message || "Deletion failed");
            }

            showToast.success("Project deleted!");
            navigate('/dashboard');
            return true;

        } catch (err) {
            console.error("DELETE ERROR:", err);
            showToast.error(err.message || "Failed to delete");
            return false;

        } finally {
            setLoading(false);
            hideLoader();
        }
    };

    return { deleteProject, loading };
};

// ✅ GET PROJECT BY SLUG
export const useGetProjectBySlug = () => {
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState(null);
    const { showLoader, hideLoader } = useLoader();

    const getProjectBySlug = async (slug, showGlobalLoader = true) => {
        if (!slug) return null;

        setLoading(true);
        if (showGlobalLoader) {
            showLoader('Loading project...', 'spinner');
        }

        try {
            const res = await apiCall('/V1/user/projects', null, 'GET');

            if (!res?.success) {
                throw new Error(res?.message || "Failed to fetch");
            }

            const projectsData = res.result || res.data || [];
            const found = projectsData.find(p => {
                const projectSlug = p.data?.slug || p.slug;
                return projectSlug === String(slug) || String(p.id) === String(slug);
            });

            if (!found) throw new Error('Project not found');

            const normalized = normalizeProject(found);
            setProject(normalized);
            return normalized;

        } catch (err) {
            console.error("GET BY SLUG ERROR:", err);
            showToast.error(err.message || "Failed to fetch");
            setProject(null);
            return null;

        } finally {
            setLoading(false);
            if (showGlobalLoader) {
                hideLoader();
            }
        }
    };

    return { getProjectBySlug, project, loading };
};