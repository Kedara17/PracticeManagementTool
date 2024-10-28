import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import UndoIcon from '@mui/icons-material/Undo'; // Undo icon for inactive
import { Switch, InputLabel, TablePagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment } from '@mui/material';

function DepartmentList({ isDrawerOpen }) {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null); // Store the action to be confirmed (delete/undo)
    const [targetDepartment, setTargetDepartment] = useState(null); // Store the target department for confirmation
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentDepartment, setCurrentDepartment] = useState({
        name: ''
    });

    const [order, setOrder] = useState('desc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [errors, setErrors] = useState({
        name: '',
    }
    );

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const deptResponse = await axios.get('http://172.17.31.61:5160/api/department');
                setDepartments(deptResponse.data);
            } catch (error) {
                console.error('There was an error fetching the departments!', error);
                setError(error);
            }
            setLoading(false);
        };
        fetchDepartments();
    }, []);

    const handleSort = (property) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const handleToggleActive = async (id, currentState) => {
        try {
            // Find the full department object based on the id
            const departmentToUpdate = departments.find(dept => dept.id === id);
            if (!departmentToUpdate) {
                console.error('Department not found');
                return;
            }
    
            // Create an updated object with the toggled isActive state
            const updatedDepartment = {
                ...departmentToUpdate,
                isActive: !currentState
            };
    
            // Send the full department object in the PUT request
            await axios.put(`http://172.17.31.61:5160/api/department/${id}`, updatedDepartment);
    
            // Update the state with the new department data
            setDepartments(departments.map(dept => dept.id === id ? { ...dept, isActive: !currentState } : dept));
        } catch (error) {
            console.error('Error updating department active state:', error);
        }
    };

    const handleUndo = async (id) => {
        try {
            await handleToggleActive(id, false); // Activate the department
        } catch (error) {
            console.error('Error activating the Department!', error);
            setError(error);
        }
        setConfirmOpen(false);
    };

    const sortedDepartments = [...departments].sort((a, b) => {
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

    const filteredDepartments = sortedDepartments.filter((department) =>
        department.name && typeof department.name === 'string' &&
        department.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const handleAdd = () => {
        setCurrentDepartment({
            name: ''
        });
        setOpen(true);
    };

    const handleUpdate = (Department) => {
        setCurrentDepartment(Department);
        setOpen(true);

    };

    const handleDelete = (id) => {
        axios.patch(`http://172.17.31.61:5160/api/department/${id}`)
            .then(response => {
                setDepartments(departments.filter(dept => dept.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the Department!', error);
                setError(error);
            });
        setConfirmOpen(false);
    };

    const handleSave = async () => {
        let validationErrors = {};

        // Name field validation
        if (!currentDepartment.name.trim()) {
            validationErrors.name = "Name is required";
        } else if (currentDepartment.name.length < 3) {
            validationErrors.name = "Name must be at least 3 characters";
        } else if (departments.some(dep => dep.name.toLowerCase() === currentDepartment.name.toLowerCase() && dep.id !== currentDepartment.id)) {
            validationErrors.name = "Name must be unique";
        }

        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        if (currentDepartment.id) {
            await axios.put(`http://172.17.31.61:5160/api/department/${currentDepartment.id}`, currentDepartment)
            const deptResponse1 = await axios.get('http://172.17.31.61:5160/api/department');
            setDepartments(deptResponse1.data);

        } else {
            await axios.post('http://172.17.31.61:5160/api/department', currentDepartment)
            const deptResponse = await axios.get('http://172.17.31.61:5160/api/department');
            setDepartments(deptResponse.data);
        }
        setOpen(false);

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentDepartment({ ...currentDepartment, [name]: value });
        if (name === "name") {
            // Perform validation
            if (!value.trim()) {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            } else if (value.length < 3) {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            }
            // Check for uniqueness
            else if (departments.some(dep => dep.name.toLowerCase() === value.toLowerCase() && dep.id !== currentDepartment.id)) {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            } else if (value.length === 50) {
                setErrors((prevErrors) => ({ ...prevErrors, name: "More than 50 characters are not allowed" }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            }
        }
    };

    const handleClose = () => {
        setCurrentDepartment({ name: '' }); // Reset the department fields
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
        setConfirmAction('delete');
        setTargetDepartment(id);
        setConfirmOpen(true);
    };

    const confirmUndo = (id) => {
        setConfirmAction('undo');
        setTargetDepartment(id);
        setConfirmOpen(true);
    };

    const handleConfirmClose = () => {
        setConfirmOpen(false);
    };

    const handleConfirmYes = () => {       
        if (confirmAction === 'delete') {
            handleDelete(targetDepartment);
        } else if (confirmAction === 'undo') {
            handleUndo(targetDepartment);
        }
    };

    if (loading) {
        return <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:'200px' }} >Loading...</p>;
    }

    if (error) {
        return <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:'200px' }}>There was an error loading the data: {error.message}</p>;
    }

    return (
    <div style={{ display: 'flex',flexDirection: 'column', padding: '10px', marginLeft: isDrawerOpen ? 240 : 0, transition: 'margin-left 0.3s', flexGrow: 1 }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '25px', display:'flex', justifyContent:'center' }}>Department</h3>
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
            <Button variant="contained" sx={{ backgroundColor: '#00aae7' }} onClick={handleAdd}>Add Department</Button>
        </div>
            <TableContainer component={Paper} style={{ width: '100%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* Sorting logic */}
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'desc'}
                                    onClick={() => handleSort('name')}
                                >
                                    <b>Name</b>
                                </TableSortLabel>
                            </TableCell>
                            {/* <TableCell>Name</TableCell> */}
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
                            <TableCell
                            
                            ><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDepartments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((Department) => (
                            <TableRow key={Department.id}
                                sx={{ backgroundColor: Department.isActive ? 'inherit' : '#FFCCCB' }} >
                                
                                <TableCell>{Department.name}</TableCell>
                                <TableCell>
                                    <Switch
                                        checked={Department.isActive}
                                        disabled={!Department.isActive} // Disable toggle for inactive records
                                        onChange={() => handleToggleActive(Department.id, Department.isActive)}
                                        color="primary"
                                    />
                                </TableCell>
                                <TableCell>{Department.createdBy}</TableCell>
                                <TableCell>{Department.createdDate}</TableCell>
                                <TableCell>{Department.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{Department.updatedDate || 'N/A'}</TableCell>
                                <TableCell>
                                    {Department.isActive ? (
                                        <>
                                            <IconButton onClick={() => handleUpdate(Department)}>
                                                <EditIcon color="primary" />
                                            </IconButton>
                                            <IconButton onClick={() => confirmDelete(Department.id)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <IconButton onClick={() => confirmUndo(Department.id)}>
                                            <UndoIcon color="secondary" />
                                        </IconButton>
                                    )}
                                </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={filteredDepartments.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>{currentDepartment.id ? 'Update Department' : 'Add Department'}</DialogTitle>
                    <DialogContent>
                        <InputLabel>Name</InputLabel>
                        <TextField
                            margin="dense"
                            name="name"
                            value={currentDepartment.name}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^[A-Za-z\s]*$/.test(value))
                                    handleChange(e);
                            }}
                            fullWidth
                            error={!!errors.name} // Display error if exists
                            helperText={errors.name}
                            inputProps={{ maxLength: 50 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSave} color="primary">
                            {currentDepartment.id ? 'Update' : 'Save'}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>{confirmAction === 'delete' ? 'Confirm Delete' : 'Confirm Activation'}</DialogTitle>
                <DialogContent>
                    <Typography>
                        {confirmAction === 'delete'
                            ? 'Are you sure you want to delete this Department?'
                            : 'Are you sure you want to activate this Department?'}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>No</Button>
                    <Button onClick={handleConfirmYes} color="primary">Yes</Button>
                </DialogActions>
            </Dialog>
            </div>
        </div>
    );
}

export default DepartmentList;