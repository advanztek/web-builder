/**
 * HELPER: Normalize project data - HANDLES ACTUAL BACKEND STRUCTURE
 */
export const normalizeProjectData = (rawProject) => {
    if (!rawProject) return null;

    console.log('Raw project structure:', {
        hasId: !!rawProject.id,
        hasName: !!rawProject.name,
        hasPages: !!rawProject.pages,
        hasDataPages: !!rawProject.data?.pages,
        hasActivePageId: !!rawProject.activePageId,
        hasDataActivePageId: !!rawProject.data?.activePageId
    });

    // Extract pages from all possible locations
    let pages = null;

    if (rawProject.pages && typeof rawProject.pages === 'object' && Object.keys(rawProject.pages).length > 0) {
        console.log('Found pages at root level');
        pages = rawProject.pages;
    } else if (rawProject.data?.pages && typeof rawProject.data.pages === 'object' && Object.keys(rawProject.data.pages).length > 0) {
        console.log('Found pages in data.pages');
        pages = rawProject.data.pages;
    }

    // Create default page if none exist
    if (!pages || Object.keys(pages).length === 0) {
        console.warn('No pages found anywhere, creating default home page');
        const homePageId = 'page-1';
        pages = {
            [homePageId]: {
                id: homePageId,
                name: 'Home',
                slug: 'home',
                isHome: true,
                gjsData: { html: '', css: '', components: [], styles: [] },
                createdAt: Date.now(),
                updatedAt: Date.now()
            }
        };
    }

    // Ensure each page has proper gjsData structure
    Object.keys(pages).forEach(pageId => {
        const page = pages[pageId];
        if (!page.gjsData || page.gjsData === null) {
            pages[pageId] = {
                ...page,
                gjsData: {
                    html: page.html || '',
                    css: page.css || '',
                    components: page.components || [],
                    styles: page.styles || []
                }
            };
        } else if (typeof page.gjsData === 'object') {
            pages[pageId] = {
                ...page,
                gjsData: {
                    html: page.gjsData.html || '',
                    css: page.gjsData.css || '',
                    components: page.gjsData.components || [],
                    styles: page.gjsData.styles || []
                }
            };
        }
    });

    // Get activePageId from all possible locations
    let activePageId = rawProject.activePageId || rawProject.data?.activePageId;

    // Validate and fallback
    if (!activePageId || !pages[activePageId]) {
        const homePage = Object.keys(pages).find(id => pages[id].isHome);
        activePageId = homePage || Object.keys(pages)[0];
    }

    return {
        id: rawProject.id,
        name: rawProject.name || rawProject.data?.name || rawProject.title || 'Untitled Project',
        slug: rawProject.slug || rawProject.data?.slug || `project-${rawProject.id}`,
        title: rawProject.title || rawProject.data?.title || rawProject.name,
        status: rawProject.status || rawProject.data?.status || 'draft',
        createdAt: rawProject.createdAt || rawProject.created_at || Date.now(),
        updatedAt: rawProject.updatedAt || rawProject.updated_at || Date.now(),
        data: {
            name: rawProject.name || rawProject.data?.name || rawProject.title,
            slug: rawProject.slug || rawProject.data?.slug,
            title: rawProject.title || rawProject.data?.title,
            pages,
            activePageId,
            seo: rawProject.data?.seo || rawProject.seo,
            theme: rawProject.data?.theme || rawProject.theme,
            sections: rawProject.data?.sections || rawProject.sections || [],
            settings: rawProject.data?.settings || rawProject.settings,
            gallery: rawProject.data?.gallery || rawProject.gallery || []
        },
        pages,
        activePageId
    };
};

export const customScrollbarStyles = {
    '&::-webkit-scrollbar': { width: '8px' },
    '&::-webkit-scrollbar-track': {
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '10px',
        transition: 'all 0.3s ease',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: 'linear-gradient(180deg, #764ba2 0%, #667eea 100%)',
        width: '10px',
    },
    scrollbarWidth: 'thin',
    scrollbarColor: '#667eea rgba(255, 255, 255, 0.05)',
};