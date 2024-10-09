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
import '../App.css';

function WebinarList() {
    const [Webinars, setWebinars] = useState([]);
    const [Employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentWebinar, setCurrentWebinar] = useState({
        title: '',
        speaker: '',
        status: '',
        webinarDate: '',
        numberOfAudience: ''
    });

    const [order, setOrder] = useState('asc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const options = ['Completed', 'Planned'];
    const [errors, setErrors] = useState({
        title: '',
        speaker: '',
        status: '',
        WebinarDate: '',
        numberOfAudience: ''
    }
    );

    useEffect(() => {
        const fetchWebinars = async () => {
            try {
                // const webResponse = await axios.get('http://localhost:5017/api/webinars');
                const webResponse = await axios.get('http://172.17.31.61:5017/api/webinars');
                setWebinars(webResponse.data);
            } catch (error) {
                console.error('There was an error fetching the webinars!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchSpeakers = async () => {
            try {
                // const speResponse = await axios.get('http://localhost:5033/api/employee');
                const speResponse = await axios.get('http://172.17.31.61:5033/api/employee');
                setEmployees(speResponse.data);
            } catch (error) {
                console.error('There was an error fetching the speakers!', error);
                setError(error);
            }
        };

        fetchWebinars();
        fetchSpeakers();
    }, []);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedWebinars = [...Webinars].sort((a, b) => {
        const valueA = a[orderBy] || '';
        const valueB = b[orderBy] || '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return order === 'asc' ? (valueA > valueB ? 1 : -1) : (valueB > valueA ? 1 : -1);
        }
    });

    const filteredWebinars = sortedWebinars.filter((webinar) =>
        (webinar.title && typeof webinar.title === 'string' &&
            webinar.title.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (webinar.status && typeof webinar.status === 'string' &&
            webinar.status.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (webinar.speaker && typeof webinar.speaker === 'string' &&
            webinar.speaker.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAdd = () => {
        setCurrentWebinar({
            title: '',
            speaker: '',
            status: '',
            webinarDate: '',
            numberOfAudience: ''
        });
        setOpen(true);
    };

    const handleUpdate = (Webinar) => {
        setCurrentWebinar(Webinar);
        setOpen(true);

    };

    const handleDelete = (id) => {
        // axios.delete(`http://localhost:5517/api/Webinars/${id}`)
        // axios.delete(`http://172.17.31.61:5017/api/webinars/${id}`)
        axios.patch(`http://172.17.31.61:5017/api/webinars/${id}`)
            .then(response => {
                setWebinars(Webinars.filter(tech => tech.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the Webinar!', error);
                setError(error);
            });
        setConfirmOpen(false);
    };

    const handleSave = () => {
        let validationErrors = {};

        // Title field validation
        if (!currentWebinar.title.trim()) {
            validationErrors.title = "Webinar title cannot be empty or whitespace";
        } else if (Webinars.some(web => web.title.toLowerCase() === currentWebinar.title.toLowerCase() && web.id !== currentWebinar.id)) {
            validationErrors.title = "Webinar title must be unique";
        }

        // Speaker field validation
        if (!currentWebinar.speaker) {
            validationErrors.speaker = "Please select a speaker";
        }
        if (!currentWebinar.status) {
            validationErrors.status = "Please select a status";
        }
        if (!currentWebinar.webinarDate) {
            validationErrors.WebinarDate = "Please select a WebinarDate";
        }
        if (!currentWebinar.numberOfAudience) {
            validationErrors.numberOfAudience = "Please select a numberOfAudience";
        }

        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        if (currentWebinar.id) {
            // axios.put(`http://localhost:5517/api/Webinars/${currentWebinar.id}`, currentWebinar)
            axios.put(`http://172.17.31.61:5017/api/webinars/${currentWebinar.id}`, currentWebinar)
                .then(response => {
                    console.log(response)
                    setWebinars(Webinars.map(tech => tech.id === currentWebinar.id ? response.data : tech));
                })
                .catch(error => {
                    console.error('There was an error updating the Webinar!', error);
                    setError(error);
                });

        } else {
            // axios.post('http://localhost:5517/api/Webinars', currentWebinar)
            axios.post('http://172.17.31.61:5017/api/webinars', currentWebinar)
                .then(response => {
                    setWebinars([...Webinars, response.data]);
                })
                .catch(error => {
                    console.error('There was an error adding the Webinar!', error);
                    setError(error);
                });
        }
        setOpen(false);

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentWebinar({ ...currentWebinar, [name]: value });
        if (name === "title") {
            // Check if the title is empty or only whitespace
            if (!value.trim()) {
                setErrors((prevErrors) => ({ ...prevErrors, title: "" }));
            }
            // Check for uniqueness
            else if (Webinars.some(web => web.title.toLowerCase() === value.toLowerCase() && web.id !== currentWebinar.id)) {
                setErrors((prevErrors) => ({ ...prevErrors, title: "" }));
            }
            // Clear the title error if valid
            else {
                setErrors((prevErrors) => ({ ...prevErrors, title: "" }));
            }
        }

        if (name === "speaker") {
            // Clear the speaker error if the user selects a value
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, speaker: "" }));
            }
        }
        if (name === "status") {
            // Clear the status error if the user selects a value
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, status: "" }));
            }
        }

        if (name === "numberOfAudience") {
            // Clear the numberOfAudience error if the user selects a value
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, numberOfAudience: "" }));
            }
        }
    };

    const handleClose = () => {
        setCurrentWebinar({ title: '', speaker: '', status: '', webinarDate: '', numberOfAudience: '' }); // Reset the department fields
        setErrors({ title: '', speaker: '', status: '', webinarDate: '', numberOfAudience: '' }); // Reset the error state
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
    const handleWebinarDateChange = (newDate) => {
        setCurrentWebinar((prevWebinar) => ({
            ...prevWebinar,
            webinarDate: newDate ? newDate.toISOString() : "",
        }));
        if (newDate) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                WebinarDate: "",
            }));
        }
    };


    // const VisuallyHiddenInput = styled("input")({
    //     width: 1,
    // });

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>There was an error loading the data: {error.message}</p>;
    }

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <h3>Webinar Table List</h3>
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
                <Button variant="contained" color="primary" onClick={handleAdd}>Add Webinar</Button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* <TableCell>Id</TableCell> */}

                            {/* Sorting logic */}
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'title'}
                                    direction={orderBy === 'title' ? order : 'asc'}
                                    onClick={() => handleSort('title')}
                                >
                                    <b>Title</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'speaker'}
                                    direction={orderBy === 'speaker' ? order : 'asc'}
                                    onClick={() => handleSort('speaker')}
                                >
                                    <b>Speaker</b>
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
                                    active={orderBy === 'webinarDate'}
                                    direction={orderBy === 'webinarDate' ? order : 'asc'}
                                    onClick={() => handleSort('webinarDate')}
                                >
                                    <b>WebinarDate</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'numberOfAudience'}
                                    direction={orderBy === 'numberOfAudience' ? order : 'asc'}
                                    onClick={() => handleSort('numberOfAudience')}
                                >
                                    <b>NumberOfAudience</b>
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
                        {filteredWebinars.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((Webinar) => (
                            <TableRow key={Webinar.id}
                                sx={{ backgroundColor: Webinar.isActive ? 'inherit' : '#FFCCCB' }} >
                                {/* <TableCell>{Webinar.id}</TableCell> */}
                                <TableCell>{Webinar.title}</TableCell>
                                <TableCell>{Webinar.speaker}</TableCell>
                                <TableCell>{Webinar.status}</TableCell>
                                <TableCell>{Webinar.webinarDate}</TableCell>
                                <TableCell>{Webinar.numberOfAudience}</TableCell>
                                <TableCell>{Webinar.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{Webinar.createdBy}</TableCell>
                                <TableCell>{new Date(Webinar.createdDate).toLocaleString()}</TableCell>
                                <TableCell>{Webinar.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{new Date(Webinar.updatedDate).toLocaleString() || 'N/A'}</TableCell>
                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(Webinar)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(Webinar.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* Pagination Component */}
                <PaginationComponent
                    count={filteredWebinars.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentWebinar.id ? 'Update Webinar' : 'Add Webinar'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Title"
                        name="title"
                        value={currentWebinar.title}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.title}
                        helperText={errors.title}
                    />
                    <InputLabel>Speaker</InputLabel>
                    <Select
                        margin="dense"
                        name="speaker"
                        value={currentWebinar.employee}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.speaker}
                    >
                        {Employees.map((employee) => (
                            <MenuItem key={employee.id} value={employee.name}>
                                {employee.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.speaker && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.speaker}</Typography>}
                    <InputLabel>Status</InputLabel>
                    <Select
                        margin="dense"
                        label="Status"
                        name="status"
                        value={currentWebinar.status}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.status}
                    >
                        {options.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.status && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.status}</Typography>}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="WebinarDate"
                            value={currentWebinar.webinarDate ? dayjs(currentWebinar.webinarDate) : null}
                            onChange={handleWebinarDateChange}
                            fullWidth
                            minDate={dayjs()}
                            slots={{ textField: (params) => <TextField {...params} /> }}
                        />
                    </LocalizationProvider>
                    {errors.WebinarDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.WebinarDate}</Typography>}
                    <TextField
                        type='number'
                        margin="dense"
                        label="NumberOfAudience"
                        name="numberOfAudience"
                        value={currentWebinar.numberOfAudience}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.numberOfAudience} // Display error if exists
                        helperText={errors.numberOfAudience}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentWebinar.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this Webinar?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>No</Button>
                    <Button onClick={handleConfirmYes} color="error">Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default WebinarList;
