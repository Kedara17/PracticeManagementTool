import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PaginationComponent from '../Components/PaginationComponent'; // Import your PaginationComponent

function SOWStatusList() {
    const [SOWStatus, setSOWStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentSOWStatus, setCurrentSOWStatus] = useState({
        status: ''
    });
    const [order, setOrder] = useState('asc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [errors, setErrors] = useState({
        status: '',
    }
    );

    useEffect(() => {
        const fetchSowStatus = async () => {
            try {
                const sowStatusResponse = await axios.get('http://172.17.31.61:5041/api/sowstatus');
                setSOWStatus(sowStatusResponse.data);
            } catch (error) {
                console.error('There was an error fetching the sowStatus!', error);
                setError(error);
            }
            setLoading(false);
        };

        fetchSowStatus();
    }, []);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedSOWStatus = [...SOWStatus].sort((a, b) => {
        const valueA = a[orderBy] || '';
        const valueB = b[orderBy] || '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return order === 'asc' ? (valueA > valueB ? 1 : -1) : (valueB > valueA ? 1 : -1);
        }
    });

    const filteredSOWStatus = sortedSOWStatus.filter((SOWStatus) =>

        SOWStatus.status && typeof SOWStatus.status === 'string' &&
        SOWStatus.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAdd = () => {
        setCurrentSOWStatus({
            status: ''
        });
        setOpen(true);
    };

    const handleUpdate = (SOWStatus) => {
        setCurrentSOWStatus(SOWStatus);
        setOpen(true);

    };

    const handleDelete = (id) => {
        //axios.delete(`http://localhost:5041/api/SOWStatus/${id}`)
        axios.delete(`http://172.17.31.61:5041/api/sowstatus/${id}`)
            .then(response => {
                setSOWStatus(SOWStatus.filter(tech => tech.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the SOWStatus!', error);
                setError(error);
            });
        setConfirmOpen(false);
    };

    const handleSave = () => {
        let validationErrors = {};

        // Name field validation
        if (!currentSOWStatus.status.trim()) {
            validationErrors.status = "Status cannot be empty or whitespace";
        } else if (SOWStatus.some(stat => stat.status === currentSOWStatus.status && stat.id !== currentSOWStatus.id)) {
            validationErrors.status = "Status must be unique";
        }

        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        if (currentSOWStatus.id) {
            // Update existing SOWStatus
            //axios.put(`http://localhost:5041/api/SOWStatus/${currentSOWStatus.id}`, currentSOWStatus)
            axios.put(`http://172.17.31.61:5041/api/sowstatus/${currentSOWStatus.id}`, currentSOWStatus)
                .then(response => {
                    //setSOWStatuss([...SOWStatuss, response.data]);
                    setSOWStatus(SOWStatus.map(tech => tech.id === currentSOWStatus.id ? response.data : tech));
                })
                .catch(error => {
                    console.error('There was an error updating the SOWStatus!', error);
                    setError(error);
                });

        } else {
            // Add new SOWStatus
            //axios.post('http://localhost:5041/api/SOWStatus', currentSOWStatus)
            axios.post('http://172.17.31.61:5041/api/sowstatus', currentSOWStatus)
                .then(response => {
                    setSOWStatus([...SOWStatus, response.data]);
                })
                .catch(error => {
                    console.error('There was an error adding the SOWStatus!', error);
                    setError(error);
                });
        }
        setOpen(false);

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentSOWStatus({ ...currentSOWStatus, [name]: value });
        if (name === "status") {
            // Check if the name is empty or only whitespace
            if (!value.trim()) {
                setErrors((prevErrors) => ({ ...prevErrors, status: "" }));
            }
            // Check for uniqueness
            else if (SOWStatus.some(stat => stat.name === value && stat.id !== currentSOWStatus.id)) {
                setErrors((prevErrors) => ({ ...prevErrors, status: "" }));
            }
            // Clear the name error if valid
            else {
                setErrors((prevErrors) => ({ ...prevErrors, status: "" }));
            }
        }
    };

    const handleClose = () => {
        setCurrentSOWStatus({ status: '', }); // Reset the department fields
        setErrors({ status: '', }); // Reset the error state
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
                <h3>SOWStatus Table List</h3>
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
                <Button variant="contained" color="primary" onClick={handleAdd}>Add SOWStatus</Button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'status'}
                                    direction={orderBy === 'status' ? order : 'asc'}
                                    onClick={() => handleSort('status')}
                                >
                                    <b>Status</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'isActive'}
                                    direction={orderBy === 'isActive' ? order : 'asc'}
                                    onClick={() => handleSort('isActive')}
                                >
                                    <b>Is Active</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'createdBy'}
                                    direction={orderBy === 'createdBy' ? order : 'asc'}
                                    onClick={() => handleSort('createdBy')}
                                >
                                    <b>Created By</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'createdDate'}
                                    direction={orderBy === 'createdDate' ? order : 'asc'}
                                    onClick={() => handleSort('createdDate')}
                                >
                                    <b>Created Date</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'updatedBy'}
                                    direction={orderBy === 'updatedBy' ? order : 'asc'}
                                    onClick={() => handleSort('updatedBy')}
                                >
                                    <b>Updated By</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'updatedDate'}
                                    direction={orderBy === 'updatedDate' ? order : 'asc'}
                                    onClick={() => handleSort('updatedDate')}
                                >
                                    <b>Updated Date</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSOWStatus.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((SOWStatus) => (
                            <TableRow key={SOWStatus.id}>
                                {/* <TableCell>{SOWStatus.id}</TableCell> */}
                                <TableCell>{SOWStatus.status}</TableCell>
                                <TableCell>{SOWStatus.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{SOWStatus.createdBy}</TableCell>
                                <TableCell>{new Date(SOWStatus.createdDate).toLocaleString()}</TableCell>
                                <TableCell>{SOWStatus.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{SOWStatus.updatedDate ? new Date(SOWStatus.updatedDate).toLocaleString() : 'N/A'}</TableCell>
                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(SOWStatus)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(SOWStatus.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <PaginationComponent
                    count={filteredSOWStatus.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentSOWStatus.id ? 'Update SOWStatus' : 'Add SOWStatus'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Status"
                        name="status"
                        value={currentSOWStatus.status}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.status} // Display error if exists
                        helperText={errors.status}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentSOWStatus.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this sowStatus?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>No</Button>
                    <Button onClick={handleConfirmYes} color="error">Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default SOWStatusList;
