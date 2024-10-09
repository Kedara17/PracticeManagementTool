import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PaginationComponent from '../Components/PaginationComponent'; // Import your PaginationComponent

function ContactTypeList() {
    const [contactTypes, setcontactTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentContactType, setCurrentContactType] = useState({
        typeName: ''
    });

    const [order, setOrder] = useState('asc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [errors, setErrors] = useState({
        typeName: '',
    }
    );


    useEffect(() => {
        const fetchContactType = async () => {
            try {
                // const techResponse = await axios.get('http://172.17.31.61:5142/api/ContactType');
                const contactTypeResponse = await axios.get('http://172.17.31.61:5142/api/contactType');
                setcontactTypes(contactTypeResponse.data);
            } catch (error) {
                console.error('There was an error fetching the technologies!', error);
                setError(error);
            }
            setLoading(false);
        };

        fetchContactType();
    }, []);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedContactType = [...contactTypes].sort((a, b) => {
        const valueA = a[orderBy] || '';
        const valueB = b[orderBy] || '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return order === 'asc' ? (valueA > valueB ? 1 : -1) : (valueB > valueA ? 1 : -1);
        }
    });

    const filteredContactType = sortedContactType.filter((contactType) =>
        contactType.typeName && typeof contactType.typeName === 'string' &&
        contactType.typeName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAdd = () => {
        setCurrentContactType({
            typeName: ''
        });
        setOpen(true);
    };

    const handleUpdate = (ContactType) => {
        setCurrentContactType(ContactType);
        setOpen(true);

    };

    const handleDelete = (id) => {
        //axios.delete(`http://localhost:5142/api/ContactType/${id}`)
        // axios.delete(`http://172.17.31.61:5142/api/contactType/${id}`)
        axios.patch(`http://172.17.31.61:5142/api/contactType/${id}`)
            .then(response => {
                setcontactTypes(contactTypes.filter(tech => tech.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the ContactType!', error);
                setError(error);
            });
        setConfirmOpen(false);

    };

    const handleSave = () => {
        let validationErrors = {};

        // Name field validation
        if (!currentContactType.typeName.trim()) {
            validationErrors.typeName = "TypeName cannot be empty or whitespace";
        } else if (contactTypes.some(cont => cont.typeName.toLowerCase() === currentContactType.typeName.toLowerCase() && cont.id !== currentContactType.id)) {
            validationErrors.typeName = "TypeName name must be unique";
        }

        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        if (currentContactType.id) {
            // Update existing ContactType
            //axios.put(`http://localhost:5142/api/ContactType/${currentContactType.id}`, currentContactType)
            axios.put(`http://172.17.31.61:5142/api/contactType/${currentContactType.id}`, currentContactType)
                .then(response => {
                    console.log(response)
                    //setcontactTypes([...contactTypes, response.data]);
                    // setcontactTypes(response.data);
                    setcontactTypes(contactTypes.map(tech => tech.id === currentContactType.id ? response.data : tech));
                })
                .catch(error => {
                    console.error('There was an error updating the ContactType!', error);
                    setError(error);
                });

        } else {
            // Add new ContactType
            //axios.post('http://localhost:5142/api/ContactType', currentContactType)
            axios.post('http://172.17.31.61:5142/api/contactType', currentContactType)
                .then(response => {
                    setcontactTypes([...contactTypes, response.data]);
                })
                .catch(error => {
                    console.error('There was an error adding the ContactType!', error);
                    setError(error);
                });
        }
        setOpen(false);

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentContactType({ ...currentContactType, [name]: value });
        if (name === "typeName") {
            // Check if the title is empty or only whitespace
            if (!value.trim()) {
                setErrors((prevErrors) => ({ ...prevErrors, typeName: "" }));
            }
            // Check for uniqueness
            else if (contactTypes.some(cont => cont.client === value && cont.id !== currentContactType.id)) {
                setErrors((prevErrors) => ({ ...prevErrors, typeName: "" }));
            }
            // Clear the title error if valid
            else {
                setErrors((prevErrors) => ({ ...prevErrors, typeName: "" }));
            }
        }
    };

    const handleClose = () => {
        setCurrentContactType({ name: '' }); // Reset the department fields
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
                <h3>ContactType Table List</h3>
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
                <Button variant="contained" color="primary" onClick={handleAdd}>Add ContactType</Button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* <TableCell>Id</TableCell> */}
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'typeName'}
                                    direction={orderBy === 'typeName' ? order : 'asc'}
                                    onClick={() => handleSort('typeName')}
                                >
                                    <b>TypeName</b>
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
                        {filteredContactType.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ContactType) => (
                            <TableRow key={ContactType.id}
                                sx={{ backgroundColor: ContactType.isActive ? 'inherit' : '#FFCCCB' }} >
                                {/* <TableCell>{ContactType.id}</TableCell> */}
                                <TableCell>{ContactType.typeName}</TableCell>
                                <TableCell>{ContactType.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{ContactType.createdBy}</TableCell>
                                <TableCell>{new Date(ContactType.createdDate).toLocaleString()}</TableCell>
                                <TableCell>{ContactType.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{new Date(ContactType.updatedDate).toLocaleString() || 'N/A'}</TableCell>
                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(ContactType)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(ContactType.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* Pagination Component */}
                <PaginationComponent
                    count={filteredContactType.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentContactType.id ? 'Update ContactType' : 'Add ContactType'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="TypeName"
                        name="typeName"
                        value={currentContactType.typeName}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.typeName} // Display error if exists
                        helperText={errors.typeName}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentContactType.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this currentContactType?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>No</Button>
                    <Button onClick={handleConfirmYes} color="error">Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ContactTypeList;
