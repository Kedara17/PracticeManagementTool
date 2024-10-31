import React, { useEffect, useState } from 'react';
import { Table, TableBody, Select, Typography, TableCell, TableContainer, TablePagination, TableHead, TableRow, Paper, IconButton, Dialog, InputAdornment, DialogTitle, DialogContent, TextField, Button, MenuItem, DialogActions, InputLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import SearchIcon from '@mui/icons-material/Search';
import PaginationComponent from '../Components/PaginationComponent';
import axios from 'axios';

const NewLeadEnquiryFollowUpList = ({ isDrawerOpen }) => {
    const [followUpData, setFollowUpData] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false); // Dialog for delete confirmation
    const [deleteFollowUpId, setDeleteFollowUpId] = useState(null); // Store ID for deletion
    const [currentFollowUp, setCurrentFollowUp] = useState({
        isActive: true,
        createdBy: 'SYSTEM',
        createdDate: new Date().toISOString(),
        updatedBy: 'SYSTEM',
        updatedDate: new Date().toISOString(),
        newLeadEnquiryID: '',
        assignTo: '',
        newFollowupDate: new Date().toISOString().split('T')[0],
        comments: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchFollowUpData = async () => {
            try {
                const response = await axios.get('http://localhost:5054/api/NewLeadEnquiryFollowup');
                console.log("Follow Up Data:", response.data); // Log the follow-up data
                setFollowUpData(response.data);
            } catch (error) {
                console.error("Error fetching follow-up data:", error);
            }
        };

        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:5533/api/Employee');
                console.log("Employee Data:", response.data); // Log the employee data
                setEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        const fetchNewLeadEnquiry = async () => {
            try {
                const response = await axios.get('http://localhost:5054/api/NewLeadEnquiry');
                console.log("New Lead Enquiry Data:", response.data); // Log the new lead enquiry data
                setEnquiries(response.data);
            } catch (error) {
                console.error("Error fetching new lead enquiry:", error);
            }
        };

        fetchFollowUpData();
        fetchEmployees();
        fetchNewLeadEnquiry();
    }, []);

    const handleAdd = () => {
        setCurrentFollowUp({
            isActive: true,
            createdBy: 'SYSTEM',
            createdDate: new Date().toISOString(),
            updatedBy: 'SYSTEM',
            updatedDate: new Date().toISOString(),
            newLeadEnquiryID: '',
            assignTo: '',
            newFollowupDate: new Date().toISOString().split('T')[0],
            comments: '',

        });
        setErrors({});
        setOpen(true);
    };

    const handleUpdate = (followUp) => {
        setCurrentFollowUp(followUp);
        setOpen(true);
    };

    const handleSave = async () => {
        let validationErrors = {};
        if (!currentFollowUp.newLeadEnquiryID) validationErrors.newLeadEnquiryID = "New Lead Enquiry ID is required";
        if (!currentFollowUp.assignTo) validationErrors.assignTo = "Assign To is required";
        if (!currentFollowUp.newFollowupDate) validationErrors.newFollowupDate = "New FollowupDate is required";
        if (!currentFollowUp.comments) validationErrors.comments = "Comments is required";

        const followUpDate = new Date(currentFollowUp.newFollowupDate);
        if (isNaN(followUpDate.getTime())) {
            validationErrors.newFollowupDate = "Valid date is required";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        const followUpToSend = {
            ...currentFollowUp,
            newFollowupDate: followUpDate.toISOString(),
            updatedDate: new Date().toISOString(),
        };

        try {
            if (currentFollowUp.id) {
                await axios.put(`http://localhost:5054/api/NewLeadEnquiryFollowup/${currentFollowUp.id}`, followUpToSend)
                    .then((response) => {
                        console.log(response);
                    });

                setFollowUpData(followUpData.map(f => f.id === currentFollowUp.id ? currentFollowUp : f));
                console.log("Updated follow-up:", followUpToSend); // Log the data being sent
            } else {
                const newFollowup = await axios.post('http://localhost:5054/api/NewLeadEnquiryFollowup', followUpToSend);
                setFollowUpData([...followUpData, newFollowup.data]);
                console.log("Added new follow-up:", followUpToSend); // Log the new follow-up data
            }
            setOpen(false);
        } catch (error) {
            console.error("Error saving follow-up data:", error);
        }
    };

    const handleDelete = async (id) => {

        try {
            await axios.patch(`http://localhost:5054/api/NewLeadEnquiryFollowup/${id}`);
            setFollowUpData(followUpData.filter(f => f.id !== id));
        } catch (error) {
            setConfirmOpen(false);
        }
    };

    const handleReactivate = async (id, currentState) => {
        try {
            const followUpToReactivate = followUpData.find((followUp) => followUp.id === id);
            if (!followUpToReactivate) {
                throw new Error("Follow-up not found with the provided ID");
            }
            const updatedFollowUp = {
                ...followUpToReactivate,
                isActive: !currentState
            };
            await axios.put(`http://localhost:5054/api/NewLeadEnquiryFollowup/${id}`, updatedFollowUp, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            setFollowUpData((prevData) =>
                prevData.map((followUp) =>
                    followUp.id === id ? { ...followUp, isActive: !currentState } : followUp
                )
            );
        } catch (error) {
            console.error("Error reactivating follow-up:", error.response?.data || error.message);
            setErrors(error.response?.data || error.message);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCurrentFollowUp(prev => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        setCurrentFollowUp({
            newLeadEnquiryID: '',
            assignTo: '',
            newFollowupDate: '',
            comments: '',
            isActive: '',
            createdBy: '',
            createdDate: '',
            updatedBy: '',
            updatedDate: ''
        });
        setErrors({
            newLeadEnquiryID: '',
            assignTo: '',
            newFollowupDate: '',
            comments: '',
            isActive: '',
            createdBy: '',
            createdDate: '',
            updatedBy: '',
            updatedDate: ''
        });
        setOpen(false);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const filteredfollowUpData = followUpData.filter((followUp) => {
        const assignToName = employees.find(emp => emp.id === followUp.assignTo)?.name || '';
        const enquiryName = enquiries.find(enquiry => enquiry.id === followUp.newLeadEnquiryID)?.name || '';
        const comments = followUp.comments || '';

        return (
            assignToName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            enquiryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comments.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const paginatedfollowUpData = filteredfollowUpData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (

        <div style={{ display: 'flex', padding: '10px', marginLeft: isDrawerOpen ? 260 : 0, transition: 'margin-left 0.3s', flexGrow: 1 }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '25px' }}>New Lead Enquiry FollowUp List</h3>
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
                        style={{ marginRight: '10px', width: '1000px' }}
                    />
                    <Button variant="contained" onClick={handleAdd}>
                        Add New FollowUp
                    </Button>
                </div>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>NewLeadEnquiryID</TableCell>
                                <TableCell>AssignTo</TableCell>
                                <TableCell>New Follow-Up Date</TableCell>
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
                            {paginatedfollowUpData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((followUp) => (
                                <TableRow key={followUp.id} style={{ backgroundColor: followUp.isActive ? 'white' : '#FFCCCB' }}>
                                    <TableCell>{enquiries.find(newLeadEnquiry => newLeadEnquiry.id === followUp.newLeadEnquiryID)?.id}</TableCell>
                                    <TableCell>{employees.find(employee => employee.id === followUp.assignTo)?.name}</TableCell>
                                    <TableCell>{new Date(followUp.newFollowupDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{followUp.comments}</TableCell>
                                    <TableCell>{followUp.isActive ? 'true' : 'false'}</TableCell>
                                    <TableCell>{followUp.createdBy}</TableCell>
                                    <TableCell>{new Date(followUp.createdDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{followUp.updatedBy}</TableCell>
                                    <TableCell>{new Date(followUp.updatedDate).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">
                                        {followUp.isActive ? (
                                            <>
                                                <IconButton onClick={() => handleUpdate(followUp)}>
                                                    <EditIcon color="primary" />
                                                </IconButton>
                                                <IconButton onClick={() => setConfirmOpen(true) || setDeleteFollowUpId(followUp.id)}>
                                                    <DeleteIcon color="error" />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <IconButton onClick={() => handleReactivate(followUp.id)}>
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
                    count={paginatedfollowUpData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />

                <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to delete this follow-up?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                        <Button onClick={() => handleDelete(deleteFollowUpId)} color="error">Delete</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>{currentFollowUp.id ? 'Edit Follow-Up' : 'Add New Follow-Up'}</DialogTitle>
                    <DialogContent>
                        <InputLabel>NewLeadEnquiryID</InputLabel>
                        <Select
                            fullWidth
                            margin="normal"
                            name="newLeadEnquiryID"
                            value={currentFollowUp.newLeadEnquiryID}
                            onChange={handleChange}
                            error={Boolean(errors.newLeadEnquiryID)}
                        >
                            {enquiries.map((newLeadEnquiry) => (
                                <MenuItem key={newLeadEnquiry.id} value={newLeadEnquiry.id}>
                                    {newLeadEnquiry.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.newLeadEnquiryID && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.newLeadEnquiryID}</Typography>}

                        <InputLabel>AssignTo</InputLabel>
                        <Select
                            fullWidth
                            margin="normal"
                            name="assignTo"
                            value={currentFollowUp.assignTo}
                            onChange={handleChange}
                            error={Boolean(errors.assignTo)}
                        >
                            {employees.map((employee) => (
                                <MenuItem key={employee.id} value={employee.id}>
                                    {employee.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.assignTo && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.assignTo}</Typography>}

                        <InputLabel>NewFollowupDate</InputLabel>
                        <TextField
                            fullWidth
                            margin="normal"
                            type="date"
                            name="newFollowupDate"
                            value={currentFollowUp.newFollowupDate}
                            error={Boolean(errors.newFollowupDate)}
                            onChange={handleChange}
                        />
                        {errors.newFollowupDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.newFollowupDate}</Typography>}

                        <InputLabel>Comments</InputLabel>
                        <TextField
                            fullWidth
                            margin="normal"
                            name="comments"
                            value={currentFollowUp.comments}
                            error={Boolean(errors.comments)}
                            onChange={handleChange}
                        />
                        {errors.comments && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.comments}</Typography>}

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSave} color="primary">
                            {currentFollowUp.id ? 'Update' : 'Save'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>

    );
};
export default NewLeadEnquiryFollowUpList;