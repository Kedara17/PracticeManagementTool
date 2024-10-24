import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, TablePagination, MenuItem, Table, InputLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import '../App.css';

function WebinarList({ isDrawerOpen }) {
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

    const [order, setOrder] = useState('desc'); 
    const [orderBy, setOrderBy] = useState('createdDate'); 
    const [searchQuery, setSearchQuery] = useState(''); 
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
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const sortedWebinars = [...Webinars].sort((a, b) => {
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

    const handleSave = async () => {
        let validationErrors = {};

        if (!currentWebinar.title.trim()) {
            validationErrors.title = "Title is required";
        } else if(currentWebinar.title.length < 3) {
            validationErrors.title = "Title must be atleast 3 characters";
        } else if (Webinars.some(web => web.title.toLowerCase() === currentWebinar.title.toLowerCase() && web.id !== currentWebinar.id)) {
            validationErrors.title = "Title must be unique";
        }

        if (!currentWebinar.speaker) {
            validationErrors.speaker = "Speaker is required";
        }
        if (!currentWebinar.status) {
            validationErrors.status = "Status is required";
        }
        if (!currentWebinar.webinarDate) {
            validationErrors.WebinarDate = "WebinarDate is required";
        }
        if (!currentWebinar.numberOfAudience) {
            validationErrors.numberOfAudience = "NumberOfAudience is required";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        const selectedSpeaker = Employees.find(t => t.name === currentWebinar.speaker);
        const speakerId = selectedSpeaker ? selectedSpeaker.id : null; 
    
        const webinarToSave = {
            ...currentWebinar,
            speaker: speakerId
        };

        if (currentWebinar.id) {
            const webRespones= await axios.put(`http://172.17.31.61:5017/api/webinars/${currentWebinar.id}`, webinarToSave)
            const res= await axios.get('http://172.17.31.61:5017/api/webinars');
            setWebinars(res.data);    
      } else {
            const webResponse = await axios.post('http://172.17.31.61:5017/api/webinars', webinarToSave)
            const res= await axios.get('http://172.17.31.61:5017/api/webinars');
            setWebinars(res.data);                
        }
        setOpen(false);

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentWebinar({ ...currentWebinar, [name]: value });

        if (name === "title") {
            if (!value.trim()) {
                setErrors((prevErrors) => ({ ...prevErrors, title: "" }));
            } else if (value.length < 3) {
                setErrors((prevErrors) => ({ ...prevErrors, title: "" }))
            }
            else if (Webinars.some(web => web.title.toLowerCase() === value.toLowerCase() && web.id !== currentWebinar.id)) {
                setErrors((prevErrors) => ({ ...prevErrors, title: "" }));
            } else if (value.length === 200) {
                setErrors((prevErrors) => ({ ...prevErrors, title: "More than 200 characters are not allowed" }));
            }
            else {
                setErrors((prevErrors) => ({ ...prevErrors, title: "" }));
            }
        }
        if (name === "speaker") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, speaker: "" }));
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
        if (name === "numberOfAudience") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, numberOfAudience: "" }));
            }
        }
    };

    const handleClose = () => {
        setCurrentWebinar({ title: '', speaker: '', status: '', webinarDate: '', numberOfAudience: '' }); 
        setErrors({ title: '', speaker: '', status: '', webinarDate: '', numberOfAudience: '' }); 
        setOpen(false); 
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

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>There was an error loading the data: {error.message}</p>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '10px', marginLeft: isDrawerOpen ? 240 : 0, transition: 'margin-left 0.3s', flexGrow: 1 }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '25px' }}>Webinar</h3>
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
                <Button variant="contained" sx={{ backgroundColor: '#00aae7' }} onClick={handleAdd}>Add Webinar</Button>
            </div>
            <TableContainer component={Paper} style={{ width: '100%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'title'}
                                    direction={orderBy === 'title' ? order : 'desc'}
                                    onClick={() => handleSort('title')}
                                >
                                    <b>Title</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'speaker'}
                                    direction={orderBy === 'speaker' ? order : 'desc'}
                                    onClick={() => handleSort('speaker')}
                                >
                                    <b>Speaker</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'status'}
                                    direction={orderBy === 'status' ? order : 'desc'}
                                    onClick={() => handleSort('status')}
                                >
                                    <b>Status</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'webinarDate'}
                                    direction={orderBy === 'webinarDate' ? order : 'desc'}
                                    onClick={() => handleSort('webinarDate')}
                                >
                                    <b>WebinarDate</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'numberOfAudience'}
                                    direction={orderBy === 'numberOfAudience' ? order : 'desc'}
                                    onClick={() => handleSort('numberOfAudience')}
                                >
                                    <b>NumberOfAudience</b>
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
                        {filteredWebinars.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((Webinar) => (
                            <TableRow key={Webinar.id}
                                sx={{ backgroundColor: Webinar.isActive ? 'inherit' : '#FFCCCB' }} >
                                <TableCell>{Webinar.title}</TableCell>
                                <TableCell>{Webinar.speaker}</TableCell>
                                <TableCell>{Webinar.status}</TableCell>
                                <TableCell>{Webinar.webinarDate}</TableCell>
                                <TableCell>{Webinar.numberOfAudience}</TableCell>
                                <TableCell>{Webinar.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{Webinar.createdBy}</TableCell>
                                <TableCell>{Webinar.createdDate}</TableCell>
                                <TableCell>{Webinar.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{Webinar.updatedDate || 'N/A'}</TableCell>
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
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredWebinars.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentWebinar.id ? 'Update Webinar' : 'Add Webinar'}</DialogTitle>
                <DialogContent>
                    <InputLabel>Title</InputLabel>
                    <TextField
                        margin="dense"
                        name="title"
                        value={currentWebinar.title}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[A-Za-z\s!.@#$%^&*()_+=-]*$/.test(value))
                                handleChange(e);
                        }}
                        fullWidth
                        error={!!errors.title}
                        helperText={errors.title}
                        inputProps={{ maxLength: 200 }}
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
                    <InputLabel>WebinarDate</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            className='date'
                            value={currentWebinar.webinarDate ? dayjs(currentWebinar.webinarDate) : null}
                            onChange={handleWebinarDateChange}
                            fullWidth
                            minDate={dayjs()}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense" />
                            )}
                        />
                    </LocalizationProvider>
                    {errors.WebinarDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.WebinarDate}</Typography>}
                    <InputLabel>NumberOfAudience</InputLabel>
                    <TextField
                        type="text"  // Keep the type as 'text' for full control over input
                        margin="dense"
                        name="numberOfAudience"
                        value={currentWebinar.numberOfAudience}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Allow only digits (numbers) and prevent letters and special characters
                            if (/^\d*$/.test(value)) {
                                handleChange(e); // Only update if the value is valid (numbers only)
                            }
                        }}
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
                    <Button onClick={handleConfirmClose}>Cancel</Button>
                    <Button onClick={handleConfirmYes} color="error">Ok</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default WebinarList;
