import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ListItemText, Checkbox, Select, MenuItem, Table, InputLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment, FormHelperText, Autocomplete } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PaginationComponent from '../Components/PaginationComponent'; // Import your PaginationComponent
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import '../App.css';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function EmployeeList({isDrawerOpen}) {
    const [Employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [technologies, setTechnologies] = useState([]);
    const [reportingTo, setReporting] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null); // New state for file
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentEmployee, setCurrentEmployee] = useState({
        name: '',
        designation: '',
        employeeID: '',
        emailId: '',
        department: '',
        reportingTo: '',
        joiningDate: '',
        relievingDate: '',
        projection: '',
        password: '',
        profile: '',
        phoneNo: '',
        role: '',
        technology: []
    });

    const [order, setOrder] = useState('asc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query  
    const [errors, setErrors] = useState({
        name: '',
        designation: '',
        employeeID: '',
        emailId: '',
        department: '',
        reportingTo: '',
        joiningDate: '',
        relievingDate: '',
        projection: '',
        password: '',
        profile: '',
        phoneNo: '',
        role: '',
        technology: ''
    }
    );

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                // const empResponse = await axios.get('http://localhost:5033/api/Employee');
                const empResponse = await axios.get('http://172.17.31.61:5033/api/employee');
                setEmployees(empResponse.data);
            } catch (error) {
                console.error('There was an error fetching the employees!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchReportingTo = async () => {
            try {
                // const repoResponse = await axios.get('http://localhost:5033/api/Employee');
                const repoResponse = await axios.get('http://172.17.31.61:5033/api/employee');
                setReporting(repoResponse.data);
            } catch (error) {
                console.error('There was an error fetching the repoting!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchDepartments = async () => {
            try {
                // const deptResponse = await axios.get('http://localhost:5560/api/Department');
                const deptResponse = await axios.get('http://172.17.31.61:5160/api/department');
                setDepartments(deptResponse.data);
            } catch (error) {
                console.error('There was an error fetching the departments!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchDesignations = async () => {
            try {
                // const desigResponse = await axios.get('http://localhost:5501/api/Designation');
                const desigResponse = await axios.get('http://172.17.31.61:5201/api/designation');
                setDesignations(desigResponse.data);
            } catch (error) {
                console.error('There was an error fetching the departments!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchTechnologies = async () => {
            try {
                // const techResponse = await axios.get('http://localhost:5574/api/Technology');
                const techResponse = await axios.get('http://172.17.31.61:5274/api/technology');
                setTechnologies(techResponse.data);
            } catch (error) {
                console.error('There was an error fetching the technologies!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchRole = async () => {
            try {
                // const roleResponse = await axios.get('http://localhost:5763/api/Role');
                const roleResponse = await axios.get('http://172.17.31.61:5063/api/role');
                setRoles(roleResponse.data);
            } catch (error) {
                console.error('There was an error fetching the roles!', error);
                setError(error);
            }
            setLoading(false);
        };

        fetchEmployees();
        fetchDepartments();
        fetchDesignations();
        fetchTechnologies();
        fetchReportingTo();
        fetchRole();
    }, []);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Ensure Employees is not undefined or null
    const safeEmployees = Employees || [];

    // Sorting logic
    const sortedEmployees = [...safeEmployees].sort((a, b) => {
        const valueA = a[orderBy] || '';
        const valueB = b[orderBy] || '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return order === 'asc' ? (valueA > valueB ? 1 : -1) : (valueB > valueA ? 1 : -1);
        }
    });

    // Filtering logic
    const filteredEmployees = sortedEmployees.filter((employee) =>
        employee && ( // Ensure employee is defined
            (employee.name && typeof employee.name === 'string' &&
                employee.name.toLowerCase().includes(searchQuery.toLowerCase())) ||

            (employee.designation && typeof employee.designation === 'string' &&
                employee.designation.toLowerCase().includes(searchQuery.toLowerCase())) ||

            (employee.employeeID && typeof employee.employeeID === 'string' &&
                employee.employeeID.toLowerCase().includes(searchQuery.toLowerCase())) ||

            (employee.emailId && typeof employee.emailId === 'string' &&
                employee.emailId.toLowerCase().includes(searchQuery.toLowerCase())) ||

            (employee.department && typeof employee.department === 'string' &&
                employee.department.toLowerCase().includes(searchQuery.toLowerCase())) ||

            (employee.reportingTo && typeof employee.reportingTo === 'string' &&
                employee.reportingTo.toLowerCase().includes(searchQuery.toLowerCase())) ||

            (employee.projection && typeof employee.projection === 'string' &&
                employee.projection.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    );

    const handleAdd = () => {
        setCurrentEmployee({
            name: '',
            designation: '',
            employeeId: '',
            emailId: '',
            department: '',
            reportingTo: '',
            joiningDate: '',
            relievingDate: '',
            projection: '',
            password: '',
            profile: '',
            phoneNo: '',
            role: '',
            technology: []
        });
        setOpen(true);
    };

    const handleUpdate = (Employee) => {
        setCurrentEmployee(Employee);
        setOpen(true);

    };

    const handleDelete = (id) => {
        // axios.delete(`http://localhost:5033/api/Employee/${id}`)
        // axios.delete(`http://172.17.31.61:5033/api/employee/${id}`)
        axios.patch(`http://172.17.31.61:5033/api/employee/${id}`)
            .then(response => {
                setEmployees(Employees.filter(tech => tech.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the Employee!', error);
                setError(error);
            });
        setConfirmOpen(false);
    };

    const handleSave = async () => {

        let validationErrors = {};

        // Name field validation
        if (!currentEmployee.name) {
            validationErrors.name = "Name  is required";
        } else if (Employees.some(emp => emp.name.toLowerCase() === currentEmployee.name.toLowerCase() && emp.id !== currentEmployee.id)) {
            validationErrors.name = "Name must be unique";
        }
        // Department field validation 
        if (!currentEmployee.designation) {
            validationErrors.designation = "Designation is required";
        }
        if (!currentEmployee.employeeID) {
            validationErrors.employeeID = "EmployeeID is required";
        }
        if (!currentEmployee.emailId) {
            validationErrors.emailId = "EmailId is required";
        }
        if (!currentEmployee.department) {
            validationErrors.department = "Department is required";
        }
        if (!currentEmployee.reportingTo) {
            validationErrors.reportingTo = "ReportingTo is required";
        }
        if (!currentEmployee.joiningDate) {
            validationErrors.joiningDate = "JoiningDate is required";
        }
        if (!currentEmployee.relievingDate) {
            validationErrors.relievingDate = "RelievingDate is required";
        }
        if (!currentEmployee.projection) {
            validationErrors.projection = "Projection is required";
        }
        if (!currentEmployee.password) {
            validationErrors.password = "Password is required";
        }
        if (!currentEmployee.profile) {
            validationErrors.profile = "Profile is required";
        }
        if (!currentEmployee.phoneNo) {
            validationErrors.phoneNo = "PhoneNo is required";
        }
        if (!currentEmployee.role) {
            validationErrors.role = "Role is required";
        }
        if (!currentEmployee.technology || currentEmployee.technology.length === 0) {
            validationErrors.technology = "Technology is required";
        }

        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        try {
            let profilePath = currentEmployee.profile; // Existing profile path (for updates)
            // If a new file is selected, upload it
            if (selectedFile) {
                const formData = new FormData();
                formData.append('profile', selectedFile);
                formData.append('id', "");

                const uploadResponse = await axios.post('http://localhost:5733/api/Employee/uploadFile', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log("upload File", uploadResponse)
                profilePath = uploadResponse.data; // Adjust based on your backend response
            }

            const employeeToSave = {
                ...currentEmployee,
                technology: currentEmployee.technology.map(tech => {
                    const selectedTech = technologies.find(t => t.name === tech);
                    return selectedTech ? selectedTech.id : null;
                }).filter(id => id !== null) // Convert technology names to IDs
            };

            employeeToSave.profile = profilePath.path;
            if (currentEmployee.id) {
                // Update existing Employee
                const response = await axios.put(`http://172.17.31.61:5033/api/employee/${currentEmployee.id}`, employeeToSave);
                setEmployees(Employees.map(emp => emp.id === currentEmployee.id ? response.data : emp));
            } else {
                // Add new Employee
                const response = axios.post('http://172.17.31.61:5033/api/employee', employeeToSave);
                setEmployees([...Employees, response.data]);
                console.log("emp res", response)
            }

            // Reset file input
            setSelectedFile(null);
            setOpen(false);
        } catch (error) {
            console.error('There was an error saving the Employee!', error);
            setError(error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        // Remove the profile error automatically when the file is selected
        if (file) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                profile: undefined, // Clear the error for profile
            }));
        }
    };

    const handleNameChange = (e) => {
        const { value } = e.target;
        // Use a regular expression to remove any non-alphabetic characters
        const filteredValue = value.replace(/[^A-Za-z\s]/g, '');
        // Update the state with the filtered value
        setCurrentEmployee({ ...currentEmployee, name: filteredValue });

        if (filteredValue.trim()) {
            setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
        }
        // Clear the title error if valid
        else {
            setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentEmployee({ ...currentEmployee, [name]: value });

        if (name === "designation") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, designation: "" }));
            }
        }
        if (name === "employeeID") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, employeeID: "" }));
            }
        }
        if (name === "emailId") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, emailId: "" }));
            }
        }
        if (name === "department") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, department: "" }));
            }
        }
        if (name === "reportingTo") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, reportingTo: "" }));
            }
        }
        if (name === "joiningDate") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, joiningDate: "" }));
            }
        }
        if (name === "relievingDate") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, relievingDate: "" }));
            }
        }
        if (name === "projection") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, projection: "" }));
            }
        }
        if (name === "password") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
            }
        }
        if (name === "phoneNo") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, phoneNo: "" }));
            }
        }
        if (name === "profile") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, profile: "" }));
            }
        }
        if (name === "role") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, role: "" }));
            }
        }
        if (name === "technology") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, technology: "" }));
            }
        }
    };

    const handleClose = () => {
        setCurrentEmployee({ name: '', designation: '', employeeId: '', emailId: '', department: '', reportingTo: '', joiningDate: '', relievingDate: '', projection: '', password: '', profile: '', phoneNo: '', role: '', technology: [] }); // Reset the department fields
        setErrors({ name: '', designation: '', employeeId: '', emailId: '', department: '', reportingTo: '', joiningDate: '', relievingDate: '', projection: '', password: '', profile: '', phoneNo: '', role: '', technology: '' }); // Reset the error state
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

    const handleJoiningDateChange = (newDate) => {
        setCurrentEmployee((prevEmployee) => ({
            ...prevEmployee,
            joiningDate: newDate ? newDate.toISOString() : "",
        }));
        if (newDate) {
            setErrors((prevErrors) => ({ ...prevErrors, joiningDate: "" }));
        }
    };

    const handleRelievingDateChange = (newDate) => {
        setCurrentEmployee((prevEmployee) => ({
            ...prevEmployee,
            relievingDate: newDate ? newDate.toISOString() : "",
        }));
        if (newDate) {
            setErrors((prevErrors) => ({ ...prevErrors, relievingDate: "" }));
        }
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
                <h3 style={{ marginBottom: '20px', fontSize: '25px' }}>Employee Table List</h3>
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
                <Button variant="contained" sx={{ backgroundColor: '#00aae7' }} onClick={handleAdd}>Add Employee</Button>
            </div>
            <TableContainer component={Paper} style={{ width: '100%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* <TableCell>ID</TableCell> */}
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={() => handleSort('name')}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'designation'}
                                    direction={orderBy === 'designation' ? order : 'asc'}
                                    onClick={() => handleSort('designation')}
                                >
                                    Designation
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'employeeId'}
                                    direction={orderBy === 'employeeId' ? order : 'asc'}
                                    onClick={() => handleSort('employeeId')}
                                >
                                    EmployeeId
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'emailId'}
                                    direction={orderBy === 'emailId' ? order : 'asc'}
                                    onClick={() => handleSort('emailId')}
                                >
                                    EmailId
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'department'}
                                    direction={orderBy === 'department' ? order : 'asc'}
                                    onClick={() => handleSort('department')}
                                >
                                    Department
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'reportingTo'}
                                    direction={orderBy === 'reportingTo' ? order : 'asc'}
                                    onClick={() => handleSort('reportingTo')}
                                >
                                    ReportingTo
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'joiningDate'}
                                    direction={orderBy === 'joiningDate' ? order : 'asc'}
                                    onClick={() => handleSort('joiningDate')}
                                >
                                    JoiningDate
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'relievingDate'}
                                    direction={orderBy === 'relievingDate' ? order : 'asc'}
                                    onClick={() => handleSort('relievingDate')}
                                >
                                    RelievingDate
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'projection'}
                                    direction={orderBy === 'projection' ? order : 'asc'}
                                    onClick={() => handleSort('projection')}
                                >
                                    Projection
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'phoneNo'}
                                    direction={orderBy === 'phoneNo' ? order : 'asc'}
                                    onClick={() => handleSort('phoneNo')}
                                >
                                    PhoneNo
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'profile'}
                                    direction={orderBy === 'profile' ? order : 'asc'}
                                    onClick={() => handleSort('profile')}
                                >
                                    Profile
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'role'}
                                    direction={orderBy === 'role' ? order : 'asc'}
                                    onClick={() => handleSort('role')}
                                >
                                    Role
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'isActive'}
                                    direction={orderBy === 'isActive' ? order : 'asc'}
                                    onClick={() => handleSort('isActive')}
                                >
                                    Is Active
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'createdBy'}
                                    direction={orderBy === 'createdBy' ? order : 'asc'}
                                    onClick={() => handleSort('createdBy')}
                                >
                                    Created By
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'createdDate'}
                                    direction={orderBy === 'createdDate' ? order : 'asc'}
                                    onClick={() => handleSort('createdDate')}
                                >
                                    Created Date
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'updatedBy'}
                                    direction={orderBy === 'updatedBy' ? order : 'asc'}
                                    onClick={() => handleSort('updatedBy')}
                                >
                                    Updated By
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'updatedDate'}
                                    direction={orderBy === 'updatedDate' ? order : 'asc'}
                                    onClick={() => handleSort('updatedDate')}
                                >
                                    Updated Date
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((Employee) => (
                            <TableRow key={Employee.id}
                                sx={{ backgroundColor: Employee.isActive ? 'inherit' : '#FFCCCB' }} >
                                <TableCell>{Employee.name}</TableCell>
                                <TableCell>{Employee.designation}</TableCell>
                                <TableCell>{Employee.employeeID}</TableCell>
                                <TableCell>{Employee.emailId}</TableCell>
                                <TableCell>{Employee.department}</TableCell>
                                <TableCell>{Employee.reportingTo || 'NA'}</TableCell>
                                <TableCell>{Employee.joiningDate}</TableCell>
                                <TableCell>{Employee.relievingDate}</TableCell>
                                <TableCell>{Employee.projection}</TableCell>
                                <TableCell>{Employee.phoneNo}</TableCell>
                                {/* <TableCell>{Employee.profile}</TableCell> */}
                                <TableCell>{Employee.role}</TableCell>
                                <TableCell>
                                    {Employee.profile ? (
                                        <>
                                            <span>{Employee.profile.split('/').pop()}</span>
                                        </>
                                    ) : (
                                        'N/A'
                                    )}
                                </TableCell>
                                <TableCell>{Employee.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{Employee.createdBy}</TableCell>
                                <TableCell>{new Date(Employee.createdDate).toLocaleString()}</TableCell>
                                <TableCell>{Employee.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{new Date(Employee.updatedDate).toLocaleString() || 'N/A'}</TableCell>
                                {/* <TableCell>{Employee.password}</TableCell> */}

                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(Employee)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(Employee.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <PaginationComponent
                    count={filteredEmployees.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentEmployee.id ? 'Update Employee' : 'Add Employee'}</DialogTitle>
                <DialogContent>
                    <InputLabel>Name</InputLabel>
                    <TextField
                        margin="dense"
                        name="name"
                        value={currentEmployee.name}
                        onChange={handleNameChange}
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name}
                        inputProps={{ maxlength: 50 }}
                    />
                    <InputLabel>Designation</InputLabel>
                    <Select
                        margin="dense"
                        name="designation"
                        value={currentEmployee.designation}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.designation}
                    >
                        {designations.map((designation) => (
                            <MenuItem key={designation.id} value={designation.name}>
                                {designation.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.designation && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.designation}</Typography>}
                    <InputLabel>EmployeeID</InputLabel>
                    <TextField
                        type='number'
                        margin="dense"
                        name="employeeID"
                        value={currentEmployee.employeeID}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.employeeID}
                        helperText={errors.employeeID}
                    />
                    <InputLabel>Email</InputLabel>
                    <TextField
                        margin="dense"
                        name="emailId"
                        value={currentEmployee.emailId}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.emailId}
                        helperText={errors.emailId}
                    />
                    <InputLabel>Department</InputLabel>
                    <Select
                        margin="dense"
                        name="department"
                        value={currentEmployee.department}
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
                    <InputLabel id="demo-simple-select-label">Technology</InputLabel>
                    <Autocomplete
                        multiple
                        id="technologies-autocomplete"
                        options={technologies.map((tech) => tech.name)} 
                        value={currentEmployee.technology}
                        onChange={(event, newValue) => {
                            handleChange({
                                target: {
                                    name: 'technology',
                                    value: newValue,
                                },
                            });
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                placeholder="Select technologies"
                                fullWidth
                                error={!!errors.technology}
                            />
                        )}
                        renderOption={(props, option, { selected }) => (
                            <li {...props}>
                                <Checkbox
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                />
                                <ListItemText primary={option} />
                            </li>
                        )}
                    />
                    {errors.technology && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.technology}</Typography>}
                    <InputLabel>ReportingTo</InputLabel>
                    <Autocomplete
                        options={reportingTo}
                        getOptionLabel={(option) => option.name}
                        value={currentEmployee.reportingTo ? reportingTo.find((report) => report.name === currentEmployee.reportingTo) : null}
                        onChange={(event, newValue) => {
                            const customEvent = {
                                target: {
                                    name: 'reportingTo',
                                    value: newValue ? newValue.name : ''
                                }
                            };
                            handleChange(customEvent);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="dense"
                                name="reportingTo"
                                error={!!errors.reportingTo}
                                fullWidth
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option.name === value.name} // Ensure correct option is selected
                    />
                    {errors.reportingTo && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.reportingTo}</Typography>}
                    <InputLabel>Joining Date</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={currentEmployee.joiningDate ? dayjs(currentEmployee.joiningDate) : null}
                            onChange={handleJoiningDateChange}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense" />
                            )}
                        />
                    </LocalizationProvider>
                    {errors.joiningDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.joiningDate}</Typography>}
                    <InputLabel>Relieving Date</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={currentEmployee.relievingDate ? dayjs(currentEmployee.relievingDate) : null}
                            onChange={handleRelievingDateChange}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense" />
                            )}
                        />
                    </LocalizationProvider>
                    {errors.relievingDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.relievingDate}</Typography>}
                    <InputLabel>Projection</InputLabel>
                    <TextField
                        margin="dense"
                        name="projection"
                        value={currentEmployee.projection}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.projection}
                        helperText={errors.projection}
                    />
                    <InputLabel>Password</InputLabel>
                    <TextField
                        type='password'
                        margin="dense"
                        name="password"
                        value={currentEmployee.password}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <InputLabel>PhoneNumber</InputLabel>
                    <TextField
                        // type='number'
                        margin="dense"
                        name="phoneNo"
                        value={currentEmployee.phoneNo}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.phoneNo}
                        helperText={errors.phoneNo}
                        inputProps={{ maxLength: 10 }}
                    />
                    <InputLabel>Role</InputLabel>
                    <Select
                        margin="dense"
                        name="role"
                        value={currentEmployee.role}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.role}
                    >
                        {roles.map((role) => (
                            <MenuItem key={role.id} value={role.roleName}>
                                {role.roleName}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.role && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.role}</Typography>}                    
                    <InputLabel>Profile</InputLabel>
                    <TextField
                        type="file"
                        margin="dense"
                        name="profile"
                        // value={currentEmployee.profile}
                        onChange={handleFileChange}
                        fullWidth
                        required={!currentEmployee.id} 
                        error={!!errors.profile}
                        helperText={errors.profile}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentEmployee.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this Employee?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>Cancel</Button>
                    <Button onClick={handleConfirmYes} color="error">Ok</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EmployeeList;