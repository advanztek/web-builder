import { styled, alpha } from '@mui/material/styles';
import { Card, Box, Button, Chip } from '@mui/material';

export const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.dark, 0.05)} 100%)`,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
        borderColor: theme.palette.primary.main,
    },
}));

export const StyledIconBox = styled(Box)(({ theme, color = 'primary' }) => ({
    width: 64,
    height: 64,
    borderRadius: theme.shape.borderRadius * 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(theme.palette[color].dark, 0.1)} 100%)`,
    color: theme.palette[color].main,
    marginBottom: theme.spacing(1.5),
}));

export const GradientButton = styled(Button)(({ theme }) => ({
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: theme.palette.common.white,
    fontWeight: 600,
    padding: '10px 24px',
    '&:hover': {
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.darker || theme.palette.primary.dark} 100%)`,
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[8],
    },
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

export const CodeChip = styled(Chip)(({ theme }) => ({
    fontFamily: '"Fira Code", "Courier New", monospace',
    fontWeight: 600,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    '& .MuiChip-deleteIcon': {
        color: theme.palette.primary.main,
        '&:hover': {
            color: theme.palette.primary.dark,
        },
    },
}));