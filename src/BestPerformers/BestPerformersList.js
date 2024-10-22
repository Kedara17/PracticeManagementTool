import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, MenuItem, TablePagination, Table, InputLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment, Switch, Autocomplete } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import SearchIcon from '@mui/icons-material/Search';
// import PaginationComponent from '../Components/PaginationComponent'; // Import your PaginationComponent
import '../App.css';

function BestPerformersList({ isDrawerOpen }) {
    const [bestperformers, setBestPerformers] = useState([]);
    const [Employees, setEmployees] = useState([]);
    const [Clients, setClients] = useState([]);
    const [Projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState('asc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [open, setOpen] = useState(false);
    const [currentBestperformers, setCurrentBestperformers] = useState({
        employeeID: '',
        frequency: '',
        clientID: '',
        projectID: '',
        isActive: false // New field to track isActive status
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const options = ['Monthly', 'Quarterly', 'Yearly'];

    const [isAdmin, setIsAdmin] = useState(true); // Assume isAdmin is determined by login/auth
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [unauthorizedOpen, setUnauthorizedOpen] = useState(false); // State for unauthorized access dialog
    const [undoConfirmOpen, setUndoConfirmOpen] = useState(false);
    const [selectedBestPerformer, setSelectedBestPerformer] = useState(null); // To store the blog being undone


    useEffect(() => {
        const fetchBestPerformers = async () => {
            try {
                const bestperformersResponse = await axios.get('https://localhost:7240/api/BestPerformers');
                setBestPerformers(bestperformersResponse.data);
            } catch (error) {
                console.error('There was an error fetching the BestPerformers!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchEmployees = async () => {
            try {
                const employeesResponse = await axios.get('http://172.17.31.61:5033/api/employee');
                setEmployees(employeesResponse.data);
            } catch (error) {
                console.error('There was an error fetching the Employee!', error);
                setError(error);
            }
        };
        const fetchClients = async () => {
            try {
                const employeesResponse = await axios.get('http://172.17.31.61:5142/api/client');
                setClients(employeesResponse.data);
            } catch (error) {
                console.error('There was an error fetching the Client!', error);
                setError(error);
            }
        };

        const fetchProjects = async () => {
            try {
                const projectResponse = await axios.get('http://172.17.31.61:5151/api/project');
                setProjects(projectResponse.data);
            } catch (error) {
                console.error('There was an error fetching the Projects!', error);
                setError(error);
            }
        };

        fetchBestPerformers();
        fetchEmployees();
        fetchClients();
        fetchProjects();
    }, []);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };


    const handleUndoClick = (bestperformer) => {
        const userRole = localStorage.getItem('userRole'); // Get the role from localStorage

        if (userRole !== 'Admin') {
            setUnauthorizedOpen(true); // Show unauthorized dialog for non-admins
            return;
        }

        setSelectedBestPerformer(bestperformer); // For admins, store the bestperformer
        setUndoConfirmOpen(true); // Open the confirmation dialog for admins
    };

    const handleUndoConfirm = async () => {
        if (!isAdmin) {
            alert('You cannot access to activate the record.'); // Simple alert for non-admins
            setUndoConfirmOpen(false); // Close the undo dialog
            return;
        }

        if (selectedBestPerformer) {
            await handleToggleActive(selectedBestPerformer); // Toggle the active state if admin
        }
        setUndoConfirmOpen(false); // Close the dialog
        setSelectedBestPerformer(null); // Clear the selected bestperformer
    };

    const handleToggleActive = async (bestperformer) => {
        try {
            const updatedBestPerformer = { ...bestperformer, isActive: !bestperformer.isActive };
            await axios.put(`https://localhost:7240/api/BestPerformers/${bestperformer.id}`, updatedBestPerformer);
            setBestPerformers(bestperformers.map((b) => (b.id === bestperformer.id ? updatedBestPerformer : b)));
        } catch (error) {
            console.error('There was an error updating the active status!', error);
        }
    };

    const sortedBestPerformers = [...bestperformers].sort((a, b) => {
        const valueA = a[orderBy] || '';
        const valueB = b[orderBy] || '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return order === 'asc' ? (valueA > valueB ? 1 : -1) : (valueB > valueA ? 1 : -1);
        }
    });

    const filteredBestPerformers = sortedBestPerformers.filter((bestperformer) =>
        (bestperformer.employeeID && typeof bestperformer.employeeID === 'string' &&
            bestperformer.employeeID.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (bestperformer.frequency && typeof bestperformer.frequency === 'string' &&
            bestperformer.frequency.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (bestperformer.clientID && typeof bestperformer.clientID === 'string' &&
            bestperformer.clientID.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (bestperformer.projectID && typeof bestperformer.projectID === 'string' &&
            bestperformer.projectID.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAdd = () => {
        setCurrentBestperformers({
            employeeID: '',
            frequency: '',
            clientID: '',
            projectID: '',
        });
        setOpen(true);
    };

    const handleUpdate = (BestPerformers) => {
        setCurrentBestperformers(BestPerformers);
        setOpen(true);

    };

    const handleDelete = (id) => {
        axios.patch(`https://localhost:7240/api/BestPerformers/${bestperformers.id}`)
            .then(response => {
                // Find the deleted record and mark it as inactive in the local state
                setBestPerformers(bestperformers.map((bestperformer) =>
                    bestperformer.id === id ? { ...bestperformer, isActive: false } : bestperformer
                ));
            })
            .catch(error => {
                console.error('There was an error deleting the BestPerformer!', error);
                setError(error);
            });
        setConfirmOpen(false); // Close the confirmation dialog
    };


    const handleSave = () => {
        if (currentBestperformers.id) {
            // Update request
            axios.put(`https://localhost:7240/api/BestPerformers/${currentBestperformers.id}`, currentBestperformers)
                .then(response => {
                    setBestPerformers(bestperformers.map(performer =>
                        performer.id === currentBestperformers.id ? response.data : performer
                    ));
                })
                .catch(error => {
                    console.error('There was an error updating the BestPerformer!', error);
                    setError(error);
                });
        } else {
            // Add request
            axios.post('https://localhost:7240/api/BestPerformers', currentBestperformers)
                .then(response => {
                    setBestPerformers([...bestperformers, response.data]);
                })
                .catch(error => {
                    console.error('There was an error adding the BestPerformer!', error);
                    setError(error);
                });
        }
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentBestperformers({ ...currentBestperformers, [name]: value });
    };

    const handleClose = () => {
        setCurrentBestperformers({ employeeID: '', frequency: '', clientID: '', projectID: '' }); // Reset the fields
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
        <div style={{ display: 'flex', flexDirection: 'column', padding: '10px', marginLeft: isDrawerOpen ? 250 : 0, transition: 'margin-left 0.3s', flexGrow: 1 }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '25px' }}>BestPerformers Table List</h3>
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
                <Button variant="contained" sx={{ backgroundColor: '#00aae7' }} onClick={handleAdd}>Add BestPerformers</Button>
            </div>
            <TableContainer component={Paper} style={{ width: '100%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'employeeID'}
                                    direction={orderBy === 'employeeID' ? order : 'asc'}
                                    onClick={() => handleSort('employeeID')}
                                >
                                    <b>Employee</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'frequency'}
                                    direction={orderBy === 'frequency' ? order : 'asc'}
                                    onClick={() => handleSort('frequency')}
                                >
                                    <b>Frequency</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'clientID'}
                                    direction={orderBy === 'clientID' ? order : 'asc'}
                                    onClick={() => handleSort('clientID')}
                                >
                                    <b>Client</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'projectID'}
                                    direction={orderBy === 'projectID' ? order : 'asc'}
                                    onClick={() => handleSort('projectID')}
                                >
                                    <b>Project</b>
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
                        {filteredBestPerformers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((BestPerformers) => (
                            <TableRow key={BestPerformers.id}
                                sx={{ backgroundColor: BestPerformers.isActive ? 'inherit' : '#FFCCCB' }} >
                                {/* <TableCell>{BestPerformers.id}</TableCell> */}
                                <TableCell>{BestPerformers.employeeID}</TableCell>
                                <TableCell>{BestPerformers.frequency}</TableCell>
                                <TableCell>{BestPerformers.clientID}</TableCell>
                                <TableCell>{BestPerformers.projectID}</TableCell>
                                {/* <TableCell>{BestPerformers.isActive ? 'Active' : 'Inactive'}</TableCell> */}
                                <TableCell>
                                    {isAdmin && (
                                        <Switch
                                            checked={BestPerformers.isActive}
                                            onChange={() => handleToggleActive(BestPerformers)}
                                            color="primary"
                                        />
                                    )}
                                </TableCell>
                                <TableCell>{BestPerformers.createdBy}</TableCell>
                                <TableCell>{new Date(BestPerformers.createdDate).toLocaleString()}</TableCell>
                                <TableCell>{BestPerformers.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{new Date(BestPerformers.updatedDate).toLocaleString() || 'N/A'}</TableCell>
                                <TableCell>
                                    {BestPerformers.isActive ? (
                                        <>
                                            <IconButton onClick={() => handleUpdate(BestPerformers)}>
                                                <EditIcon color="primary" />
                                            </IconButton>
                                            <IconButton onClick={() => confirmDelete(BestPerformers.id)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <IconButton onClick={() => handleUndoClick(BestPerformers)}>
                                            <UndoIcon color="action" />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination Component */}
                {/* <PaginationComponent
                    count={filteredBestPerformers.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                /> */}
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredBestPerformers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentBestperformers.id ? 'Update BestPerformers' : 'Add BestPerformers'}</DialogTitle>
                <DialogContent>

                    {/*

                    <InputLabel>Employee</InputLabel>
                    <Select
                        margin="dense"
                        name="employeeID"  // Correct name for state update
                        value={currentBestperformers.employeeID}  // This should reflect the state correctly
                        onChange={handleChange}
                        fullWidth
                    >
                        {Employees.map((employee) => (
                            <MenuItem key={employee.id} value={employee.name}>
                                {employee.name}
                            </MenuItem>
                        ))}
                    </Select>

                    <InputLabel>Client</InputLabel>
                    <Select
                        margin="dense"
                        name="clientID"  // Correct name for state update
                        value={currentBestperformers.clientID}
                        onChange={handleChange}
                        fullWidth
                    >
                        {Clients.map((client) => (
                            <MenuItem key={client.id} value={client.name}>
                                {client.name}
                            </MenuItem>
                        ))}
                    </Select>

                    <InputLabel>Project</InputLabel>
                    <Select
                        margin="dense"
                        name="projectID"
                        value={currentBestperformers.projectID}
                        onChange={handleChange}
                        fullWidth
                        inputProps={{ maxLength: 200 }}
                    >
                        {Projects.map((project) => (
                            <MenuItem key={project.id} value={project.projectName}>
                                {project.projectName}
                            </MenuItem>
                        ))}
                    </Select> */}
                    <InputLabel>Frequency</InputLabel>
                    <Autocomplete
                        options={options}
                        value={options.includes(currentBestperformers.frequency) ? currentBestperformers.frequency : null}
                        onChange={(event, newValue) => {
                            handleChange({ target: { name: 'frequency', value: newValue } });
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="dense"
                                fullWidth
                                inputProps={{ maxLength: 50, ...params.inputProps }} // Ensure we maintain the inputProps
                            />
                        )}
                        freeSolo // Allows free text input
                    />

                    <InputLabel>Employee</InputLabel>
                    <Autocomplete
                        options={Employees}
                        getOptionLabel={(option) => option.name} // Assuming 'name' is the property of the employee
                        value={Employees.find((employee) => employee.name === currentBestperformers.employeeID) || null}
                        onChange={(event, newValue) => {
                            handleChange({ target: { name: 'employeeID', value: newValue ? newValue.name : '' } });
                        }}
                        renderInput={(params) => (
                            <TextField {...params} margin="dense" fullWidth />
                        )}
                    />
                    
                    <InputLabel>Client</InputLabel>
                    <Autocomplete
                        options={Clients}
                        getOptionLabel={(option) => option.name}
                        value={Clients.find((client) => client.name === currentBestperformers.clientID) || null}
                        onChange={(event, newValue) => {
                            handleChange({ target: { name: 'clientID', value: newValue ? newValue.name : '' } });
                        }}
                        renderInput={(params) => (
                            <TextField {...params} margin="dense" fullWidth />
                        )}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentBestperformers.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this bestperformer?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>Cancel</Button>
                    <Button onClick={handleConfirmYes} color="error">Ok</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={undoConfirmOpen} onClose={() => setUndoConfirmOpen(false)}>
                <DialogTitle>Undo Confirmation</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to undo to the respective state?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUndoConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={handleUndoConfirm} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={unauthorizedOpen} onClose={() => setUnauthorizedOpen(false)}>
                <DialogTitle>Access Denied</DialogTitle>
                <DialogContent>
                    <Typography>Only Admins have access to activate the record.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUnauthorizedOpen(false)}>Ok</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default BestPerformersList;
