import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, MenuItem, Table, InputLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PaginationComponent from '../Components/PaginationComponent'; // Import your PaginationComponent
import '../App.css';

function TrainingTeamList({isDrawerOpen}) {
    const [TrainingTeam, setTrainingTeam] = useState([]);
    const [Trainings, setTrainings] = useState([]);
    const [Employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentTrainingTeam, setCurrentTrainingTeam] = useState({
        trainings: '',
        employee: ''
       
    });

    const [order, setOrder] = useState('asc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [errors, setErrors] = useState({
        trainings: '',
        employee: ''
    }
    );

    useEffect(() => {
        const fetchTrainingTeam = async () => {
            try {
                const traTeamResponse = await axios.get('https://localhost:7016/api/TrainingTeam');
                setTrainingTeam(traTeamResponse.data);
                
            } catch (error) {
                console.error('There was an error fetching the TrainingTeam!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchTrainings = async () => {
            try {
                const trainingsResponse = await axios.get('https://localhost:7016/api/Trainings');
                setTrainings(trainingsResponse.data);
            } catch (error) {
                console.error('There was an error fetching the Trainings!', error);
                setError(error);
            }
        };
        const fetchEmployees = async () => {
            try {
                const empResponse = await axios.get('http://172.17.31.61:5033/api/employee');
                setEmployees(empResponse.data);
            } catch (error) {
                console.error('There was an error fetching the employees!', error);
                setError(error);
            }
        };

        fetchTrainingTeam();
        fetchTrainings();
        fetchEmployees();
    }, []);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedTrainingTeam = [...TrainingTeam].sort((a, b) => {
        const valueA = a[orderBy] || '';
        const valueB = b[orderBy] || '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return order === 'asc' ? (valueA > valueB ? 1 : -1) : (valueB > valueA ? 1 : -1);
        }
    });

    const filteredTrainingTeam = sortedTrainingTeam.filter((TrainingTeam) =>
        (TrainingTeam.trainings && typeof TrainingTeam.trainings === 'string' &&
            TrainingTeam.trainings.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (TrainingTeam.employee && typeof TrainingTeam.employee === 'string' &&
            TrainingTeam.employee.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAdd = () => {
        setCurrentTrainingTeam({
            trainings: '',
            employee: ''
        });
        setOpen(true);
    };

    const handleUpdate = (TrainingTeam) => {
        setCurrentTrainingTeam(TrainingTeam);
        setOpen(true);

    };

    const handleDelete = (id) => {
        axios.patch(`https://localhost:7016/api/TrainingTeam/${id}`)
            .then(response => {
                setTrainingTeam(TrainingTeam.filter(tech => tech.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the TrainingTeam!', error);
                setError(error);
            });
        setConfirmOpen(false);
    };

    const handleSave = () => {
        let validationErrors = {};

        if (!currentTrainingTeam.trainings.trim()) {
            validationErrors.trainings = "Trainings are required";
        }
        if (!currentTrainingTeam.employee) {
            validationErrors.employee = "Employee is required";
        }

        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        if (currentTrainingTeam.id) {
            axios.put(`https://localhost:7016/api/TrainingTeam/${currentTrainingTeam.id}`, currentTrainingTeam)
                .then(response => {
                    setTrainingTeam(TrainingTeam.map(tech => tech.id === currentTrainingTeam.id ? response.data : tech));
                })
                .catch(error => {
                    console.error('There was an error updating the TrainingTeam!', error);
                    setError(error);
                });


        } else {
            axios.post('https://localhost:7016/api/TrainingTeam', currentTrainingTeam)
                .then(response => {
                    setTrainingTeam([...TrainingTeam, response.data]);
                })
                .catch(error => {
                    console.error('There was an error adding the TrainingTeam!', error);
                    setError(error);
                });
        }
        setOpen(false);

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentTrainingTeam({ ...currentTrainingTeam, [name]: value });
        if (name === "trainings") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, trainings: "" }));
            }
        }
        if (name === "employee") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, employee: "" }));
            }
        }
    };

    const handleClose = () => {
        setCurrentTrainingTeam({ trainings: '', employee: ''}); 
        setErrors({ trainings: '', employee: '' }); // Reset the error state
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
        <div style={{ display: 'flex',flexDirection: 'column', padding: '10px', marginLeft: isDrawerOpen ? 250 : 0, transition: 'margin-left 0.3s', flexGrow: 1 }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '25px' }}>Training Team Table List</h3>
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
                <Button variant="contained" sx={{ backgroundColor: '#00aae7' }} onClick={handleAdd}>Add Training Team</Button>
            </div>
            <TableContainer component={Paper} style={{ width: '100%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'trainings'}
                                    direction={orderBy === 'trainings' ? order : 'asc'}
                                    onClick={() => handleSort('trainings')}
                                >
                                    <b>Training</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'employee'}
                                    direction={orderBy === 'employee' ? order : 'asc'}
                                    onClick={() => handleSort('employee')}
                                >
                                    <b>Employee</b>
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
                        {filteredTrainingTeam.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((TrainingTeam) => (
                            <TableRow key={TrainingTeam.id}
                                sx={{ backgroundColor: TrainingTeam.isActive ? 'inherit' : '#FFCCCB' }} >
                                <TableCell>{TrainingTeam.trainings}</TableCell>
                                <TableCell>{TrainingTeam.employee}</TableCell>
                                <TableCell>{TrainingTeam.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{TrainingTeam.createdBy}</TableCell>
                                <TableCell>{new Date(TrainingTeam.createdDate).toLocaleString()}</TableCell>
                                <TableCell>{TrainingTeam.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{new Date(TrainingTeam.updatedDate).toLocaleString() || 'N/A'}</TableCell>
                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(TrainingTeam)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(TrainingTeam.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <PaginationComponent
                    count={filteredTrainingTeam.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentTrainingTeam.id ? 'Update TrainingTeam' : 'Add TrainingTeam'}</DialogTitle>
                <DialogContent>
                    <InputLabel>Training</InputLabel>
                    <Select
                        margin="dense"
                        name="trainings"
                        value={currentTrainingTeam.trainings}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.trainings}
                    >
                        {Trainings.map((trainings) => (
                            <MenuItem key={trainings.id} value={trainings.topic}>
                                {trainings.topic}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.trainings && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.trainings}</Typography>}
                    <InputLabel>Employee</InputLabel>
                    <Select
                        margin="dense"
                        name="employee"
                        value={currentTrainingTeam.employee}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.employee}
                    >
                        {Employees.map((employee) => (
                            <MenuItem key={employee.id} value={employee.name}>
                                {employee.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.employee && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.employee}</Typography>}
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentTrainingTeam.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this Training Team?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>Cancel</Button>
                    <Button onClick={handleConfirmYes} color="error">Ok</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TrainingTeamList;
