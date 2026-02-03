import React from 'react';
import {
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    CalendarToday as CalendarTodayIcon,
    Percent as PercentIcon,
} from '@mui/icons-material';

import { Grid, CardContent, Typography } from '@mui/material';
import { StyledCard, StyledIconBox } from '../styles';

const CouponStats = ({ stats }) => {
    const statsConfig = [
        {
            title: 'Total Coupons',
            value: stats.total,
            icon: <TrendingUpIcon fontSize="large" />,
            color: 'primary',
        },
        {
            title: 'Active Coupons',
            value: stats.active,
            icon: <PeopleIcon fontSize="large" />,
            color: 'success',
        },
        {
            title: 'Scheduled',
            value: stats.scheduled,
            icon: <CalendarTodayIcon fontSize="large" />,
            color: 'info',
        },
        {
            title: 'Expired',
            value: stats.expired,
            icon: <PercentIcon fontSize="large" />,
            color: 'error',
        },
    ];
    return (
        <Grid container spacing={3} mb={4}>
            {statsConfig.map((stat, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <StyledCard>
                        <CardContent>
                            <StyledIconBox color={stat.color}>
                                {stat.icon}
                            </StyledIconBox>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {stat.title}
                            </Typography>
                            <Typography variant="h4" fontWeight={700}>
                                {stat.value}
                            </Typography>
                        </CardContent>
                    </StyledCard>
                </Grid>
            ))}
        </Grid>
    );
};

export default CouponStats;