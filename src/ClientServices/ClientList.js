import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, MenuItem, Table, InputLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PaginationComponent from '../Components/PaginationComponent'; // Import your PaginationComponent

function ClientList() {
    const [Clients, setClients] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentClient, setCurrentClient] = useState({
        name: '',
        lineofBusiness: '',
        salesEmployee: '',
        country: '',
        city: '',
        state: '',
        address: ''
    });

    const [order, setOrder] = useState('asc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [errors, setErrors] = useState({
        name: '',
        lineofBusiness: '',
        salesEmployee: '',
        country: '',
        city: '',
        state: '',
        address: ''
    }
    );

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const clientResponse = await axios.get('http://172.17.31.61:5142/api/client');
                setClients(clientResponse.data);
            } catch (error) {
                console.error('There was an error fetching the Clients!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchEmployees = async () => {
            try {
                const empResponse = await axios.get('http://172.17.31.61:5033/api/employee');
                setEmployees(empResponse.data);
            } catch (error) {
                console.error('There was an error fetching the salesEmployes!', error);
                setError(error);
            }
        };

        fetchClients();
        fetchEmployees();
    }, []);


    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedClients = [...Clients].sort((a, b) => {
        const valueA = a[orderBy] || '';
        const valueB = b[orderBy] || '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return order === 'asc' ? (valueA > valueB ? 1 : -1) : (valueB > valueA ? 1 : -1);
        }
    });

    const filteredClients = sortedClients.filter((client) =>
        (client.name && typeof client.name === 'string' &&
            client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (client.lineofBusiness && typeof client.lineofBusiness === 'string' &&
            client.lineofBusiness.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (client.salesEmployee && typeof client.salesEmployee === 'string' &&
            client.salesEmployee.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (client.country && typeof client.country === 'string' &&
            client.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (client.city && typeof client.city === 'string' &&
            client.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (client.state && typeof client.state === 'string' &&
            client.state.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (client.address && typeof client.address === 'string' &&
            client.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAdd = () => {
        setCurrentClient({
            name: '',
            lineofBusiness: '',
            salesEmployee: '',
            country: '',
            city: '',
            state: '',
            address: ''
        });
        setOpen(true);
    };

    const handleUpdate = (Client) => {
        setCurrentClient(Client);
        setOpen(true);

    };

    const handleDelete = (id) => {
        //axios.delete(`http://localhost:5142/api/Client/${id}`)
        // axios.delete(`http://172.17.31.61:5142/api/client/${id}`)
        axios.patch(`http://172.17.31.61:5142/api/client/${id}`)
            .then(response => {
                setClients(Clients.filter(tech => tech.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the Client!', error);
                setError(error);
            });
        setConfirmOpen(false);
    };

    const handleSave = () => {
        let validationErrors = {};

        // Name field validation
        if (!currentClient.name.trim()) {
            validationErrors.name = "Client name cannot be empty or whitespace";
        } else if (Clients.some(cli => cli.name.toLowerCase() === currentClient.name.toLowerCase() && cli.id !== currentClient.id)) {
            validationErrors.name = "Client name must be unique";
        }

        if (!currentClient.lineofBusiness) {
            validationErrors.lineofBusiness = "Please select a lineofBusiness";
        }
        if (!currentClient.salesEmployee) {
            validationErrors.salesEmployee = "Please select a salesEmployee";
        }
        if (!currentClient.country) {
            validationErrors.country = "Please select a country";
        }
        if (!currentClient.city) {
            validationErrors.city = "Please select a city";
        }
        if (!currentClient.state) {
            validationErrors.state = "Please select a state";
        }
        if (!currentClient.address) {
            validationErrors.address = "Please select a address";
        }

        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        if (currentClient.id) {
            //axios.put(`http://localhost:5142/api/Client/${currentClient.id}`, currentClient)
            axios.put(`http://172.17.31.61:5142/api/client/${currentClient.id}`, currentClient)
                .then(response => {
                    setClients(Clients.map(tech => tech.id === currentClient.id ? response.data : tech));
                })
                .catch(error => {
                    console.error('There was an error updating the Client!', error);
                    setError(error);
                });

        } else {
            //axios.post('http://localhost:5142/api/Client', currentClient)
            axios.post('http://172.17.31.61:5142/api/client', currentClient)
                .then(response => {
                    setClients([...Clients, response.data]);
                })
                .catch(error => {
                    console.error('There was an error adding the Client!', error);
                    setError(error);
                });
        }
        setOpen(false);

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentClient({ ...currentClient, [name]: value });
        if (name === "name") {
            // Check if the title is empty or only whitespace
            if (!value.trim()) {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            }
            // Check for uniqueness
            else if (Clients.some(cli => cli.name.toLowerCase() === value.toLowerCase() && cli.id !== currentClient.id)) {
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

    const handleClose = () => {
        setCurrentClient({
            name: '', lineofBusiness: '', salesEmployee: '', country: '', city: '', state: '', address: ''
        }); // Reset the department fields
        setErrors({ name: '', lineofBusiness: '', salesEmployee: '', country: '', city: '', state: '', address: '' }); // Reset the error state
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
                <h3>Client Table List</h3>
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
                <Button variant="contained" color="primary" onClick={handleAdd}>Add Client</Button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* Sorting logic */}
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={() => handleSort('name')}
                                >
                                    <b>Name</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'lineofBusiness'}
                                    direction={orderBy === 'lineofBusiness' ? order : 'asc'}
                                    onClick={() => handleSort('lineofBusiness')}
                                >
                                    <b>LineofBusiness</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'salesEmployee'}
                                    direction={orderBy === 'salesEmployee' ? order : 'asc'}
                                    onClick={() => handleSort('salesEmployee')}
                                >
                                    <b>SalesEmployee</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'country'}
                                    direction={orderBy === 'country' ? order : 'asc'}
                                    onClick={() => handleSort('country')}
                                >
                                    <b>Country</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'city'}
                                    direction={orderBy === 'city' ? order : 'asc'}
                                    onClick={() => handleSort('city')}
                                >
                                    <b>City</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'state'}
                                    direction={orderBy === 'state' ? order : 'asc'}
                                    onClick={() => handleSort('state')}
                                >
                                    <b>State</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'Address'}
                                    direction={orderBy === 'Address' ? order : 'asc'}
                                    onClick={() => handleSort('Address')}
                                >
                                    <b>Address</b>                                </TableSortLabel>
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
                                    <b>Created By</b>                                </TableSortLabel>
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
                        {filteredClients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((Client) => (
                            <TableRow key={Client.id}
                                sx={{ backgroundColor: Client.isActive ? 'inherit' : '#FFCCCB' }} >
                                {/* <TableCell>{Client.id}</TableCell> */}
                                <TableCell>{Client.name}</TableCell>
                                <TableCell>{Client.lineofBusiness}</TableCell>
                                <TableCell>{Client.salesEmployee}</TableCell>
                                <TableCell>{Client.country}</TableCell>
                                <TableCell>{Client.city}</TableCell>
                                <TableCell>{Client.state}</TableCell>
                                <TableCell>{Client.address}</TableCell>
                                <TableCell>{Client.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{Client.createdBy}</TableCell>
                                <TableCell>{new Date(Client.createdDate).toLocaleString()}</TableCell>
                                <TableCell>{Client.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{new Date(Client.updatedDate).toLocaleString() || 'N/A'}</TableCell>
                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(Client)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(Client.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* Pagination Component */}
                <PaginationComponent
                    count={filteredClients.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentClient.id ? 'Update Client' : 'Add Client'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Name"
                        name="name"
                        value={currentClient.name}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.name} // Display error if exists
                        helperText={errors.name}
                    />
                    <TextField
                        margin="dense"
                        label="LineofBusiness"
                        name="lineofBusiness"
                        value={currentClient.lineofBusiness}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.lineofBusiness} // Display error if exists
                        helperText={errors.lineofBusiness}
                    />
                    <InputLabel>SalesEmployee</InputLabel>
                    <Select
                        margin="dense"
                        name="salesEmployee"
                        value={currentClient.salesEmployee}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.salesEmployee}
                    >
                        {employees.map((employee) => (
                            <MenuItem key={employee.id} value={employee.name}>
                                {employee.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.salesEmployee && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.salesEmployee}</Typography>}
                    <TextField
                        margin="dense"
                        label="Country"
                        name="country"
                        value={currentClient.country}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.country} // Display error if exists
                        helperText={errors.country}
                    />
                    <TextField
                        margin="dense"
                        label="City"
                        name="city"
                        value={currentClient.city}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.city} // Display error if exists
                        helperText={errors.city}
                    />
                    <TextField
                        margin="dense"
                        label="State"
                        name="state"
                        value={currentClient.state}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.state} // Display error if exists
                        helperText={errors.state}
                    />
                    <TextField
                        margin="dense"
                        label="Address"
                        name="address"
                        value={currentClient.address}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.address} // Display error if exists
                        helperText={errors.address}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentClient.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this Client?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>No</Button>
                    <Button onClick={handleConfirmYes} color="error">Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ClientList;
