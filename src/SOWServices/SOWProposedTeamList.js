import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select,TablePagination, MenuItem, Table, InputLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PaginationComponent from '../Components/PaginationComponent'; // Import your PaginationComponent

function SOWProposedTeamList({isDrawerOpen}) {
    const [SOWProposedTeams, setSOWProposedTeams] = useState([]);
    const [SOWRequirements, setSOWRequirements] = useState([]);
    const [Employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentSOWProposedTeam, setCurrentSOWProposedTeam] = useState({
        sowRequirement: '',
        employee: ''
    });
    const [order, setOrder] = useState('asc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [errors, setErrors] = useState({
        id: '',
        sowRequirement: '',
        employee: '',
        isActive: true,
        createdBy: '',
        createdDate: '',
        updatedBy: '',
        updatedDate: ''
    }
    );

    useEffect(() => {
        const fetchSOWProposedTeam = async () => {
            try {
                // const sowProTeamResponse = await axios.get('http://localhost:5041/api/sowProposedTeam');
                const sowProTeamResponse = await axios.get('http://172.17.31.61:5041/api/sowProposedTeam');
                setSOWProposedTeams(sowProTeamResponse.data);
            } catch (error) {
                console.error('There was an error fetching the soeProposedTeams!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchSOWRequirements = async () => {
            try {
                // const sowReqResponse = await axios.get('http://localhost:5041/api/SOWRequirement');
                const sowReqResponse = await axios.get('http://172.17.31.61:5041/api/sowRequirement');
                setSOWRequirements(sowReqResponse.data);
            } catch (error) {
                console.error('There was an error fetching the sowReqResponse!', error);
                setError(error);
            }
        };

        const fetchEmployees = async () => {
            try {
                // const empResponse = await axios.get('http://localhost:5033/api/Employee');
                const empResponse = await axios.get('http://172.17.31.61:5033/api/employee');
                setEmployees(empResponse.data);
            } catch (error) {
                console.error('There was an error fetching the employees!', error);
                setError(error);
            }
        };

        fetchSOWProposedTeam();
        fetchSOWRequirements();
        fetchEmployees();
    }, []);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedSOWProposedTeams = [...SOWProposedTeams].sort((a, b) => {
        const valueA = a[orderBy] || '';
        const valueB = b[orderBy] || '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return order === 'asc' ? (valueA > valueB ? 1 : -1) : (valueB > valueA ? 1 : -1);
        }
    });

    const filteredSOWProposedTeams = sortedSOWProposedTeams.filter((SOWProposedTeam) =>
        (SOWProposedTeam.sowRequirement && typeof SOWProposedTeam.sowRequirement === 'string' &&
            SOWProposedTeam.sowRequirement.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (SOWProposedTeam.employee && typeof SOWProposedTeam.employee === 'string' &&
            SOWProposedTeam.employee.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAdd = () => {
        setCurrentSOWProposedTeam({
            sowRequirement: '',
            employee: ''
        });
        setOpen(true);
    };

    const handleUpdate = (SOWProposedTeam) => {
        setCurrentSOWProposedTeam(SOWProposedTeam);
        setOpen(true);

    };

    const handleDelete = (id) => {
        //axios.delete(`http://localhost:5041/api/SOWProposedTeam/${id}`)
        // axios.delete(`http://172.17.31.61:5041/api/sowProposedTeam/${id}`)
        axios.patch(`http://172.17.31.61:5041/api/sowProposedTeam/${id}`)
            .then(response => {
                setSOWProposedTeams(SOWProposedTeams.filter(tech => tech.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the SOWProposedTeam!', error);
                setError(error);
            });
        setConfirmOpen(false);
    };

    const handleSave = () => {
        let validationErrors = {};

        // Name field validation
        if (!currentSOWProposedTeam.sowRequirement.trim()) {
            validationErrors.sowRequirement = "SowRequirement is required";
        }
        if (!currentSOWProposedTeam.employee) {
            validationErrors.employee = "Employee is required";
        }

        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        if (currentSOWProposedTeam.id) {
            // Update existing SOWProposedTeam
            //axios.put(`http://localhost:5041/api/SOWProposedTeam/${currentSOWProposedTeam.id}`, currentSOWProposedTeam)
            axios.put(`http://172.17.31.61:5041/api/sowProposedTeam/${currentSOWProposedTeam.id}`, currentSOWProposedTeam)
                .then(response => {
                    console.log(response)
                    //setSOWProposedTeams([...SOWProposedTeams, response.data]);
                    // setSOWProposedTeams(response.data);
                    setSOWProposedTeams(SOWProposedTeams.map(tech => tech.id === currentSOWProposedTeam.id ? response.data : tech));
                })
                .catch(error => {
                    console.error('There was an error updating the SOWProposedTeam!', error);
                    setError(error);
                });

        } else {
            // Add new SOWProposedTeam
            //axios.post('http://localhost:5041/api/SOWProposedTeam', currentSOWProposedTeam)
            axios.post('http://172.17.31.61:5041/api/sowProposedTeam', currentSOWProposedTeam)
                .then(response => {
                    setSOWProposedTeams([...SOWProposedTeams, response.data]);
                })
                .catch(error => {
                    console.error('There was an error adding the SOWProposedTeam!', error);
                    setError(error);
                });
        }
        setOpen(false);

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentSOWProposedTeam({ ...currentSOWProposedTeam, [name]: value });
        if (name === "sowRequirement") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, sowRequirement: "" }));
            }
        }
        if (name === "employee") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, employee: "" }));
            }
        }
    };

    const handleClose = () => {
        setCurrentSOWProposedTeam({ sowRequirement: '', employee: '' }); // Reset the department fields
        setErrors({ sowRequirement: '', employee: '' }); // Reset the error state
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
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>There was an error loading the data: {error.message}</p>;
    }

    return (
        <div style={{ display: 'flex',flexDirection: 'column', padding: '10px', marginLeft: isDrawerOpen ? 250 : 0, transition: 'margin-left 0.3s', flexGrow: 1 }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '25px' }}>SOW Proposed Team Table List</h3>
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
                <Button variant="contained" sx={{ backgroundColor: '#00aae7' }} onClick={handleAdd}>Add SOW Proposed Team</Button>
            </div>
            <TableContainer component={Paper} style={{ width: '100%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* <TableCell>ID</TableCell> */}
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
                                    active={orderBy === 'employee'}
                                    direction={orderBy === 'employee' ? order : 'asc'}
                                    onClick={() => handleSort('employee')}
                                >
                                    <b>Employee</b>
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
                        {filteredSOWProposedTeams.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((SOWProposedTeam) => (
                            <TableRow key={SOWProposedTeam.id}
                                sx={{ backgroundColor: SOWProposedTeam.isActive ? 'inherit' : '#FFCCCB' }} >
                                {/* <TableCell>{SOWProposedTeam.id}</TableCell> */}
                                <TableCell>{SOWProposedTeam.sowRequirement}</TableCell>
                                <TableCell>{SOWProposedTeam.employee}</TableCell>
                                <TableCell>{SOWProposedTeam.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{SOWProposedTeam.createdBy}</TableCell>
                                <TableCell>{new Date(SOWProposedTeam.createdDate).toLocaleString()}</TableCell>
                                <TableCell>{SOWProposedTeam.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{new Date(SOWProposedTeam.updatedDate).toLocaleString() || 'N/A'}</TableCell>
                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(SOWProposedTeam)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(SOWProposedTeam.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* <PaginationComponent
                    count={filteredSOWProposedTeams.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                /> */}
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredSOWProposedTeams.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentSOWProposedTeam.id ? 'Update SOWProposedTeam' : 'Add SOWProposedTeam'}</DialogTitle>
                <DialogContent>
                    <InputLabel>SOWRequirement</InputLabel>
                    <Select
                        margin="dense"
                        name="sowRequirement"
                        value={currentSOWProposedTeam.sowRequirement}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.sowRequirement}
                    >
                        {SOWRequirements.map((sowRequirement) => (
                            <MenuItem key={sowRequirement.id} value={sowRequirement.teamSize}>
                                {sowRequirement.teamSize}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.sowRequirement && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.sowRequirement}</Typography>}
                    <InputLabel>Employee</InputLabel>
                    <Select
                        margin="dense"
                        name="employee"
                        value={currentSOWProposedTeam.employee}
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentSOWProposedTeam.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this SOW proposed team?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>Cancel</Button>
                    <Button onClick={handleConfirmYes} color="error">Ok</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default SOWProposedTeamList;
