import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ListItemText, Checkbox, Select, MenuItem, Table, InputLabel, TableBody, TableCell, TableContainer, TablePagination, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment, FormHelperText, Autocomplete } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import '../App.css';

function EmployeeList({ isDrawerOpen }) {
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

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

    const [order, setOrder] = useState('desc'); // Order of sorting: 'asc' or 'desc'
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
                const empResponse = await axios.get('http://172.17.31.61:5033/api/Employee');
                setEmployees(empResponse.data);
            } catch (error) {
                console.error('There was an error fetching the employees!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchReportingTo = async () => {
            try {
                const repoResponse = await axios.get('http://172.17.31.61:5033/api/Employee');
                setReporting(repoResponse.data);
            } catch (error) {
                console.error('There was an error fetching the repoting!', error);
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
            setLoading(false);
        };

        const fetchDesignations = async () => {
            try {
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
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    // Ensure Employees is not undefined or null
    const safeEmployees = Employees || [];

    // Sorting logic
    const sortedEmployees = [...safeEmployees].sort((a, b) => {
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
        setOpen(true);
    };

    const handleUpdate = (Employee) => {
        setCurrentEmployee(Employee);
        setOpen(true);

    };

    const handleDelete = (id) => {
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

        if (!currentEmployee.name) {
            validationErrors.name = "Name  is required";
        } else if (currentEmployee.name.length < 3) {
            validationErrors.name = "Name must be at least 3 characters";
        }        
        // if (!currentEmployee.designation) {
        //     validationErrors.designation = "Designation is required";
        // }
        //Check employeeID validation       
        if (!currentEmployee.employeeID) {
            validationErrors.employeeID = "EmployeeID is required";
        } else if (currentEmployee.employeeID.length < 4) { // Change here
            validationErrors.employeeID = "EmployeeID must be at least 4 characters";
        } else if (currentEmployee.employeeID.length > 8) { // Change here
            validationErrors.employeeID = "EmployeeID must be at most 8 characters";
        } else if (Employees.some(emp => emp.employeeID.toLowerCase() === currentEmployee.employeeID.toLowerCase() && emp.id !== currentEmployee.id)) {
            validationErrors.employeeID = "EmployeeID must be unique";
        }
        // Check if emailId is empty
        if (!currentEmployee.emailId) {
            validationErrors.emailId = "Email is required";
        }
        if (!currentEmployee.emailId) {
            validationErrors.emailId = "EmailId is required";
        }
        // if (!currentEmployee.department) {
        //     validationErrors.department = "Department is required";
        // }
        // if (!currentEmployee.reportingTo) {
        //     validationErrors.reportingTo = "ReportingTo is required";
        // }
        if (!currentEmployee.joiningDate) {
            validationErrors.joiningDate = "JoiningDate is required";
        }
        if (!currentEmployee.relievingDate) {
            validationErrors.relievingDate = "RelievingDate is required";
        }
        // if (!currentEmployee.projection) {
        //     validationErrors.projection = "Projection is required";
        // } else if (currentEmployee.projection.length < 3) {
        //     validationErrors.projection = "Projection must be atleast 3 characters";
        // }
        if (!currentEmployee.password) {
            validationErrors.password = "Password is required";
        } 
        if (!currentEmployee.profile || errors.profile) {
            validationErrors.profile = "Please select a valid PDF or DOC file";
        }
        if (!currentEmployee.phoneNo) {
            validationErrors.phoneNo = "PhoneNo is required";
        }
        // if (!currentEmployee.role) {
        //     validationErrors.role = "Role is required";
        // }
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

                const uploadResponse = await axios.post('http://172.17.31.61:5033/api/Employee/uploadFile', formData, {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentEmployee({ ...currentEmployee, [name]: value });

        if (name === "name") {
            // Check if the title is empty or only whitespace
            if (!value.trim()) {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            } else if (value.lenth < 3) {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }))
            }
            else if (value.length === 50) {
                setErrors((prevErrors) => ({ ...prevErrors, name: "More than 50 characters are not allowed" }));
            }
            // Clear the title error if valid
            else {
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            }
        }
        // if (name === "designation") {
        //     if (value) {
        //         setErrors((prevErrors) => ({ ...prevErrors, designation: "" }));
        //     }
        // }
        if (name === "employeeID") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, employeeID: "" }));
            }
        }
        if (name === "emailId") {
            if (!value.endsWith("@miraclesoft.com")) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    emailId: "Email must end with @miraclesoft.com"
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    emailId: "" // Clear error if the email is valid
                }));
            }
        }
        // if (name === "department") {
        //     if (value) {
        //         setErrors((prevErrors) => ({ ...prevErrors, department: "" }));
        //     }
        // }
        // if (name === "reportingTo") {
        //     if (value) {
        //         setErrors((prevErrors) => ({ ...prevErrors, reportingTo: "" }));
        //     }
        // }
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
        // if (name === "projection") {
        //     if (value) {
        //         setErrors((prevErrors) => ({ ...prevErrors, projection: "" }));
        //     } else if (value.length < 3) {
        //         setErrors((prevErrors) => ({ ...prevErrors, projection: "" }))
        //     }
        // }
        if (name === 'password') {
            if (!value) {
                setErrors({ ...errors, password: 'Password is required' });
            } else if (!passwordRegex.test(value)) {
                setErrors({ ...errors, password: 'Password must contain at least 1 uppercase, 1 lowercase, 1 special character and be at least 8 characters long' });
            } else {
                setErrors({ ...errors, password: '' });
            }
        }
        if (name === "phoneNo") {
            const numericValue = value.replace(/\D/g, ''); // Remove non-numeric characters

            // Update the phoneNo field only if it's less than or equal to 10 digits
            if (numericValue.length <= 10) {
                setCurrentEmployee((prevEmployee) => ({
                    ...prevEmployee,
                    [name]: numericValue
                }));
                if (numericValue) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        phoneNo: ""
                    }));
                }
            }
        }
        if (name === "profile") {
            const file = e.target.files[0];

            if (file) {
                const fileType = file.type;

                // Check if the file type is either PDF or DOC/DOCX
                if (fileType === "application/pdf" ||
                    fileType === "application/docx" ||
                    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {

                    setCurrentEmployee((prevEmployee) => ({
                        ...prevEmployee,
                        profile: file
                    }));

                    // Remove error when valid file is selected
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        profile: "" // Clear error for profile
                    }));
                } else {
                    // Set error if an invalid file type is selected
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        profile: "Only PDF or DOC files are allowed"
                    }));
                }
            }
        }
        // if (name === "role") {
        //     if (value) {
        //         setErrors((prevErrors) => ({ ...prevErrors, role: "" }));
        //     }
        // }
        if (name === "technology") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, technology: "" }));
            }
        }
    };
    
    const handleClose = () => {
        setCurrentEmployee({ name: '', designation: '', employeeID: '', emailId: '', department: '', reportingTo: '', joiningDate: '', relievingDate: '', projection: '', password: '', profile: '', phoneNo: '', role: '', technology: [] }); // Reset the department fields
        setErrors({ name: '', designation: '', employeeID: '', emailId: '', department: '', reportingTo: '', joiningDate: '', relievingDate: '', projection: '', password: '', profile: '', phoneNo: '', role: '', technology: '' }); // Reset the error state
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
        <div style={{ display: 'flex',flexDirection: 'column', padding: '10px', marginLeft: isDrawerOpen ? 240 : 0, transition: 'margin-left 0.3s', flexGrow: 1 }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '25px' }}>Employees</h3>
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
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'desc'}
                                    onClick={() => handleSort('name')}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'designation'}
                                    direction={orderBy === 'designation' ? order : 'desc'}
                                    onClick={() => handleSort('designation')}
                                >
                                    Designation
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'employeeID'}
                                    direction={orderBy === 'employeeID' ? order : 'desc'}
                                    onClick={() => handleSort('employeeID')}
                                >
                                    EmployeeID
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'emailId'}
                                    direction={orderBy === 'emailId' ? order : 'desc'}
                                    onClick={() => handleSort('emailId')}
                                >
                                    EmailId
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'department'}
                                    direction={orderBy === 'department' ? order : 'desc'}
                                    onClick={() => handleSort('department')}
                                >
                                    Department
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'reportingTo'}
                                    direction={orderBy === 'reportingTo' ? order : 'desc'}
                                    onClick={() => handleSort('reportingTo')}
                                >
                                    ReportingTo
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'joiningDate'}
                                    direction={orderBy === 'joiningDate' ? order : 'desc'}
                                    onClick={() => handleSort('joiningDate')}
                                >
                                    JoiningDate
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'relievingDate'}
                                    direction={orderBy === 'relievingDate' ? order : 'desc'}
                                    onClick={() => handleSort('relievingDate')}
                                >
                                    RelievingDate
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'projection'}
                                    direction={orderBy === 'projection' ? order : 'desc'}
                                    onClick={() => handleSort('projection')}
                                >
                                    Projection
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'phoneNo'}
                                    direction={orderBy === 'phoneNo' ? order : 'desc'}
                                    onClick={() => handleSort('phoneNo')}
                                >
                                    PhoneNo
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'profile'}
                                    direction={orderBy === 'profile' ? order : 'desc'}
                                    onClick={() => handleSort('profile')}
                                >
                                    Profile
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'role'}
                                    direction={orderBy === 'role' ? order : 'desc'}
                                    onClick={() => handleSort('role')}
                                >
                                    Role
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'isActive'}
                                    direction={orderBy === 'isActive' ? order : 'desc'}
                                    onClick={() => handleSort('isActive')}
                                >
                                    Is Active
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'createdBy'}
                                    direction={orderBy === 'createdBy' ? order : 'desc'}
                                    onClick={() => handleSort('createdBy')}
                                >
                                    Created By
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'createdDate'}
                                    direction={orderBy === 'createdDate' ? order : 'desc'}
                                    onClick={() => handleSort('createdDate')}
                                >
                                    Created Date
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'updatedBy'}
                                    direction={orderBy === 'updatedBy' ? order : 'desc'}
                                    onClick={() => handleSort('updatedBy')}
                                >
                                    Updated By
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'updatedDate'}
                                    direction={orderBy === 'updatedDate' ? order : 'desc'}
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
                                <TableCell>
                                    {Employee.profile ? (
                                        <>
                                            <span>{Employee.profile.split('/').pop()}</span>
                                        </>
                                    ) : (
                                        'N/A'
                                    )}
                                </TableCell>
                                <TableCell>{Employee.role}</TableCell>
                                <TableCell>{Employee.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{Employee.createdBy}</TableCell>
                                <TableCell>{new Date(Employee.createdDate).toLocaleString()}</TableCell>
                                <TableCell>{Employee.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{new Date(Employee.updatedDate).toLocaleString() || 'N/A'}</TableCell>
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
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredEmployees.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentEmployee.id ? 'Update Employee' : 'Add Employee'}</DialogTitle>
                <DialogContent>
                    <InputLabel>Name</InputLabel>
                    <TextField
                        margin="dense"
                        name="name"
                        value={currentEmployee.name}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[A-Za-z\s]*$/.test(value))
                                handleChange(e);
                        }}
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name}
                        inputProps={{ maxLength: 50 }}
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
                        type="text" // Keep as 'text' for better control
                        margin="dense"
                        name="employeeID"
                        value={currentEmployee.employeeID}
                        onChange={(e) => {
                            const value = e.target.value;
                            const numericValue = value.replace(/\D/g, '');
                            handleChange({ target: { name: e.target.name, value: numericValue } });
                        }}
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
                        options={(technologies && technologies.length > 0) ? technologies.map((tech) => tech.name) : []}  // Ensure technologies is an array
                        value={currentEmployee.technology || []}  // Ensure value is always an array
                        onChange={(event, newValue) => {
                            handleChange({
                                target: {
                                    name: 'technology',
                                    value: newValue || [],  // Ensure newValue is always an array
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
                            className='datetime'
                            value={currentEmployee.joiningDate ? dayjs(currentEmployee.joiningDate) : null}
                            onChange={handleJoiningDateChange}
                            renderInput={(params) => (
                                <TextField className='DateTime' {...params} fullWidth margin="dense" />
                            )}
                        />
                    </LocalizationProvider>
                    {errors.joiningDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.joiningDate}</Typography>}
                    <InputLabel>Relieving Date</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            className='datetime'
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
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[A-Za-z\s]*$/.test(value))
                                handleChange(e);
                        }}
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
                        error={!!errors.password}  // Show error if exists
                        helperText={errors.password}  // Display error message
                    />
                    <InputLabel>PhoneNumber</InputLabel>
                    <TextField
                        margin="dense"
                        name="phoneNo"
                        value={currentEmployee.phoneNo}
                        onChange={handleChange} // Use the modified handleChange
                        fullWidth
                        error={!!errors.phoneNo}
                        helperText={errors.phoneNo}
                        inputProps={{ maxLength: 10 }} // Limit the max length to 10 digits
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
                        onChange={handleChange}
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