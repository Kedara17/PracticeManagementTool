import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, MenuItem, Table, InputLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PaginationComponent from '../Components/PaginationComponent'; // Import your PaginationComponent

function ProjectTechnologyList() {
    const [ProjectTechnologys, setProjectTechnologys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentProjectTechnology, setCurrentProjectTechnology] = useState({
        id: '',
        project: '',
        technology: '',
        isActive: true,
        createdBy: '',
        createdDate: '',
        updatedBy: '',
        updatedDate: ''
    });
    const [order, setOrder] = useState('asc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    useEffect(() => {
        //axios.get('http://localhost:5151/api/ProjectTechnology')
        axios.get('http://172.17.31.61:5151/api/projectTechnology')
            .then(response => {
                setProjectTechnologys(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the ProjectTechnologys!', error);
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedProjectTechnologies = [...ProjectTechnologys].sort((a, b) => {
        const valueA = a[orderBy] || '';
        const valueB = b[orderBy] || '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return order === 'asc' ? (valueA > valueB ? 1 : -1) : (valueB > valueA ? 1 : -1);
        }
    });

    const filteredProjectTechnologies = sortedProjectTechnologies.filter((ProjectTechnology) =>
        ProjectTechnology.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ProjectTechnology.technology.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAdd = () => {
        setCurrentProjectTechnology({
            id: '',
            project: '',
            technology: '',
            isActive: true,
            createdBy: '',
            createdDate: '',
            updatedBy: '',
            updatedDate: ''
        });
        setOpen(true);
    };

    const handleUpdate = (ProjectTechnology) => {
        setCurrentProjectTechnology(ProjectTechnology);
        setOpen(true);

    };

    const handleDelete = (id) => {
        //axios.delete(`http://localhost:5151/api/ProjectTechnology/${id}`)
        // axios.delete(`http://172.17.31.61:5151/api/projectTechnology/${id}`)
        axios.patch(`http://172.17.31.61:5151/api/projectTechnology/${id}`)
            .then(response => {
                setProjectTechnologys(ProjectTechnologys.filter(tech => tech.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the ProjectTechnology!', error);
                setError(error);
            });
    };

    const handleSave = () => {
        if (currentProjectTechnology.id) {
            // Update existing ProjectTechnology
            //axios.put(`http://localhost:5151/api/ProjectTechnology/${currentProjectTechnology.id}`, currentProjectTechnology)
            axios.put(`http://172.17.31.61:5151/api/projectTechnology/${currentProjectTechnology.id}`, currentProjectTechnology)
                .then(response => {
                    console.log(response)
                    //setProjectTechnologys([...ProjectTechnologys, response.data]);
                    // setProjectTechnologys(response.data);
                    setProjectTechnologys(ProjectTechnologys.map(tech => tech.id === currentProjectTechnology.id ? response.data : tech));
                })
                .catch(error => {
                    console.error('There was an error updating the ProjectTechnology!', error);
                    setError(error);
                });

        } else {
            // Add new ProjectTechnology
            //axios.post('http://localhost:5151/api/ProjectTechnology', currentProjectTechnology)
            axios.post('http://172.17.31.61:5151/api/projectTechnology', currentProjectTechnology)
                .then(response => {
                    setProjectTechnologys([...ProjectTechnologys, response.data]);
                })
                .catch(error => {
                    console.error('There was an error adding the ProjectTechnology!', error);
                    setError(error);
                });
        }
        setOpen(false);

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentProjectTechnology({ ...currentProjectTechnology, [name]: value });
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
        <div>
            <div style={{ display: 'flex' }}>
                <h3>ProjectTechnology Table List</h3>
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
                <Button variant="contained" color="primary" onClick={handleAdd}>Add ProjectTechnology</Button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* <TableCell>Id</TableCell> */}
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'project'}
                                    direction={orderBy === 'project' ? order : 'asc'}
                                    onClick={() => handleSort('project')}
                                >
                                    Project
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'technology'}
                                    direction={orderBy === 'technology' ? order : 'asc'}
                                    onClick={() => handleSort('technology')}
                                >
                                    Technology
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'isActive'}
                                    direction={orderBy === 'isActive' ? order : 'asc'}
                                    onClick={() => handleSort('isActive')}
                                >
                                    Is Active
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'createdBy'}
                                    direction={orderBy === 'createdBy' ? order : 'asc'}
                                    onClick={() => handleSort('createdBy')}
                                >
                                    Created By
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'createdDate'}
                                    direction={orderBy === 'createdDate' ? order : 'asc'}
                                    onClick={() => handleSort('createdDate')}
                                >
                                    Created Date
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'updatedBy'}
                                    direction={orderBy === 'updatedBy' ? order : 'asc'}
                                    onClick={() => handleSort('updatedBy')}
                                >
                                    Updated By
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'updatedDate'}
                                    direction={orderBy === 'updatedDate' ? order : 'asc'}
                                    onClick={() => handleSort('updatedDate')}
                                >
                                    Updated Date
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProjectTechnologies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ProjectTechnology) => (
                            <TableRow key={ProjectTechnology.id}>
                                {/* <TableCell>{ProjectTechnology.id}</TableCell> */}
                                <TableCell>{ProjectTechnology.project}</TableCell>
                                <TableCell>{ProjectTechnology.technology}</TableCell>
                                <TableCell>{ProjectTechnology.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{ProjectTechnology.createdBy}</TableCell>
                                <TableCell>{new Date(ProjectTechnology.createdDate).toLocaleString()}</TableCell>
                                <TableCell>{ProjectTechnology.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{ProjectTechnology.updatedDate ? new Date(ProjectTechnology.updatedDate).toLocaleString() : 'N/A'}</TableCell>
                                <TableCell >
                                    <IconButton onClick={() => handleUpdate(ProjectTechnology)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(ProjectTechnology.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <PaginationComponent
                    count={filteredProjectTechnologies.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentProjectTechnology.id ? 'Update ProjectTechnology' : 'Add ProjectTechnology'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Project"
                        name="project"
                        value={currentProjectTechnology.project}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Technology"
                        name="technology"
                        value={currentProjectTechnology.technology}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Is Active"
                        name="isActive"
                        value={currentProjectTechnology.isActive}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Created By"
                        name="createdBy"
                        value={currentProjectTechnology.createdBy}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Created Date"
                        name="createdDate"
                        value={currentProjectTechnology.createdDate}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Updated By"
                        name="updatedBy"
                        value={currentProjectTechnology.updatedBy}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Updated Date"
                        name="updatedDate"
                        value={currentProjectTechnology.updatedDate}
                        onChange={handleChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentProjectTechnology.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this ProjectTechnology?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>No</Button>
                    <Button onClick={handleConfirmYes} color="error">Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ProjectTechnologyList;
