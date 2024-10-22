import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ListItemText, Checkbox, Box, Select, MenuItem, Table, InputLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PaginationComponent from '../Components/PaginationComponent'; // Import your PaginationComponent



function SuccessStoriesList() {
    const [SuccessStories, setSuccessStories] = useState([]);
    const [Employees, setEmployees] = useState([]);
    const [Clients, setClients] = useState([]);
    const [Projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // const [technologies, setTechnologies] = useState([]);
    const [currentSuccessStorie, setCurrentSuccessStorie] = useState({
        client: '',
        project: '',
        assignTo: '',
        status: '',
        comments: '',
        isActive: true // New field to track isActive status
        // technology: []
    });

    const [order, setOrder] = useState('desc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [errors, setErrors] = useState({
        client: '',
        project: '',
        assignTo: '',
        status: '',
        comments: '',
        isActive: false // New field to track isActive status
        // technology: []
    });


    useEffect(() => {
        const fetchSuccessStories = async () => {
            try {
                const successStoriesResponse = await axios.get('http://localhost:5235/api/SuccessStories');
                setSuccessStories(successStoriesResponse.data);
            } catch (error) {
                console.error('There was an error fetching the SuccessStories!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchClient = async () => {
            try {
                const clientResponse = await axios.get('http://172.17.31.61:5142/api/client');
                setClients(clientResponse.data);
            } catch (error) {
                console.error('There was an error fetching the client!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchEmployees = async () => {
            try {
                const empResponse = await axios.get('http://172.17.31.61:5033/api/Employee');
                setEmployees(empResponse.data);
            } catch (error) {
                console.error('There was an error fetching the employees!', error);
                setError(error);
            }
        };
        const fetchProjects = async () => {
            try {
                const techResponse = await axios.get('http://172.17.31.61:5151/api/project');
                setProjects(techResponse.data);
            } catch (error) {
                console.error('There was an error fetching the Projects!', error);
                setError(error);
            }
        };


        fetchSuccessStories();
        fetchClient();
        fetchEmployees();
        fetchProjects();

        // console.log('testing...');

    }, []);


    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

   

    const sortedSuccessStories = [...SuccessStories].sort((a, b) => {
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

    const filteredSuccessStorie = sortedSuccessStories.filter((successStorie) =>

        (successStorie.client && typeof successStorie.client === 'string' &&
            successStorie.client.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (successStorie.project && typeof successStorie.project === 'string' &&
            successStorie.project.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (successStorie.assignTo && typeof successStorie.assignTo === 'string' &&
            successStorie.assignTo.toLowerCase().includes(searchQuery.toLowerCase()))


    );

    const handleAdd = () => {
        setCurrentSuccessStorie({
            client: '',
            project: '',
            assignTo: '',
            status: '',
            comments: '',

        });
        setOpen(true);
    };

    const handleUpdate = (successStorie) => {
        setCurrentSuccessStorie(successStorie);
        setOpen(true);

    };

    const handleDelete = (id) => {
        //axios.delete(`http://localhost:5151/api/Project/${id}`)
        axios.patch(`http://localhost:5235/api/SuccessStories/${id}`)
            .then(response => {
                setSuccessStories(SuccessStories.filter(tech => tech.id !== id));
            })

            
            .catch(error => {
                console.error('There was an error deleting the SuccessStorie!', error);
                setError(error);
            });
        setConfirmOpen(false);
    }

    const handleSave = () => {
        let validationErrors = {};

        // Client field validation
        if (!currentSuccessStorie.client) {
            validationErrors.client = "Please select a client";
        }

        // Technical Project Manager validation
        if (!currentSuccessStorie.project) {
            validationErrors.project = "Please select a  project ";
        }

        // Assigned To field validation
        if (!currentSuccessStorie.assignTo) {
            validationErrors.assignTo = "Please select a employee";
        }

       
        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});
        if (currentSuccessStorie.id) {
            // axios.put(`http://localhost:5574/api/Technology/${currentTechnology.id}`, currentTechnology)
            axios.put(`http://localhost:5235/api/SuccessStories/${currentSuccessStorie.id}`, currentSuccessStorie)
                .then(response => {
                    // setSuccessStories(SuccessStories.map(tech => tech.id === response.data.id ? response.data : tech));
                    setSuccessStories(prevSuccessStories => 
                        prevSuccessStories.map(tech => 
                          tech.id === response.data.id ? response.data : tech
                        )
                      );
                })
                .catch(error => {
                    console.error('There was an error updating the SuccessStorie!', error);
                    setError(error);
                });
        } else {
            // axios.post('http://localhost:5574/api/Technology', currentTechnology)
            axios.post('http://localhost:5235/api/SuccessStories', currentSuccessStorie)
                .then(response => {
                    setSuccessStories([...SuccessStories, response.data]);
                })
                .catch(error => {
                    console.error('There was an error adding the SuccessStorie!', error);
                    setError(error);
                });
        }
        setOpen(false);
    };




    // const successStorieToSave = {
    //     ...currentSuccessStorie,
    //     technology: currentSuccessStorie.technology.map(tech => {
    //         const selectedTech = Technologies.find(t => t.name === tech);
    //         return selectedTech ? selectedTech.id : null;
    //     }).filter(id => id !== null) // Convert technology names to IDs
    // };

    // if (currentSuccessStorie.id) {
    //     // Update existing Project
    //     //axios.put(`http://localhost:5151/api/Project/${currentProject.id}`, currentProject)
    //     axios.put(`https://localhost:7132/api/SuccessStories/${currentSuccessStorie.id}`, successStorieToSave)
    //         .then(response => {
    //             console.log(response)
    //             //setProjects([...Projects, response.data]);
    //             // setProjects(response.data);
    //             setSuccessStories(SuccessStories.map(tech => tech.id === currentSuccessStorie.id ? response.data : tech));
    //         })
    //         .catch(error => {
    //             console.error('There was an error updating the Project!', error);
    //             setError(error);
    //         });

    // } else {
    //     // Add new Project
    //     //axios.post('http://localhost:5151/api/Project', currentProject)
    //     axios.post('https://localhost:7132/api/SuccessStories', successStorieToSave)
    //         .then(response => {
    //             setProjects([...SuccessStories, response.data]);
    //         })
    //         .catch(error => {
    //             console.error('There was an error adding the successStorie!', error);
    //             setError(error);
    //         });
    // }
    // setOpen(false);



    // if (currentSuccessStorie.id) {
    //     // axios.put(`http://localhost:5151/api/Project/${currentProject.id}`, currentTechnology)
    //     axios.put(`https://localhost:7132/api/SuccessStories/${currentSuccessStorie.id}`, currentSuccessStorie)
    //         .then(response => {
    //             setSuccessStories(SuccessStories.map(tech => tech.id === currentSuccessStorie.id ? response.data : tech));
    //         })
    //         .catch(error => {
    //             console.error('There was an error updating the SuccessStories!', error);
    //             setError(error);
    //         });
    // } else {
    //     // axios.post('http://localhost:5574/api/Technology', currentTechnology)
    //     axios.post('https://localhost:7132/api/SuccessStories', currentSuccessStorie)
    //         .then(response => {
    //             setSuccessStories([...SuccessStories, response.data]);
    //         })
    //         .catch(error => {
    //             console.error('There was an error adding the SuccessStories!', error);
    //             setError(error);
    //         });
    // }
    // setOpen(false);





    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentSuccessStorie({ ...currentSuccessStorie, [name]: value });

        

        if (name === "client") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, client: "" }));
            }
        }
        if (name === "project") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, project: "" }));
            }
        }

        if (name === "assignTo") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, assignTo: "" }));
            }
        }
        if (name === "status") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, status: "" }));
            }
        }
        if (name === "comments") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, comments: "" }));
            }
        }


    };

    const handleClose = () => {
        setCurrentSuccessStorie({ client: '', project: '', assignTo: '', status: '', comments: '' }); // Reset the department fields        
        setErrors({ client: '', project: '', assignTo: '', status: '', comments: '' }); // Reset the error state
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


    return (
        <Box>
            <div style={{ display: 'flex' }}>
                <h3>SuccessStories Table List</h3>
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
                <Button variant="contained" color="primary" onClick={handleAdd}>Add SuccessStories</Button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* <TableCell>ID</TableCell> */}
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'client'}
                                    direction={orderBy === 'client' ? order : 'asc'}
                                    onClick={() => handleSort('client')}
                                >
                                    <b>Client</b>
                                </TableSortLabel>
                            </TableCell>
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
                                    active={orderBy === 'assignTo'}
                                    direction={orderBy === 'assignTo' ? order : 'asc'}
                                    onClick={() => handleSort('assignTo')}
                                >
                                    <b>AssignTo</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'status'}
                                    direction={orderBy === 'status' ? order : 'asc'}
                                    onClick={() => handleSort('status')}
                                >
                                    <b>Status</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'comments'}
                                    direction={orderBy === 'comments' ? order : 'asc'}
                                    onClick={() => handleSort('comments')}
                                >
                                    <b>Comments</b>
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
                        {filteredSuccessStorie.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((SuccessStorie) => (
                            <TableRow key={SuccessStorie.id}
                                sx={{ backgroundColor: SuccessStorie.isActive ? 'inherit' : '#FFCCCB' }} >
                                {/* <TableCell>{SuccessStorie.id}</TableCell> */}
                                <TableCell>{SuccessStorie.client}</TableCell>
                                <TableCell>{SuccessStorie.project}</TableCell>
                                <TableCell>{SuccessStorie.assignTo}</TableCell>
                                <TableCell>{SuccessStorie.status}</TableCell>
                                <TableCell>{SuccessStorie.comments}</TableCell>

                                <TableCell>{SuccessStorie.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{SuccessStorie.createdBy}</TableCell>
                                <TableCell>{(SuccessStorie.createdDate)}</TableCell>
                                <TableCell>{SuccessStorie.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{(SuccessStorie.updatedDate) || 'N/A'}</TableCell>
                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(SuccessStorie)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(SuccessStorie.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* Pagination Component */}
                <PaginationComponent
                    count={filteredSuccessStorie.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentSuccessStorie.id ? 'Update SuccessStorie' : 'Add SuccessStorie'}</DialogTitle>
                <DialogContent>
                    <InputLabel>Client</InputLabel>
                    <Select
                        margin="dense"
                        name="client"
                        value={currentSuccessStorie.client}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.client}
                        helperText={errors.comments}
                    >
                        {Clients.map((client) => (
                            <MenuItem key={client.id} value={client.name}>
                                {client.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.client && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.client}</Typography>}



                    <InputLabel>Project</InputLabel>
                    <Select
                        margin="dense"
                        name="project"
                        value={currentSuccessStorie.project}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.project}
                        helperText={errors.comments}
                    >
                        {Projects.map((project) => (
                            <MenuItem key={project.id} value={project.projectName}>
                                {project.projectName}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.project && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.project}</Typography>}


                    <InputLabel>AssignTo</InputLabel>
                    <Select
                        margin="dense"
                        name="assignTo"
                        value={currentSuccessStorie.assignTo}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.assignTo}
                        helperText={errors.comments}
                    >
                        {Employees.map((assignTo) => (
                            <MenuItem key={assignTo.id} value={assignTo.name}>
                                {assignTo.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.assignTo && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.assignTo}</Typography>}


                   


                    <TextField
                        margin="dense"
                        name="status"
                        label="Status"
                        value={currentSuccessStorie.status}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.comments} // Display error if exists
                        helperText={errors.comments}
                    />

<TextField
                        margin="dense"
                        name="comments"
                        label="Comments"
                        value={currentSuccessStorie.comments}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.comments} // Display error if exists
                        helperText={errors.comments}
                    />

</DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentSuccessStorie.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>




                    <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                        <DialogTitle>Confirm Delete</DialogTitle>

                        <DialogContent>
                            <Typography>Are you sure you want to delete this SuccessStory?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleConfirmClose}>No</Button>
                            <Button onClick={handleConfirmYes} color="error">Yes</Button>
                        </DialogActions>
                    </Dialog>
              
           
        </Box>

    );
}

export default SuccessStoriesList;
