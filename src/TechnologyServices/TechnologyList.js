import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select,TablePagination, MenuItem, Table, InputLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

function TechnologyList({isDrawerOpen}) {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentTechnology, setCurrentTechnology] = useState({
        name: '',
        department: '',
    });
    const [order, setOrder] = useState('desc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [errors, setErrors] = useState({
        name: '',
        department: ''
    }
    );

    useEffect(() => {
        const fetchTechnologies = async () => {
            try {
                const techResponse = await axios.get('http://172.17.31.61:5274/api/technology');
                setTechnologies(techResponse.data);
            } catch (error) {
                console.error('There was an error fetching the technologies!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchDepartments = async () => {
            try {
                const deptResponse = await axios.get('http://172.17.31.61:5160/api/department');
                setDepartments(deptResponse.data);
            } catch (error) {
                console.error('There was an error fetching the departments!', error);
                setError(error);
            }
        };

        fetchTechnologies();
        fetchDepartments();
    }, []);

    const handleSort = (property) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const sortedTechnologies = [...technologies].sort((a, b) => {
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

    const filteredTechnologies = sortedTechnologies.filter((technology) =>
        (technology.name && typeof technology.name === 'string' &&
            technology.name.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (technology.department && typeof technology.department === 'string' &&
            technology.department.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAdd = () => {
        setCurrentTechnology({
            name: '',
            department: ''
        });
        setOpen(true);
    };

    const handleUpdate = (technology) => {
        setCurrentTechnology(technology);
        setOpen(true);
    };

    const handleDelete = (id) => {
        axios.patch(`http://172.17.31.61:5274/api/technology/${id}`)
            .then(response => {
                setTechnologies(technologies.filter(tech => tech.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the technology!', error);
                setError(error);
            });
        setConfirmOpen(false);
    };

    const handleSave = async () => {
        let validationErrors = {};

        // Name field validation
        if (!currentTechnology.name.trim()) {
            validationErrors.name = "Name is required";
        } else if(currentTechnology.length < 3){
            validationErrors.name = "Name must be at least 3 characters";
        }
        else if (technologies.some(tech => tech.name.toLowerCase() === currentTechnology.name.toLowerCase() && tech.id !== currentTechnology.id)) {
            validationErrors.name = "Name must be unique";
        }

        // Department field validation 
        if (!currentTechnology.department) {
            validationErrors.department = "Department is required";
        }

        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        if (currentTechnology.id) {
            await axios.put(`http://172.17.31.61:5274/api/technology/${currentTechnology.id}`, currentTechnology)
            const response = await axios.get('http://172.17.31.61:5274/api/technology');
            setTechnologies(response.data);
        } else {
            await axios.post('http://172.17.31.61:5274/api/technology', currentTechnology)
            const response = await axios.get('http://172.17.31.61:5274/api/technology');
            setTechnologies(response.data);
        }
        setOpen(false);
    };    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentTechnology({ ...currentTechnology, [name]: value });
        if (name === "name") {
            // Check if the title is empty or only whitespace
            if (!value.trim()) {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            }else if(value.length < 3){
                setErrors((prevErrors) => ({ ...prevErrors, name: ""}))
            }
            // Check for uniqueness
            else if (technologies.some(tech => tech.client === value && tech.id !== currentTechnology.id)) {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            }else if (value.length === 50) {
                setErrors((prevErrors) => ({ ...prevErrors, name: "More than 50 characters are not allowed" }));
            }
            // Clear the title error if valid
            else {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            }
        }

        if (name === "department") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, department: "" }));
            }
        }
    };

    const handleClose = () => {
        setCurrentTechnology({ name: '', department: '' }); // Reset the department fields
        setErrors({ name: '', department: '' }); // Reset the error state
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
        <div style={{ display: 'flex',flexDirection: 'column', padding: '10px', marginLeft: isDrawerOpen ? 240 : 0, transition: 'margin-left 0.3s', flexGrow: 1 }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '25px' }}>Technology Table List</h3>
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
                    style={{ flexGrow: 1, marginRight: '10px' }}
                />
                <Button variant="contained" sx={{ backgroundColor: '#00aae7' }} onClick={handleAdd}>Add Technology</Button>
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
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'department'}
                                    direction={orderBy === 'department' ? order : 'desc'}
                                    onClick={() => handleSort('department')}
                                >
                                    <b>Department</b>
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
                        {filteredTechnologies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((technology) => (
                            <TableRow key={technology.id}
                                sx={{ backgroundColor: technology.isActive ? 'inherit' : '#FFCCCB' }} >
                                <TableCell>{technology.name}</TableCell>
                                <TableCell>{technology.department}</TableCell>
                                <TableCell>{technology.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{technology.createdBy}</TableCell>
                                <TableCell>{technology.createdDate}</TableCell>
                                <TableCell>{technology.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{technology.updatedDate || 'N/A'}</TableCell>
                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(technology)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(technology.id)}>
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
                count={filteredTechnologies.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentTechnology.id ? 'Update Technology' : 'Add Technology'}</DialogTitle>
                <DialogContent>
                <InputLabel>Name</InputLabel>
                    <TextField
                        margin="dense"
                        name="name"                     
                        value={currentTechnology.name}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[A-Za-z\s]*$/.test(value))
                                handleChange(e);
                        }}
                        fullWidth
                        error={!!errors.name} // Display error if exists
                        helperText={errors.name}
                        inputProps={{maxLength: 50}}
                    />
                    <InputLabel>Department</InputLabel>
                    <Select
                        margin="dense"
                        name="department"
                        value={currentTechnology.department}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.department}
                    >
                        {departments.map((department) => (
                            <MenuItem key={department.id} value={department.name}>
                                {department.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.department && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.department}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentTechnology.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this technology?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>No</Button>
                    <Button onClick={handleConfirmYes} color="error">Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TechnologyList;

