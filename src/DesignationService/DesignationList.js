import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PaginationComponent from '../Components/PaginationComponent'; // Import your PaginationComponent
import { InputLabel,TablePagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment } from '@mui/material';

function DesignationList({ isDrawerOpen }) {
    const [designations, setDesignations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentDesignation, setCurrentDesignation] = useState({
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
        const fetchDesignations = async () => {
            try {
                const desigResponse = await axios.get('http://172.17.31.61:5201/api/designation');
                setDesignations(desigResponse.data);
            } catch (error) {
                console.error('There was an error fetching the designation!', error);
                setError(error);
            }
            setLoading(false);
        };
        fetchDesignations();
    }, []);

    const handleSort = (property) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const sortedDesignation = [...designations].sort((a, b) => {
        const valueA = a[orderBy] || '';
        const valueB = b[orderBy] || '';

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

    const filteredDesignation = sortedDesignation.filter((Designation) =>
        Designation.name && typeof Designation.name === 'string' &&
        Designation.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAdd = () => {
        setCurrentDesignation({
            name: ''
        });
        setOpen(true);
    };

    const handleUpdate = (Designation) => {
        setCurrentDesignation(Designation);
        setOpen(true);

    };

    const handleDelete = (id) => {
        axios.patch(`http://172.17.31.61:5201/api/designation/${id}`)
            .then(response => {
                setDesignations(designations.filter(desig => desig.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the Designation!', error);
                setError(error);
            });
        setConfirmOpen(false);
    };

    const handleSave = async () => {
        let validationErrors = {};

        // Name field validation
        if (!currentDesignation.name.trim()) {
            validationErrors.name = "Designation is required";
        }else if (currentDesignation.name.length < 3) {
            validationErrors.name = "Name must be atleast 3 characters";
        }  else if (designations.some(des => des.name.toLowerCase() === currentDesignation.name.toLowerCase() && des.id !== currentDesignation.id)) {
            validationErrors.name = "Name must be unique";
        }

        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        if (currentDesignation.id) {
            await axios.put(`http://172.17.31.61:5201/api/designation/${currentDesignation.id}`, currentDesignation)
            const Response = await axios.get('http://172.17.31.61:5201/api/designation');
            setDesignations(Response.data);

        } else {
            await axios.post('http://172.17.31.61:5201/api/designation', currentDesignation)
            const Response = await axios.get('http://172.17.31.61:5201/api/designation');
            setDesignations(Response.data);
        }
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentDesignation({ ...currentDesignation, [name]: value });
        if (name === "name") {
            // Check if the name is empty or only whitespace
            if (!value.trim()) {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            }else if (value.length < 3) {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            } 
            // Check for uniqueness
            else if (designations.some(des => des.name.toLowerCase() === value.toLowerCase() && des.id !== currentDesignation.id)) {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            } else if (value.length === 50) {
                setErrors((prevErrors) => ({ ...prevErrors, name: "More than 50 characters are not allowed" }));
            }
            // Clear the name error if valid
            else {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            }
        }
    };

    const handleClose = () => {
        setCurrentDesignation({ name: '' }); // Reset the department fields
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
        <div style={{ display: 'flex', flexDirection: 'column', padding: '10px', marginLeft: isDrawerOpen ? 250 : 0, transition: 'margin-left 0.3s', flexGrow: 1 }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '25px' }}>Designation Table List</h3>
            </div>
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
                    style={{ flexGrow: 1, marginRight: '10px' }}
                />
                <Button variant="contained" sx={{ backgroundColor: '#00aae7' }} onClick={handleAdd}>Add Designation</Button>
            </div>
            <TableContainer component={Paper} style={{ width: '100%' }}>
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
                            <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDesignation.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((Designation) => (
                            <TableRow key={Designation.id}
                                sx={{ backgroundColor: Designation.isActive ? 'inherit' : '#FFCCCB' }} // Set background color conditionally
                            >
                                {/* <TableCell>{Designation.id}</TableCell> */}
                                <TableCell>{Designation.name}</TableCell>
                                <TableCell>{Designation.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{Designation.createdBy}</TableCell>
                                <TableCell>{Designation.createdDate}</TableCell>
                                <TableCell>{Designation.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{Designation.updatedDate || 'N/A'}</TableCell>
                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(Designation)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(Designation.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* <PaginationComponent
                    count={filteredDesignation.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                /> */}
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredDesignation.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentDesignation.id ? 'Update Designation' : 'Add Designation'}</DialogTitle>
                <DialogContent>
                    <InputLabel>Name</InputLabel>
                    <TextField
                        margin="dense"
                        name="name"
                        value={currentDesignation.name}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[A-Za-z\s]*$/.test(value))
                                handleChange(e);
                        }}
                        fullWidth
                        error={!!errors.name} // Display error if exists
                        helperText={errors.name}
                        inputProps={{ maxLength: 50 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentDesignation.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this Designation?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>Cancel</Button>
                    <Button onClick={handleConfirmYes} color="error">Ok</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DesignationList;
