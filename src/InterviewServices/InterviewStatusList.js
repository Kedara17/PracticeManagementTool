import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table,TablePagination, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment, InputLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PaginationComponent from '../Components/PaginationComponent'; // Import your PaginationComponent

function InterviewStatusList({isDrawerOpen}) {
    const [InterviewStatus, setInterviewStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentInterviewStatus, setCurrentInterviewStatus] = useState({
        status: ''
    });
    const [order, setOrder] = useState('asc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [errors, setErrors] = useState({
        status: ''
    }
    );

    useEffect(() => {
        const fetchInterviewStatus = async () => {
            try {
                const interviewStatusResponse = await axios.get('http://172.17.31.61:5200/api/interviewStatus');
                setInterviewStatus(interviewStatusResponse.data);
            } catch (error) {
                console.error('There was an error fetching the technologies!', error);
                setError(error);
            }
            setLoading(false);
        };

        fetchInterviewStatus();
    }, []);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedInterviewStatus = [...InterviewStatus].sort((a, b) => {
        const valueA = a[orderBy] || '';
        const valueB = b[orderBy] || '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return order === 'asc' ? (valueA > valueB ? 1 : -1) : (valueB > valueA ? 1 : -1);
        }
    });

    const filteredInterviewStatus = sortedInterviewStatus.filter((InterviewStatus) =>
    (InterviewStatus.status && typeof InterviewStatus.status === 'string' &&
        InterviewStatus.status.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAdd = () => {
        setCurrentInterviewStatus({
            status: ''
        });
        setOpen(true);
    };

    const handleUpdate = (InterviewStatus) => {
        setCurrentInterviewStatus(InterviewStatus);
        setOpen(true);

    };

    const handleDelete = (id) => {
        //axios.delete(`http://localhost:5200/api/InterviewStatus/${id}`)
        // axios.delete(`http://172.17.31.61:5200/api/interviewStatus/${id}`)
        axios.patch(`http://172.17.31.61:5200/api/interviewStatus/${id}`)
            .then(response => {
                setInterviewStatus(InterviewStatus.filter(tech => tech.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the InterviewStatus!', error);
                setError(error);
            });
        setConfirmOpen(false);
    };

    const handleSave = () => {
        let validationErrors = {};

        if (!currentInterviewStatus.status.trim()) {
            validationErrors.status = "Status is required";
        }else if(!currentInterviewStatus.status.length < 3) {
            validationErrors.status = "Status must be atleast 3 characters";
        }

        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        if (currentInterviewStatus.id) {
            // Update existing InterviewStatus
            //axios.put(`http://localhost:5200/api/InterviewStatus/${currentInterviewStatus.id}`, currentInterviewStatus)
            axios.put(`http://172.17.31.61:5200/api/interviewStatus/${currentInterviewStatus.id}`, currentInterviewStatus)
                .then(response => {
                    console.log(response)
                    //setInterviewStatuss([...InterviewStatuss, response.data]);
                    // setInterviewStatuss(response.data);
                    setInterviewStatus(InterviewStatus.map(tech => tech.id === currentInterviewStatus.id ? response.data : tech));
                })
                .catch(error => {
                    console.error('There was an error updating the InterviewStatus!', error);
                    setError(error);
                });

        } else {
            // Add new InterviewStatus
            //axios.post('http://localhost:5200/api/InterviewStatus', currentInterviewStatus)
            axios.post('http://172.17.31.61:5200/api/interviewStatus', currentInterviewStatus)
                .then(response => {
                    setInterviewStatus([...InterviewStatus, response.data]);
                })
                .catch(error => {
                    console.error('There was an error adding the InterviewStatus!', error);
                    setError(error);
                });
        }
        setOpen(false);

    };
   
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentInterviewStatus({ ...currentInterviewStatus, [name]: value });
        if (name === "status") {
            if (value.length === 50) {
                setErrors((prevErrors) => ({ ...prevErrors, status: "More than 50 characters are not allowed" }));
            }else if(value.length < 3) {
                setErrors((prevErrors) => ({ ...prevErrors, status: ""}))
            }
            // Clear the title error if valid
            else {
                setErrors((prevErrors) => ({ ...prevErrors, status: "" }));
            }        
        }
    };

    const handleClose = () => {
        setCurrentInterviewStatus({ status: '' }); // Reset the department fields
        setErrors({ status: '' }); // Reset the error state
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
        <div style={{ display: 'flex',flexDirection: 'column', padding: '10px', marginLeft: isDrawerOpen ? 250 : 0, transition: 'margin-left 0.3s', flexGrow: 1 }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '25px' }}>Interview Status Table List</h3>
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
                <Button variant="contained" sx={{ backgroundColor: '#00aae7' }} onClick={handleAdd}>Add Interview Status</Button>
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
                        {filteredInterviewStatus.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((InterviewStatus) => (
                            <TableRow key={InterviewStatus.id}
                                sx={{ backgroundColor: InterviewStatus.isActive ? 'inherit' : '#FFCCCB' }} >
                                {/* <TableCell>{InterviewStatus.id}</TableCell> */}
                                <TableCell>{InterviewStatus.status}</TableCell>
                                <TableCell>{InterviewStatus.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{InterviewStatus.createdBy}</TableCell>
                                <TableCell>{new Date(InterviewStatus.createdDate).toLocaleString()}</TableCell>
                                <TableCell>{InterviewStatus.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{new Date(InterviewStatus.updatedDate).toLocaleString() || 'N/A'}</TableCell>
                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(InterviewStatus)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(InterviewStatus.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* <PaginationComponent
                    count={filteredInterviewStatus.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                /> */}
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredInterviewStatus.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentInterviewStatus.id ? 'Update InterviewStatus' : 'Add InterviewStatus'}</DialogTitle>
                <DialogContent>
                    <InputLabel>Status</InputLabel>
                    <TextField
                        margin="dense"
                        name="status"
                        value={currentInterviewStatus.status}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[A-Za-z\s]*$/.test(value))
                                handleChange(e);
                        }}
                        fullWidth
                        error={!!errors.status}
                        helperText={errors.status}
                        inputProps={{maxLength: 50}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentInterviewStatus.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this InterviewStatus?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>Cancel</Button>
                    <Button onClick={handleConfirmYes} color="error">Ok</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default InterviewStatusList;
