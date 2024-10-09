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

function InterviewList() {
    const [Interviews, setInterviews] = useState([]);
    const [SOWRequirement, setSOWRequirement] = useState([]);
    const [InterviewStatus, setInterviewStatus] = useState([]);
    const [Employee, setEmployee] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentInterview, setCurrentInterview] = useState({
        sowRequirement: '',
        name: '',
        interviewDate: '',
        yearsOfExperience: '',
        status: '',
        on_Boarding: '',
        recruiter: ''
    });

    const [order, setOrder] = useState('asc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [errors, setErrors] = useState({
        sowRequirement: '',
        name: '',
        interviewDate: '',
        yearsOfExperience: '',
        status: '',
        on_Boarding: '',
        recruiter: ''
    }
    );

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const interviewResponse = await axios.get('http://172.17.31.61:5200/api/interview');
                setInterviews(interviewResponse.data);
            } catch (error) {
                console.error('There was an error fetching the interviews!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchSOWRequirements = async () => {
            try {
                const SowRequirementResponse = await axios.get('http://172.17.31.61:5041/api/sowRequirement');
                setSOWRequirement(SowRequirementResponse.data);
            } catch (error) {
                console.error('There was an error fetching the sowRequirement!', error);
                setError(error);
            }
        };

        const fetchInterviewStatus = async () => {
            try {
                const interviewStatutsResponse = await axios.get('http://172.17.31.61:5200/api/interviewStatus');
                setInterviewStatus(interviewStatutsResponse.data);
            } catch (error) {
                console.error('There was an error fetching the interviewStatus!', error);
                setError(error);
            }
        };

        const fetchRecruiter = async () => {
            try {
                const recruiterResponse = await axios.get('http://172.17.31.61:5033/api/employee');
                setEmployee(recruiterResponse.data);
            } catch (error) {
                console.error('There was an error fetching the recruiter!', error);
                setError(error);
            }
        };

        fetchInterviews();
        fetchSOWRequirements();
        fetchInterviewStatus();
        fetchRecruiter();
    }, []);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedInterviews = [...Interviews].sort((a, b) => {
        const valueA = a[orderBy] || '';
        const valueB = b[orderBy] || '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return order === 'asc' ? (valueA > valueB ? 1 : -1) : (valueB > valueA ? 1 : -1);
        }
    });

    const filteredInterviews = sortedInterviews.filter((Interviews) =>
        (Interviews.name && typeof Interviews.name === 'string' &&
            Interviews.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (Interviews.sowRequirement && typeof Interviews.sowRequirement === 'string' &&
            Interviews.sowRequirement.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (Interviews.recruiter && typeof Interviews.recruiter === 'string' &&
            Interviews.recruiter.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (Interviews.status && typeof Interviews.status === 'string' &&
            Interviews.status.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    const handleAdd = () => {
        setCurrentInterview({
            sowRequirement: '',
            name: '',
            interviewDate: '',
            yearsOfExperience: '',
            status: '',
            on_Boarding: '',
            recruiter: ''
        });
        setOpen(true);
    };

    const handleUpdate = (Interview) => {
        setCurrentInterview(Interview);
        setOpen(true);

    };

    const handleDelete = (id) => {
        //axios.delete(`http://localhost:5200/api/Interview/${id}`)
        // axios.delete(`http://172.17.31.61:5200/api/interview/${id}`)
        axios.patch(`http://172.17.31.61:5200/api/interview/${id}`)
            .then(response => {
                setInterviews(Interviews.filter(tech => tech.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the Interview!', error);
                setError(error);
            });
        setConfirmOpen(false);
    };

    const handleSave = () => {
        let validationErrors = {};

        // Name field validation
        if (!currentInterview.sowRequirement.trim()) {
            validationErrors.sowRequirement = "Please select a sowRequirement";
        }
        if (!currentInterview.name) {
            validationErrors.name = "Please select a name";
        }
        if (!currentInterview.interviewDate) {
            validationErrors.interviewDate = "Please select a interviewDate";
        }
        if (!currentInterview.yearsOfExperience) {
            validationErrors.yearsOfExperience = "Please select a yearsOfExperience";
        }
        if (!currentInterview.status) {
            validationErrors.status = "Please select a status";
        }
        if (!currentInterview.on_Boarding) {
            validationErrors.on_Boarding = "Please select a on_Boarding";
        }
        if (!currentInterview.recruiter) {
            validationErrors.recruiter = "Please select a recruiter";
        }

        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        if (currentInterview.id) {
            // Update existing Interview
            //axios.put(`http://localhost:5200/api/Interview/${currentInterview.id}`, currentInterview)
            axios.put(`http://172.17.31.61:5200/api/interview/${currentInterview.id}`, currentInterview)
                .then(response => {
                    console.log(response)
                    //setInterviews([...Interviews, response.data]);
                    // setInterviews(response.data);
                    setInterviews(Interviews.map(tech => tech.id === currentInterview.id ? response.data : tech));
                })
                .catch(error => {
                    console.error('There was an error updating the Interview!', error);
                    setError(error);
                });

        } else {
            // Add new Interview
            //axios.post('http://localhost:5200/api/Interview', currentInterview)
            axios.post('http://172.17.31.61:5200/api/interview', currentInterview)
                .then(response => {
                    setInterviews([...Interviews, response.data]);
                })
                .catch(error => {
                    console.error('There was an error adding the Interview!', error);
                    setError(error);
                });
        }
        setOpen(false);

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentInterview({ ...currentInterview, [name]: value });
        if (name === "sowRequirement") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, sowRequirement: "" }));
            }
        }
        if (name === "name") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            }
        }
        if (name === "interviewDate") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, interviewDate: "" }));
            }
        }
        if (name === "yearsOfExperience") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, yearsOfExperience: "" }));
            }
        }
        if (name === "status") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, status: "" }));
            }
        }
        if (name === "on_Boarding") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, on_Boarding: "" }));
            }
        }
        if (name === "recruiter") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, recruiter: "" }));
            }
        }
    };

    const handleClose = () => {
        setCurrentInterview({ sowRequirement: '', name: '', interviewDate: '', yearsOfExperience: '', status: '', on_Boarding: '', recruiter: '' }); // Reset the department fields
        setErrors({ sowRequirement: '', name: '', interviewDate: '', yearsOfExperience: '', status: '', on_Boarding: '', recruiter: '' }); // Reset the error state
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

    const handleInterviewDateChange = (newDate) => {
        setCurrentInterview((prev) => ({
            ...prev,
            interviewDate: newDate ? newDate.toISOString() : "",
        }));
        if (newDate) {
            setErrors((prevErrors) => ({ ...prevErrors, interviewDate: "" }));
        }
    };
    const handleOnBoardingDateChange = (newDate) => {
        setCurrentInterview((prev) => ({
            ...prev,
            on_Boarding: newDate ? newDate.toISOString() : "",
        }));
        if (newDate) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                on_Boarding: "",
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
        <div>
            <div style={{ display: 'flex' }}>
                <h3>Interview Table List</h3>
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
                <Button variant="contained" color="primary" onClick={handleAdd}>Add Interview</Button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'sowRequirement'}
                                    direction={orderBy === 'sowRequirement' ? order : 'asc'}
                                    onClick={() => handleSort('sowRequirement')}
                                >
                                    <b>SOWRequirement</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={() => handleSort('name')}
                                >
                                    <b>Name</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'interviewDate'}
                                    direction={orderBy === 'interviewDate' ? order : 'asc'}
                                    onClick={() => handleSort('interviewDate')}
                                >
                                    <b>InterviewDate</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'yearsOfExperience'}
                                    direction={orderBy === 'yearsOfExperience' ? order : 'asc'}
                                    onClick={() => handleSort('yearsOfExperience')}
                                >
                                    <b>YearsOfExperience</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'status'}
                                    direction={orderBy === 'status' ? order : 'asc'}
                                    onClick={() => handleSort('status')}
                                >
                                    <b>Status</b>                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'on_Boarding'}
                                    direction={orderBy === 'on_Boarding' ? order : 'asc'}
                                    onClick={() => handleSort('on_Boarding')}
                                >
                                    <b>On_Boarding</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'recuriter'}
                                    direction={orderBy === 'recuriter' ? order : 'asc'}
                                    onClick={() => handleSort('recuriter')}
                                >
                                    <b>Recuriter</b>
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
                        {filteredInterviews.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((Interview) => (
                            <TableRow key={Interview.id}
                                sx={{ backgroundColor: Interview.isActive ? 'inherit' : '#FFCCCB' }} >
                                {/* <TableCell>{Interview.id}</TableCell> */}
                                <TableCell>{Interview.sowRequirement}</TableCell>
                                <TableCell>{Interview.name}</TableCell>
                                <TableCell>{Interview.interviewDate}</TableCell>
                                <TableCell>{Interview.yearsOfExperience}</TableCell>
                                <TableCell>{Interview.status}</TableCell>
                                <TableCell>{Interview.on_Boarding}</TableCell>
                                <TableCell>{Interview.recruiter}</TableCell>
                                <TableCell>{Interview.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{Interview.createdBy}</TableCell>
                                <TableCell>{new Date(Interview.createdDate).toLocaleString()}</TableCell>
                                <TableCell>{Interview.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{new Date(Interview.updatedDate).toLocaleString() || 'N/A'}</TableCell>
                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(Interview)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(Interview.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <PaginationComponent
                    count={filteredInterviews.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentInterview.id ? 'Update Interview' : 'Add Interview'}</DialogTitle>
                <DialogContent>
                    <InputLabel>SOWRequirement</InputLabel>
                    <Select
                        margin="dense"
                        name="sowRequirement"
                        value={currentInterview.sowRequirement}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.sowRequirement}
                    >
                        {SOWRequirement.map((sowRequirement) => (
                            <MenuItem key={sowRequirement.id} value={sowRequirement.status}>
                                {sowRequirement.status}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.sowRequirement && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.sowRequirement}</Typography>}
                    <TextField
                        margin="dense"
                        label="Name"
                        name="name"
                        value={currentInterview.name}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.name} // Display error if exists
                        helperText={errors.name}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="InterviewDate"
                            value={currentInterview.interviewDate ? dayjs(currentInterview.interviewDate) : null}
                            onChange={handleInterviewDateChange}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense" errors={!!errors.interviewDate} />
                            )}
                        />
                        {errors.interviewDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.interviewDate}</Typography>}
                    </LocalizationProvider>
                    <TextField
                        margin="dense"
                        label="YearsOfExperience"
                        name="yearsOfExperience"
                        value={currentInterview.yearsOfExperience}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.yearsOfExperience} // Display error if exists
                        helperText={errors.yearsOfExperience}
                    />
                    <InputLabel>Status</InputLabel>
                    <Select
                        margin="dense"
                        name="status"
                        value={currentInterview.interviewStatus}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.status}
                    >
                        {InterviewStatus.map((interviewStatus) => (
                            <MenuItem key={interviewStatus.id} value={interviewStatus.status}>
                                {interviewStatus.status}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.status && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.status}</Typography>}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="On_Boarding"
                            value={currentInterview.on_Boarding ? dayjs(currentInterview.on_Boarding) : null}
                            onChange={handleOnBoardingDateChange}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense" errors={!!errors.on_Boarding} />
                            )}
                        />
                        {errors.on_Boarding && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.on_Boarding}</Typography>}
                    </LocalizationProvider>
                    <InputLabel>Recruiter</InputLabel>
                    <Select
                        margin="dense"
                        name="recruiter"
                        value={currentInterview.employee}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.recruiter}
                    >
                        {Employee.map((employee) => (
                            <MenuItem key={employee.id} value={employee.name}>
                                {employee.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.recruiter && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.recruiter}</Typography>}

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentInterview.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this Interview?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>No</Button>
                    <Button onClick={handleConfirmYes} color="error">Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default InterviewList;
