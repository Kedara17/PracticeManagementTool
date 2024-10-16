import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Table, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, IconButton } from '@mui/material';

function EmployeeTechnologyList({isDrawerOpen}) {
    const [employeeTechnologies, setemployeeTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [currentEmployeeTechnology, setCurrentEmployeeTechnology] = useState({
        id: '',
        employeeID: '',
        technology: '',
        isActive: true,
        createdBy: '',
        createdDate: '',
        updatedBy: '',
        updatedDate: ''
    });

    const [errors, setErrors] = useState({
        id: '',
        employeeID: '',
        technology: '',
    }
    );

    useEffect(() => {
        //axios.get('http://localhost:5033/api/EmployeeTechnology')
        axios.get('http://172.17.31.61:5033/api/employeeTechnology')
            .then(response => {
                setemployeeTechnologies(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the employeeTechnologies!', error);
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleAdd = () => {
        setCurrentEmployeeTechnology({
            id: '',
            employeeID: '',
            technology: '',
            isActive: true,
            createdBy: '',
            createdDate: '',
            updatedBy: '',
            updatedDate: ''
        });
        setOpen(true);
    };

    const handleUpdate = (EmployeeTechnology) => {
        setCurrentEmployeeTechnology(EmployeeTechnology);
        setOpen(true);

    };

    const handleDelete = (id) => {
        //axios.delete(`http://localhost:5033/api/EmployeeTechnology/${id}`)
        axios.delete(`http://172.17.31.61:5033/api/employeeTechnology/${id}`)
            .then(response => {
                setemployeeTechnologies(employeeTechnologies.filter(tech => tech.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the EmployeeTechnology!', error);
                setError(error);
            });
    };

    const handleSave = () => {
        if (currentEmployeeTechnology.id) {
            // Update existing EmployeeTechnology
            //axios.put(`http://localhost:5033/api/EmployeeTechnology/${currentEmployeeTechnology.id}`, currentEmployeeTechnology)
            axios.put(`http://172.17.31.61:5033/api/employeeTechnology/${currentEmployeeTechnology.id}`, currentEmployeeTechnology)
                .then(response => {
                    console.log(response)
                    //setemployeeTechnologies([...employeeTechnologies, response.data]);
                    // setemployeeTechnologies(response.data);
                    setemployeeTechnologies(employeeTechnologies.map(tech => tech.id === currentEmployeeTechnology.id ? response.data : tech));
                })
                .catch(error => {
                    console.error('There was an error updating the EmployeeTechnology!', error);
                    setError(error);
                });

        } else {
            // Add new EmployeeTechnology
            //axios.post('http://localhost:5033/api/EmployeeTechnology', currentEmployeeTechnology)
            axios.post('http://172.17.31.61:5033/api/employeeTechnology', currentEmployeeTechnology)
                .then(response => {
                    setemployeeTechnologies([...employeeTechnologies, response.data]);
                })
                .catch(error => {
                    console.error('There was an error adding the EmployeeTechnology!', error);
                    setError(error);
                });
        }
        setOpen(false);

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentEmployeeTechnology({ ...currentEmployeeTechnology, [name]: value });
    };

    const handleConfirmClose = () => {
        setConfirmOpen(false);
    };

    const handleConfirmYes = () => {
        handleDelete(deleteTechId);
    };

    const confirmDelete = (id) => {
        setDeleteTechId(id);
        setConfirmOpen(true);
    };

    const handleClose = () => {
        setCurrentEmployeeTechnology({ id: '', employeeId: '', technology: [] }); // Reset the department fields
        setErrors({ id: '', employeeId: '', technology: '' }); // Reset the error state
        setOpen(false); // Close the dialog
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
                <h3 style={{ marginBottom: '20px', fontSize: '25px' }}>Employee Technology Table List</h3>
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
                <Button variant="contained" sx={{ backgroundColor: '#00aae7' }} onClick={handleAdd}>Add Employee Technology</Button>
            </div>
            <TableContainer component={Paper} style={{ width: '100%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* <TableCell>ID</TableCell> */}
                            <TableCell>EmployeeID</TableCell>
                            <TableCell>Technology</TableCell>
                            <TableCell>Is Active</TableCell>
                            <TableCell>Created By</TableCell>
                            <TableCell>Created Date</TableCell>
                            <TableCell>Updated By</TableCell>
                            <TableCell>Updated Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employeeTechnologies.map(EmployeeTechnology => (
                            <TableRow key={EmployeeTechnology.id}>
                                {/* <TableCell>{EmployeeTechnology.id}</TableCell> */}
                                <TableCell>{EmployeeTechnology.employeeID}</TableCell>
                                <TableCell>{EmployeeTechnology.technology}</TableCell>
                                <TableCell>{EmployeeTechnology.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{EmployeeTechnology.createdBy}</TableCell>
                                <TableCell>{new Date(EmployeeTechnology.createdDate).toLocaleString()}</TableCell>
                                <TableCell>{EmployeeTechnology.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{EmployeeTechnology.updatedDate ? new Date(EmployeeTechnology.updatedDate).toLocaleString() : 'N/A'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleUpdate(EmployeeTechnology)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(EmployeeTechnology.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentEmployeeTechnology.id ? 'Update EmployeeTechnology' : 'Add EmployeeTechnology'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="EmployeeID"
                        name="employeeID"
                        value={currentEmployeeTechnology.employeeID}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="technology"
                        name="technology"
                        value={currentEmployeeTechnology.technology}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Is Active"
                        name="isActive"
                        value={currentEmployeeTechnology.isActive}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Created By"
                        name="createdBy"
                        value={currentEmployeeTechnology.createdBy}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Created Date"
                        name="createdDate"
                        value={currentEmployeeTechnology.createdDate}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Updated By"
                        name="updatedBy"
                        value={currentEmployeeTechnology.updatedBy}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Updated Date"
                        name="updatedDate"
                        value={currentEmployeeTechnology.updatedDate}
                        onChange={handleChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this employee technology?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>Cancel</Button>
                    <Button onClick={handleConfirmYes} color="error">Ok</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EmployeeTechnologyList;
