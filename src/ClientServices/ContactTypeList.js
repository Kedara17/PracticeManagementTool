import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TablePagination, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment, InputLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

function ContactTypeList({ isDrawerOpen }) {
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

    const [order, setOrder] = useState('desc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [errors, setErrors] = useState({
        typeName: '',
    }
    );


    useEffect(() => {
        const fetchContactType = async () => {
            try {
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
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const sortedContactType = [...contactTypes].sort((a, b) => {
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
            validationErrors.typeName = "TypeName is required";

        } else if(currentContactType.typeName.length < 3) {
            validationErrors.typeName = "TypeName must be at least 3 characters";
        }
        else if (contactTypes.some(cont => cont.typeName.toLowerCase() === currentContactType.typeName.toLowerCase() && cont.id !== currentContactType.id)) {
            validationErrors.typeName = "TypeName must be unique";
        }

        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        if (currentContactType.id) {
            axios.put(`http://172.17.31.61:5142/api/contactType/${currentContactType.id}`, currentContactType)
                .then(response => {
                    setcontactTypes(contactTypes.map(tech => tech.id === currentContactType.id ? response.data : tech));
                })
                .catch(error => {
                    console.error('There was an error updating the ContactType!', error);
                    setError(error);
                });

        } else {
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
            } else if (value.length < 3) {
                setErrors((prevErrors) => ({ ...prevErrors, typeName: "" }));
            }
            // Check for uniqueness
            else if (contactTypes.some(cont => cont.client === value && cont.id !== currentContactType.id)) {
                setErrors((prevErrors) => ({ ...prevErrors, typeName: "" }));
            } else if (value.length === 50) {
                setErrors((prevErrors) => ({ ...prevErrors, typeName: "More than 50 characters are not allowed" }));
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
        <div style={{ display: 'flex', flexDirection: 'column', padding: '10px', marginLeft: isDrawerOpen ? 240 : 0, transition: 'margin-left 0.3s', flexGrow: 1 }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '25px' }}>Contact Type</h3>
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
                <Button variant="contained" sx={{ backgroundColor: '#00aae7' }} onClick={handleAdd}>Add Contact Type</Button>
            </div>
            <TableContainer component={Paper} style={{ width: '100%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'typeName'}
                                    direction={orderBy === 'typeName' ? order : 'desc'}
                                    onClick={() => handleSort('typeName')}
                                >
                                    <b>TypeName</b>
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
                        {filteredContactType.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ContactType) => (
                            <TableRow key={ContactType.id}
                                sx={{ backgroundColor: ContactType.isActive ? 'inherit' : '#FFCCCB' }} >
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
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredContactType.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentContactType.id ? 'Update ContactType' : 'Add ContactType'}</DialogTitle>
                <DialogContent>
                    <InputLabel>TypeName</InputLabel>
                    <TextField
                        margin="dense"
                        name="typeName"
                        value={currentContactType.typeName}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[A-Za-z\s]*$/.test(value))
                                handleChange(e);
                        }}
                        fullWidth
                        error={!!errors.typeName} // Display error if exists
                        helperText={errors.typeName}
                        inputProps={{ maxLength: 50 }}
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
                    <Button onClick={handleConfirmClose}>Cancel</Button>
                    <Button onClick={handleConfirmYes} color="error">Ok</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ContactTypeList;
