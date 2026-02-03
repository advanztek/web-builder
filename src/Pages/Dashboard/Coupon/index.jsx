import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Fade, Box, } from '@mui/material';
import { useGetCoupons, useDeleteCoupon } from '../../../Hooks/coupon';
import CouponHeading from './CouponHeading';
import CouponStats from './CouponStats';
import CouponFilters from './CouponFilters';
import CouponTable from './CouponTable';
import DeleteCouponDialog from './DeleteCouponDialog';
import { getStatusBadge } from './data';

const CouponPage = () => {
    const navigate = useNavigate();
    const { getCoupons, coupons, loading, pagination } = useGetCoupons();
    const { deleteCoupon } = useDeleteCoupon();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [couponToDelete, setCouponToDelete] = useState(null);

    useEffect(() => {
        fetchCoupons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage, filterStatus, filterType]);

    const fetchCoupons = async () => {
        const filters = {
            offset: page * rowsPerPage,
            limit: rowsPerPage,
            ...(filterStatus !== 'all' && { status: filterStatus === 'active' }),
            ...(filterType !== 'all' && { discount_type: filterType }),
            ...(searchTerm && { search: searchTerm }),
        };
        await getCoupons(filters);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchCoupons();
    };

    const handleDeleteClick = (coupon) => {
        setCouponToDelete(coupon);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteCoupon(couponToDelete.id);
            setShowDeleteModal(false);
            setCouponToDelete(null);
            fetchCoupons();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Calculate stats
    const stats = {
        total: pagination.total,
        active: coupons.filter((c) => getStatusBadge(c).text === 'Active').length,
        scheduled: coupons.filter((c) => getStatusBadge(c).text === 'Scheduled').length,
        expired: coupons.filter((c) => getStatusBadge(c).text === 'Expired').length,
    };

    return (
        <Container maxWidth="lg" sx={{ pt: 14, pb: 4 }}>
            <Fade in timeout={600}>
                <Box> <CouponHeading onCreateClick={() => navigate('/dashboard/coupons/create')} /></Box>
            </Fade>

            <Fade in timeout={600} style={{ transitionDelay: '100ms' }}>
                <Box> <CouponStats stats={stats} /></Box>
            </Fade>

            <Fade in timeout={600} style={{ transitionDelay: '200ms' }}>
                <Box> <CouponFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    filterType={filterType}
                    setFilterType={setFilterType}
                    onSearch={handleSearch}
                /></Box>
            </Fade>

            <Fade in timeout={600} style={{ transitionDelay: '300ms' }}>
                <Box> <CouponTable
                    coupons={coupons}
                    loading={loading}
                    pagination={pagination}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    onDeleteClick={handleDeleteClick}
                    onCreateClick={() => navigate('/dashboard/coupons/create')}
                    onViewClick={(id) => navigate(`/dashboard/coupons/view/${id}`)}
                    onEditClick={(id) => navigate(`/dashboard/coupons/edit/${id}`)}
                /></Box>
            </Fade>

            <DeleteCouponDialog
                open={showDeleteModal}
                coupon={couponToDelete}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
            />
        </Container>
    );
};

export default CouponPage;