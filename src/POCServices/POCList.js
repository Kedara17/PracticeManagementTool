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

function POCList({ isDrawerOpen }) {
    const [POCs, setPOCs] = useState([]);
    const [Clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPOC, setCurrentPOC] = useState({
        title: '',
        client: '',
        status: '',
        targetDate: '',
        completedDate: '',
        document: ''
    });
    const [order, setOrder] = useState('desc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const options = ['InProgress', 'InReview', 'Completed'];
    const [errors, setErrors] = useState({
        title: '',
        client: '',
        status: '',
        targetDate: '',
        completedDate: '',
        document: ''
    }
    );

    useEffect(() => {
        const fetchPOCs = async () => {
            try {
                const pocResponse = await axios.get('http://172.17.31.61:5254/api/poc');
                setPOCs(pocResponse.data);
            } catch (error) {
                console.error('There was an error fetching the pocs!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchClients = async () => {
            try {
                const clientResponse = await axios.get('http://172.17.31.61:5142/api/client');
                setClients(clientResponse.data);
            } catch (error) {
                console.error('There was an error fetching the departments!', error);
                setError(error);
            }
        };

        fetchPOCs();
        fetchClients();
    }, []);

    const handleSort = (property) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const sortedPOCs = [...POCs].sort((a, b) => {
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

    const filteredPOCs = sortedPOCs.filter(poc =>
        (poc && poc.title.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (poc && poc.client && poc.client.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (poc && poc.status && poc.status.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (poc && poc.targetDate && poc.targetDate.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (poc && poc.completedDate && poc.completedDate.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (poc && poc.document && poc.document.toLowerCase().includes(searchQuery.toLowerCase()))

    );

    const handleAdd = () => {
        setCurrentPOC({
            title: '',
            client: '',
            status: '',
            targetDate: '',
            completedDate: '',
            document: ''
        });
        setOpen(true);
    };

    const handleUpdate = (poc) => {
        setCurrentPOC(poc);
        setOpen(true);
    };

    const handleDelete = (id) => {
        axios.patch(`http://172.17.31.61:5254/api/poc/${id}`)
            .then(response => {
                setPOCs(POCs.filter(tech => tech.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the poc!', error);
                setError(error);
            });
        setConfirmOpen(false);
    };

    const handleSave = async () => {
        let validationErrors = {};

        if (!currentPOC.title.trim()) {
            validationErrors.title = "POC title is required";

        }else if(currentPOC.title.length < 3) {
            validationErrors.title = "POC title must be atleast 3 characters";
        }
        else if (POCs.some(tech => tech.title.toLowerCase() === currentPOC.title.toLowerCase() && tech.id !== currentPOC.id)) {
            validationErrors.title = "POC title must be unique";
        }
        if (!currentPOC.client) {
            validationErrors.client = "Client is required";
        }
        if (!currentPOC.status) {
            validationErrors.status = "Status is required";
        }
        if (!currentPOC.targetDate) {
            validationErrors.targetDate = "TargetDate is required";
        }
        if (!currentPOC.completedDate) {
            validationErrors.completedDate = "ComletedDate is required";
        }
        if (!currentPOC.document || errors.document) {
            validationErrors.document = "Please select a valid PDF or DOC file";
        }
        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        try {
            let documentPath = currentPOC.document;
            // If a new file is selected, upload it
            if (selectedFile) {
                const formData = new FormData();
                formData.append('document', selectedFile);
                formData.append('id', "");

                const uploadResponse = await axios.post('http://localhost:5254/api/POC/uploadFile', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                documentPath = uploadResponse.data.path; // Adjust based on your backend response
            }

            currentPOC.document = documentPath;
            if (currentPOC.id) {
                const response = axios.put(`http://localhost:5254/api/POC/${currentPOC.id}`, currentPOC)
                setPOCs(POCs.map(poc => poc.id === currentPOC.id ? response.data : poc));
            } else {
                const response = axios.post('http://localhost:5254/api/POC', currentPOC)
                setPOCs([...POCs, response.data]);
            }
            setSelectedFile(null);
            setOpen(false);
        } catch (error) {
            console.error('There was an error saving the Poc!', error);
            setError(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentPOC({ ...currentPOC, [name]: value });

        if (name === "title") {
            if (value.length === 200) {
                setErrors((prevErrors) => ({ ...prevErrors, title: "More than 200 characters are not allowed" }));
            } else if (value.length < 3) {
                setErrors((prevErrors) => ({ ...prevErrors, title: "" }))
            }
            else {
                setErrors((prevErrors) => ({ ...prevErrors, title: "" }));
            }
        }
        if (name === "client") {
            if (value.length === 36) {
                setErrors((prevErrors) => ({ ...prevErrors, client: "More than 36 characters are not allowed" }));
            }
            else {
                setErrors((prevErrors) => ({ ...prevErrors, client: "" }));
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
        if (name === "targetDate") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, targetDate: "" }));
            }
        }
        if (name === "completedDate") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, completedDate: "" }));
            }
        }
        if (name === "document") {
            const file = e.target.files[0];

            if (file) {
                const fileType = file.type;

                // Check if the file type is either PDF or DOC/DOCX
                if (fileType === "application/pdf" ||
                    fileType === "application/msword" ||
                    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {

                    setCurrentPOC((prevEmployee) => ({
                        ...prevEmployee,
                        document: file
                    }));
                    setSelectedFile(file);
                    // Remove error when valid file is selected
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        document: "" // Clear error for profile
                    }));
                } else {
                    // Set error if an invalid file type is selected
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        document: "Only PDF or DOC files are allowed"
                    }));
                }
            }
        }
    };

    const handleClose = () => {
        setCurrentPOC({ title: '', client: '', status: '', targetDate: '', completedDate: '', document: '' }); // Reset the department fields
        setErrors({ title: '', client: '', status: '', targetDate: '', completedDate: '', document: '' }); // Reset the error state
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
    const handleTargetDateChange = (newDate) => {
        setCurrentPOC((prevPOCs) => ({
            ...prevPOCs,
            targetDate: newDate ? newDate.toISOString() : "",
        }));
        if (newDate) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                targetDate: "",
            }));
        }
    };

    const handleCompletedDateChange = (newDate) => {
        setCurrentPOC((prev) => ({
            ...prev,
            completedDate: newDate ? newDate.toISOString() : "",
        }));
        if (newDate) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                completedDate: "",
            }));
        }
    };


    if (loading) {
        return <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:'200px' }}>Loading...</p>;
    }

    if (error) {
        return <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:'200px' }}>There was an error loading the data: {error.message}</p>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '10px', marginLeft: isDrawerOpen ? 240 : 0, transition: 'margin-left 0.3s', flexGrow: 1 }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '25px' }}>POC Table List</h3>
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
                <Button variant="contained" sx={{ backgroundColor: '#00aae7' }} onClick={handleAdd}>Add POC</Button>
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
                                    Title
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'client'}
                                    direction={orderBy === 'client' ? order : 'desc'}
                                    onClick={() => handleSort('client')}
                                >
                                    Client
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'status'}
                                    direction={orderBy === 'status' ? order : 'desc'}
                                    onClick={() => handleSort('status')}
                                >
                                    Status
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'targetDate'}
                                    direction={orderBy === 'targetDate' ? order : 'desc'}
                                    onClick={() => handleSort('targetDate')}
                                >
                                    TargetDate
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'completedDate'}
                                    direction={orderBy === 'completedDate' ? order : 'desc'}
                                    onClick={() => handleSort('completedDate')}
                                >
                                    CompletedDate
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'document'}
                                    direction={orderBy === 'document' ? order : 'desc'}
                                    onClick={() => handleSort('document')}
                                >
                                    Document
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
                        {filteredPOCs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((poc) => (
                            <TableRow key={poc.id}
                                sx={{ backgroundColor: poc.isActive ? 'inherit' : '#FFCCCB' }} >
                                <TableCell>{poc.title}</TableCell>
                                <TableCell>{poc.client}</TableCell>
                                <TableCell>{poc.status}</TableCell>
                                <TableCell>{poc.targetDate}</TableCell>
                                <TableCell>{poc.completedDate}</TableCell>
                                <TableCell>{poc.document}</TableCell>
                                <TableCell>{poc.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{poc.createdBy}</TableCell>
                                <TableCell>{poc.createdDate}</TableCell>
                                <TableCell>{poc.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{poc.updatedDate}</TableCell>
                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(poc)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(poc.id)}>
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
                count={filteredPOCs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentPOC.id ? 'Update POC' : 'Add POC'}</DialogTitle>
                <DialogContent>
                    <InputLabel>POC Title</InputLabel>
                    <TextField
                        margin="dense"
                        name="title"
                        value={currentPOC.title}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[A-Za-z\s]*$/.test(value))
                                handleChange(e);
                        }}
                        fullWidth
                        error={!!errors.title} // Display error if exists
                        helperText={errors.title}
                        inputProps={{ maxLength: 200 }}
                    />
                    <InputLabel>Client</InputLabel>
                    <Select
                        margin="dense"
                        name="client"
                        value={currentPOC.client}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.client}
                        inputProps={{ maxLength: 36 }}
                    >
                        {Clients.map((client) => (
                            <MenuItem key={client.id} value={client.name}>
                                {client.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.client && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.client}</Typography>}
                    <InputLabel>Status</InputLabel>
                    <Select
                        margin="dense"
                        label="Status"
                        name="status"
                        value={currentPOC.status}
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
                    <InputLabel>TargetDate</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            className='date'
                            value={currentPOC.targetDate ? dayjs(currentPOC.targetDate) : null}
                            onChange={handleTargetDateChange}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense" />
                            )}
                        />
                    </LocalizationProvider>
                    {errors.targetDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.targetDate}</Typography>}
                    <InputLabel>CompletedDate</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            className='date'
                            value={currentPOC.completedDate ? dayjs(currentPOC.completedDate) : null}
                            onChange={handleCompletedDateChange}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense" />
                            )}
                        />
                    </LocalizationProvider>
                    {errors.completedDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.completedDate}</Typography>}
                    <InputLabel>POC Document</InputLabel>
                    <TextField
                        type="file"
                        margin="dense"
                        name="document"
                        onChange={handleChange}
                        fullWidth
                        required={!currentPOC.id}
                        error={!!errors.document}
                        helperText={errors.document}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentPOC.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this POC?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>No</Button>
                    <Button onClick={handleConfirmYes} color="error">Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default POCList;

