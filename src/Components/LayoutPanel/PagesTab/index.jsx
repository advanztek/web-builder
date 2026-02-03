import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Tooltip
} from '@mui/material';
import {
    Add,
    MoreVert,
    Home as HomeIcon
} from '@mui/icons-material';

export const PagesTab = ({
    project,
    pagesArray,
    currentPageId,
    updatingProject,
    onAddPage,
    onPageClick,
    onMenuOpen
}) => {
    if (!project) {
        return (
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#808080' }}>
                    Select or create a project to manage pages
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                bgcolor: '#0d0d0d'
            }}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: 600,
                        color: '#b0b0b0',
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px'
                    }}
                >
                    Pages ({pagesArray.length})
                </Typography>
                <Tooltip title="Add Page">
                    <IconButton
                        size="small"
                        onClick={onAddPage}
                        sx={{ color: '#1976d2' }}
                        disabled={updatingProject}
                    >
                        <Add fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            <List sx={{ py: 0, flex: 1, overflowY: 'auto' }}>
                {pagesArray.map((page) => (
                    <ListItem
                        key={page.id}
                        disablePadding
                        secondaryAction={
                            !page.isHome && (
                                <IconButton
                                    edge="end"
                                    size="small"
                                    onClick={(e) => onMenuOpen(e, page.id)}
                                    sx={{ color: '#808080' }}
                                >
                                    <MoreVert fontSize="small" />
                                </IconButton>
                            )
                        }
                    >
                        <ListItemButton
                            selected={currentPageId === page.id}
                            onClick={() => onPageClick(page.id)}
                            sx={{
                                '&.Mui-selected': {
                                    bgcolor: '#1976d2',
                                    '&:hover': {
                                        bgcolor: '#1565c0'
                                    }
                                },
                                '&:hover': {
                                    bgcolor: '#2a2a2a'
                                }
                            }}
                        >
                            {page.isHome && (
                                <HomeIcon sx={{ mr: 1, fontSize: 18, color: currentPageId === page.id ? 'white' : '#1976d2' }} />
                            )}
                            <ListItemText
                                primary={page.name}
                                primaryTypographyProps={{
                                    fontSize: '0.875rem',
                                    fontWeight: currentPageId === page.id ? 600 : 400
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </>
    );
};