import React, { useState } from 'react';
import {
    TableRow,
    TableCell,
    Stack,
    Tooltip,
    IconButton,
    Chip,
    Typography,
    Box,
    LinearProgress,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    ContentCopy as ContentCopyIcon,
    MoreVert as MoreVertIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Percent as PercentIcon,
    AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { CodeChip } from '../styles';
import { formatDate, getStatusBadge, getUsagePercentage, copyToClipboard } from '../data';
import { encodeId } from '../../../../Utils/IdUtils';
import { useNavigate } from 'react-router-dom';

const CouponTableRow = ({ coupon, onView, onEdit, onDelete }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const status = getStatusBadge(coupon);

    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleView = () => {
        const hashedId = encodeId(coupon.id);
        navigate(`/dashboard/coupons/view/${hashedId}`);
        handleMenuClose();
    };

    const handleEdit = () => {
        const hashedId = encodeId(coupon.id);
        navigate(`/dashboard/coupons/edit/${hashedId}`);
        handleMenuClose();
    };


    const handleDelete = () => {
        onDelete(coupon);
        handleMenuClose();
    };

    return (
        <>
            <TableRow
                hover
                sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                }}
            >
                <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <CodeChip label={coupon.code} size="small" />
                        <Tooltip title="Copy code">
                            <IconButton
                                size="small"
                                onClick={() => copyToClipboard(coupon.code)}
                            >
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </TableCell>
                <TableCell>
                    <Chip
                        icon={
                            coupon.discount_type === 'percentage' ? (
                                <PercentIcon />
                            ) : (
                                <AttachMoneyIcon />
                            )
                        }
                        label={
                            coupon.discount_type === 'percentage'
                                ? 'Percentage'
                                : 'Fixed'
                        }
                        size="small"
                        variant="outlined"
                    />
                </TableCell>
                <TableCell>
                    <Typography fontWeight={700} color="success.main">
                        {coupon.discount_type === 'percentage'
                            ? `${coupon.discount_value}%`
                            : `$${coupon.discount_value}`}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Box sx={{ width: 120 }}>
                        <LinearProgress
                            variant="determinate"
                            value={getUsagePercentage(coupon)}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'grey.200',
                            }}
                        />
                        <Typography variant="caption" color="text.secondary" mt={0.5}>
                            {coupon.used_count} / {coupon.usage_limit}
                        </Typography>
                    </Box>
                </TableCell>
                <TableCell>
                    <Typography variant="body2">
                        {formatDate(coupon.valid_from)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        → {formatDate(coupon.valid_until)}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Chip label={status.text} color={status.color} size="small" />
                </TableCell>
                <TableCell align="right">
                    <IconButton onClick={handleMenuOpen}>
                        <MoreVertIcon />
                    </IconButton>
                </TableCell>
            </TableRow>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleView}>
                    <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
                    View Details
                </MenuItem>
                <MenuItem onClick={handleEdit}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
            </Menu>
        </>
    );
};

export default CouponTableRow;