import React from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';

const CouponTableHeader = () => {
    const headers = ['Code', 'Type', 'Discount', 'Usage', 'Valid Period', 'Status', 'Actions'];

    return (
        <TableHead>
            <TableRow
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
            >
                {headers.map((header) => (
                    <TableCell
                        key={header}
                        sx={{ color: 'white', fontWeight: 700 }}
                    >
                        {header}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

export default CouponTableHeader;