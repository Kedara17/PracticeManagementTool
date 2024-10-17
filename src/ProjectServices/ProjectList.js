import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Autocomplete,TablePagination, ListItemText, Checkbox, Select, MenuItem, Table, InputLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PaginationComponent from '../Components/PaginationComponent'; // Import your PaginationComponent
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import '../App.css';

function ProjectList({isDrawerOpen}) {
    const [Projects, setProjects] = useState([]);
    const [Employees, setEmployees] = useState([]);
    const [Clients, setClients] = useState([]);
    const [Technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentProject, setCurrentProject] = useState({
        client: '',
        projectName: '',
        technicalProjectManager: '',
        salesContact: '',
        pmo: '',
        sowSubmittedDate: '',
        sowSignedDate: '',
        sowValidTill: '',
        sowLastExtendedDate: '',
        technology: []
    });

    const [order, setOrder] = useState('asc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [errors, setErrors] = useState({
        client: '',
        projectName: '',
        technicalProjectManager: '',
        salesContact: '',
        pmo: '',
        sowSubmittedDate: '',
        sowSignedDate: '',
        sowValidTill: '',
        sowLastExtendedDate: '',
        technology: []
    }
    );

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectResponse = await axios.get('http://172.17.31.61:5151/api/project');
                setProjects(projectResponse.data);
            } catch (error) {
                console.error('There was an error fetching the Projects!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchClient = async () => {
            try {
                const clientResponse = await axios.get('http://172.17.31.61:5142/api/client');
                setClients(clientResponse.data);
            } catch (error) {
                console.error('There was an error fetching the technologies!', error);
                setError(error);
            }
            setLoading(false);
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
        const fetchTechnologies = async () => {
            try {
                const techResponse = await axios.get('http://172.17.31.61:5274/api/Technology');
                setTechnologies(techResponse.data);
            } catch (error) {
                console.error('There was an error fetching the technologies!', error);
                setError(error);
            }
        };
        fetchProjects();
        fetchClient();
        fetchEmployees();
        fetchTechnologies();
    }, []);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedProjects = [...Projects].sort((a, b) => {
        const valueA = a[orderBy] || '';
        const valueB = b[orderBy] || '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return order === 'asc' ? (valueA > valueB ? 1 : -1) : (valueB > valueA ? 1 : -1);
        }
    });

    const filteredProjects = sortedProjects.filter((project) =>

        (project.client && typeof project.client === 'string' &&
            project.client.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (project.projectName && typeof project.projectName === 'string' &&
            project.projectName.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (project.technicalProjectManager && typeof project.technicalProjectManager === 'string' &&
            project.technicalProjectManager.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (project.salesContact && typeof project.salesContact === 'string' &&
            project.salesContact.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (project.pmo && typeof project.pmo === 'string' &&
            project.pmo.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAdd = () => {
        setCurrentProject({
            client: '',
            projectName: '',
            technicalProjectManager: '',
            salesContact: '',
            pmo: '',
            sowSubmittedDate: '',
            sowSignedDate: '',
            sowValidTill: '',
            sowLastExtendedDate: '',
            technology: []
        });
        setOpen(true);
    };

    const handleUpdate = (Project) => {
        setCurrentProject(Project);
        setOpen(true);

    };

    const handleDelete = (id) => {
        //axios.delete(`http://localhost:5151/api/Project/${id}`)
        axios.delete(`http://172.17.31.61:5151/api/project/${id}`)
            .then(response => {
                setProjects(Projects.filter(tech => tech.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the Project!', error);
                setError(error);
            });
        setConfirmOpen(false);
    };

    const handleSave = () => {
        setFormSubmitted(true);
        let validationErrors = {};

        // Name field validation
        if (!currentProject.projectName.trim()) {
            validationErrors.projectName = "ProjectName is required";
        } else if (Projects.some(pro => pro.projectName.toLowerCase() === currentProject.projectName.toLowerCase() && pro.id !== currentProject.id)) {
            validationErrors.projectName = "ProjectName must be unique";
        }

        if (!currentProject.client) {
            validationErrors.client = "Client is required";
        }
        if (!currentProject.technicalProjectManager) {
            validationErrors.technicalProjectManager = "TechnicalProjectManager is required";
        }
        if (!currentProject.salesContact) {
            validationErrors.salesContact = "SalesContact is required";
        }
        if (!currentProject.pmo) {
            validationErrors.pmo = "Pmo is required";
        }
        if (!currentProject.sowSubmittedDate) {
            validationErrors.sowSubmittedDate = "SowSubmittedDate is required";
        }
        if (!currentProject.sowSignedDate) {
            validationErrors.sowSignedDate = "SowSignedDate is required";
        }
        if (!currentProject.sowValidTill) {
            validationErrors.sowValidTill = "SowValidTill is required";
        }
        if (!currentProject.sowLastExtendedDate) {
            validationErrors.sowLastExtendedDate = "SowLastExtendedDate is required";
        }
        if (!currentProject.technology || currentProject.technology.length === 0) {
            validationErrors.technology = "Technology is required";                  
             }

        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        const projectToSave = {
            ...currentProject,
            technology: currentProject.technology.map(tech => {
                const selectedTech = Technologies.find(t => t.name === tech);
                return selectedTech ? selectedTech.id : null;
            }).filter(id => id !== null) // Convert technology names to IDs
        };

        if (currentProject.id) {
            // Update existing Project
            //axios.put(`http://localhost:5151/api/Project/${currentProject.id}`, currentProject)
            axios.put(`http://172.17.31.61:5151/api/project/${currentProject.id}`, projectToSave)
                .then(response => {
                    console.log(response)
                    //setProjects([...Projects, response.data]);
                    // setProjects(response.data);
                    setProjects(Projects.map(tech => tech.id === currentProject.id ? response.data : tech));
                })
                .catch(error => {
                    console.error('There was an error updating the Project!', error);
                    setError(error);
                });

        } else {
            // Add new Project
            //axios.post('http://localhost:5151/api/Project', currentProject)
            axios.post('http://172.17.31.61:5151/api/project', projectToSave)
                .then(response => {
                    setProjects([...Projects, response.data]);
                })
                .catch(error => {
                    console.error('There was an error adding the Project!', error);
                    setError(error);
                });
        }
        setOpen(false);
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentProject({ ...currentProject, [name]: value });

        if (name === "projectName") {
            // Check if the title is empty or only whitespace
            if (!value.trim()) {
                setErrors((prevErrors) => ({ ...prevErrors, projectName: "" }));
            }
            // Check for uniqueness
            else if (Projects.some(pro => pro.projectName.toLowerCase() === value.toLowerCase() && pro.id !== currentProject.id)) {
                setErrors((prevErrors) => ({ ...prevErrors, projectName: "" }));
            }else if (value.length === 50) {
                setErrors((prevErrors) => ({ ...prevErrors, projectName: "More than 50 characters are not allowed" }));
            }
            // Clear the title error if valid
            else {
                setErrors((prevErrors) => ({ ...prevErrors, projectName: "" }));
            }
        }
        if (name === "client") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, client: "" }));
            }
        }
        if (name === "technicalProjectManager") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, technicalProjectManager: "" }));
            }
        }

        if (name === "salesContact") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, salesContact: "" }));
            }
        }
        if (name === "pmo") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, pmo: "" }));
            }
        }
        if (name === "sowSubmittedDate") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, sowSubmittedDate: "" }));
            }
        }
        if (name === "sowSignedDate") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, sowSignedDate: "" }));
            }
        }
        if (name === "sowValidTill") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, sowValidTill: "" }));
            }
        }
        if (name === "sowLastExtendedDate") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, sowLastExtendedDate: "" }));
            }
        }
        if (name === "technology") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, technology: "" }));
            }
        } 
    };

    const handleClose = () => {
        setCurrentProject({ client: '', projectName: '', technicalProjectManager: '', salesContact: '', pmo: '', sowSubmittedDate: '', sowSignedDate: '', sowValidTill: '', sowLastExtendedDate: '', technology: [] }); // Reset the department fields        
        setErrors({ client: '', projectName: '', technicalProjectManager: '', salesContact: '', pmo: '', sowSubmittedDate: '', sowSignedDate: '', sowValidTill: '', sowLastExtendedDate: '', technology: [] }); // Reset the error state
        setOpen(false); 
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

    const handleSowSubmittedDateChange = (newDate) => {
        setCurrentProject((prevSow) => ({
            ...prevSow,
            sowSubmittedDate: newDate ? newDate.toISOString() : "",
        }));
        if (newDate) {
            setErrors((prevErrors) => ({ ...prevErrors, sowSubmittedDate: "" }));
        }
    };

    const handleSowSignedDateChange = (newDate) => {
        setCurrentProject((prevSow) => ({
            ...prevSow,
            sowSignedDate: newDate ? newDate.toISOString() : "",
        }));
        if (newDate) {
            setErrors((prevErrors) => ({ ...prevErrors, sowSignedDate: "" }));
        }
    };

    const handleSowValidTillDateChange = (newDate) => {
        setCurrentProject((prevSow) => ({
            ...prevSow,
            sowValidTill: newDate ? newDate.toISOString() : "",
        }));
        if (newDate) {
            setErrors((prevErrors) => ({ ...prevErrors, sowValidTill: "" }));
        }
    };

    const handleSowLastExtendedDateChange = (newDate) => {
        setCurrentProject((prevSow) => ({
            ...prevSow,
            sowLastExtendedDate: newDate ? newDate.toISOString() : "",
        }));
        if (newDate) {
            setErrors((prevErrors) => ({ ...prevErrors, sowLastExtendedDate: "" }));
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
                <h3 style={{ marginBottom: '20px', fontSize: '25px' }}>Project Table List</h3>
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
                <Button variant="contained" sx={{ backgroundColor: '#00aae7' }} onClick={handleAdd}>Add Project</Button>
            </div>
            <TableContainer component={Paper} style={{ width: '100%' }}>
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
                                    active={orderBy === 'projectName'}
                                    direction={orderBy === 'projectName' ? order : 'asc'}
                                    onClick={() => handleSort('projectName')}
                                >
                                    <b>ProjectName</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'technicalProjectManager'}
                                    direction={orderBy === 'technicalProjectManager' ? order : 'asc'}
                                    onClick={() => handleSort('technicalProjectManager')}
                                >
                                    <b>TechnicalProjectManager</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'salesContact'}
                                    direction={orderBy === 'salesContact' ? order : 'asc'}
                                    onClick={() => handleSort('salesContact')}
                                >
                                    <b>SalesContact</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'pmo'}
                                    direction={orderBy === 'pmo' ? order : 'asc'}
                                    onClick={() => handleSort('pmo')}
                                >
                                    <b>PMO</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'sowSubmittedDate'}
                                    direction={orderBy === 'sowSubmittedDate' ? order : 'asc'}
                                    onClick={() => handleSort('sowSubmittedDate')}
                                >
                                    <b>SOWSubmittedDate</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'sowSigniedDate'}
                                    direction={orderBy === 'sowSigniedDate' ? order : 'asc'}
                                    onClick={() => handleSort('sowSigniedDate')}
                                >
                                    <b>SOWSigniedDate</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'sowValidTill'}
                                    direction={orderBy === 'sowValidTill' ? order : 'asc'}
                                    onClick={() => handleSort('sowValidTill')}
                                >
                                    <b>SOWValidTill</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'sowLastExtendedDate'}
                                    direction={orderBy === 'sowLastExtendedDate' ? order : 'asc'}
                                    onClick={() => handleSort('sowLastExtendedDate')}
                                >
                                    <b>SOWLastExtendedDate</b>
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
                        {filteredProjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((Project) => (
                            <TableRow key={Project.id}
                                sx={{ backgroundColor: Project.isActive ? 'inherit' : '#FFCCCB' }} >
                                {/* <TableCell>{Project.id}</TableCell> */}
                                <TableCell>{Project.client}</TableCell>
                                <TableCell>{Project.projectName}</TableCell>
                                <TableCell>{Project.technicalProjectManager}</TableCell>
                                <TableCell>{Project.salesContact}</TableCell>
                                <TableCell>{Project.pmo}</TableCell>
                                <TableCell>{Project.sowSubmittedDate}</TableCell>
                                <TableCell>{Project.sowSignedDate}</TableCell>
                                <TableCell>{Project.sowValidTill}</TableCell>
                                <TableCell>{Project.sowLastExtendedDate}</TableCell>
                                <TableCell>{Project.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{Project.createdBy}</TableCell>
                                <TableCell>{new Date(Project.createdDate).toLocaleString()}</TableCell>
                                <TableCell>{Project.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{new Date(Project.updatedDate).toLocaleString() || 'N/A'}</TableCell>
                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(Project)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(Project.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* <PaginationComponent
                    count={filteredProjects.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                /> */}
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredProjects.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentProject.id ? 'Update Project' : 'Add Project'}</DialogTitle>
                <DialogContent>
                    <InputLabel>Client</InputLabel>
                    <Select
                        margin="dense"
                        name="client"
                        value={currentProject.client}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.client}
                    >
                        {Clients.map((client) => (
                            <MenuItem key={client.id} value={client.name}>
                                {client.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.client && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.client}</Typography>}
                    <InputLabel>ProjectName</InputLabel>
                    <TextField
                        margin="dense"
                        name="projectName"
                        value={currentProject.projectName}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[A-Za-z\s]*$/.test(value))
                                handleChange(e);
                        }}
                        fullWidth
                        error={!!errors.projectName} 
                        helperText={errors.projectName}
                    />
                   <InputLabel id="demo-simple-select-label">Technology</InputLabel>
                    <Autocomplete
                        multiple
                        id="technologies-autocomplete"
                        options={Technologies.map((tech) => tech.name)} 
                        value={currentProject.technology}
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
                                error={!!errors.technology && formSubmitted}
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
                    <InputLabel>SalesContact</InputLabel>
                    <Select
                        margin="dense"
                        name="salesContact"
                        value={currentProject.salesContact}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.salesContact}
                    >
                        {Employees.map((salesContact) => (
                            <MenuItem key={salesContact.id} value={salesContact.name}>
                                {salesContact.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.salesContact && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.salesContact}</Typography>}
                    <InputLabel>TechnicalProjectManager</InputLabel>
                    <Select
                        margin="dense"
                        name="technicalProjectManager"
                        value={currentProject.technicalProjectManager}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.technicalProjectManager}
                    >
                        {Employees.map((technicalProjectManager) => (
                            <MenuItem key={technicalProjectManager.id} value={technicalProjectManager.name}>
                                {technicalProjectManager.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.technicalProjectManager && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.technicalProjectManager}</Typography>}
                    <InputLabel>PMO</InputLabel>
                    <Select
                        margin="dense"
                        name="pmo"
                        value={currentProject.pmo}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.pmo}
                    >
                        {Employees.map((pmo) => (
                            <MenuItem key={pmo.id} value={pmo.name}>
                                {pmo.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.pmo && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.pmo}</Typography>}
                    <InputLabel>SOWSubmittedDate</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker  
                        className='datetime'                        
                            value={currentProject.sowSubmittedDate ? dayjs(currentProject.sowSubmittedDate) : null}
                            onChange={handleSowSubmittedDateChange}
                            fullWidth
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense" />
                            )}
                            // slots={{ textField: (params) => <TextField {...params} fullWidth margin="dense" error={!!errors.sowSubmittedDate} /> }}
                        />
                    </LocalizationProvider>
                    {errors.sowSubmittedDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.sowSubmittedDate}</Typography>}
                    <InputLabel>SOWSignedDate</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                        className='datetime'
                            value={currentProject.sowSignedDate ? dayjs(currentProject.sowSignedDate) : null}
                            onChange={handleSowSignedDateChange}
                            fullWidth
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense" />
                            )}                            
                        />
                    </LocalizationProvider>
                    {errors.sowSignedDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.sowSignedDate}</Typography>}
                    <InputLabel>SOWValidTill</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                        className='datetime'
                            value={currentProject.sowValidTill ? dayjs(currentProject.sowValidTill) : null}
                            onChange={handleSowValidTillDateChange}
                            fullWidth
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense" />
                            )}
                        />
                    </LocalizationProvider>
                    {errors.sowValidTill && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.sowValidTill}</Typography>}
                    <InputLabel>SOWLastExtendedDate</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                       className='datetime'
                            value={currentProject.sowLastExtendedDate ? dayjs(currentProject.sowLastExtendedDate) : null}
                            onChange={handleSowLastExtendedDateChange}
                            fullWidth                            
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense" />
                            )}
                        />
                    </LocalizationProvider>
                    {errors.sowLastExtendedDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.sowLastExtendedDate}</Typography>}                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentProject.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this technology?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>No</Button>
                    <Button onClick={handleConfirmYes} color="error">Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ProjectList;
