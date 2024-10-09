import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, MenuItem, Table, InputLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PaginationComponent from '../Components/PaginationComponent'; // Import your PaginationComponent
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import '../App.css';
import ProjectList from '../ProjectServices/ProjectList';

function POCList() {
    const [POCs, setPOCs] = useState([]);
    const [Clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPOC, setCurrentPOC] = useState({
        title: '',
        client: '',
        status: '',
        targetDate: '',
        comletedDate: '',
        document: ''
    });
    const [order, setOrder] = useState('asc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [errors, setErrors] = useState({
        title: '',
        client: '',
        status: '',
        targetDate: '',
        comletedDate: '',
        document: ''
    }
    );

    useEffect(() => {
        const fetchPOCs = async () => {
            try {
                // const pocResponse = await axios.get('http://localhost:5254/api/POC');
                const pocResponse = await axios.get('http://172.17.31.61:5254/api/poc');
                setPOCs(pocResponse.data);
            } catch (error) {
                console.error('There was an error fetching the pocs!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchClients = async () => {
            try {
                // const clientResponse = await axios.get('http://localhost:5142/api/Client');
                const clientResponse = await axios.get('http://172.17.31.61:5142/api/client');
                setClients(clientResponse.data);
            } catch (error) {
                console.error('There was an error fetching the departments!', error);
                setError(error);
            }
        };

        fetchPOCs();
        fetchClients();
    }, []);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedPOCs = [...POCs].sort((a, b) => {
        const valueA = a[orderBy] || '';
        const valueB = b[orderBy] || '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return order === 'asc' ? (valueA > valueB ? 1 : -1) : (valueB > valueA ? 1 : -1);
        }
    });

    const filteredPOCs = sortedPOCs.filter((poc) =>
        (poc.title && typeof poc.title === 'string' &&
            poc.title.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (poc.client && typeof poc.client === 'string' &&
            poc.client.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (poc.project && typeof poc.project === 'string' &&
            poc.project.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (poc.status && typeof poc.status === 'string' &&
            poc.status.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (poc.comments && typeof poc.comments === 'string' &&
            poc.comments.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAdd = () => {
        setCurrentPOC({
            title: '',
            client: '',
            status: '',
            targetDate: '',
            completedDate: '',
            document: ''
        });
        setOpen(true);
    };

    const handleUpdate = (poc) => {
        setCurrentPOC(poc);
        setOpen(true);
    };

    const handleDelete = (id) => {
        // axios.delete(`http://localhost:5254/api/POC/${id}`)
        // axios.delete(`http://172.17.31.61:5254/api/poc/${id}`)
        axios.patch(`http://172.17.31.61:5254/api/poc/${id}`)
            .then(response => {
                setPOCs(POCs.filter(tech => tech.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the poc!', error);
                setError(error);
            });
        setConfirmOpen(false);
    };

    const handleSave = () => {
        let validationErrors = {};

        // Name field validation
        if (!currentPOC.title.trim()) {
            validationErrors.title = "POC title cannot be empty or whitespace";
        } else if (POCs.some(tech => tech.title.toLowerCase() === currentPOC.title.toLowerCase() && tech.id !== currentPOC.id)) {
            validationErrors.title = "POC title must be unique";
        }

        // Department field validation 
        if (!currentPOC.client) {
            validationErrors.client = "Please select a client";
        }

        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        if (currentPOC.id) {
            // axios.put(`http://localhost:5254/api/poc/${currentPOC.id}`, currentPOC)
            axios.put(`http://172.17.31.61:5254/api/poc/${currentPOC.id}`, currentPOC)
                .then(response => {
                    setPOCs(POCs.map(tech => tech.id === currentPOC.id ? response.data : tech));
                })
                .catch(error => {
                    console.error('There was an error updating the poc!', error);
                    setError(error);
                });
        } else {
            // axios.post('http://localhost:5254/api/poc', currentPOC)
            axios.post('http://172.17.31.61:5254/api/poc', currentPOC)
                .then(response => {
                    setPOCs([...POCs, response.data]);
                })
                .catch(error => {
                    console.error('There was an error adding the poc!', error);
                    setError(error);
                });
        }
        setOpen(false);
    };

    const handleChange = (e) => {
        const { title, value } = e.target;
        setCurrentPOC({ ...currentPOC, [title]: value });
        if (title === "client") {
            // Check if the title is empty or only whitespace
            if (!value.trim()) {
                setErrors((prevErrors) => ({ ...prevErrors, client: "" }));
            }
            // Check for uniqueness
            else if (ProjectList.some(pro => pro.client.toLowerCase() === value.toLowerCase() && pro.id !== currentPOC.id)) {
                setErrors((prevErrors) => ({ ...prevErrors, client: "" }));
            }
            // Clear the title error if valid
            else {
                setErrors((prevErrors) => ({ ...prevErrors, client: "" }));
            }
        }

        // if (name === "projectName") {
        //     if (value) {
        //         setErrors((prevErrors) => ({ ...prevErrors, projectName: "" }));
        //     }
        // }
        // if (name === "technicalProjectManager") {
        //     if (value) {
        //         setErrors((prevErrors) => ({ ...prevErrors, technicalProjectManager: "" }));
        //     }
        // }

        // if (name === "salesContact") {
        //     if (value) {
        //         setErrors((prevErrors) => ({ ...prevErrors, salesContact: "" }));
        //     }
        // }
        // if (name === "pmo") {
        //     if (value) {
        //         setErrors((prevErrors) => ({ ...prevErrors, pmo: "" }));
        //     }
        // }
        // if (name === "sowSubmittedDate") {
        //     if (value) {
        //         setErrors((prevErrors) => ({ ...prevErrors, sowSubmittedDate: "" }));
        //     }
        // }
        // if (name === "sowSignedDate") {
        //     if (value) {
        //         setErrors((prevErrors) => ({ ...prevErrors, sowSignedDate: "" }));
        //     }
        // }
        // if (name === "sowValidTill") {
        //     if (value) {
        //         setErrors((prevErrors) => ({ ...prevErrors, sowValidTill: "" }));
        //     }
        // }
        // if (name === "sowLastExtendedDate") {
        //     if (value) {
        //         setErrors((prevErrors) => ({ ...prevErrors, sowLastExtendedDate: "" }));
        //     }
        // }
    };

    const handleClose = () => {
        setCurrentPOC({ title: '', client: '', status: '', targetDate: '', completedDate: '', document: '' }); // Reset the department fields
        setErrors({ title: '', client: '', status: '', targetDate: '', completedDate: '', document: '' }); // Reset the error state
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
    const handleTargetDateChange = (newDate) => {
        setCurrentPOC((prevPOCs) => ({
            ...prevPOCs,
            targetDate: newDate ? newDate.toISOString() : "",
        }));
    };

    const handleCompletedDateChange = (newDate) => {
        setCurrentPOC((prev) => ({
            ...prev,
            completedDate: newDate ? newDate.toISOString() : "",
        }));
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
                <h3>POC Table List</h3>
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
                <Button variant="contained" color="primary" onClick={handleAdd}>Add POC</Button>
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* Sorting logic */}
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'title'}
                                    direction={orderBy === 'title' ? order : 'asc'}
                                    onClick={() => handleSort('title')}
                                >
                                    Title
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'client'}
                                    direction={orderBy === 'client' ? order : 'asc'}
                                    onClick={() => handleSort('client')}
                                >
                                    Client
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'status'}
                                    direction={orderBy === 'status' ? order : 'asc'}
                                    onClick={() => handleSort('status')}
                                >
                                    Status
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'targetDate'}
                                    direction={orderBy === 'targetDate' ? order : 'asc'}
                                    onClick={() => handleSort('targetDate')}
                                >
                                    TargetDate
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'completedDate'}
                                    direction={orderBy === 'completedDate' ? order : 'asc'}
                                    onClick={() => handleSort('completedDate')}
                                >
                                    CompletedDate
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'document'}
                                    direction={orderBy === 'document' ? order : 'asc'}
                                    onClick={() => handleSort('document')}
                                >
                                    Document
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
                        {filteredPOCs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((poc) => (
                            <TableRow key={poc.id}
                                sx={{ backgroundColor: poc.isActive ? 'inherit' : '#FFCCCB' }} >
                                <TableCell>{poc.title}</TableCell>
                                <TableCell>{poc.client}</TableCell>
                                <TableCell>{poc.status}</TableCell>
                                <TableCell>{poc.targetDate}</TableCell>
                                <TableCell>{poc.completedDate}</TableCell>
                                <TableCell>{poc.document}</TableCell>
                                <TableCell>{poc.isActive ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{poc.createdBy}</TableCell>
                                <TableCell>{new Date(poc.createdDate).toLocaleDateString()}</TableCell>
                                <TableCell>{poc.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{new Date(poc.updatedDate).toLocaleDateString()}</TableCell>
                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(poc)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(poc.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* Pagination Component */}
                <PaginationComponent
                    count={filteredPOCs.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>

            {/* Dialogs for adding/editing and confirming delete */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentPOC.id ? 'Update POC' : 'Add POC'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="title"
                        label="POC Title"
                        value={currentPOC.title}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.title} // Display error if exists
                        helperText={errors.title}
                    />
                    <InputLabel>Client</InputLabel>
                    <Select
                        margin="dense"
                        name="client"
                        value={currentPOC.client}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.client}
                    >
                        {Clients.map((client) => (
                            <MenuItem key={client.id} value={client.name}>
                                {client.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.client && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.client}</Typography>}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="TargetDate"
                            value={currentPOC.targetDate ? dayjs(currentPOC.targetDate) : null}
                            onChange={handleTargetDateChange}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense"
                                    error={!!errors.targetDate} />
                            )}
                        />
                    </LocalizationProvider>
                    {errors.targetDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.targetDate}</Typography>}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="CompletedDate"
                            value={currentPOC.completedDate ? dayjs(currentPOC.completedDate) : null}
                            onChange={handleCompletedDateChange}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense"
                                    error={!!errors.completedDate} />
                            )}
                        />
                    </LocalizationProvider>
                    {errors.completedDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.completedDate}</Typography>}
                    <TextField
                        margin="dense"
                        name="document"
                        label="POC Document"
                        value={currentPOC.document}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.document} // Display error if exists
                        helperText={errors.document}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentPOC.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this POC?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>No</Button>
                    <Button onClick={handleConfirmYes} color="error">Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default POCList;

