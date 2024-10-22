import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation  } from 'react-router-dom';
import { AppBar,Divider, Toolbar, IconButton, Typography, Drawer, Box, List, ListItem, ListItemText, Avatar, Menu, MenuItem, CssBaseline, Collapse } from '@mui/material';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import BadgeIcon from '@mui/icons-material/Badge';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import EventNoteIcon from '@mui/icons-material/EventNote';
import GradeIcon from '@mui/icons-material/Grade';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import SliderComponent from './SliderComponent';
import EmployeeList from '../EmployeeServices/EmployeeList';
import DepartmentList from '../DepartmentServices/DepartmentList';
import DesignationList from '../DesignationService/DesignationList';
import TechnologyList from '../TechnologyServices/TechnologyList';
import BlogsList from '../BlogsServices/BlogsList';
import ClientList from '../ClientServices/ClientList';
import ClientContactList from '../ClientServices/ClientContactList';
import ContactTypeList from '../ClientServices/ContactTypeList';
import ProjectList from '../ProjectServices/ProjectList';
import ProjectEmployeeList from '../ProjectServices/ProjectEmployeeList';
import InterviewList from '../InterviewServices/InterviewList';
import InterviewStatusList from '../InterviewServices/InterviewStatusList';
import WebinarList from '../WebinarServices/WebinarList';
import SOWList from '../SOWServices/SOWList';
import SOWProposedTeamList from '../SOWServices/SOWProposedTeamList';
import SOWRequirementList from '../SOWServices/SOWRequirementList';
import SOWStatusList from '../SOWServices/SOWStatusList';
import POCList from '../POCServices/POCList';
import CustomBreadcrumbs from './CustomBreadCrumbs';
import CertificationsList from '../CertificationsServices/CertificationsList';


function Home() {

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const [view, setView] = useState('slider'); // Default view
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [currentSubMenu, setCurrentSubMenu] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // Anchor for menu
  const [role, setRole] = useState('User'); 
  const [username, setUsername] = useState('')

  const [openClientMenu, setOpenClientMenu] = useState(false);
  const [openLeadEnquiryMenu, setOpenLeadEnquiryMenu] = useState(false);
  const [openProjectMenu, setOpenProjectMenu] = useState(false);
  const [openSowMenu, setOpenSowMenu] = useState(false);
  const [openInterviewMenu, setOpenInterviewMenu] = useState(false);
  const [openTrainingsMenu, setOpenTrainingsMenu] = useState(false);

  const handleClientMenu = () => {
      setOpenClientMenu((prev) => !prev);
  };
  const handleLeadEnquiryMenu = () => {
    setOpenLeadEnquiryMenu((prev) => !prev);
  };
  const handleProjectMenu = () => {
    setOpenProjectMenu((prev) => !prev);
  };
  const handleSowMenu = () => {
    setOpenSowMenu((prev) => !prev);
  };
  const handleInterviewMenu = () => {
    setOpenInterviewMenu((prev) => !prev);
  };
  const handleTrainingsMenu = () => {
    setOpenTrainingsMenu((prev) => !prev);
  };

  const location = useLocation();
  const currentPath = location.pathname;

    
  const getBreadcrumbs = () => {
      const pathnames = location.pathname.split('/').filter((x) => x);
      return pathnames.map((path, index) => ({
          label: path.charAt(0).toUpperCase() + path.slice(1).replace(/([A-Z])/g, ' $1'), // Capitalize and space camel case
          link: '/' + pathnames.slice(0, index + 1).join('/'), // Create link for breadcrumb
      }));
  };

  useEffect(() => {
    // Retrieve the email from localStorage
    const userEmail = localStorage.getItem('userEmail'); 
    const userRole = localStorage.getItem('userRole');
    
    // Check if userEmail is valid
    if (userEmail) {
      const emailParts = userEmail.split('@');
      setUsername(emailParts[0]); 
    }
    
    // Check if userRole is valid
    if (userRole) {
      setRole(userRole);
    }
  }, []);

  const [userData, setUserData] = useState({
    photo: '/profile.avif',
  });

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData)); 
    }
  }, []);

  
  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };  

   // Handle menu open/close
   const handleClick = (event, menu) => {
    setAnchorEl({ [menu]: event.currentTarget });
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle profile menu open and close
  const handleProfileMenuClick = (event) => setProfileMenuAnchorEl(event.currentTarget);
  
  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null); 
    navigate('/profile'); 
  };

  // Handle sub-menu open and close
  const handleSubMenuOpen = (event, menu) => {
    setSubMenuAnchorEl(event.currentTarget);
    setCurrentSubMenu(menu);
  };
  const handleSubMenuClose = () => setSubMenuAnchorEl(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Assume the role is stored in localStorage after login
    const userRole = localStorage.getItem('userRole');
    setRole(userRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('oauth2');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const renderEmployeeForm = () => (
    <>
      <ListItem 
        button 
        component={Link} to="employees"
        onClick={(event) => handleClick(event, 'employee')}
      >
        <ListItemText primary="Employees" className="drawer-text" />
        <SupervisorAccountIcon />
      </ListItem>
    </>
  )

  const renderAdminForms = () => (
    <>
      <ListItem 
        button 
        component={Link} to="department"
        onClick={(event) => handleClick(event, 'department')}
      >
        <ListItemText primary="Department" className="drawer-text" />
        <CorporateFareIcon />
      </ListItem>

      <ListItem 
        button 
        component={Link} to="designation"
        onClick={(event) => handleClick(event, 'designation')}
      >
        <ListItemText primary="Designation" />
        <BadgeIcon />
      </ListItem>
              
      <ListItem 
        button 
        component={Link} to="technology"
        onClick={(event) => handleClick(event, 'technology')}
      >
        <ListItemText primary="Technology" />
        <ImportantDevicesIcon />
      </ListItem>          
      {renderOtherRoleForms()}
    </>
  );

  const renderOtherRoleForms = () => (
    <>
      {renderEmployeeForm()}

      {/* <ListItem 
        button 
        component={Link} to="client"
        onClick={(event) => handleClick(event, 'client')}
      >
        <ListItemText primary="Client" />
        <AddBusinessIcon />
      </ListItem>
      <Menu
        anchorEl={anchorEl?.client}
        open={Boolean(anchorEl?.client)}
        onClick={handleClose}
        onClose={handleClose}
        sx={{ mt: 2 }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem component={Link} to="client/clientcontactlist">Client Contact</MenuItem>
        <MenuItem component={Link} to="client/clientcontacttypelist">Client Contact Type</MenuItem>
      </Menu> */}
        <ListItem button onClick={handleClientMenu}>
            <ListItemText primary="Client" />
            <AddBusinessIcon />
        </ListItem>
        <Collapse in={openClientMenu} timeout="auto" unmountOnExit sx={{backgroundColor:'#2C3539'}}>
              <List component="div" disablePadding>
                  <ListItem button component={Link} to="client" onClick={handleClose}>
                      <ListItemText primary="Client List" />
                  </ListItem>
                  <ListItem button component={Link} to="client/clientcontactlist" onClick={handleClose}>
                      <ListItemText primary="Client Contact" />
                  </ListItem>
                  <ListItem button component={Link} to="client/clientcontacttypelist" onClick={handleClose}>
                      <ListItemText primary="Client Contact Type List" />
                  </ListItem>
              </List>
        </Collapse>

      <ListItem button onClick={handleProjectMenu}>
            <ListItemText primary="Project" />
            <CreateNewFolderIcon />
        </ListItem>
        <Collapse in={openProjectMenu} timeout="auto" unmountOnExit sx={{backgroundColor:'#2C3539'}}>
              <List component="div" disablePadding>
                  <ListItem button component={Link} to="project" onClick={handleClose}>
                      <ListItemText primary="Project List" />
                  </ListItem>
                  <ListItem button component={Link} to="project/projectemployeelist" onClick={handleClose}>
                      <ListItemText primary="Project Employee List" />
                  </ListItem>
              </List>
        </Collapse>

      <ListItem button onClick={handleSowMenu}>
        <ListItemText primary="SOW" />
        <AssessmentIcon />
      </ListItem>
      <Collapse in={openSowMenu} timeout="auto" unmountOnExit sx={{backgroundColor:'#2C3539'}}>
              <List component="div" disablePadding>
                  <ListItem button component={Link} to="sow" onClick={handleClose}>
                      <ListItemText primary="SOW List" />
                  </ListItem>
                  <ListItem button component={Link} to="sow/sowproposedteamlist" onClick={handleClose}>
                      <ListItemText primary="SOW Proposed Team List" />
                  </ListItem>
                  <ListItem button component={Link} to="sow/sowrequirementlist" onClick={handleClose}>
                      <ListItemText primary="SOW Requirement List" />
                  </ListItem>
                  <ListItem button component={Link} to="sow/sowstatuslist" onClick={handleClose}>
                      <ListItemText primary="SOW Status List" />
                  </ListItem>
              </List>
        </Collapse>

      <ListItem button onClick={handleInterviewMenu}>
        <ListItemText primary="Interviews" />
        <HowToRegIcon />
      </ListItem>
      <Collapse in={openInterviewMenu} timeout="auto" unmountOnExit sx={{backgroundColor:'#2C3539'}}>
              <List component="div" disablePadding>
                  <ListItem button component={Link} to="interview" onClick={handleClose}>
                      <ListItemText primary="Interview List" />
                  </ListItem>
                  <ListItem button component={Link} to="interview/interviewstatuslist" onClick={handleClose}>
                      <ListItemText primary="Interview Status List" />
                  </ListItem>
              </List>
        </Collapse>

      <ListItem 
        button
        component={Link} to="webinars"
        onClick={(event) => handleClick(event, 'webinar')}
      >
        <ListItemText primary="Webinars" />
        <LiveTvIcon />
      </ListItem>

      <ListItem 
        button 
        component={Link} to="blogs"
        onClick={(event) => handleClick(event, 'blogs')}
      >
        <ListItemText primary="Blogs" />
        <ArticleIcon />
      </ListItem>
             
      <ListItem 
        button 
        component={Link} to="poc"
        onClick={(event) => handleClick(event, 'poc')}
      >
        <ListItemText primary="POC" />
        <CheckCircleIcon />
      </ListItem>
              
      <ListItem 
        button 
        component={Link} to="certifications"
        onClick={(event) => handleClick(event, 'certifications')}
      >
        <ListItemText primary="Certifications" />
        <WorkspacePremiumIcon />
      </ListItem>

      <ListItem 
        button 
        component={Link} to="successstories"
        onClick={(event) => handleClick(event, 'successstories')}
      >
        <ListItemText primary="Success Stories" />
        <ThumbUpIcon />
      </ListItem>

      <ListItem button onClick={handleTrainingsMenu}>
        <ListItemText primary="Training" />
        <EventNoteIcon />
      </ListItem>
      <Collapse in={openTrainingsMenu} timeout="auto" unmountOnExit sx={{backgroundColor:'#2C3539'}}>
              <List component="div" disablePadding>
                  <ListItem button component={Link} to="trainings" onClick={handleClose}>
                      <ListItemText primary="Trainings List" />
                  </ListItem>
                  <ListItem button component={Link} to="trainings/trainingteamlist" onClick={handleClose}>
                      <ListItemText primary="Training Team List" />
                  </ListItem>
              </List>
        </Collapse>

      <ListItem 
        button 
        component={Link} to="bestperformers"
        onClick={(event) => handleClick(event, 'bestperformers')}
      >
        <ListItemText primary="Best Performers" />
        <GradeIcon />
      </ListItem>

        <ListItem button onClick={handleLeadEnquiryMenu}>
            <ListItemText primary="New Lead Enquiry" />
            <ContactMailIcon />
        </ListItem>
        <Collapse in={openLeadEnquiryMenu} timeout="auto" unmountOnExit sx={{backgroundColor:'#2C3539'}}>
            <List component="div" disablePadding>
               <ListItem button component={Link} to="newleadenquiry" onClick={handleClose}>
                    <ListItemText primary="New Lead Enquiry List" />
                </ListItem>
                <ListItem button component={Link} to="newleadenquiry/newleadenquirytechnologylist" onClick={handleClose}>
                    <ListItemText primary="New Lead Enquiry Technology List" />
                </ListItem>
                <ListItem button component={Link} to="newleadenquiry/newleadenquiryfollowuplist" onClick={handleClose}>
                    <ListItemText primary="New Lead Enquiry Follow Up List" />
                </ListItem>
                <ListItem button component={Link} to="newleadenquiry/newleadenquirydocumentslist" onClick={handleClose}>
                    <ListItemText primary="New Lead Enquiry Documents List" />
                </ListItem>
            </List>
        </Collapse>
    </>
  );

  return (
    <div style={{fontFamily:'Montserrat'}}>
      <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor:'#fff' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      
          {/* Left menu icon and Logo container */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
              <MenuOutlinedIcon sx={{ color: 'black', fontSize: '32px' }} />
            </IconButton>
            <img src='/miraclelogodark.png' alt="Miracle Logo" style={{ width: '160px', marginLeft: '13px' }} />
            <Divider orientation="vertical" flexItem sx={{ margin: '0 16px' }} />
          </div>

          {/* Navigation Images */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href="https://miraclesoft.com/" target="_blank" rel="noopener noreferrer">
            <img src="https://images.miraclesoft.com/mss/images/newsletters/2020/May/M.png" alt="Page 1" style={{ width: '30px', height: '30px', marginRight: '9px' }} />
          </a>
          <a href="https://me.miraclesoft.com/login" target="_blank" rel="noopener noreferrer">
            <img src='https://images.miraclesoft.com/mss/images/newsletters/2020/May/MiracleMe_logo.png' alt="Page 2" style={{ width: '30px', height: '30px', marginRight: '9px' }} />
          </a>
          <a href="https://blog.miraclesoft.com/" target="_blank" rel="noopener noreferrer">
            <img src='https://images.miraclesoft.com/mss/images/newsletters/2020/May/B.png' alt="Page 3" style={{ width: '30px', height: '30px', marginRight: '9px' }} />
          </a>
          <a href="https://help.miraclesoft.com/login" target="_blank" rel="noopener noreferrer">
            <img src='https://images.miraclesoft.com/mss/images/newsletters/2020/May/H.png' alt="Page 4" style={{ width: '30px', height: '30px' }} />
          </a>
          <Divider orientation="vertical" flexItem sx={{ margin: '0 18px' }} />
        </div>
        <Box flexGrow={1} />

          {/* Username and Profile Avatar */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ marginRight: 1, color:'black' }}>
              {username || 'U'}
            </Typography>
            <IconButton onClick={handleProfileMenuClick} color="inherit">
              <Avatar src={userData.photo} sx={{ bgcolor: '#00aae7' }}>{username[0] || 'U'}</Avatar>
            </IconButton>
          </div>

          {/* Profile Menu */}
          <Menu
            anchorEl={profileMenuAnchorEl}
            open={Boolean(profileMenuAnchorEl)}
            onClose={() => setProfileMenuAnchorEl(null)}
          >
            <MenuItem onClick={handleProfileMenuClose} sx={{fontFamily:'Lato'}}>Profile</MenuItem>
            <MenuItem onClick={handleLogout} sx={{fontFamily:'Lato'}}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      {/* <Drawer
          variant="persistent"
          anchor="left"
          open={isDrawerOpen}
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 260,
              boxSizing: 'border-box',
              backgroundColor: '#232527',
              fontFamily: 'Montserrat, sans-serif' ,
              color: 'white',
            },
          }}
        > */}
        <Drawer
          variant="persistent"
          anchor="left"
          open={isDrawerOpen}
          sx={{
              width: 250,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                  width: 250,
                  boxSizing: 'border-box',
                  backgroundColor: '#232527',
                  color: 'white',
                  fontFamily: 'Montserrat, sans-serif',
                  '&::-webkit-scrollbar': {
                      width: '0px', // Hide scrollbar
                  },
                  '&::-webkit-scrollbar-thumb': {
                      background: 'transparent', 
                  },
                  '&::-webkit-scrollbar-track': {
                      background: 'transparent', 
                  },
                },
            }}
          >
          <Toolbar />
          <Box  className="drawer-invisible-scrollbar" sx={{ overflow: 'auto' }}>
            <List className="drawer-text">
              {role === 'Admin' ? renderAdminForms() : renderOtherRoleForms()}
            </List>
          </Box>
        </Drawer>
      </Box>

      {/* Submenu */}
      <Menu
        anchorEl={subMenuAnchorEl}
        open={Boolean(subMenuAnchorEl)}
        onClose={handleSubMenuClose}
      >
        {currentSubMenu?.subMenu?.map((subItem) => (
          <MenuItem key={subItem} onClick={() => setView(subItem.toLowerCase())}>{subItem}</MenuItem>
        ))}
      </Menu>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 3, height: '100vh', overflow: 'auto' }}>
        <Toolbar />
        <CustomBreadcrumbs paths={getBreadcrumbs()} currentPath={currentPath} isDrawerOpen={isDrawerOpen}  />
        <Routes>
          <Route path='/' element={<SliderComponent  isDrawerOpen={isDrawerOpen} />} />
          <Route path='department' element={<DepartmentList isDrawerOpen={isDrawerOpen} />} />
          <Route path='designation' element={<DesignationList isDrawerOpen={isDrawerOpen} />} />
          <Route path='technology' element={<TechnologyList isDrawerOpen={isDrawerOpen} />} />
          <Route path='employees' element={<EmployeeList isDrawerOpen={isDrawerOpen} />} />
          <Route path='blogs' element={<BlogsList isDrawerOpen={isDrawerOpen} />} />
          <Route path='client' element={<ClientList isDrawerOpen={isDrawerOpen} />} />
          <Route path='client/clientcontactlist' element={<ClientContactList isDrawerOpen={isDrawerOpen} />} />
          <Route path='client/clientcontacttypelist' element={<ContactTypeList isDrawerOpen={isDrawerOpen} />} />
          <Route path='project' element={<ProjectList isDrawerOpen={isDrawerOpen} />} />
          <Route path='project/projectemployeelist' element={<ProjectEmployeeList isDrawerOpen={isDrawerOpen} />} />
          <Route path='interview' element={<InterviewList isDrawerOpen={isDrawerOpen} />} />
          <Route path='interview/interviewstatuslist' element={<InterviewStatusList isDrawerOpen={isDrawerOpen} />} />
          <Route path='webinars' element={<WebinarList isDrawerOpen={isDrawerOpen} />} />
          <Route path='sow' element={<SOWList isDrawerOpen={isDrawerOpen} />} />
          <Route path='sow/sowproposedteamlist' element={<SOWProposedTeamList isDrawerOpen={isDrawerOpen} />} />
          <Route path='sow/sowrequirementlist' element={<SOWRequirementList isDrawerOpen={isDrawerOpen} />} />
          <Route path='sow/sowstatuslist' element={<SOWStatusList isDrawerOpen={isDrawerOpen} />} />
          <Route path='poc' element={<POCList isDrawerOpen={isDrawerOpen} />} />
          <Route path='certifications' element={<CertificationsList isDrawerOpen={isDrawerOpen} />} />
        </Routes>

        {/* {view === 'slider' && <SliderComponent  isDrawerOpen={isDrawerOpen} />}
        {view === 'department' && <DepartmentList isDrawerOpen={isDrawerOpen} />}
        {view === 'designation' && <DesignationList isDrawerOpen={isDrawerOpen} />}
        {view === 'technology' && <TechnologyList isDrawerOpen={isDrawerOpen} />}
        {view === 'employee' && <EmployeeList isDrawerOpen={isDrawerOpen} />}
        {view === 'blogs' && <BlogsList isDrawerOpen={isDrawerOpen} />}
        {view === 'client' && <ClientList isDrawerOpen={isDrawerOpen} />}
        {view === 'clientcontact' && <ClientContactList isDrawerOpen={isDrawerOpen} />}
        {view === 'contacttype' && <ContactTypeList isDrawerOpen={isDrawerOpen} />}
        {view === 'project' && <ProjectList isDrawerOpen={isDrawerOpen} />}
        {view === 'projectemployee' && <ProjectEmployeeList isDrawerOpen={isDrawerOpen} />}
        {view === 'interview' && <InterviewList isDrawerOpen={isDrawerOpen} />}
        {view === 'interviewstatus' && <InterviewStatusList isDrawerOpen={isDrawerOpen} />}
        {view === 'webinar' && <WebinarList isDrawerOpen={isDrawerOpen} />}
        {view === 'sow' && <SOWList isDrawerOpen={isDrawerOpen} />}
        {view === 'sowproposedteam' && <SOWProposedTeamList isDrawerOpen={isDrawerOpen} />}
        {view === 'sowrequirement' && <SOWRequirementList isDrawerOpen={isDrawerOpen} />}
        {view === 'sowstatus' && <SOWStatusList isDrawerOpen={isDrawerOpen} />}
        {view === 'poc' && <POCList isDrawerOpen={isDrawerOpen} />} */}
      </Box>
    </div>
  )
}

export default Home