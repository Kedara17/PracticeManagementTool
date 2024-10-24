import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, MenuItem, TablePagination, Table, InputLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TableSortLabel, InputAdornment, Switch } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import SearchIcon from '@mui/icons-material/Search';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import '../App.css';

function BlogsList({ isDrawerOpen }) {
    const [blogs, setBlogs] = useState([]);
    const [Employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTechId, setDeleteTechId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [undoConfirmOpen, setUndoConfirmOpen] = useState(false);
    const [unauthorizedOpen, setUnauthorizedOpen] = useState(false); // State for unauthorized access dialog
    const [selectedBlog, setSelectedBlog] = useState(null); // To store the blog being undone
    const [isAdmin, setIsAdmin] = useState(true); // Assume isAdmin is determined by login/auth
    const [currentBlogs, setCurrentBlogs] = useState({
        title: '',
        author: '',
        status: '',
        targetDate: '',
        completedDate: '',
        publishedDate: '',
        isActive: false // New field to track isActive status
    });

    const [order, setOrder] = useState('desc'); // Order of sorting: 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const options = ['Completed', 'InProgress', 'InReview', 'Published'];
    const [errors, setErrors] = useState({
        title: '',
        author: '',
        status: '',
        targetDate: '',
        completedDate: '',
        publishedDate: ''
    }
    );

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const blogResponse = await axios.get('http://172.17.31.61:5174/api/blogs');
                setBlogs(blogResponse.data);
            } catch (error) {
                console.error('There was an error fetching the Blogs!', error);
                setError(error);
            }
            setLoading(false);
        };

        const fetchAuthor = async () => {
            try {
                const authorResponse = await axios.get('http://172.17.31.61:5033/api/employee');
                setEmployees(authorResponse.data);
            } catch (error) {
                console.error('There was an error fetching the speakers!', error);
                setError(error);
            }
        };

        fetchBlogs();
        fetchAuthor();
    }, []);

    const handleSort = (property) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const handleUndoClick = (blog) => {
        const userRole = localStorage.getItem('userRole'); // Get the role from localStorage

        if (userRole !== 'Admin') {
            setUnauthorizedOpen(true); // Show unauthorized dialog for non-admins
            return;
        }

        setSelectedBlog(blog); // For admins, store the blog
        setUndoConfirmOpen(true); // Open the confirmation dialog for admins
    };

    const handleUndoConfirm = async () => {
        if (!isAdmin) {
            alert('You cannot access to activate the record.'); // Simple alert for non-admins
            setUndoConfirmOpen(false); // Close the undo dialog
            return;
        }

        if (selectedBlog) {
            await handleToggleActive(selectedBlog); // Toggle the active state if admin
        }
        setUndoConfirmOpen(false); // Close the dialog
        setSelectedBlog(null); // Clear the selected blog
    };

    const handleToggleActive = async (blog) => {
        try {
            const updatedBlog = { ...blog, isActive: !blog.isActive };
            await axios.put(`http://172.17.31.61:5174/api/blogs/${blog.id}`, updatedBlog);
            setBlogs(blogs.map((b) => (b.id === blog.id ? updatedBlog : b)));
        } catch (error) {
            console.error('There was an error updating the active status!', error);
        }
    };

    const sortedBlogs = [...blogs].sort((a, b) => {
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

    const filteredBlogs = sortedBlogs.filter((blog) =>
        (blog.title && typeof blog.title === 'string' &&
            blog.title.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (blog.author && typeof blog.author === 'string' &&
            blog.author.toLowerCase().includes(searchQuery.toLowerCase())) ||

        (blog.status && typeof blog.status === 'string' &&
            blog.status.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAdd = () => {
        setCurrentBlogs({
            title: '',
            author: '',
            status: '',
            targetDate: '',
            completedDate: '',
            publishedDate: ''
        });
        setOpen(true);
    };

    const handleUpdate = (Blogs) => {
        setCurrentBlogs(Blogs);
        setOpen(true);

    };

    const handleDelete = (id) => {
        axios.patch(`http://172.17.31.61:5174/api/blogs/${id}`)
            .then(response => {
                setBlogs(blogs.map((blog) =>
                    blog.id === id ? { ...blog, isActive: false } : blog
                ));
            })
            .catch(error => {
                console.error('There was an error deleting the blog!', error);
                setError(error);
            });
        setConfirmOpen(false); // Close the confirmation dialog
    };


    const handleSave = () => {
        let validationErrors = {};

        // Title field validation
        if (!currentBlogs.title.trim()) {
            validationErrors.title = "Title is required";

        }else if(currentBlogs.title.length < 3) {
            validationErrors.title = "Title must be atleast 3 characters";
        }
        if (!currentBlogs.author) {
            validationErrors.author = "Author is required";
        }
        if (!currentBlogs.status) {
            validationErrors.status = "Status is required";
        }
        if (!currentBlogs.targetDate) {
            validationErrors.targetDate = "TargetDate is required";
        }
        if (!currentBlogs.completedDate) {
            validationErrors.completedDate = "CompletedDate is required";
        }
        if (!currentBlogs.publishedDate) {
            validationErrors.publishedDate = "PublishedDate is required";
        }

        // If there are validation errors, update the state and prevent save
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors if validation passes
        setErrors({});

        const { blogDate } = currentBlogs;

        // Check if the webinarDate field is empty
        if (!blogDate) {
            setErrors((prevErrors) => ({ ...prevErrors, blogDate: "Please fill the datetime field" }));
        } else {
            // Proceed with saving the details (you can add more logic here)
            console.log("Webinar Date:", blogDate);
        }

        if (currentBlogs.id) {
            axios.put(`http://172.17.31.61:5174/api/blogs/${currentBlogs.id}`, currentBlogs)
                .then(response => {
                    setBlogs(blogs.map(tech => tech.id === currentBlogs.id ? response.data : tech));
                })
                .catch(error => {
                    console.error('There was an error updating the Blogs!', error);
                    setError(error);
                });

        } else {
            axios.post('http://172.17.31.61:5174/api/blogs', currentBlogs)
                .then(response => {
                    setBlogs([...blogs, response.data]);
                })
                .catch(error => {
                    console.error('There was an error adding the Blogs!', error);
                    setError(error);
                });
        }
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentBlogs({ ...currentBlogs, [name]: value });

        if (name === "title") {
            // Check if the title is empty or only whitespace
            if (!value.trim()) {
                setErrors((prevErrors) => ({ ...prevErrors, title: "" }));
            } else if (value.length < 3) {
                setErrors((prevErrors) => ({ ...prevErrors, title: "" }))
            }
            // Check for uniqueness
            else if (blogs.some(web => web.title.toLowerCase() === value.toLowerCase() && web.id !== currentBlogs.id)) {
                setErrors((prevErrors) => ({ ...prevErrors, title: "" }));
            } else if (value.length === 200) {
                setErrors((prevErrors) => ({ ...prevErrors, title: "More than 200 characters are not allowed" }));
            }
            // Clear the title error if valid
            else {
                setErrors((prevErrors) => ({ ...prevErrors, title: "" }));
            }
        }
        if (name === "author") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, author: "" }));
            }
        }
        if (name === "status") {
            if (value.length === 50) {
                setErrors((prevErrors) => ({ ...prevErrors, status: "More than 50 characters are not allowed" }));
            }
            // Clear the title error if valid
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
        if (name === "publishedDate") {
            if (value) {
                setErrors((prevErrors) => ({ ...prevErrors, publishedDate: "" }));
            }
        }
    };

    const handleClose = () => {
        setCurrentBlogs({ title: '', author: '', status: '', targetDate: '', completedDate: '', publishedDate: '' }); // Reset the department fields
        setErrors({ title: '', author: '', status: '', targetDate: '', completedDate: '', publishedDate: '' }); // Reset the error state
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
        setCurrentBlogs((prevBlogs) => ({
            ...prevBlogs,
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
        setCurrentBlogs((prevBlogs) => ({
            ...prevBlogs,
            completedDate: newDate ? newDate.toISOString() : "",
        }));
        if (newDate) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                completedDate: "",
            }));
        }
    };

    const handlePublishedDateChange = (newDate) => {
        setCurrentBlogs((prevBlogs) => ({
            ...prevBlogs,
            publishedDate: newDate ? newDate.toISOString() : "",
        }));
        if (newDate) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                publishedDate: "",
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
                <h3 style={{ marginBottom: '20px', fontSize: '25px' }}>Blogs Table List</h3>
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
                <Button variant="contained" sx={{ backgroundColor: '#00aae7' }} onClick={handleAdd}>Add Blogs</Button>
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
                                    <b>Title</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'author'}
                                    direction={orderBy === 'author' ? order : 'desc'}
                                    onClick={() => handleSort('author')}
                                >
                                    <b>Author</b>
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
                                    active={orderBy === 'targetDate'}
                                    direction={orderBy === 'targetDate' ? order : 'desc'}
                                    onClick={() => handleSort('targetDate')}
                                >
                                    <b>TargetDate</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'completedDate'}
                                    direction={orderBy === 'completedDate' ? order : 'desc'}
                                    onClick={() => handleSort('completedDate')}
                                >
                                    <b>CompletedDate</b>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'publishedDate'}
                                    direction={orderBy === 'publishedDate' ? order : 'desc'}
                                    onClick={() => handleSort('publishedDate')}
                                >
                                    <b>PublishedDate</b>
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
                        {filteredBlogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((Blogs) => (
                            <TableRow key={Blogs.id}
                                sx={{ backgroundColor: Blogs.isActive ? 'inherit' : '#FFCCCB' }} >
                                <TableCell>{Blogs.title}</TableCell>
                                <TableCell>{Blogs.author}</TableCell>
                                <TableCell>{Blogs.status}</TableCell>
                                <TableCell>{Blogs.targetDate}</TableCell>
                                <TableCell>{Blogs.completedDate}</TableCell>
                                <TableCell>{Blogs.publishedDate}</TableCell>
                                {/* <TableCell>{Blogs.isActive ? 'Active' : 'Inactive'}</TableCell> */}
                                <TableCell>
                                    {isAdmin && (
                                        <Switch
                                            checked={Blogs.isActive}
                                            onChange={() => handleToggleActive(Blogs)}
                                            color="primary"
                                        />
                                    )}
                                </TableCell>
                                <TableCell>{Blogs.createdBy}</TableCell>
                                <TableCell>{Blogs.createdDate}</TableCell>
                                <TableCell>{Blogs.updatedBy || 'N/A'}</TableCell>
                                <TableCell>{Blogs.updatedDate || 'N/A'}</TableCell>
                                <TableCell>
                                    {Blogs.isActive ? (
                                        <>
                                            <IconButton onClick={() => handleUpdate(Blogs)}>
                                                <EditIcon color="primary" />
                                            </IconButton>
                                            <IconButton onClick={() => confirmDelete(Blogs.id)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <IconButton onClick={() => handleUndoClick(Blogs)}>
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
                count={filteredBlogs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentBlogs.id ? 'Update Blogs' : 'Add Blogs'}</DialogTitle>
                <DialogContent>
                    <InputLabel>Title</InputLabel>
                    <TextField
                        margin="dense"
                        name="title"
                        value={currentBlogs.title}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[A-Za-z\s]*$/.test(value))
                                handleChange(e);
                        }}
                        fullWidth
                        error={!!errors.title}
                        helperText={errors.title}
                        inputProps={{ maxLength: 200 }}
                    />
                    <InputLabel>Author</InputLabel>
                    <Select
                        margin="dense"
                        name="author"
                        value={currentBlogs.employee}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.author}
                    >
                        {Employees.map((employee) => (
                            <MenuItem key={employee.id} value={employee.name}>
                                {employee.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.author && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.author}</Typography>}
                    <InputLabel>Status</InputLabel>
                    <Select
                        margin="dense"
                        name="status"
                        value={currentBlogs.status}
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
                            className='datetime'
                            value={currentBlogs.targetDate ? dayjs(currentBlogs.targetDate) : null}
                            onChange={handleTargetDateChange}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense"
                                    error={!!errors.targetDate} />
                            )}
                        />
                    </LocalizationProvider>
                    {errors.targetDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.targetDate}</Typography>}
                    <InputLabel>CompletedDate</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            className='datetime'
                            value={currentBlogs.completedDate ? dayjs(currentBlogs.completedDate) : null}
                            onChange={handleCompletedDateChange}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense"
                                    error={!!errors.completedDate} />
                            )}
                        />
                    </LocalizationProvider>
                    {errors.completedDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.completedDate}</Typography>}
                    <InputLabel>PublishedDate</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            className='datetime'
                            value={currentBlogs.publishedDate ? dayjs(currentBlogs.publishedDate) : null}
                            onChange={handlePublishedDateChange}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense"
                                    error={!!errors.publishedDate} />
                            )}
                        />
                    </LocalizationProvider>
                    {errors.publishedDate && <Typography fontSize={12} margin="3px 14px 0px" color="error">{errors.publishedDate}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {currentBlogs.id ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this blog?</Typography>
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

export default BlogsList;
