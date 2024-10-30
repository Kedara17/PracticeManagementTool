import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import SearchIcon from '@mui/icons-material/Search';
import PaginationComponent from '../Components/PaginationComponent';
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
    ListItemText
} from '@mui/material';

function NewLeadEnquiryList({ isDrawerOpen }) {
    const [newLeadEnquiries, setNewLeadEnquiries] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [technologies, setTechnologies] = useState([]); // State for technologies
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [currentEnquiry, setCurrentEnquiry] = useState({
        id: '',
        isActive: true,
        createdBy: 'SYSTEM',
        createdDate: new Date().toISOString(),
        updatedBy: 'SYSTEM',
        updatedDate: new Date().toISOString(),
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
            isActive: true,
            createdBy: 'SYSTEM',
            createdDate: new Date().toISOString(),
            updatedBy: 'SYSTEM',
            updatedDate: new Date().toISOString(),
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
            id: enquiry.id,
        });
        setOpen(true);
    };

    const handleSave = async () => {
        let validationErrors = {};

        // Validation checks
        if (!currentEnquiry.companyName) validationErrors.companyName = "Company Name is required";
        if (!currentEnquiry.companyRepresentative) validationErrors.companyRepresentative = "Company Representative is required";
        if (!currentEnquiry.representativeDesignation) validationErrors.representativeDesignation = "Representative Designation is required";
        if (!currentEnquiry.requirement) validationErrors.requirement = "Requirement is required";
        if (!currentEnquiry.assignTo) validationErrors.assignTo = "Assign To is required";
        if (!currentEnquiry.enquiryDate) validationErrors.enquiryDate = "Enquiry Date is required";
        if (!currentEnquiry.status) validationErrors.status = "Status is required";
        if (!currentEnquiry.comments) validationErrors.comments = "Comments are required";
        if (currentEnquiry.technology.length === 0) validationErrors.technology = "At least one Technology is required"; // New validation
        if (!file) validationErrors.fileName = "File is required"; // File validation

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
            fileName: file.name, 
        };

        try {
            let newLeadEnquiryId;
            if (currentEnquiry.id) {
                // Update existing enquiry
                await axios.put(`http://localhost:5054/api/NewLeadEnquiry/${currentEnquiry.id}`, enquiryToSend);
                newLeadEnquiryId = currentEnquiry.id; // Set the existing ID
            } else {
                // Create new enquiry
                const response = await axios.post('http://localhost:5054/api/NewLeadEnquiry', enquiryToSend);
                newLeadEnquiryId = response.data.id; // Get the newly created ID
            }
    
            // Save technology data
            await Promise.all(currentEnquiry.technology.map(technologyId =>
                axios.post('http://localhost:5054/api/NewLeadEnquiryTechnology', {
                    newLeadEnquiryId, // Use the newLeadEnquiryId variable
                    technologyId,
                })
            ));

            const formData = new FormData();
            formData.append('fileName', file);
            formData.append('NewLeadEnquiryId', currentEnquiry.id); // Assuming enquiry ID is needed in NewLeadEnquiryDocuments


            const response = await fetch('http://localhost:5054/api/NewLeadEnquiryDocuments', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            setOpen(false);
            // Fetch updated enquiries
            const enquiryResponse = await axios.get('http://localhost:5054/api/NewLeadEnquiry');
            setNewLeadEnquiries(enquiryResponse.data);
        } catch (error) {
            console.error("Error saving the enquiry:", error.response?.data || error.message);
            setError(error.response?.data || error.message);
        }
    };

    const handleChange = (event) => {
        const { name, value, files } = event.target;
    
        if (name === 'fileName') {
            // Handle file input
            const selectedFile = files[0];
            setFile(selectedFile);
    
            if (!selectedFile) {
                setErrors((prevErrors) => ({ ...prevErrors, fileName: 'File is required' }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, fileName: '' }));
            }
        } else {
            // Handle other inputs
            setCurrentEnquiry((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5054/api/NewLeadEnquiry/${id}`);
            const enquiryResponse = await axios.get('http://localhost:5054/api/NewLeadEnquiry');
            setNewLeadEnquiries(enquiryResponse.data);
        } catch (error) {
            console.error("Error deleting enquiry:", error);
            setError(error.response?.data || error.message);
        }
    };

    const handleReactivate = async (id) => {
        try {
            const enquiryToUpdate = newLeadEnquiries.find(enquiry => enquiry.id === id);
            const updatedEnquiry = { ...enquiryToUpdate, isActive: true };

            // Send the update request to the server
            await axios.put(`http://localhost:5054/api/NewLeadEnquiry/${id}`, updatedEnquiry);

            // Update the local state to reflect the change
            setNewLeadEnquiries((prevEnquiries) =>
                prevEnquiries.map((enquiry) =>
                    enquiry.id === id ? { ...enquiry, isActive: true } : enquiry
                )
            );
        } catch (error) {
            console.error("Error reactivating enquiry:", error);
            setError(error.response?.data || error.message);
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

    const filteredEnquiries = newLeadEnquiries.filter(enquiry =>
        enquiry.companyName.toLowerCase().includes(searchQuery.toLowerCase())
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
                        style={{ marginRight: '10px', width: '300px' }}
                    />
                    <Button variant="contained" onClick={handleAdd}>
                        Add New Enquiry
                    </Button>
                </div>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Company Name</TableCell>
                                <TableCell>Company Representative</TableCell>
                                <TableCell>Representative Designation</TableCell>
                                <TableCell>Requirement</TableCell>
                                <TableCell>Enquiry Date</TableCell>
                                <TableCell>EmployeeID</TableCell>
                                <TableCell>Assign To</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Comments</TableCell>
                                <TableCell>Is Active</TableCell>
                                <TableCell>Created By</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell>Updated By</TableCell>
                                <TableCell>Updated Date</TableCell>
                                <TableCell>Actions</TableCell>
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
                                    <TableCell>{enquiry.isActive ? 'true' : 'false'}</TableCell>
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
                                            <IconButton onClick={() => handleDelete(enquiry.id)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <IconButton onClick={() => handleReactivate(enquiry)}>
                                            <UndoIcon color="action" />
                                        </IconButton>
                                    )}
                                </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <PaginationComponent
                    count={Math.ceil(filteredEnquiries.length / rowsPerPage)}
                    page={page + 1}
                    onPageChange={handlePageChange}
                    rowsPerPage={rowsPerPage} // Rows per page
                    onRowsPerPageChange={handleRowsPerPageChange}
                />

                {/* Dialog for Add/Edit Enquiry */}
                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>{currentEnquiry.id ? 'Edit Enquiry' : 'Add New Enquiry'}</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Company Name"
                            fullWidth
                            margin="normal"
                            name="companyName"
                            value={currentEnquiry.companyName}
                            onChange={handleChange}
                            error={Boolean(errors.companyName)}
                            helperText={errors.companyName}
                        />
                        <TextField
                            label="Company Representative"
                            fullWidth
                            margin="normal"
                            name="companyRepresentative"
                            value={currentEnquiry.companyRepresentative}
                            onChange={handleChange}
                            error={Boolean(errors.companyRepresentative)}
                            helperText={errors.companyRepresentative}
                        />
                        <TextField
                            label="Representative Designation"
                            fullWidth
                            margin="normal"
                            name="representativeDesignation"
                            value={currentEnquiry.representativeDesignation}
                            onChange={handleChange}
                            error={Boolean(errors.representativeDesignation)}
                            helperText={errors.representativeDesignation}
                        />
                        <TextField
                            label="Requirement"
                            fullWidth
                            margin="normal"
                            name="requirement"
                            value={currentEnquiry.requirement}
                            onChange={handleChange}
                            error={Boolean(errors.requirement)}
                            helperText={errors.requirement}
                        />
                        <TextField
                            label="Enquiry Date"
                            fullWidth
                            margin="normal"
                            type="date"
                            name="enquiryDate"
                            value={currentEnquiry.enquiryDate}
                            onChange={handleChange}
                            error={Boolean(errors.enquiryDate)}
                            helperText={errors.enquiryDate}
                        />

                        <TextField
                            select
                            label="EmployeeID"
                            fullWidth
                            margin="normal"
                            name="employeeID"
                            value={currentEnquiry.employeeID}
                            onChange={handleChange}
                            error={Boolean(errors.employeeID)}
                            helperText={errors.employeeID}
                        >
                            {employees.map((employee) => (
                                <MenuItem key={employee.id} value={employee.id}>
                                    {employee.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Assign To"
                            fullWidth
                            margin="normal"
                            name="assignTo"
                            value={currentEnquiry.assignTo}
                            onChange={handleChange}
                            error={Boolean(errors.assignTo)}
                            helperText={errors.assignTo}
                        >
                            {employees.map((employee) => (
                                <MenuItem key={employee.id} value={employee.id}>
                                    {employee.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Status"
                            fullWidth
                            margin="normal"
                            name="status"
                            value={currentEnquiry.status}
                            onChange={handleChange}
                            error={Boolean(errors.status)}
                            helperText={errors.status}
                        />
                        <TextField
                            label="Comments"
                            fullWidth
                            margin="normal"
                            name="comments"
                            value={currentEnquiry.comments}
                            onChange={handleChange}
                            error={Boolean(errors.comments)}
                            helperText={errors.comments}
                        />

                        {/* Technology Multi-Select with Checkboxes */}
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Technology</InputLabel>
                            <Autocomplete
                                multiple
                                id="technologies-autocomplete"
                                options={technologies.map((tech) => ({ id: tech.id, name: tech.name }))} // Assuming tech has id and name
                                getOptionLabel={(option) => option.name} // Displaying the name
                                value={currentEnquiry.technology.map(id => technologies.find(tech => tech.id === id) || { name: '' })} // Match selected IDs with technology names
                                onChange={(event, newValue) => {
                                    handleChange({
                                        target: {
                                            name: 'technology',
                                            value: newValue.map(tech => tech.id), // Store selected technology IDs
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
            </div>
        </div>
    );
}

export default NewLeadEnquiryList;