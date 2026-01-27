import React from 'react';
import {
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const PackageFeatures = ({ features, theme }) => {
    if (!features || features.length === 0) return null;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                my: 3,
                borderRadius: 2,
            }}
        >
            <List dense disablePadding>
                {features.map((feature, idx) => (
                    <ListItem key={idx} disableGutters>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircle
                                sx={{
                                    color: '#4ade80',
                                    fontSize: 20,
                                }}
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary={feature}
                            primaryTypographyProps={{
                                fontSize: '0.85rem',
                                color: theme.palette.text.secondary,
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default PackageFeatures;