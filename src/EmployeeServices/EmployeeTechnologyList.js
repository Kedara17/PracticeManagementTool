import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

function EmployeeTechnologyList() {
    const [employeeTechnologies, setemployeeTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
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

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>There was an error loading the data: {error.message}</p>;
    }

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <h3>EmployeeTechnology Table List</h3>
            </div>
            <div style={{ display: 'flex', marginBottom: '20px' }}>
                <Button variant="contained" color="primary" onClick={handleAdd}>Add EmployeeTechnology</Button>
            </div>
            <TableContainer component={Paper}>
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
                                    <Button variant="contained" color="secondary" onClick={() => handleUpdate(EmployeeTechnology)}>Update</Button>
                                    <Button variant="contained" color="error" onClick={() => handleDelete(EmployeeTechnology.id)}>Delete</Button>
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
        </div>
    );
}

export default EmployeeTechnologyList;
