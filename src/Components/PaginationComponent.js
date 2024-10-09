import React from 'react';
import { TablePagination } from '@mui/material';

function PaginationComponent({ count, page, rowsPerPage, handlePageChange, handleRowsPerPageChange }) {
    return (
        <TablePagination
            component="div"
            count={count}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[10, 25, 50]}
        />
    );
}

export default PaginationComponent;
