import React, { useState } from 'react';
import { Avatar,Grid,Box,Button,TextField,Typography,Snackbar,IconButton, AppBar,Toolbar,CssBaseline,Alert} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

function Profile() {

    const navigate = useNavigate();

    const storedData = JSON.parse(localStorage.getItem('userData'));
    const initialData = storedData || {
      name: '',
      role: '',
      email: '',
      photo: '/profile.avif', // default photo if none is set
    };
      
    const [name, setName] = useState(initialData.name);
    const [role, setRole] = useState(initialData.role);
    const [email, setEmail] = useState(initialData.email);
    const [photo, setPhoto] = useState(initialData.photo);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [nameError, setNameError] = useState('');
    const [roleError, setRoleError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [nameCharError, setNameCharError] = useState('');
    const [roleCharError, setRoleCharError] = useState('');
    const [emailCharError, setEmailCharError] = useState('');

    const handleSave = () => {
        let hasError = false;

        setNameError('');
        setRoleError('');
        setEmailError('');
        setNameCharError('');
        setRoleCharError('');
        setEmailCharError('');

        if (!name) {
            setNameError('Name is required');
            hasError = true;
        }
        if (!role) {
            setRoleError('Role is required');
            hasError = true;
        }
        if (!email) {
            setEmailError('Email is required');
            hasError = true;
        }

        if (hasError) return;

        const updatedData = { name, role, email, photo };
        localStorage.setItem('userData', JSON.stringify(updatedData));
        setOpenSnackbar(true);
    };
    
    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };
    
    const handleBack = () => {
        navigate('/home');
    };
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/avif')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPhoto(reader.result);
          };
          reader.readAsDataURL(file);
        } else {
          alert('Please select a PNG, JPEG, or AVIF image.');
        }
    };

    const handleNameChange = (e) => {
      const value = e.target.value;
      if (value.length <= 30) {
          setName(value);
          setNameCharError('');
      } else {
          setNameCharError('You cannot enter more than 30 characters');
      }
    };

    const handleRoleChange = (e) => {
        const value = e.target.value;
        if (value.length <= 30) {
            setRole(value);
            setRoleCharError('');
        } else {
            setRoleCharError('You cannot enter more than 30 characters');
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        if (value.length <= 30) {
            setEmail(value);
            setEmailCharError('');
        } else {
            setEmailCharError('You cannot enter more than 30 characters');
        }
    };
      
  return (
    // <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
    //   <CssBaseline />

    //   {/* AppBar */}
    //   <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor:' #232527' }}>
    //     <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    //         <img src='/miraclelogo.png' alt="Miracle Logo" style={{ width: '160px', marginLeft: '16px' }} />  
    //         <Button sx={{backgroundColor:'#00aae7', color:'white'}} onClick={handleBack}>
    //             Back
    //         </Button>
    //     </Toolbar>
    //   </AppBar>

    //   <Box sx={{ mt: 10 }}> 
    //     <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
    //       <Avatar src={photo} sx={{ width: 100, height: 100, mb: 2 }}>
    //         {name[0] || 'U'}
    //       </Avatar>
    //       <input
    //         accept="image/png, image/jpeg"
    //         style={{ display: 'none' }}
    //         id="icon-button-file"
    //         type="file"
    //         onChange={handleFileChange}
    //       />
    //       <label htmlFor="icon-button-file">
    //         <IconButton component="span" sx={{ position: 'absolute', top: 150, right: 590 }}>
    //           <EditIcon />
    //         </IconButton>
    //       </label>
    //       <Typography sx={{ fontFamily: 'Montserrat', fontSize: '22px' }}>{name}</Typography>
    //     </Box>

    //     <Box sx={{ mt: 5, width: 600, display: 'flex', justifyContent: 'space-between' }}>
    //       <TextField
    //         label="Name"
    //         value={name}
    //         onChange={handleNameChange}
    //         error={!!nameError || !!nameCharError}
    //         helperText={nameError || nameCharError}
    //         sx={{ width: '48%' }}
    //       />
    //       <TextField
    //         label="Role"
    //         value={role}
    //         onChange={handleRoleChange}
    //         error={!!roleError || !!roleCharError}
    //         helperText={roleError || roleCharError}
    //         sx={{ width: '48%' }}
    //       />
    //     </Box>

    //     <Box sx={{display: 'flex', flexDirection: 'column', alignItems:'center'}}>
    //         <TextField
    //             label="Email"
    //             value={email}
    //             onChange={handleEmailChange}
    //             error={!!emailError || !!emailCharError}
    //             helperText={emailError || emailCharError}
    //             fullWidth
    //             sx={{ mt: 4, width: 400 }}
    //         />
    //         <Button variant="contained" onClick={handleSave} sx={{ mt: 4, bgcolor: '#00aae7' }}>
    //             SAVE
    //         </Button>
    //     </Box>

    //     <Snackbar 
    //         open={openSnackbar} 
    //         autoHideDuration={3000} 
    //         onClose={handleSnackbarClose}
    //         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    //     >
    //       <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
    //         Data updated successfully
    //       </Alert>
    //     </Snackbar>
    //   </Box>
    // </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', minHeight: '100vh' }}>
            <CssBaseline />

            {/* AppBar */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#232527' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <img src='/miraclelogo.png' alt="Miracle Logo" style={{ width: '160px', marginLeft: '16px' }} />
                    <Button sx={{ backgroundColor: '#00aae7', color: 'white' }} onClick={handleBack}>
                        Back
                    </Button>
                </Toolbar>
            </AppBar>

            <Box sx={{ mt: 8, width: '100%', maxWidth: '600px', px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', mb: 2 }}>
                    <label htmlFor="icon-button-file" style={{ cursor: 'pointer' }}>
                        <Avatar src={photo} sx={{ width: 140, height: 140, mb: 2 }}>
                            {name[0] || 'U'}
                        </Avatar>
                    </label>
                    <input
                        accept="image/png, image/jpeg, image/avif"
                        style={{ display: 'none' }}
                        id="icon-button-file"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <Typography sx={{ fontFamily: 'Montserrat', fontSize: { xs: '20px', sm: '30px' } }}>{name}</Typography>
                </Box>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Name"
                            value={name}
                            onChange={handleNameChange}
                            error={!!nameError || !!nameCharError}
                            helperText={nameError || nameCharError}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Role"
                            value={role}
                            onChange={handleRoleChange}
                            error={!!roleError || !!roleCharError}
                            helperText={roleError || roleCharError}
                            fullWidth
                        />
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <TextField
                        label="Email"
                        value={email}
                        onChange={handleEmailChange}
                        error={!!emailError || !!emailCharError}
                        helperText={emailError || emailCharError}
                        fullWidth
                        sx={{ mt: 4 }}
                    />
                    <Button variant="contained" onClick={handleSave} sx={{ mt: 4, bgcolor: '#00aae7' }}>
                        SAVE
                    </Button>
                </Box>

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                        Data updated successfully
                    </Alert>
                </Snackbar>
            </Box>
        </div>
  )
}

export default Profile
