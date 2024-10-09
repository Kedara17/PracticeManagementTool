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

function ProjectEmployeeList() {
    const [ProjectEmployees, setProjectEmployees] = useState([]);
    const [Projects, setProjects] = useState([]);
    const [Employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentProjectEmployee, setCurrentProjectEmployee] = useState({
        project: '',
        employee: '',
        startDate: '',
        endDate: ''
    });

    const [order, setOrder] = useState('asc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [errors, setErrors] = useState({
        project: '',
        employee: '',
        startDate: '',
        endDate: ''
    }
    );

    useEffect(() => {
        const fetchProjectEmployees = async () => {
            try {
                const proEmpResponse = await axios.get('http://172.17.31.61:5151/api/projectEmployee');
                setProjectEmployees(proEmpResponse.data);
            } catch (error) {
                console.error('There was an error fetching the ProjectEmployees!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchProjects = async () => {
            try {
                const projectResponse = await axios.get('http://172.17.31.61:5151/api/project');
                setProjects(projectResponse.data);
            } catch (error) {
                console.error('There was an error fetching the project!', error);
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

        fetchProjectEmployees();
        fetchProjects();
        fetchEmployees();
    }, []);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedProjectEmployees = [...ProjectEmployees].sort((a, b) => {
        const valueA = a[orderBy] || '';
        const valueB = b[orderBy] || '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return order === 'asc' ? (valueA > valueB ? 1 : -1) : (valueB > valueA ? 1 : -1);
        }
    });

    const filteredProjectEmployees = sortedProjectEmployees.filter((ProjectEmployees) =>
        (ProjectEmployees.project && typeof ProjectEmployees.project === 'string' &&
            ProjectEmployees.project.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (ProjectEmployees.employee && typeof ProjectEmployees.employee === 'string' &&
            ProjectEmployees.employee.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAdd = () => {
        setCurrentProjectEmployee({
            project: '',
            employee: '',
            startDate: '',
            endDate: ''
        });
        setOpen(true);
    };

    const handleUpdate = (ProjectEmployee) => {
        setCurrentProjectEmployee(ProjectEmployee);
        setOpen(true);

    };

    const handleDelete = (id) => {
        //axios.delete(`http://localhost:5151/api/ProjectEmployee/${id}`)
        // axios.delete(`http://172.17.31.61:5151/api/projectEmployee/${id}`)
        axios.patch(`http://172.17.31.61:5151/api/projectEmployee/${id}`)
            .then(response => {
                setProjectEmployees(ProjectEmployees.filter(tech => tech.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the ProjectEmployee!', error);
                setError(error);
            });
        setConfirmOpen(false);
    };

    const handleSave = () => {
        let validationErrors = {};

        // Name field validation
        if (!currentProjectEmployee.project.trim()) {
            validationErrors.project = "Please select a Project";
        }
        if (!currentProjectEmployee.employee) {
            validationErrors.employee = "Please select a employee";
        }
        if (!currentProjectEmployee.startDate) {
            validationErrors.startDate = "Please select a startDate";
        }
        if (!currentProjectEmployee.endDate) {
            validationErrors.endDate = "Please select a endDate";
        }

        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        if (currentProjectEmployee.id) {
            // Update existing ProjectEmployee
            //axios.put(`http://localhost:5151/api/ProjectEmployee/${currentProjectEmployee.id}`, currentProjectEmployee)
            axios.put(`http://172.17.31.61:5151/api/projectEmployee/${currentProjectEmployee.id}`, currentProjectEmployee)
                .then(response => {
                    setProjectEmployees(ProjectEmployees.map(tech => tech.id === currentProjectEmployee.id ? response.data : tech));
                })
                .catch(error => {
                    console.error('There was an error updating the ProjectEmployee!', error);
                    setError(error);
                });

        } else {
            // Add new ProjectEmployee
            //axios.post('http://localhost:5151/api/ProjectEmployee', currentProjectEmployee)
            axios.post('http://172.17.31.61:5151/api/projectEmployee', currentProjectEmployee)
                .then(response => {
                    setProjectEmployees([...ProjectEmployees, response.data]);
                })
                .catch(error => {
                    console.error('There was an error adding the ProjectEmployee!', error);
                    setError(error);
                });
        }
        setOpen(false);

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentProjectEmployee({ ...currentProjectEmployee, [name]: value });
        if (name === "project") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, project: "" }));
            }
        }
        if (name === "employee") {
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
    };

    const handleClose = () => {
        setCurrentProjectEmployee({ project: '', employee: '', startDate: '', endDate: '' }); // Reset the department fields
        setErrors({ project: '', employee: '', startDate: '', endDate: '' }); // Reset the error state
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
        setCurrentProjectEmployee((prev) => ({
            ...prev,
            startDate: newDate ? newDate.toISOString() : "",
        }));
        if (newDate) {
            setErrors((prevErrors) => ({ ...prevErrors, startDate: "" }));
        }
    };

    const handleEndDateChange = (newDate) => {
        setCurrentProjectEmployee((prev) => ({
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
        <div>
            <div style={{ display: 'flex' }}>
                <h3>ProjectEmployee Table List</h3>
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
                <Button variant="contained" color="primary" onClick={handleAdd}>Add ProjectEmployee</Button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'project'}
                                    direction={orderBy === 'project' ? order : 'asc'}
                                    onClick={() => handleSort('project')}
                                >
                                    <b>Project</b>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProjectEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ProjectEmployee) => (
                            <TableRow key={ProjectEmployee.id}
                                sx={{ backgroundColor: ProjectEmployee.isActive ? 'inherit' : '#FFCCCB' }} >
                                {/* <TableCell>{ProjectEmployee.id}</TableCell> */}
                                <TableCell>{ProjectEmployee.project}</TableCell>
                                <TableCell>{ProjectEmployee.employee}</TableCell>
                                <TableCell>{ProjectEmployee.startDate}</TableCell>
                                <TableCell>{ProjectEmployee.endDate}</TableCell>
                                <TableCell>{ProjectEmployee.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{ProjectEmployee.createdBy}</TableCell>
                                <TableCell>{new Date(ProjectEmployee.createdDate).toLocaleString()}</TableCell>
                                <TableCell>{ProjectEmployee.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{new Date(ProjectEmployee.updatedDate).toLocaleString() || 'N/A'}</TableCell>
                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(ProjectEmployee)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(ProjectEmployee.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <PaginationComponent
                    count={filteredProjectEmployees.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentProjectEmployee.id ? 'Update ProjectEmployee' : 'Add ProjectEmployee'}</DialogTitle>
                <DialogContent>
                    <InputLabel>Project</InputLabel>
                    <Select
                        margin="dense"
                        name="project"
                        value={currentProjectEmployee.project}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.project}
                    >
                        {Projects.map((project) => (
                            <MenuItem key={project.id} value={project.projectName}>
                                {project.projectName}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.project && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.project}</Typography>}
                    <InputLabel>Employee</InputLabel>
                    <Select
                        margin="dense"
                        name="employee"
                        value={currentProjectEmployee.employee}
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="StartDate"
                            value={currentProjectEmployee.startDate ? dayjs(currentProjectEmployee.startDate) : null}
                            onChange={handleStartDateChange}
                            fullWidth
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense" />
                            )}
                        />
                    </LocalizationProvider>
                    {errors.startDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.startDate}</Typography>}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="EndDate"
                            value={currentProjectEmployee.endDate ? dayjs(currentProjectEmployee.endDate) : null}
                            onChange={handleEndDateChange}
                            fullWidth
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense" />
                            )}
                        />
                    </LocalizationProvider>
                    {errors.endDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.endDate}</Typography>}

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentProjectEmployee.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this employee project?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>No</Button>
                    <Button onClick={handleConfirmYes} color="error">Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ProjectEmployeeList;
