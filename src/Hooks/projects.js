import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../Utils/toast';
import { useLoader } from '../Context/LoaderContext';
import { apiCall } from '../Utils/ApiCall';


const createDefaultPages = () => {
    const homePageId = 'page-1';
    return {
        [homePageId]: {
            id: homePageId,
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

//CREATE PROJECT
export const useCreateProject = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();

    const createProject = async (input) => {
        setLoading(true);
        showLoader('Creating your project...', 'orbit');

        try {
            let payload;
            // PROMPT MODE
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

                console.log("PROMPT PAYLOAD:", payload);

                const res = await apiCall("/V1/user/project/create", payload);
                console.log("FULL RESPONSE:", res);

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

                console.log("EXTRACTED PROJECT:", created);

                if (!created) {
                    console.error("No valid project in response");
                    throw new Error("Failed to create project - invalid response");
                }

                if (!created.id) {
                    console.warn("Project has no ID, using slug or generating one");
                    created.id = created.slug || created.data?.slug || `project-${Date.now()}`;
                }

                console.log("Raw project data being stored:", {
                    id: created.id,
                    pages: created.pages || created.data?.pages,
                    activePageId: created.activePageId || created.data?.activePageId
                });

                try {
                    const recentProjects = JSON.parse(localStorage.getItem('recent_projects') || '[]');
                    recentProjects.unshift(created);
                    localStorage.setItem('recent_projects', JSON.stringify(recentProjects.slice(0, 10)));
                } catch (e) {
                    console.warn('Could not store in localStorage:', e);
                }

                try {
                    sessionStorage.setItem('pending_project', JSON.stringify(created));
                    console.log('Stored raw backend response in sessionStorage');
                } catch (e) {
                    console.warn('Could not store in sessionStorage:', e);
                }

                const slug = created.slug || created.data?.slug || created.id;
                console.log("Navigating to editor:", slug);

                hideLoader();
                showToast.success('Project created successfully!');

                navigate(`/dashboard/editor/${slug}`, {
                    state: { createdProject: created },
                    replace: false
                });

                return created;
            }
            // MANUAL MODE
            payload = {
                mode: "manual",
                data: input.data
            };

            console.log("MANUAL PAYLOAD:", payload);

            const res = await apiCall("/V1/user/project/create", payload);
            console.log("MANUAL RESPONSE:", res);

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

            console.log("CREATED PROJECT:", created);

            if (!created) {
                throw new Error("Invalid response from server");
            }

            if (!created.id) {
                console.warn("Project has no ID, using slug or generating one");
                created.id = created.slug || created.data?.slug || `project-${Date.now()}`;
            }

            console.log("Raw manual project data being stored:", {
                id: created.id,
                pages: created.pages || created.data?.pages,
                activePageId: created.activePageId || created.data?.activePageId
            });

            try {
                sessionStorage.setItem('pending_project', JSON.stringify(created));
                console.log('Stored raw backend response in sessionStorage');
            } catch (e) {
                console.warn('Could not store in sessionStorage:', e);
            }

            const slug = created.slug || created.data?.slug || created.id;
            console.log("Navigating to:", `/dashboard/editor/${slug}`);

            hideLoader();
            showToast.success('Project created successfully!');

            navigate(`/dashboard/editor/${slug}`, {
                state: { createdProject: created },
                replace: false
            });

            return created;

        } catch (err) {
            console.error("CREATE PROJECT ERROR:", err);
            hideLoader();

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

//GET ALL PROJECTS
export const useGetProjects = () => {
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    const getProjects = async () => {
        setLoading(true);
        showLoader('Loading projects...', 'dots');

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

            hideLoader();
            return normalized;

        } catch (err) {
            console.error("GET PROJECTS ERROR:", err);
            hideLoader();

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else {
                showToast.error(err.message || 'Failed to load projects');
            }

            setProjects([]);
            return [];

        } finally {
            setLoading(false);
        }
    };

    return { getProjects, projects, loading };
};

//GET SINGLE PROJECT
export const useGetProject = () => {
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState(null);
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    const getProject = async (projectId, showGlobalLoader = true) => {
        if (!projectId) {
            console.warn('No projectId provided to getProject');
            return null;
        }

        setLoading(true);
        if (showGlobalLoader) {
            showLoader('Loading project...', 'spinner');
        }

        try {
            console.log(`Looking for project: ${projectId}`);

            // Strategy 1: Try direct fetch
            try {
                const res = await apiCall(`/V1/user/project/${projectId}`, null, 'GET');

                if (res?.success && (res.result || res.data)) {
                    const projectData = res.result || res.data;
                    console.log('Found via direct fetch');
                    const normalized = normalizeProject(projectData);
                    setProject(normalized);
                    hideLoader();
                    return normalized;
                }
            } catch (directError) {
                console.warn(`Direct fetch failed:`, directError.message);
            }

            // Strategy 2: Get all projects and search
            console.log('Searching in all projects...');
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
                    console.log('Found in all projects list');
                    const normalized = normalizeProject(found);
                    setProject(normalized);
                    hideLoader();
                    return normalized;
                }
            }

            // Strategy 3: Check sessionStorage
            console.log('Checking sessionStorage...');
            const pendingProject = sessionStorage.getItem('pending_project');
            if (pendingProject) {
                try {
                    const parsed = JSON.parse(pendingProject);
                    if (String(parsed.id) === String(projectId) ||
                        String(parsed.slug) === String(projectId)) {
                        console.log('Found in sessionStorage');
                        const normalized = normalizeProject(parsed);
                        setProject(normalized);
                        sessionStorage.removeItem('pending_project');
                        hideLoader();
                        return normalized;
                    }
                } catch (e) {
                    console.warn('Failed to parse sessionStorage:', e);
                }
            }

            // Strategy 4: Check localStorage
            console.log('Checking localStorage...');
            try {
                const recentProjects = JSON.parse(localStorage.getItem('recent_projects') || '[]');
                const found = recentProjects.find(p =>
                    String(p.id) === String(projectId) ||
                    String(p.slug) === String(projectId)
                );

                if (found) {
                    console.log('Found in localStorage');
                    const normalized = normalizeProject(found);
                    setProject(normalized);
                    hideLoader();
                    return normalized;
                }
            } catch (e) {
                console.warn('Failed to check localStorage:', e);
            }

            console.error('Project not found anywhere');
            throw new Error('Project not found');

        } catch (err) {
            console.error("GET PROJECT ERROR:", err);
            hideLoader();

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else if (!err.message?.includes('not found')) {
                showToast.error(err.message || 'Failed to load project');
            }

            setProject(null);
            return null;

        } finally {
            setLoading(false);
        }
    };

    return { getProject, project, loading };
};

//UPDATE PROJECT
export const useUpdateProject = () => {
    const [loading, setLoading] = useState(false);
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    const updateProject = async (projectId, updateData, showGlobalLoader = false) => {
        setLoading(true);
        if (showGlobalLoader) {
            showLoader('Saving changes...', 'pulse');
        }

        try {
            console.log('UPDATE REQUEST:', {
                projectId,
                updateKeys: Object.keys(updateData)
            });

            const payload = {
                mode: 'manual',
                data: updateData
            };

            const res = await apiCall(`/V1/user/project/update/${projectId}`, payload, 'PATCH');

            if (!res?.success) {
                throw new Error(res?.message || "Update failed");
            }

            const result = res.result || res.data;

            if (showGlobalLoader) {
                hideLoader();
                showToast.success('Changes saved successfully!');
            }

            return result ? normalizeProject(result) : null;

        } catch (err) {
            console.error("UPDATE ERROR:", err);

            if (showGlobalLoader) {
                hideLoader();
            }

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else if (!err.message?.includes('Validation')) {
                if (showGlobalLoader) {
                    showToast.error(err.message || "Failed to save");
                }
            } else {
                console.warn('Validation error during save');
            }

            return null;

        } finally {
            setLoading(false);
        }
    };

    return { updateProject, loading };
};

// AI UPDATE PROJECT
// export const useAIUpdateProject = () => {
//     const [loading, setLoading] = useState(false);
//     const { showLoader, hideLoader } = useLoader();
//     const navigate = useNavigate();

//     const aiUpdateProject = async (projectId, updateData) => {
//         setLoading(true);
//         showLoader('AI is updating your page...', 'orbit');

//         try {
//             const payload = {
//                 mode: 'prompt',
//                 pageId: updateData.pageId,
//                 updates: {
//                     html: updateData.html,
//                     css: updateData.css,
//                     components: updateData.components,
//                     styles: updateData.styles
//                 }
//             };

//             const res = await apiCall(`/V1/project/ai-update-page/${projectId}`, payload, 'PATCH');

//             if (!res?.success) {
//                 throw new Error(res?.message || "AI update failed");
//             }

//             const result = res.result || res.data;

//             hideLoader();
//             showToast.success('AI update applied successfully!');

//             return result ? normalizeProject(result) : null;

//         } catch (err) {
//             console.error("❌ AI UPDATE ERROR:", err);
//             hideLoader();

//             if (err.message?.includes('Unauthorized')) {
//                 showToast.error('Session expired. Please log in again.');
//                 navigate('/login');
//             } else if (!err.message?.includes('Validation')) {
//                 showToast.error(err.message || "Failed to apply AI updates");
//             }

//             return null;

//         } finally {
//             setLoading(false);
//         }
//     };

//     return { aiUpdateProject, loading };
// };

// ✅ UPDATE PAGE WITH AI
export const useUpdatePageWithAI = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();

    const updatePageWithAI = async (input) => {
        setLoading(true);
        showLoader('Updating your page with AI...', 'orbit');

        try {
            // ✅ Format similar to create project (prompt mode)
            const payload = {
                projectId: input.projectId,
                pageId: input.pageId,
                prompt: input.prompt,
                files: input.files?.length ? input.files : undefined
            };

            console.log("AI UPDATE PAGE PAYLOAD:", payload);

            const res = await apiCall("/V1/user/project/ai-update-page", payload);
            console.log("AI UPDATE PAGE RESPONSE:", res);

            let updatedPage = null;

            // ✅ Parse response similar to create project
            if (res?.result?.data) {
                updatedPage = res.result.data;
            } else if (res?.data) {
                updatedPage = res.data;
            } else if (res?.result) {
                updatedPage = res.result;
            } else if (res?.project) {
                updatedPage = res.project;
            } else if (res?.page) {
                updatedPage = res.page;
            } else if (res?.id) {
                updatedPage = res;
            }

            console.log("EXTRACTED UPDATED PAGE:", updatedPage);

            if (!updatedPage) {
                console.error("No valid page in response");
                throw new Error("Failed to update page - invalid response");
            }

            hideLoader();
            showToast.success('Page updated successfully!');

            return updatedPage;

        } catch (err) {
            console.error("AI UPDATE PAGE ERROR:", err);
            hideLoader();

            if (err.message?.includes("Unauthorized")) {
                showToast.error("Session expired. Please log in again.");
                navigate("/login");
                return null;
            }

            showToast.error(err.message || "Failed to update page");
            return null;

        } finally {
            setLoading(false);
        }
    };

    return { updatePageWithAI, loading };
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

            hideLoader();
            showToast.success("Project deleted successfully!");
            navigate('/dashboard');
            return true;

        } catch (err) {
            console.error("❌ DELETE ERROR:", err);
            hideLoader();

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else {
                showToast.error(err.message || "Failed to delete project");
            }

            return false;

        } finally {
            setLoading(false);
        }
    };

    return { deleteProject, loading };
};

// ✅ GET PROJECT BY SLUG
export const useGetProjectBySlug = () => {
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState(null);
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    const getProjectBySlug = async (slug) => {
        if (!slug) {
            console.warn('No slug provided');
            return null;
        }

        setLoading(true);
        showLoader('Loading project...', 'spinner');

        try {
            const res = await apiCall('/V1/user/projects', null, 'GET');

            if (!res?.success) {
                throw new Error(res?.message || "Failed to fetch projects");
            }

            const projectsData = res.result || res.data || [];
            const found = projectsData.find(p => {
                const projectSlug = p.data?.slug || p.slug;
                return projectSlug === String(slug) || String(p.id) === String(slug);
            });

            if (!found) {
                throw new Error('Project not found');
            }

            const normalized = normalizeProject(found);
            setProject(normalized);

            hideLoader();
            return normalized;

        } catch (err) {
            console.error("❌ GET BY SLUG ERROR:", err);
            hideLoader();

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else {
                showToast.error(err.message || "Failed to load project");
            }

            setProject(null);
            return null;

        } finally {
            setLoading(false);
        }
    };

    return { getProjectBySlug, project, loading };
};