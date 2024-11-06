import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import SearchIcon from '@mui/icons-material/Search';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    MenuItem,
    FormControl,
    InputLabel,
    Autocomplete,
    Checkbox,
    ListItemText,
    Select,
    Typography,
    Switch,
    TableSortLabel,
    TablePagination,
} from '@mui/material';

function NewLeadEnquiryList({ isDrawerOpen }) {
    const [newLeadEnquiries, setNewLeadEnquiries] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [technologies, setTechnologies] = useState([]); // State for technologies
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false); // Dialog for delete confirmation
    const [deleteEnquiry, setDeleteEnquiry] = useState(null); // Store ID for deletion
    const [currentEnquiry, setCurrentEnquiry] = useState({
        id: '',
        employeeID: '',
        assignTo: '',
        companyName: '',
        companyRepresentative: '',
        representativeDesignation: '',
        requirement: '',
        enquiryDate: '',
        status: '',
        comments: '',
        technology: [], // Changed to an array for multiple selections
        fileName: '',
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('desc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [errors, setErrors] = useState({});
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const enquiryResponse = await axios.get('http://localhost:5054/api/NewLeadEnquiry');
                setNewLeadEnquiries(enquiryResponse.data);

                const employeeResponse = await axios.get('http://localhost:5533/api/Employee');
                setEmployees(employeeResponse.data);

                const technologyResponse = await axios.get('http://localhost:5574/api/Technology'); // Fetch technologies
                setTechnologies(technologyResponse.data);
            } catch (error) {
                setError(error);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleAdd = () => {
        setCurrentEnquiry({
            id: '',
            employeeID: '',
            assignTo: '',
            companyName: '',
            companyRepresentative: '',
            representativeDesignation: '',
            requirement: '',
            enquiryDate: '',
            status: '',
            comments: '',
            technology: [], // Reset technology
            fileName: '',
        });
        setOpen(true);
    };

    const handleUpdate = (enquiry) => {
        setCurrentEnquiry({
            ...enquiry,
            enquiryDate: new Date(enquiry.enquiryDate).toISOString().split('T')[0],
            technology: enquiry.technology || [], // Set technology to the existing ones
            fileName: enquiry.fileName || "",      // Set to existing file name if available
            id: enquiry.id,
        });
        setOpen(true);
    };

    const handleSave = async () => {
        let validationErrors = {};

        // Validation checks
        if (!currentEnquiry.companyName) {
            validationErrors.companyName = "Company Name is required";
        } else if (newLeadEnquiries.some(enquiry => enquiry.companyName.toLowerCase() === currentEnquiry.companyName.toLowerCase() && enquiry.id !== currentEnquiry.id)) {
            validationErrors.companyName = "Company Name must be unique";
        }

        if (!currentEnquiry.companyRepresentative) {
            validationErrors.companyRepresentative = "Company Representative is required";
        } else if (newLeadEnquiries.some(enquiry => enquiry.companyRepresentative.toLowerCase() === currentEnquiry.companyRepresentative.toLowerCase() && enquiry.id !== currentEnquiry.id)) {
            validationErrors.companyRepresentative = "Company Representative must be unique";
        }

        if (!currentEnquiry.representativeDesignation) {
            validationErrors.representativeDesignation = "Representative Designation is required";
        } else if (newLeadEnquiries.some(enquiry => enquiry.representativeDesignation.toLowerCase() === currentEnquiry.representativeDesignation.toLowerCase() && enquiry.id !== currentEnquiry.id)) {
            validationErrors.representativeDesignation = "Representative Designation must be unique";
        }

        if (!currentEnquiry.requirement) {
            validationErrors.requirement = "Requirement is required";
        } else if (newLeadEnquiries.some(enquiry => enquiry.requirement.toLowerCase() === currentEnquiry.requirement.toLowerCase() && enquiry.id !== currentEnquiry.id)) {
            validationErrors.requirement = "Requirement must be unique";
        }

        if (!currentEnquiry.assignTo) {
            validationErrors.assignTo = "Assign To is required";
        }
        if (!currentEnquiry.enquiryDate) {
            validationErrors.enquiryDate = "Enquiry Date is required";
        }
        if (!currentEnquiry.status) {
            validationErrors.status = "Status is required";
        }
        if (!currentEnquiry.comments) {
            validationErrors.comments = "Comments are required";
        }
        if (currentEnquiry.technology.length === 0) {
            validationErrors.technology = "At least one Technology is required";
        }
        if (!file) {
            validationErrors.fileName = "File is required";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        // Prepare data for submission
        const enquiryToSend = {
            ...currentEnquiry,
            enquiryDate: new Date(currentEnquiry.enquiryDate).toISOString(),
            updatedDate: new Date().toISOString(),
            isActive: currentEnquiry.isActive === true,
            fileName: file ? file.name : currentEnquiry.fileName,
            updatedBy: 'userName',
        };

        try {
            let newLeadEnquiryId;
            if (currentEnquiry.id) {
                await axios.put(`http://localhost:5054/api/NewLeadEnquiry/${currentEnquiry.id}`, enquiryToSend);
                newLeadEnquiryId = currentEnquiry.id; // Set the existing ID
                setNewLeadEnquiries((prevEnquiries) =>
                    prevEnquiries.map((enquiry) =>
                        enquiry.id === currentEnquiry.id ? { ...enquiry, ...enquiryToSend } : enquiry
                    )
                );
            } else {
                const response = await axios.post('http://localhost:5054/api/NewLeadEnquiry', enquiryToSend);
                newLeadEnquiryId = response.data.id; // Get the newly created ID
                setNewLeadEnquiries((prevEnquiries) => [...prevEnquiries, response.data]);
            }

            await Promise.all(currentEnquiry.technology.map(technologyId =>
                axios.post('http://localhost:5054/api/NewLeadEnquiryTechnology', {
                    newLeadEnquiryId,
                    technologyId,
                })
            ));

            if (file) {
                const formData = new FormData();
                formData.append('FileName', file);
                formData.append('Id', currentEnquiry.id);

                await axios.post('http://localhost:5054/api/NewLeadEnquiryDocuments', formData);

            }

            setOpen(false);
        } catch (error) {
            console.error("Error saving the enquiry:", error.response?.data || error.message);
            setError(error.response?.data || error.message);
        }
    };

    const handleChange = (event) => {
        const { name, value, files } = event.target;

        // File validation for `fileName`
        if (name === 'fileName') {
            const selectedFile = files[0];
            setFile(selectedFile);

            if (!selectedFile) {
                setErrors((prevErrors) => ({ ...prevErrors, fileName: 'File is required' }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, fileName: '' }));
            }
        } else {
            // Update current enquiry field
            setCurrentEnquiry((prev) => ({
                ...prev,
                [name]: value,
            }));

            // Field-specific validations
            if (name === "companyName") {
                if (!value.trim()) {
                    setErrors((prevErrors) => ({ ...prevErrors, companyName: "Company Name is required" }));
                } else if (value.length > 50) {
                    setErrors((prevErrors) => ({ ...prevErrors, companyName: "Maximum 50 characters allowed" }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, companyName: "" }));
                }
            }

            if (name === "companyRepresentative") {
                if (!value.trim()) {
                    setErrors((prevErrors) => ({ ...prevErrors, companyRepresentative: "Company Representative is required" }));
                } else if (value.length > 50) {
                    setErrors((prevErrors) => ({ ...prevErrors, companyRepresentative: "Maximum 50 characters allowed" }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, companyRepresentative: "" }));
                }
            }

            if (name === "representativeDesignation") {
                if (!value.trim()) {
                    setErrors((prevErrors) => ({ ...prevErrors, representativeDesignation: "Representative Designation is required" }));
                } else if (value.length > 50) {
                    setErrors((prevErrors) => ({ ...prevErrors, representativeDesignation: "Maximum 50 characters allowed" }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, representativeDesignation: "" }));
                }
            }

            if (name === "requirement") {
                if (!value.trim()) {
                    setErrors((prevErrors) => ({ ...prevErrors, requirement: "Requirement is required" }));
                } else if (value.length > 50) {
                    setErrors((prevErrors) => ({ ...prevErrors, requirement: "Maximum 50 characters allowed" }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, requirement: "" }));
                }
            }

            if (name === "assignTo") {
                if (!value) {
                    setErrors((prevErrors) => ({ ...prevErrors, assignTo: "Assign To is required" }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, assignTo: "" }));
                }
            }

            if (name === "employeeID") {
                if (!value) {
                    setErrors((prevErrors) => ({ ...prevErrors, employeeID: "Employee ID is required" }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, employeeID: "" }));
                }
            }

            if (name === "enquiryDate") {
                if (!value) {
                    setErrors((prevErrors) => ({ ...prevErrors, enquiryDate: "Enquiry Date is required" }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, enquiryDate: "" }));
                }
            }

            if (name === "status") {
                if (!value) {
                    setErrors((prevErrors) => ({ ...prevErrors, status: "Status is required" }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, status: "" }));
                }
            }

            if (name === "comments") {
                if (!value.trim()) {
                    setErrors((prevErrors) => ({ ...prevErrors, comments: "Comments are required" }));
                } else if (value.length > 500) {
                    setErrors((prevErrors) => ({ ...prevErrors, comments: "Maximum 500 characters allowed" }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, comments: "" }));
                }
            }

            if (name === "technology") {
                if (!value) {
                    setErrors((prevErrors) => ({ ...prevErrors, technology: "Technology selection is required" }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, technology: "" }));
                }
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.patch(`http://localhost:5054/api/NewLeadEnquiry/${id}`);
            const enquiryResponse = await axios.get('http://localhost:5054/api/NewLeadEnquiry');
            setNewLeadEnquiries(enquiryResponse.data);
            setConfirmOpen(false);
        } catch (error) {
            console.error("Error deleting enquiry:", error);
            setError(error.response?.data || error.message);
        }
    };

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        const sortedData = [...data].sort((a, b) => {
            if (a[property] < b[property]) return isAsc ? -1 : 1;
            if (a[property] > b[property]) return isAsc ? 1 : -1;
            return 0;
        });

        setData(sortedData); // Set the sorted data to ensure full dataset is updated
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleReactivate = async (id, currentState) => {
        try {
            const enquiryToUpdate = newLeadEnquiries.find(enquiry => enquiry.id === id);
            if (!enquiryToUpdate) {
                throw new Error("Enquiry not found with the provided ID");
            }

            const updatedEnquiry = {
                ...enquiryToUpdate,
                isActive: !currentState,
                fileName: enquiryToUpdate.fileName || '',
                technology: enquiryToUpdate.technology || [],
            };

            await axios.put(`http://localhost:5054/api/NewLeadEnquiry/${id}`, updatedEnquiry, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            setNewLeadEnquiries((prevEnquiries) =>
                prevEnquiries.map((enquiry) =>
                    enquiry.id === id ? { ...enquiry, isActive: !currentState } : enquiry
                )
            );
        } catch (error) {
            console.error("Error reactivating enquiry:", error.response?.data || error.message);
            setError(error.response?.data || error.message);
        }
    };

    const handleToggleActive = async (enquiry) => {
        try {
            // Toggle isActive status and provide default values if necessary
            const updatedEnquiry = {
                ...enquiry,
                isActive: !enquiry.isActive,
                fileName: enquiry.fileName || '',
                technology: enquiry.technology || [],
            };

            console.log("Payload being sent with defaults:", updatedEnquiry); // Log payload with defaults

            const response = await axios.put(`http://localhost:5054/api/NewLeadEnquiry/${enquiry.id}`, updatedEnquiry);

            if (response.status === 200) {
                setNewLeadEnquiries(prevEnquiries =>
                    prevEnquiries.map((f) => (f.id === enquiry.id ? updatedEnquiry : f))
                );
            } else {
                console.error("Unexpected response:", response);
            }
        } catch (error) {
            console.error("There was an error updating the active status!", error.response?.data || error.message);
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };
    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>There was an error loading the data: {error.message}</p>;
    }

    const sortedEnquiries = [...newLeadEnquiries].sort((a, b) => {
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


    const filteredEnquiries = sortedEnquiries.filter((enquiry) =>
        (enquiry.companyName && typeof enquiry.companyName === 'string' &&
            enquiry.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (enquiry.companyRepresentative && typeof enquiry.companyRepresentative === 'string' &&
            enquiry.companyRepresentative.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (enquiry.representativeDesignation && typeof enquiry.representativeDesignation === 'string' &&
            enquiry.representativeDesignation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (enquiry.requirement && typeof enquiry.requirement === 'string' &&
            enquiry.requirement.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (enquiry.enquiryDate && typeof enquiry.enquiryDate === 'string' &&
            enquiry.enquiryDate.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (enquiry.employeeID && typeof enquiry.employeeID === 'string' &&
            enquiry.employeeID.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (enquiry.assignTo && typeof enquiry.assignTo === 'string' &&
            enquiry.assignTo.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (enquiry.status && typeof enquiry.status === 'string' &&
            enquiry.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (enquiry.comments && typeof enquiry.comments === 'string' &&
            enquiry.comments.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (enquiry.isActive && typeof enquiry.isActive === 'string' &&
            enquiry.isActive.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (enquiry.createdBy && typeof enquiry.createdBy === 'string' &&
            enquiry.createdBy.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (enquiry.createdDate && typeof enquiry.createdDate === 'string' &&
            enquiry.createdDate.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (enquiry.updatedBy && typeof enquiry.updatedBy === 'string' &&
            enquiry.updatedBy.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (enquiry.updatedDate && typeof enquiry.updatedDate === 'string' &&
            enquiry.updatedDate.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const paginatedEnquiries = filteredEnquiries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <div style={{ display: 'flex', padding: '10px', marginLeft: isDrawerOpen ? 260 : 0, transition: 'margin-left 0.3s', flexGrow: 1 }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '25px' }}>New Lead Enquiry Table List</h3>
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
                        style={{ marginRight: '10px', flexGrow: 1 }}
                    />
                    <Button variant="contained" onClick={handleAdd}>
                        Add New Enquiry
                    </Button>
                </div>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'companyName'}
                                        direction={orderBy === 'companyName' ? order : 'desc'}
                                        onClick={() => handleSort('companyName')}
                                    >
                                        <b>Company Name</b>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'companyRepresentative'}
                                        direction={orderBy === 'companyRepresentative' ? order : 'desc'}
                                        onClick={() => handleSort('companyRepresentative')}
                                    >
                                        <b>Company Representative</b>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'representativeDesignation'}
                                        direction={orderBy === 'representativeDesignation' ? order : 'desc'}
                                        onClick={() => handleSort('representativeDesignation')}
                                    >
                                        <b>Representative Designation</b>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'requirement'}
                                        direction={orderBy === 'requirement' ? order : 'desc'}
                                        onClick={() => handleSort('requirement')}
                                    >
                                        <b>Requirement</b>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'enquiryDate'}
                                        direction={orderBy === 'enquiryDate' ? order : 'desc'}
                                        onClick={() => handleSort('enquiryDate')}
                                    >
                                        <b>Enquiry Date</b>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'employeeID'}
                                        direction={orderBy === 'employeeID' ? order : 'desc'}
                                        onClick={() => handleSort('employeeID')}
                                    >
                                        <b>EmployeeID</b>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'assignTo'}
                                        direction={orderBy === 'assignTo' ? order : 'desc'}
                                        onClick={() => handleSort('assignTo')}
                                    >
                                        <b>Assign To</b>
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
                                        active={orderBy === 'comments'}
                                        direction={orderBy === 'comments' ? order : 'desc'}
                                        onClick={() => handleSort('comments')}
                                    >
                                        <b>Comments</b>
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
                            {paginatedEnquiries.map((enquiry) => (
                                <TableRow key={enquiry.id} style={{ backgroundColor: enquiry.isActive ? 'white' : '#FFCCCB' }}>
                                    <TableCell>{enquiry.companyName}</TableCell>
                                    <TableCell>{enquiry.companyRepresentative}</TableCell>
                                    <TableCell>{enquiry.representativeDesignation}</TableCell>
                                    <TableCell>{enquiry.requirement}</TableCell>
                                    <TableCell>{new Date(enquiry.enquiryDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{employees.find(employee => employee.id === enquiry.employeeID)?.name}</TableCell>
                                    <TableCell>{employees.find(employee => employee.id === enquiry.assignTo)?.name}</TableCell>
                                    <TableCell>{enquiry.status}</TableCell>
                                    <TableCell>{enquiry.comments}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={enquiry.isActive}
                                            onChange={() => handleToggleActive(enquiry)}
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell>{enquiry.createdBy}</TableCell>
                                    <TableCell>{new Date(enquiry.createdDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{enquiry.updatedBy}</TableCell>
                                    <TableCell>{new Date(enquiry.updatedDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {enquiry.isActive ? (
                                            <>
                                                <IconButton onClick={() => handleUpdate(enquiry)}>
                                                    <EditIcon color="primary" />
                                                </IconButton>
                                                <IconButton onClick={() => setConfirmOpen(true) || setDeleteEnquiry(enquiry.id)}>
                                                    <DeleteIcon color="error" />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <IconButton onClick={() => handleReactivate(enquiry.id, enquiry.isActive)}>
                                                <UndoIcon color="action" />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={filteredEnquiries.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />

                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>{currentEnquiry.id ? 'Edit Enquiry' : 'Add New Enquiry'}</DialogTitle>
                    <DialogContent>
                        <InputLabel>CompanyName</InputLabel>
                        <TextField
                            fullWidth
                            margin="normal"
                            name="companyName"
                            value={currentEnquiry.companyName}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Regex to allow letters, numbers, spaces, and the specified special characters
                                if (/^[A-Za-z\s.\-']*$/.test(value)) {
                                    handleChange(e);
                                }
                            }}
                            error={Boolean(errors.companyName)}
                            helperText={errors.companyName}
                            inputProps={{ maxLength: 50 }}
                        />

                        <InputLabel>CompanyRepresentative</InputLabel>
                        <TextField
                            fullWidth
                            margin="normal"
                            name="companyRepresentative"
                            value={currentEnquiry.companyRepresentative}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Regex to allow letters, numbers, spaces, and the specified special characters
                                if (/^[A-Za-z\s.\-']*$/.test(value)) {
                                    handleChange(e);
                                }
                            }}
                            error={Boolean(errors.companyRepresentative)}
                            helperText={errors.companyRepresentative}
                            inputProps={{ maxLength: 50 }}
                        />

                        <InputLabel>RepresentativeDesignation</InputLabel>
                        <TextField
                            fullWidth
                            margin="normal"
                            name="representativeDesignation"
                            value={currentEnquiry.representativeDesignation}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Regex to allow letters, numbers, spaces, and the specified special characters
                                if (/^[A-Za-z\s.\-']*$/.test(value)) {
                                    handleChange(e);
                                }
                            }}
                            error={Boolean(errors.representativeDesignation)}
                            helperText={errors.representativeDesignation}
                            inputProps={{ maxLength: 50 }}
                        />

                        <InputLabel>Requirement</InputLabel>
                        <TextField
                            fullWidth
                            margin="normal"
                            name="requirement"
                            value={currentEnquiry.requirement}
                            onChange={handleChange}
                            error={Boolean(errors.requirement)}
                            helperText={errors.requirement}
                            inputProps={{ maxLength: 50 }}
                        />

                        <InputLabel>EnquiryDate</InputLabel>
                        <TextField
                            fullWidth
                            margin="normal"
                            type="date"
                            name="enquiryDate"
                            value={currentEnquiry.enquiryDate}
                            onChange={handleChange}
                            error={Boolean(errors.enquiryDate)}
                            helperText={errors.enquiryDate}
                        />

                        <InputLabel>EmployeeID</InputLabel>
                        <Select
                            fullWidth
                            margin="normal"
                            name="employeeID"
                            value={currentEnquiry.employeeID}
                            onChange={handleChange}
                            error={Boolean(errors.employeeID)}
                            inputProps={{ maxLength: 36 }}
                        >
                            {employees.map((employee) => (
                                <MenuItem key={employee.id} value={employee.id}>
                                    {employee.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.employeeID && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.employeeID}</Typography>}

                        <InputLabel>AssignTo</InputLabel>
                        <Select
                            fullWidth
                            margin="normal"
                            name="assignTo"
                            value={currentEnquiry.assignTo}
                            onChange={handleChange}
                            error={Boolean(errors.assignTo)}
                            inputProps={{ maxLength: 36 }}
                        >
                            {employees.map((employee) => (
                                <MenuItem key={employee.id} value={employee.id}>
                                    {employee.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.assignTo && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.assignTo}</Typography>}

                        <InputLabel>Status</InputLabel>
                        <TextField
                            fullWidth
                            margin="normal"
                            name="status"
                            value={currentEnquiry.status}
                            onChange={handleChange}
                            error={Boolean(errors.status)}
                            helperText={errors.status}
                            inputProps={{ maxLength: 50 }}
                        />

                        <InputLabel>Comments</InputLabel>
                        <TextField
                            fullWidth
                            margin="normal"
                            name="comments"
                            value={currentEnquiry.comments}
                            onChange={handleChange}
                            error={Boolean(errors.comments)}
                            helperText={errors.comments}
                            inputProps={{ maxLength: 500 }}
                        />
                        <InputLabel id="demo-simple-select-label">Technology</InputLabel>
                        <FormControl fullWidth>
                            <Autocomplete
                                multiple
                                id="technologies-autocomplete"
                                options={technologies.map((tech) => ({ id: tech.id, name: tech.name }))}
                                getOptionLabel={(option) => option.name}
                                value={currentEnquiry.technology.map(id => technologies.find(tech => tech.id === id) || { name: '' })}
                                onChange={(event, newValue) => {
                                    handleChange({
                                        target: {
                                            name: 'technology',
                                            value: newValue.map(tech => tech.id),
                                        },
                                    });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
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
                                        <ListItemText primary={option.name} />
                                    </li>
                                )}
                            />
                        </FormControl>

                        <InputLabel>FileName</InputLabel>
                        <TextField
                            type="file"
                            margin="dense"
                            name="fileName"
                            onChange={handleChange}
                            fullWidth
                            required={!currentEnquiry.id}
                            error={!!errors.fileName}
                            helperText={errors.fileName}
                            inputProps={{
                                accept: ".pdf, .doc, .docx"
                            }}
                        />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to delete this follow-up?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                        <Button onClick={() => handleDelete(deleteEnquiry)} color="error">Delete</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default NewLeadEnquiryList;