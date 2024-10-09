import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Checkbox, ListItemText, Select, MenuItem, Table, InputLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PaginationComponent from '../Components/PaginationComponent'; // Import your PaginationComponent

function SOWRequirementList() {
    const [SOWRequirements, setSOWRequirements] = useState([]);
    const [SOWs, setSOWs] = useState([]);
    const [Designations, setDesignations] = useState([]);
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentSOWRequirement, setCurrentSOWRequirement] = useState({
        sow: '',
        designation: '',
        teamSize: '',
        technology: []
    });
    const [order, setOrder] = useState('asc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [errors, setErrors] = useState({
        sow: '',
        designation: '',
        teamSize: '',
        technology: []
    }
    );

    useEffect(() => {
        const fetchSowRequirements = async () => {
            try {
                const sowReqResponse = await axios.get('http://172.17.31.61:5041/api/sowRequirement');
                setSOWRequirements(sowReqResponse.data);
            } catch (error) {
                console.error('There was an error fetching the sow requirements!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchSow = async () => {
            try {
                const sowResponse = await axios.get('http://172.17.31.61:5041/api/sow');
                setSOWs(sowResponse.data);
            } catch (error) {
                console.error('There was an error fetching the sow!', error);
                setError(error);
            }
        };
        const fetchDesignations = async () => {
            try {
                const desigResponse = await axios.get('http://172.17.31.61:5201/api/designation');
                setDesignations(desigResponse.data);
            } catch (error) {
                console.error('There was an error fetching the sow!', error);
                setError(error);
            }
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

        fetchSowRequirements();
        fetchSow();
        fetchDesignations();
        fetchTechnologies();
    }, []);


    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedSOWRequirements = [...SOWRequirements].sort((a, b) => {
        const valueA = a[orderBy] || '';
        const valueB = b[orderBy] || '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return order === 'asc' ? (valueA > valueB ? 1 : -1) : (valueB > valueA ? 1 : -1);
        }
    });

    const filteredSOWRequirements = sortedSOWRequirements.filter((SOWRequirement) =>
        (SOWRequirement.sow && typeof SOWRequirement.sow === 'string' &&
            SOWRequirement.sow.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (SOWRequirement.designation && typeof SOWRequirement.designation === 'string' &&
            SOWRequirement.designation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (SOWRequirement.teamSize && typeof SOWRequirement.teamSize === 'string' &&
            SOWRequirement.teamSize.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAdd = () => {
        setCurrentSOWRequirement({
            sow: '',
            designation: '',
            teamSize: '',
            technology: []
        });
        setOpen(true);
    };

    const handleUpdate = (SOWRequirement) => {
        setCurrentSOWRequirement(SOWRequirement);
        setOpen(true);

    };

    const handleDelete = (id) => {
        //axios.delete(`http://localhost:5041/api/SOWRequirement/${id}`)
        // axios.delete(`http://172.17.31.61:5041/api/sowRequirement/${id}`)
        axios.patch(`http://172.17.31.61:5041/api/sowRequirement/${id}`)
            .then(response => {
                setSOWRequirements(SOWRequirements.filter(tech => tech.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the SOWRequirement!', error);
                setError(error);
            });
        setConfirmOpen(false);
    };

    const handleSave = async () => {
        let validationErrors = {};

        // Name field validation
        if (!currentSOWRequirement.sow.trim()) {
            validationErrors.sow = "Please select a sow";
        }
        if (!currentSOWRequirement.designation) {
            validationErrors.designation = "Please select a designation";
        }
        if (!currentSOWRequirement.technologies) {
            validationErrors.technologies = "Please select a technologies";
        }
        if (!currentSOWRequirement.teamSize) {
            validationErrors.teamSize = "Please select a teamSize";
        }

        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        const sowReqToSave = {
            ...currentSOWRequirement,
            technology: currentSOWRequirement.technology.map(tech => {
                const selectedTech = technologies.find(t => t.name === tech);
                return selectedTech ? selectedTech.id : null;
            }).filter(id => id !== null) // Convert technology names to IDs
        };

        if (currentSOWRequirement.id) {
            // Update existing SOWRequirement
            //axios.put(`http://localhost:5041/api/SOWRequirement/${currentSOWRequirement.id}`, currentSOWRequirement)
            // axios.put(`http://172.17.31.61:5041/api/sowRequirement/${currentSOWRequirement.id}`, currentSOWRequirement)           
            const response = await axios.put(`http://172.17.31.61:5041/api/sowRequirement/${currentSOWRequirement.id}`, sowReqToSave);
            setSOWRequirements(SOWRequirements.map(tech => tech.id === currentSOWRequirement.id ? response.data : tech));

        } else {
            // Add new SOWRequirement
            //axios.post('http://localhost:5041/api/SOWRequirement', currentSOWRequirement)
            const response = axios.post('http://172.17.31.61:5041/api/sowRequirement', sowReqToSave);
            setSOWRequirements([...SOWRequirements, response.data]);
        }
        setOpen(false);

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentSOWRequirement({ ...currentSOWRequirement, [name]: value });
        if (name === "sow") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, sow: "" }));
            }
        }
        if (name === "designation") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, designation: "" }));
            }
        }

        if (name === "technologies") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, technologies: "" }));
            }
        }
        if (name === "teamSize") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, teamSize: "" }));
            }
        }
    };

    const handleClose = () => {
        setCurrentSOWRequirement({ sow: '', designation: '', teamSize: '', technology: [] }); // Reset the department fields
        setErrors({ sow: '', designation: '', teamSize: '', technology: [] }); // Reset the error state
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

    const handleTechnologyChange = (event) => {
        const { value } = event.target;
        setCurrentSOWRequirement({
            ...currentSOWRequirement,
            technology: typeof value === 'string' ? value.split(',') : value  // Handle multiple selection
        });
    };
    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>There was an error loading the data: {error.message}</p>;
    }

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <h3>SOWRequirement Table List</h3>
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
                <Button variant="contained" color="primary" onClick={handleAdd}>Add SOWRequirement</Button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'sow'}
                                    direction={orderBy === 'sow' ? order : 'asc'}
                                    onClick={() => handleSort('sow')}
                                >
                                    <b>SOW</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'designation'}
                                    direction={orderBy === 'designation' ? order : 'asc'}
                                    onClick={() => handleSort('designation')}
                                >
                                    <b>Designation</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'teamSize'}
                                    direction={orderBy === 'teamSize' ? order : 'asc'}
                                    onClick={() => handleSort('teamSize')}
                                >
                                    <b>TeamSize</b>
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
                        {filteredSOWRequirements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((SOWRequirement) => (
                            <TableRow key={SOWRequirement.id}
                                sx={{ backgroundColor: SOWRequirement.isActive ? 'inherit' : '#FFCCCB' }} >
                                {/* <TableCell>{SOWRequirement.id}</TableCell> */}
                                <TableCell>{SOWRequirement.sow}</TableCell>
                                <TableCell>{SOWRequirement.designation}</TableCell>
                                <TableCell>{SOWRequirement.teamSize}</TableCell>
                                <TableCell>{SOWRequirement.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{SOWRequirement.createdBy}</TableCell>
                                <TableCell>{new Date(SOWRequirement.createdDate).toLocaleString()}</TableCell>
                                <TableCell>{SOWRequirement.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{new Date(SOWRequirement.updatedDate).toLocaleString() || 'N/A'}</TableCell>
                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(SOWRequirement)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(SOWRequirement.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <PaginationComponent
                    count={filteredSOWRequirements.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentSOWRequirement.id ? 'Update SOWRequirement' : 'Add SOWRequirement'}</DialogTitle>
                <DialogContent>
                    <InputLabel>SOW</InputLabel>
                    <Select
                        margin="dense"
                        name="sow"
                        value={currentSOWRequirement.sow}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.sow}
                    >
                        {SOWs.map((sow) => (
                            <MenuItem key={sow.id} value={sow.title}>
                                {sow.title}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.sow && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.sow}</Typography>}
                    <InputLabel>Designation</InputLabel>
                    <Select
                        margin="dense"
                        name="designation"
                        value={currentSOWRequirement.designation}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.designation}
                    >
                        {Designations.map((designation) => (
                            <MenuItem key={designation.id} value={designation.name}>
                                {designation.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.designation && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.designation}</Typography>}
                    <InputLabel id="demo-simple-select-label">Technology</InputLabel>
                    <Select
                        label="Technologies"
                        //  placeholder="Technologies"
                        name="technologies"
                        multiple
                        value={currentSOWRequirement.technology || []}
                        onChange={handleTechnologyChange}
                        renderValue={(selected) => selected.join(', ')}
                        fullWidth
                    >
                        {technologies.map((tech) => (
                            <MenuItem key={tech.id} value={tech.name}>
                                <Checkbox checked={Array.isArray(currentSOWRequirement.technology) && currentSOWRequirement.technology.indexOf(tech.name) > -1} />
                                <ListItemText primary={tech.name} />
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                        margin="dense"
                        label="TeamSize"
                        name="teamSize"
                        value={currentSOWRequirement.teamSize}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.teamSize} // Display error if exists
                        helperText={errors.teamSize}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentSOWRequirement.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this SowRequirementList?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>No</Button>
                    <Button onClick={handleConfirmYes} color="error">Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default SOWRequirementList;
