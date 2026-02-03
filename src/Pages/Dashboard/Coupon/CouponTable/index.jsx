import React from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableContainer,
    TablePagination,
    LinearProgress,
} from '@mui/material';
import CouponTableRow from '../CouponTableRow';
import EmptyState from '../EmptyState';
import CouponTableHeader from '../CouponTableHeader';

const CouponTable = ({
    coupons,
    loading,
    pagination,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    onDeleteClick,
    onCreateClick,
    onViewClick,
    onEditClick,
}) => {
    return (
        <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
            {loading && <LinearProgress />}
            <Table>
                <CouponTableHeader />
                <TableBody>
                    {coupons.length === 0 && !loading ? (
                        <EmptyState onCreateClick={onCreateClick} />
                    ) : (
                        coupons.map((coupon) => (
                            <CouponTableRow
                                key={coupon.id}
                                coupon={coupon}
                                onView={onViewClick}
                                onEdit={onEditClick}
                                onDelete={onDeleteClick}
                            />
                        ))
                    )}
                </TableBody>
            </Table>
            {coupons.length > 0 && (
                <TablePagination
                    component="div"
                    count={pagination.total}
                    page={page}
                    onPageChange={onPageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={onRowsPerPageChange}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />
            )}
        </TableContainer>
    );
};

export default CouponTable;