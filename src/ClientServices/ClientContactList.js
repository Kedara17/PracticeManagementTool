import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, MenuItem, TablePagination, Table, InputLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PaginationComponent from '../Components/PaginationComponent'; // Import your PaginationComponent

function ClientContactList({ isDrawerOpen }) {
    const [ClientContact, setClientContact] = useState([]);
    const [Clients, setClient] = useState([]);
    const [ContactType, setContactType] = useState([]);
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

    const [order, setOrder] = useState('desc'); // Order of sorting: 'asc' or 'desc'
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
                console.error('There was an error fetching the client!', error);
                setError(error);
            }
        };

        const fetchContactType = async () => {
            try {
                const contactTypeResponse = await axios.get('http://172.17.31.61:5142/api/contactType');
                setContactType(contactTypeResponse.data);
            } catch (error) {
                console.error('There was an error fetching the contactType!', error);
                setError(error);
            }
        };

        fetchClientContacts();
        fetchClient();
        fetchContactType();
    }, []);


    const handleSort = (property) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const sortedClientContact = [...ClientContact].sort((a, b) => {
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
        if (!currentClientContact.contactValue) {
            validationErrors.contactValue = "ContactValue is required";

        } else if(currentClientContact.contactValue.length < 3 ) {       
            validationErrors.contactValue = "ContactValue must be at least 3 characters";
        }
        else if (ClientContact.some(conval => conval.contactValue.toLowerCase() === currentClientContact.contactValue.toLowerCase() && conval.id !== currentClientContact.id)) {
            validationErrors.contactValue = "ContactValue must be unique";
        }
        else {
            setErrors('');
        }

        if (!currentClientContact.contactType) {
            validationErrors.contactType = "contactType is required";
        } else if (ClientContact.some(conval => conval.contactType === currentClientContact.contactType && conval.id !== currentClientContact.id)) {
            validationErrors.contactType = "contactType must be unique";
        }
        else {
            setErrors('');
        }

        if (!currentClientContact.client) {
            validationErrors.client = "Client is required";
        }

        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        if (currentClientContact.id) {
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
                setErrors((prevErrors) => ({ ...prevErrors, contactValue: "" }));
            } else if (value.length < 3) {
                setErrors((prevErrors) => ({ ...prevErrors, contactValue: "" }))
            }
            // Check for uniqueness
            else if (ClientContact.some(conval => conval.contactValue && conval.contactValue.toLowerCase() === value.toLowerCase() && conval.id !== currentClientContact.id)) {
                setErrors((prevErrors) => ({ ...prevErrors, contactValue: "" }));
            } else if (value.length === 50) {
                setErrors((prevErrors) => ({ ...prevErrors, contactValue: "More than 50 characters are not allowed" }));
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
                setErrors((prevErrors) => ({ ...prevErrors, contactType: "" }));
            }
            // Check for uniqueness
            else if (Clients.some(contyp => contyp.contactType && contyp.contactType.toLowerCase() === value.toLowerCase() && contyp.id !== currentClientContact.id)) {
                setErrors((prevErrors) => ({ ...prevErrors, contactType: "" }));
            } else if (value.length === 50) {
                setErrors((prevErrors) => ({ ...prevErrors, contactType: "More than 50 characters are not allowed" }));
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
        <div style={{ display: 'flex', flexDirection: 'column', padding: '10px', marginLeft: isDrawerOpen ? 240 : 0, transition: 'margin-left 0.3s', flexGrow: 1 }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '25px' }}>Client Contact Table List</h3>
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
                <Button variant="contained" sx={{ backgroundColor: '#00aae7' }} onClick={handleAdd}>Add Client Contact</Button>
            </div>
            <TableContainer component={Paper} style={{ width: '100%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* Sorting logic */}
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'client'}
                                    direction={orderBy === 'client' ? order : 'desc'}
                                    onClick={() => handleSort('client')}
                                >
                                    <b>Client</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'contactValue'}
                                    direction={orderBy === 'contactValue' ? order : 'desc'}
                                    onClick={() => handleSort('contactValue')}
                                >
                                    <b>ContactValue</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'contactType'}
                                    direction={orderBy === 'contactType' ? order : 'desc'}
                                    onClick={() => handleSort('contactType')}
                                >
                                    <b>ContactType</b>
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
                        {filteredClientContact.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ClientContact) => (
                            <TableRow key={ClientContact.id}
                                sx={{ backgroundColor: ClientContact.isActive ? 'inherit' : '#FFCCCB' }} >
                                <TableCell>{ClientContact.client}</TableCell>
                                <TableCell>{ClientContact.contactValue}</TableCell>
                                <TableCell>{ClientContact.contactType}</TableCell>
                                <TableCell>{ClientContact.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{ClientContact.createdBy}</TableCell>
                                <TableCell>{ClientContact.createdDate}</TableCell>
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
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredClientContact.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
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
                    <InputLabel>ContactType</InputLabel>
                    <Select
                        margin="dense"
                        name="contactType"
                        value={currentClientContact.contactType}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.contactType}
                    >
                        {ContactType.map((contactType) => (
                            <MenuItem key={contactType.id} value={contactType.typeName}>
                                {contactType.typeName}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.contactType && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.contactType}</Typography>}
                    <InputLabel>ContactValue</InputLabel>
                    <TextField
                        margin="dense"
                        name="contactValue"
                        value={currentClientContact.contactValue}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.contactValue} // Display error if exists
                        helperText={errors.contactValue}
                        inputProps={{ maxLength: 50 }}
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
                    <Button onClick={handleConfirmClose}>Cancel</Button>
                    <Button onClick={handleConfirmYes} color="error">Ok</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ClientContactList;
