
// http://localhost:5151/api/Certifications/ -->put


//new one


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


const CertificationsList = () => {
    const [certifications, setCertifications] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);


    const [currentCertifications, setCurrentCertifications] = useState({
        employee: '',
        name: '',
        examDate: '',
        validTill: '',
        status: '',
        comments: '',
        isActive: true // New field to track isActive status
    });

    const [order, setOrder] = useState('asc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [errors, setErrors] = useState({
        employee: '',
        name: '',
        examDate: '',
        validTill: '',
        status: '',
        comments: '',

        isActive: false // New field to track isActive status
    }
    );

    useEffect(() => {
        const fetchCertifications = async () => {
            try {
                const techResponse = await axios.get('http://localhost:5019/api/Certifications');
                setCertifications(techResponse.data);
            } catch (error) {
                console.error('There was an error fetching the certifications!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchEmployees = async () => {
            try {
                // const deptResponse = await axios.get('http://localhost:5560/api/Department');
                const deptResponse = await axios.get('http://172.17.31.61:5033/api/Employee');
                setEmployees(deptResponse.data);
            } catch (error) {
                console.error('There was an error fetching the employees!', error);
                setError(error);
            }
        };

        fetchCertifications();
        fetchEmployees();
    }, []);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedCertifications = [...certifications].sort((a, b) => {
        const valueA = a[orderBy] || '';
        const valueB = b[orderBy] || '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return order === 'asc' ? (valueA > valueB ? 1 : -1) : (valueB > valueA ? 1 : -1);
        }
    });

    const filteredCertifications = sortedCertifications.filter((certification) =>
        (certification.name && typeof certification.name === 'string' &&
            certification.name.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (certification.employeeId && typeof certification.employeeId === 'string' &&
            certification.employeeId.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAdd = () => {
        setCurrentCertifications({
            employee: '',
            name: '',
            examDate: '',
            validTill: '',
            status: '',
            comments: '',
        });
        setOpen(true);
    };

    const handleUpdate = (certification) => {
        setCurrentCertifications(certification);
        setOpen(true);
    };

    const handleDelete = (id) => {
        // axios.delete(`http://localhost:5574/api/Technology/${id}`)
        // axios.delete(`http://172.17.31.61:5274/api/technology/${id}`)
        axios.patch(`http://localhost:5019/api/Certifications/${id}`)
            .then(response => {
                setCertifications(certifications.filter(tech => tech.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the technology!', error);
                setError(error);
            });
        setConfirmOpen(false);
    };


    // const handleSave = async () => {
    //     try {


    //         const response = await axios.post('http://localhost:5151/api/Certifications', currentCertifications);
    //         // console.log(response);
    //         if (response.status === 200) {
    //             setCertifications((prev) => [...prev, ...response.data])
    //             // Show success message
    //             alert("Data saved successfully!");
    //         }
    //     } catch (error) {
    //         console.error("Error adding certification:", error);

    //         // Show error message
    //         alert("Error saving data!");
    //     }
    // };



    const handleSave = () => {
        let validationErrors = {};

        // Name field validation
        if (!currentCertifications.name.trim()) {
            validationErrors.name = "Certification is required";
        } else if (!/^[A-Za-z\s]+$/.test(currentCertifications.name)) {
            validationErrors.name = "Enter a valid certificate name (only alphabetical characters)";
        }


        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        if (currentCertifications.id) {
            // Update existing Designation
            // axios.put(`http://localhost:5501/api/Designation/${currentDesignation.id}`, currentDesignation)
            axios.put(`http://localhost:5019/api/Certifications/${currentCertifications.id}`, currentCertifications)
                .then(response => {
                    //setDesignations([...Designations, response.data]);
                    // setDesignations(response.data);
                    setCertifications(certifications.map(tech => tech.id === currentCertifications.id ? response.data : tech));
                })
                .catch(error => {
                    console.error('There was an error updating the Certifications!', error);
                    setError(error);
                });

        } else {
            // Add new Designation
            // axios.post('http://localhost:5501/api/Designation', currentDesignation)
            axios.post('http://localhost:5019/api/Certifications', currentCertifications)
                .then(response => {
                    setCertifications([...certifications, response.data]);
                })
                .catch(error => {
                    console.error('There was an error adding the Certifications!', error);
                    setError(error);
                });
        }
        setOpen(false);
    };





    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentCertifications({ ...currentCertifications, [name]: value });
        if (name === "name") {
            // Check if the title is empty or only whitespace
            if (!value.trim()) {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            }
            // Check for uniqueness
            else if (certifications.some(tech => tech.client === value && tech.id !== currentCertifications.id)) {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            }
            // Clear the title error if valid
            else {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            }
        }

        if (name === "employeeId") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, employeeId: "" }));
            }
        }
    };


    const handleClose = () => {
        setCurrentCertifications({ name: '', certification: '' }); // Reset the department fields
        setErrors({ name: '', certification: '' }); // Reset the error state
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
        return <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:'200px' }}>Loading...</p>;
    }

    if (error) {
        return <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:'200px' }}>There was an error loading the data: {error.message}</p>;
    }


    const handleExamDateChange = (newDate) => {
        setCurrentCertifications((prevCertifications) => ({
            ...prevCertifications,
            examDate: newDate ? newDate.toISOString() : "",
        }));
        if (newDate) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                examDate: "",
            }));
        }
    };

    const handleValidTillChange = (newDate) => {
        setCurrentCertifications((prevCertifications) => ({
            ...prevCertifications,
            validTill: newDate ? newDate.toISOString() : "", // Store selected date or empty string if null
        }));

        if (newDate) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                validTill: "",
            }));
        }
    };



    return (
        <div>
            <div style={{ display: 'flex' }}>
                <h3>Certification</h3>
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
                <Button variant="contained" color="primary" onClick={handleAdd}>Add Certification</Button>
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* Sorting logic */}
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
                                    active={orderBy === 'employee'}
                                    direction={orderBy === 'employee' ? order : 'asc'}
                                    onClick={() => handleSort('employee')}
                                >
                                    <b>Employee</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'examDate'}
                                    direction={orderBy === 'examDate' ? order : 'asc'}
                                    onClick={() => handleSort('examDate')}
                                >
                                    <b>ExamDate</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'validTill'}
                                    direction={orderBy === 'validTill' ? order : 'asc'}
                                    onClick={() => handleSort('validTill')}
                                >
                                    <b>ValidTill</b>
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
                        {filteredCertifications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((certification) => (
                            <TableRow key={certification.id}
                                sx={{ backgroundColor: certification.isActive ? 'inherit' : '#FFCCCB' }} >
                                <TableCell>{certification.name}</TableCell>
                                <TableCell>{certification.employee}</TableCell>
                                <TableCell>{certification.examDate}</TableCell>
                                <TableCell>{certification.validTill}</TableCell>
                                <TableCell>{certification.isActive ? 'Active' : 'InActive'}</TableCell>
                                <TableCell>{certification.createdBy}</TableCell>
                                <TableCell>{new Date(certification.createdDate).toLocaleDateString()}</TableCell>
                                <TableCell>{certification.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{new Date(certification.updatedDate).toLocaleDateString()}</TableCell>
                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(certification)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(certification.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* Pagination Component */}
                <PaginationComponent
                    count={filteredCertifications.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>

            {/* Dialogs for adding/editing and confirming delete */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentCertifications.id ? 'Update Certification' : 'Add Certification'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="name"
                        label="Certification Name"
                        value={currentCertifications.name}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.name} // Display error if exists
                        helperText={errors.name}
                    />
                    <TextField
                        margin="dense"
                        name="comments"
                        label="Comments"
                        value={currentCertifications.comments}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.comments} // Display error if exists
                        helperText={errors.comments}
                    />



                    <TextField
                        margin="dense"
                        name="status"
                        label="Status"
                        value={currentCertifications.status}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.comments} // Display error if exists
                        helperText={errors.comments}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="ExamDate"
                            value={currentCertifications.examDate ? dayjs(currentCertifications.examDate) : null}
                            onChange={handleExamDateChange}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense"
                                    error={!!errors.examDate} />
                            )}
                        />
                    </LocalizationProvider>
                    {errors.examDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.examDate}</Typography>}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="ValidTill"
                            value={currentCertifications.validTill ? dayjs(currentCertifications.validTill) : null}
                            onChange={handleValidTillChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    margin="dense"
                                    error={!!errors.validTill}
                                    helperText={errors.validTill}
                                />
                            )}
                        />
                    </LocalizationProvider>


                    <InputLabel>Employee</InputLabel>
                    <Select
                        margin="dense"
                        name="employee"
                        value={currentCertifications.employee}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.employee}
                    >
                        {employees.map((employee) => (
                            <MenuItem key={employee.id} value={employee.name}>
                                {employee.name}
                            </MenuItem>
                        ))}
                    </Select>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentCertifications.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>



            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this certification?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>No</Button>
                    <Button onClick={handleConfirmYes} color="error">Yes</Button>
                </DialogActions>
            </Dialog>
        </div>


    );
}

export default CertificationsList