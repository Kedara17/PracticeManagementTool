import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PaginationComponent from '../Components/PaginationComponent'; // Import your PaginationComponent
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment } from '@mui/material';

function DepartmentList() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentDepartment, setCurrentDepartment] = useState({
        name: ''
    });

    const [order, setOrder] = useState('desc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [errors, setErrors] = useState({
        name: '',
    }
    );

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const deptResponse = await axios.get('http://172.17.31.61:5160/api/department');
                setDepartments(deptResponse.data);
            } catch (error) {
                console.error('There was an error fetching the departments!', error);
                setError(error);
            }
            setLoading(false);
        };
        fetchDepartments();
    }, []);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'desc';
        setOrder(isAsc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const sortedDepartments = [...departments].sort((a, b) => {
        const valueA = a[orderBy] ?? ''; // Using nullish coalescing to handle null/undefined
        const valueB = b[orderBy] ?? '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'desc'
                ? valueB.localeCompare(valueA)
                : valueA.localeCompare(valueB);
        } else if (valueA instanceof Date && valueB instanceof Date) {
            return order === 'desc'
                ? valueB - valueA
                : valueA - valueB;
        } else {
            return order === 'desc'
                ? (valueA > valueB ? 1 : -1)
                : (valueB > valueA ? 1 : -1);
        }
    });

    const filteredDepartments = sortedDepartments.filter((department) =>
        department.name && typeof department.name === 'string' &&
        department.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const handleAdd = () => {
        setCurrentDepartment({
            name: ''
        });
        setOpen(true);
    };

    const handleUpdate = (Department) => {
        setCurrentDepartment(Department);
        setOpen(true);

    };

    const handleDelete = (id) => {
        axios.patch(`http://172.17.31.61:5160/api/department/${id}`)
            .then(response => {
                setDepartments(departments.filter(dept => dept.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the Department!', error);
                setError(error);
            });
        setConfirmOpen(false);
    };

    const handleSave = async () => {
        let validationErrors = {};

        // Name field validation
        if (!currentDepartment.name.trim()) {
            validationErrors.name = "Department name cannot be empty or whitespace";
        } else if (departments.some(dep => dep.name.toLowerCase() === currentDepartment.name.toLowerCase() && dep.id !== currentDepartment.id)) {
            validationErrors.name = "Department name must be unique";
        }

        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        if (currentDepartment.id) {
            await axios.put(`http://172.17.31.61:5160/api/department/${currentDepartment.id}`, currentDepartment)
            const deptResponse1 = await axios.get('http://172.17.31.61:5160/api/department');
            setDepartments(deptResponse1.data);

        } else {
            // axios.post('http://localhost:5560/api/Department', currentDepartment)
            await axios.post('http://172.17.31.61:5160/api/department', currentDepartment)
            const deptResponse = await axios.get('http://172.17.31.61:5160/api/department');
            setDepartments(deptResponse.data);
        }
        setOpen(false);

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentDepartment({ ...currentDepartment, [name]: value });
        if (name === "name") {
            // Check if the title is empty or only whitespace
            if (!value.trim()) {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            }
            // Check for uniqueness
            else if (departments.some(dep => dep.name.toLowerCase() === value.toLowerCase() && dep.id !== currentDepartment.id)) {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            }
            // Clear the title error if valid
            else {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            }
        }
    };

    const handleClose = () => {
        setCurrentDepartment({ name: '' }); // Reset the department fields
        setErrors({ name: '' }); // Reset the error state
        setOpen(false); // Close the dialog
    };


    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const confirmDelete = (id) => {
        setDeleteTechId(id);
        setConfirmOpen(true);
    };

    const handleConfirmClose = () => {
        setConfirmOpen(false);
    };

    const handleConfirmYes = () => {
        handleDelete(deleteTechId);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>There was an error loading the data: {error.message}</p>;
    }

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <h3>Department Table List</h3>
            </div>
            <div style={{ display: 'flex', marginBottom: '20px' }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton edge="end">
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    style={{ marginRight: '20px', width: '90%' }}
                />
                <Button variant="contained" color="primary" onClick={handleAdd}>Add Department</Button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* Sorting logic */}
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'desc'}
                                    onClick={() => handleSort('name')}
                                >
                                    <b>Name</b>
                                </TableSortLabel>
                            </TableCell>
                            {/* <TableCell>Name</TableCell> */}
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'isActive'}
                                    direction={orderBy === 'isActive' ? order : 'desc'}
                                    onClick={() => handleSort('isActive')}
                                >
                                    <b>Is Active</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'createdBy'}
                                    direction={orderBy === 'createdBy' ? order : 'desc'}
                                    onClick={() => handleSort('createdBy')}
                                >
                                    <b>Created By</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'createdDate'}
                                    direction={orderBy === 'createdDate' ? order : 'desc'}
                                    onClick={() => handleSort('createdDate')}
                                >
                                    <b>Created Date</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'updatedBy'}
                                    direction={orderBy === 'updatedBy' ? order : 'desc'}
                                    onClick={() => handleSort('updatedBy')}
                                >
                                    <b>Updated By</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'updatedDate'}
                                    direction={orderBy === 'updatedDate' ? order : 'desc'}
                                    onClick={() => handleSort('updatedDate')}
                                >
                                    <b>Updated Date</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell

                            ><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDepartments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((Department) => (
                            <TableRow key={Department.id}
                                sx={{ backgroundColor: Department.isActive ? 'inherit' : '#FFCCCB' }} >
                                {/* <TableCell>{Department.id}</TableCell> */}
                                <TableCell>{Department.name}</TableCell>
                                <TableCell>{Department.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{Department.createdBy}</TableCell>
                                <TableCell>{new Date(Department.createdDate).toLocaleString()}</TableCell>
                                <TableCell>{Department.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{Department.updatedDate || 'N/A'}</TableCell>
                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(Department)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(Department.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <PaginationComponent
                    count={filteredDepartments.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentDepartment.id ? 'Update Department' : 'Add Department'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Name"
                        name="name"
                        value={currentDepartment.name}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.name} // Display error if exists
                        helperText={errors.name}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentDepartment.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this Department?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>No</Button>
                    <Button onClick={handleConfirmYes} color="error">Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DepartmentList;
