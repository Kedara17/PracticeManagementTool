import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, MenuItem, Table, InputLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PaginationComponent from '../Components/PaginationComponent'; // Import your PaginationComponent

function ClientContactList() {
    const [ClientContact, setClientContact] = useState([]);
    const [Clients, setClient] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentClientContact, setCurrentClientContact] = useState({
        client: '',
        contactValue: '',
        contactType: ''
    });

    const [order, setOrder] = useState('asc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [errors, setErrors] = useState({
        client: '',
        contactValue: '',
        contactType: ''
    }
    );

    useEffect(() => {
        const fetchClientContacts = async () => {
            try {
                const clientContactResponse = await axios.get('http://172.17.31.61:5142/api/clientContact');
                setClientContact(clientContactResponse.data);
            } catch (error) {
                console.error('There was an error fetching the technologies!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchClient = async () => {
            try {
                const clientResponse = await axios.get('http://172.17.31.61:5142/api/client');
                setClient(clientResponse.data);
            } catch (error) {
                console.error('There was an error fetching the departments!', error);
                setError(error);
            }
        };

        fetchClientContacts();
        fetchClient();
    }, []);


    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedClientContact = [...ClientContact].sort((a, b) => {
        const valueA = a[orderBy] || '';
        const valueB = b[orderBy] || '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return order === 'asc' ? (valueA > valueB ? 1 : -1) : (valueB > valueA ? 1 : -1);
        }
    });

    const filteredClientContact = sortedClientContact.filter((clientContact) =>
        (clientContact.client && typeof clientContact.client === 'string' &&
            clientContact.client.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (clientContact.name && typeof clientContact.name === 'string' &&
            clientContact.contactValue.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAdd = () => {
        setCurrentClientContact({
            client: '',
            contactValue: '',
            contactType: ''
        });
        setOpen(true);
    };

    const handleUpdate = (ClientContact) => {
        setCurrentClientContact(ClientContact);
        setOpen(true);

    };

    const handleDelete = (id) => {
        //axios.delete(`http://localhost:5142/api/ClientContact/${id}`)
        // axios.delete(`http://172.17.31.61:5142/api/clientContact/${id}`)
        axios.patch(`http://172.17.31.61:5142/api/clientContact/${id}`)
            .then(response => {
                setClientContact(ClientContact.filter(tech => tech.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the ClientContact!', error);
                setError(error);
            });
        setConfirmOpen(false);
    };

    const handleSave = () => {
        let validationErrors = {};

        // Name field validation
        if (!currentClientContact.contactValue.trim()) {
            validationErrors.contactValue = "ContactValue cannot be empty or whitespace";
        } else if (ClientContact.some(conval => conval.contactValue.toLowerCase() === currentClientContact.contactValue.toLowerCase() && conval.id !== currentClientContact.id)) {
            validationErrors.contactValue = "ContactValue must be unique";
        }
        else {
            setErrors('');
        }

        if (!currentClientContact.contactType.trim()) {
            validationErrors.contactType = "contactType cannot be empty or whitespace";
        } else if (ClientContact.some(conval => conval.contactType === currentClientContact.contactType && conval.id !== currentClientContact.id)) {
            validationErrors.contactType = "contactType must be unique";
        }
        else {
            setErrors('');
        }

        if (!currentClientContact.client) {
            validationErrors.client = "Please select a client";
        }

        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        if (currentClientContact.id) {
            // Update existing ClientContact
            //axios.put(`http://localhost:5142/api/ClientContact/${currentClientContact.id}`, currentClientContact)
            axios.put(`http://172.17.31.61:5142/api/clientContact/${currentClientContact.id}`, currentClientContact)
                .then(response => {
                    console.log(response)
                    //setClientContact([...ClientContact, response.data]);
                    // setClientContact(response.data);
                    setClientContact(ClientContact.map(tech => tech.id === currentClientContact.id ? response.data : tech));
                })
                .catch(error => {
                    console.error('There was an error updating the ClientContact!', error);
                    setError(error);
                });

        } else {
            // Add new ClientContact
            //axios.post('http://localhost:5142/api/ClientContact', currentClientContact)
            axios.post('http://172.17.31.61:5142/api/clientContact', currentClientContact)
                .then(response => {
                    setClientContact([...ClientContact, response.data]);
                })
                .catch(error => {
                    console.error('There was an error adding the ClientContact!', error);
                    setError(error);
                });
        }
        setOpen(false);

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentClientContact({ ...currentClientContact, [name]: value });
        if (name === "contactValue") {
            // Check if the name is empty or only whitespace
            if (!value.trim()) {
                setErrors((prevErrors) => ({ ...prevErrors, contactValue: "Contact value cannot be empty" }));
            }
            // Check for uniqueness
            else if (ClientContact.some(conval => conval.contactValue && conval.contactValue.toLowerCase() === value.toLowerCase() && conval.id !== currentClientContact.id)) {
                setErrors((prevErrors) => ({ ...prevErrors, contactValue: "Contact value must be unique" }));
            }
            // Clear the name error if valid
            else {
                setErrors((prevErrors) => ({ ...prevErrors, contactValue: "" }));
            }
        }

        // Real-time validation logic for contactType
        if (name === "contactType") {
            // Check if the name is empty or only whitespace
            if (!value.trim()) {
                setErrors((prevErrors) => ({ ...prevErrors, contactType: "Contact type cannot be empty" }));
            }
            // Check for uniqueness
            else if (Clients.some(contyp => contyp.contactType && contyp.contactType.toLowerCase() === value.toLowerCase() && contyp.id !== currentClientContact.id)) {
                setErrors((prevErrors) => ({ ...prevErrors, contactType: "Contact type must be unique" }));
            }
            // Clear the name error if valid
            else {
                setErrors((prevErrors) => ({ ...prevErrors, contactType: "" }));
            }
        }

        // Real-time validation logic for client
        if (name === "client") {
            // Clear the client error if the user selects a value
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, client: "" }));
            }
        }
    };
    const handleClose = () => {
        setCurrentClientContact({
            name: '', contactValue: '', contactType: ''
        }); // Reset the department fields
        setErrors({ name: '', contactValue: '', contactType: '' }); // Reset the error state
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
                <h3>ClientContact Table List</h3>
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
                <Button variant="contained" color="primary" onClick={handleAdd}>Add ClientContact</Button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* Sorting logic */}
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'client'}
                                    direction={orderBy === 'client' ? order : 'asc'}
                                    onClick={() => handleSort('client')}
                                >
                                    <b>Client</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'contactValue'}
                                    direction={orderBy === 'contactValue' ? order : 'asc'}
                                    onClick={() => handleSort('contactValue')}
                                >
                                    <b>ContactValue</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'contactType'}
                                    direction={orderBy === 'contactType' ? order : 'asc'}
                                    onClick={() => handleSort('contactType')}
                                >
                                    <b>ContactType</b>
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
                        {filteredClientContact.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ClientContact) => (
                            <TableRow key={ClientContact.id}
                                sx={{ backgroundColor: ClientContact.isActive ? 'inherit' : '#FFCCCB' }} >
                                {/* <TableCell>{ClientContact.id}</TableCell> */}
                                <TableCell>{ClientContact.client}</TableCell>
                                <TableCell>{ClientContact.contactValue}</TableCell>
                                <TableCell>{ClientContact.contactType}</TableCell>
                                <TableCell>{ClientContact.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{ClientContact.createdBy}</TableCell>
                                <TableCell>{new Date(ClientContact.createdDate).toLocaleString()}</TableCell>
                                <TableCell>{ClientContact.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{ClientContact.updatedDate ? new Date(ClientContact.updatedDate).toLocaleString() : 'N/A'}</TableCell>
                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(ClientContact)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(ClientContact.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* Pagination Component */}
                <PaginationComponent
                    count={filteredClientContact.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentClientContact.id ? 'Update ClientContact' : 'Add ClientContact'}</DialogTitle>
                <DialogContent>
                    <InputLabel>Client</InputLabel>
                    <Select
                        margin="dense"
                        name="client"
                        value={currentClientContact.client}
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
                    <TextField
                        margin="dense"
                        label="ContactValue"
                        name="contactValue"
                        value={currentClientContact.contactValue}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.contactValue} // Display error if exists
                        helperText={errors.contactValue}
                    />
                    <TextField
                        margin="dense"
                        label="ContactType"
                        name="contactType"
                        value={currentClientContact.contactType}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.contactType} // Display error if exists
                        helperText={errors.contactType}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentClientContact.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this clientContact?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>No</Button>
                    <Button onClick={handleConfirmYes} color="error">Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ClientContactList;
