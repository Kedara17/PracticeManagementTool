import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PaginationComponent from '../Components/PaginationComponent'; // Import your PaginationComponent
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment } from '@mui/material';
import ClientList from '../ClientServices/ClientList';

function DepartmentList({isDrawerOpen}) {
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

    const [order, setOrder] = useState('asc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [errors, setErrors] = useState({
        name: '',
    }
    );

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                // const deptResponse = await axios.get('http://localhost:5560/api/department');
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
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedDepartments = [...departments].sort((a, b) => {
        const valueA = a[orderBy] || '';
        const valueB = b[orderBy] || '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return order === 'asc' ? (valueA > valueB ? 1 : -1) : (valueB > valueA ? 1 : -1);
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
        // axios.delete(`http://localhost:5560/api/Department/${id}`)
        // axios.delete(`http://172.17.31.61:5160/api/department/${id}`)
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

    const handleSave = () => {
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
            // axios.put(`http://localhost:5560/api/Department/${currentDepartment.id}`, currentDepartment)
            axios.put(`http://172.17.31.61:5160/api/department/${currentDepartment.id}`, currentDepartment)
                .then(response => {
                    setDepartments(departments.map(dept => dept.id === currentDepartment.id ? response.data : dept));
                })
                .catch(error => {
                    console.error('There was an error updating the Department!', error);
                    setError(error);
                });

        } else {
            // axios.post('http://localhost:5560/api/Department', currentDepartment)
            axios.post('http://172.17.31.61:5160/api/department', currentDepartment)
                .then(response => {
                    setDepartments([...departments, response.data]);
                })
                .catch(error => {
                    console.error('There was an error adding the Department!', error);
                    setError(error);
                });
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
            else if (ClientList.some(cli => cli.name.toLowerCase() === value.toLowerCase() && cli.id !== currentDepartment.id)) {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            }
            // Clear the title error if valid
            else {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            }
        }

        if (name === "lineofBusiness") {
            // Clear the lineofBusiness error if the user selects a value
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, lineofBusiness: "" }));
            }
        }
        if (name === "salesEmployee") {
            // Clear the salesEmployee error if the user selects a value
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, salesEmployee: "" }));
            }
        }

        if (name === "country") {
            // Clear the country error if the user selects a value
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, country: "" }));
            }
        }
        if (name === "city") {
            // Clear the city error if the user selects a value
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, city: "" }));
            }
        }
        if (name === "state") {
            // Clear the state error if the user selects a value
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, state: "" }));
            }
        }
        if (name === "address") {
            // Clear the address error if the user selects a value
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, address: "" }));
            }
        }
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
        <div style={{ display: 'flex', padding: '10px', marginLeft: isDrawerOpen ? 260 : 0, transition: 'margin-left 0.3s', flexGrow: 1 }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '25px' }}>Department Table List</h3>
                <div style={{ display: 'flex', marginBottom: '20px', width: '100%' }}>
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
                        style={{ marginRight: '20px', flexGrow: 1 }}
                    />
                    <Button variant="contained" sx={{ backgroundColor: '#00aae7' }} onClick={handleAdd}>Add Department</Button>
                </div>
                <TableContainer component={Paper} style={{ width: '100%' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'name'}
                                        direction={orderBy === 'name' ? order : 'asc'}
                                        onClick={() => handleSort('name')}
                                    >
                                        Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'isActive'}
                                        direction={orderBy === 'isActive' ? order : 'asc'}
                                        onClick={() => handleSort('isActive')}
                                    >
                                        Is Active
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'createdBy'}
                                        direction={orderBy === 'createdBy' ? order : 'asc'}
                                        onClick={() => handleSort('createdBy')}
                                    >
                                        Created By
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'createdDate'}
                                        direction={orderBy === 'createdDate' ? order : 'asc'}
                                        onClick={() => handleSort('createdDate')}
                                    >
                                        Created Date
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'updatedBy'}
                                        direction={orderBy === 'updatedBy' ? order : 'asc'}
                                        onClick={() => handleSort('updatedBy')}
                                    >
                                        Updated By
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'updatedDate'}
                                        direction={orderBy === 'updatedDate' ? order : 'asc'}
                                        onClick={() => handleSort('updatedDate')}
                                    >
                                        Updated Date
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDepartments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((Department) => (
                                <TableRow key={Department.id}
                                    sx={{ backgroundColor: Department.isActive ? 'inherit' : '#FFCCCB' }}>
                                    <TableCell>{Department.name}</TableCell>
                                    <TableCell>{Department.isActive ? 'Active' : 'Inactive'}</TableCell>
                                    <TableCell>{Department.createdBy}</TableCell>
                                    <TableCell>{new Date(Department.createdDate).toLocaleString()}</TableCell>
                                    <TableCell>{Department.updatedBy || 'N/A'}</TableCell>
                                    <TableCell>{new Date(Department.updatedDate).toLocaleString()}</TableCell>
                                    <TableCell>
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
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
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
                        <Button onClick={handleConfirmClose}>Cancel</Button>
                        <Button onClick={handleConfirmYes} color="error">Ok</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default DepartmentList;
