import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table,TablePagination, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment, InputLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PaginationComponent from '../Components/PaginationComponent'; // Import your PaginationComponent

function SOWStatusList({isDrawerOpen}) {
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
            validationErrors.status = "Status is required";
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
            } else if (value.length === 50) {
                setErrors((prevErrors) => ({ ...prevErrors, status: "More than 50 characters are not allowed" }));
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
        <div style={{ display: 'flex',flexDirection: 'column', padding: '10px', marginLeft: isDrawerOpen ? 240 : 0, transition: 'margin-left 0.3s', flexGrow: 1 }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '25px' }}>SOW Status Table List</h3>
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
                <Button variant="contained" sx={{ backgroundColor: '#00aae7' }} onClick={handleAdd}>Add SOW Status</Button>
            </div>
            <TableContainer component={Paper} style={{ width: '100%' }}>
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
                {/* <PaginationComponent
                    count={filteredSOWStatus.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                /> */}
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredSOWStatus.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentSOWStatus.id ? 'Update SOWStatus' : 'Add SOWStatus'}</DialogTitle>
                <DialogContent>
                    <InputLabel>Status</InputLabel>
                    <TextField
                        margin="dense"
                        name="status"
                        value={currentSOWStatus.status}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[A-Za-z\s]*$/.test(value))
                                handleChange(e);
                        }}
                        fullWidth
                        error={!!errors.status} // Display error if exists
                        helperText={errors.status}
                        inputProps={{maxLength: 50}}
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
                    <Typography>Are you sure you want to delete this SOW Status?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>Cancel</Button>
                    <Button onClick={handleConfirmYes} color="error">Ok</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default SOWStatusList;
