import { Box, Typography } from '@mui/material';


export const DomainsPanel = () => (
    <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Purchase Domain Names</Typography>
        <Typography color="text.secondary">
            Search and purchase available domain names for your projects.
        </Typography>
        <Typography sx={{ mt: 2 }}>
            Example:
            <br />• mybusiness.com — Available
            <br />• startup.io — Available
        </Typography>
    </Box>
);