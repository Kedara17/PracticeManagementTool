import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, MenuItem, Table, InputLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PaginationComponent from '../Components/PaginationComponent'; // Import your PaginationComponent
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function Trainings({ isDrawerOpen }) {
    const [Trainings, setTrainings] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentTrainings, setCurrentTrainings] = useState({
        topic: '',
        employee: '',
        startDate: '',
        endDate: '',
        status: '',
        comments: ''
    });

    const [order, setOrder] = useState('asc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const options = ['InProgress', 'InReview', 'Completed'];
    const [errors, setErrors] = useState({
        topic: '',
        employee: '',
        startDate: '',
        endDate: '',
        status: '',
        comments: ''
    }
    );

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const trainingsResponse = await axios.get('https://localhost:7016/api/Trainings');

                setTrainings(trainingsResponse.data);
            } catch (error) {
                console.error('There was an error fetching the Trainings!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchEmployees = async () => {
            try {
                const empResponse = await axios.get('http://172.17.31.61:5033/api/employee');
                setEmployees(empResponse.data);
            } catch (error) {
                console.error('There was an error fetching the Employee!', error);
                setError(error);
            }
        };

        fetchTrainings();
        fetchEmployees();
    }, []);


    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedTrainings = [...Trainings].sort((a, b) => {
        const valueA = a[orderBy] || '';
        const valueB = b[orderBy] || '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return order === 'asc' ? (valueA > valueB ? 1 : -1) : (valueB > valueA ? 1 : -1);
        }
    });

    const filteredTrainings = sortedTrainings.filter((trainings) =>
        (trainings.topic && typeof trainings.topic === 'string' &&
            trainings.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (trainings.employee && typeof trainings.employee === 'string' &&
            trainings.employee.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (trainings.startDate && typeof trainings.startDate === 'string' &&
            trainings.startDate.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (trainings.endDate && typeof trainings.endDate === 'string' &&
            trainings.endDate.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (trainings.status && typeof trainings.status === 'string' &&
            trainings.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (trainings.comments && typeof trainings.comments === 'string' &&
            trainings.comments.toLowerCase().includes(searchQuery.toLowerCase()))

    );

    const handleAdd = () => {
        setCurrentTrainings({
            topic: '',
            employee: '',
            startDate: '',
            endDate: '',
            status: '',
            comments: ''
        });
        setOpen(true);
    };

    const handleUpdate = (Trainings) => {
        setCurrentTrainings(Trainings);
        setOpen(true);

    };

    const handleDelete = (id) => {
        axios.patch(`https://localhost:7016/api/Trainings/${id}`)
            .then(response => {
                setTrainings(Trainings.filter(tech => tech.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the Trainings!', error);
                setError(error);
            });
        setConfirmOpen(false);
    };

    const handleSave = () => {
        let validationErrors = {};

        //Topic field validation
        if (!currentTrainings.topic.trim()) {
            validationErrors.topic = "Topic is required";
        } else if (Trainings.some(tra => tra.topic.toLowerCase() === currentTrainings.topic.toLowerCase() && tra.id !== currentTrainings.id)) {
            validationErrors.Topic = "Topic must be unique";
        }

        if (!currentTrainings.employee) {
            validationErrors.employee = "Employee is required";
        }
        if (!currentTrainings.startDate) {
            validationErrors.startDate = "StartDate is required";
        }
        if (!currentTrainings.endDate) {
            validationErrors.endDate = "EndDate is required";
        }
        if (!currentTrainings.status) {
            validationErrors.status = "Status is required";
        }
        if (!currentTrainings.comments) {
            validationErrors.comments = "Comemnts is required";
        }


        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        if (currentTrainings.id) {
            axios.put(`https://localhost:7016/api/Trainings/${currentTrainings.id}`, currentTrainings)
                .then(response => {
                    setTrainings(Trainings.map(tech => tech.id === currentTrainings.id ? response.data : tech));
                })
                .catch(error => {
                    console.error('There was an error updating the Trainings!', error);
                    setError(error);
                });

        } else {
            axios.post('https://localhost:7016/api/Trainings', currentTrainings)
                .then(response => {
                    setTrainings([...Trainings, response.data]);
                })
                .catch(error => {
                    console.error('There was an error adding the Trainings!', error);
                    setError(error);
                });
        }
        setOpen(false);

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentTrainings({ ...currentTrainings, [name]: value });

        if (name === "topic") {
            if (value.length === 200) {
                setErrors((prevErrors) => ({ ...prevErrors, topic: "More than 200 characters are not allowed" }));
            }
            else {
                setErrors((prevErrors) => ({ ...prevErrors, topic: "" }));
            }
        }

        if (name === "employee") {
            // Clear the employeeId error if the user selects a value
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, employee: "" }));
            }
        }
        if (name === "startDate") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, startDate: "" }));
            }
        }
        if (name === "endDate") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, endDate: "" }));
            }
        }

        if (name === "status") {
            if (value.length === 50) {
                setErrors((prevErrors) => ({ ...prevErrors, status: "More than 50 characters are not allowed" }));
            }
            else {
                setErrors((prevErrors) => ({ ...prevErrors, status: "" }));
            }
        }


        if (name === "comments") {
            if (value.length === 500) {
                setErrors((prevErrors) => ({ ...prevErrors, comments: "More than 500 characters are not allowed" }));
            }
            // Clear the topic error if valid
            else {
                setErrors((prevErrors) => ({ ...prevErrors, comments: "" }));
            }
        }

    };

    const handleClose = () => {
        setCurrentTrainings({
            topic: '', employee: '', startDate: '', endDate: '', status: '', comments: ''
        });
        setErrors({ topic: '', employee: '', startDate: '', endDate: '', status: '', comments: '' }); // Reset the error state
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
    const handleStartDateChange = (newDate) => {
        setCurrentTrainings((prev) => ({
            ...prev,
            startDate: newDate ? newDate.toISOString() : "",
        }));
        if (newDate) {
            setErrors((prevErrors) => ({ ...prevErrors, startDate: "" }));
        }
    };

    const handleEndDateChange = (newDate) => {
        setCurrentTrainings((prev) => ({
            ...prev,
            endDate: newDate ? newDate.toISOString() : "",
        }));
        if (newDate) {
            setErrors((prevErrors) => ({
                ...prevErrors, endDate: ""
            }));
        }
    };


    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>There was an error loading the data: {error.message}</p>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '10px', marginLeft: isDrawerOpen ? 250 : 0, transition: 'margin-left 0.3s', flexGrow: 1 }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '25px' }}>Trainings Table List</h3>
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
                <Button variant="contained" sx={{ backgroundColor: '#00aae7' }} onClick={handleAdd}>Add Trainings</Button>
            </div>
            <TableContainer component={Paper} style={{ width: '100%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* Sorting logic */}
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'topic'}
                                    direction={orderBy === 'topic' ? order : 'asc'}
                                    onClick={() => handleSort('topic')}
                                >
                                    <b>Topic</b>
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
                                    active={orderBy === 'startDate'}
                                    direction={orderBy === 'startDate' ? order : 'asc'}
                                    onClick={() => handleSort('startDate')}
                                >
                                    <b>StartDate</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'endDate'}
                                    direction={orderBy === 'endDate' ? order : 'asc'}
                                    onClick={() => handleSort('endDate')}
                                >
                                    <b>EndDate</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'status'}
                                    direction={orderBy === 'status' ? order : 'asc'}
                                    onClick={() => handleSort('status')}
                                >
                                    <b>Status</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'comments'}
                                    direction={orderBy === 'comments' ? order : 'asc'}
                                    onClick={() => handleSort('comments')}
                                >
                                    <b>Comments</b>
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
                        {filteredTrainings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((Trainings) => (
                            <TableRow key={Trainings.id}
                                sx={{ backgroundColor: Trainings.isActive ? 'inherit' : '#FFCCCB' }} >
                                <TableCell>{Trainings.topic}</TableCell>
                                <TableCell>{Trainings.employee}</TableCell>
                                <TableCell>{Trainings.startDate}</TableCell>
                                <TableCell>{Trainings.endDate}</TableCell>
                                <TableCell>{Trainings.status}</TableCell>
                                <TableCell>{Trainings.comments}</TableCell>
                                <TableCell>{Trainings.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{Trainings.createdBy}</TableCell>
                                <TableCell>{new Date(Trainings.createdDate).toLocaleString()}</TableCell>
                                <TableCell>{Trainings.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{new Date(Trainings.updatedDate).toLocaleString() || 'N/A'}</TableCell>
                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(Trainings)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(Trainings.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* Pagination Component */}
                <PaginationComponent
                    count={filteredTrainings.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentTrainings.id ? 'Update Trainings' : 'Add Trainings'}</DialogTitle>
                <DialogContent>
                    <InputLabel>Topic</InputLabel>
                    <TextField
                        margin="dense"
                        name="topic"
                        value={currentTrainings.topic}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[A-Za-z\s]*$/.test(value))
                                handleChange(e);
                        }}
                        fullWidth
                        error={!!errors.topic} // Display error if exists
                        helperText={errors.topic}
                        inputProps={{ maxLength: 50 }}
                    />

                    <InputLabel>Employee</InputLabel>
                    <Select
                        margin="dense"
                        name="employee"
                        value={currentTrainings.employee}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.employee}
                        inputProps={{ maxLength: 50 }}
                    >
                        {employees.map((employee) => (
                            <MenuItem key={employee.id} value={employee.name}>
                                {employee.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.employee && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.employee}</Typography>}

                    <InputLabel>StartDate</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            className='time'
                            value={currentTrainings.startDate ? dayjs(currentTrainings.startDate) : null}
                            onChange={handleStartDateChange}
                            fullWidth
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense" />
                            )}
                        />
                    </LocalizationProvider>
                    {errors.startDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.startDate}</Typography>}
                    <InputLabel>EndDate</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            className='time'
                            value={currentTrainings.endDate ? dayjs(currentTrainings.endDate) : null}
                            onChange={handleEndDateChange}
                            fullWidth
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense" />
                            )}
                        />
                    </LocalizationProvider>
                    {errors.endDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.endDate}</Typography>}

                    <InputLabel>Status</InputLabel>
                    <Select
                        margin="dense"
                        label="Status"
                        name="status"
                        value={currentTrainings.status}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.status}
                        inputProps={{ maxLength: 50 }}
                    >
                        {options.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.status && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.status}</Typography>}
                    <InputLabel>Comments</InputLabel>
                    <TextField
                        margin="dense"
                        name="comments"
                        value={currentTrainings.comments}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.comments} // Display error if exists
                        helperText={errors.comments}
                        inputProps={{ maxLength: 500 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentTrainings.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this Training?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>Cancel</Button>
                    <Button onClick={handleConfirmYes} color="error">Ok</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Trainings;
