// SortingComponent.js
import React from 'react';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableCell from '@mui/material/TableCell';

const SortingComponent = ({ column, sortBy, direction, handleSort }) => {
    return (
        <TableCell>
            <TableSortLabel
                active={sortBy === column}
                direction={sortBy === column ? direction : 'asc'}
                onClick={() => handleSort(column)}
            >
                {column.charAt(0).toUpperCase() + column.slice(1)}
            </TableSortLabel>
        </TableCell>
    );
};

export default SortingComponent;
