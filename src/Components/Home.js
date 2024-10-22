import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { AppBar,Divider, Toolbar, IconButton, Typography, Drawer, Box, List, ListItem, ListItemText, Avatar, Menu, MenuItem, CssBaseline } from '@mui/material';
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
import CertificationsList from '../CertificationsServices/CertificationsList';
import SuccessStoriesList from '../SuccessStoriesServices/SuccessStoriesList';

function Home() {

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const [view, setView] = useState('slider'); // Default view
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [currentSubMenu, setCurrentSubMenu] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // Anchor for menu
  const [role, setRole] = useState('User'); 
  const [username, setUsername] = useState('');

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
      <ListItem button onClick={(event) => handleClick(event, 'employee')}>
        <ListItemText primary="Employees" />
        <SupervisorAccountIcon />
      </ListItem>
      <Menu
        anchorEl={anchorEl?.employee}
        open={Boolean(anchorEl?.employee)}
        onClick={handleClose}
        onClose={handleClose}
        sx={{ mt: 2 }}
          anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem  component={Link} to="employees/employeelist">Employee List</MenuItem>
      </Menu>
    </>
  )

  const renderAdminForms = () => (
    <>
      <ListItem button onClick={(event) => handleClick(event, 'department')}>
        <ListItemText primary="Department" />
        <CorporateFareIcon />
      </ListItem>
      <Menu
        anchorEl={anchorEl?.department}
        open={Boolean(anchorEl?.department)}
        onClick={handleClose}
        onClose={handleClose}
        sx={{ mt: 2 }}
          anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {/* <MenuItem onClick={() => setView('department')}>Department List</MenuItem> */}
        <MenuItem component={Link} to="department/departmentlist">Department List</MenuItem>
      </Menu>

      <ListItem button onClick={(event) => handleClick(event, 'designation')}>
                <ListItemText primary="Designation" />
                <BadgeIcon />
              </ListItem>
              <Menu
                anchorEl={anchorEl?.designation}
                open={Boolean(anchorEl?.designation)}
                onClick={handleClose}
                onClose={handleClose}
                sx={{ mt: 2 }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem component={Link} to="designation/designationlist">Designation List</MenuItem>
              </Menu>        

              

              <ListItem button onClick={(event) => handleClick(event, 'technology')}>
                <ListItemText primary="Technology" />
                <ImportantDevicesIcon />
              </ListItem>
              <Menu
                anchorEl={anchorEl?.technology}
                open={Boolean(anchorEl?.technology)}
                onClick={handleClose}
                onClose={handleClose}
                sx={{ mt: 2 }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem component={Link} to="technology/technologylist">Technology List</MenuItem>
              </Menu>
      {renderOtherRoleForms()}

    </>
  );

  const renderOtherRoleForms = () => (
    <>
      {renderEmployeeForm()}

      <ListItem button onClick={(event) => handleClick(event, 'client')}>
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
                <MenuItem component={Link} to="client/clientlist">Client List</MenuItem>
                <MenuItem component={Link} to="client/clientcontact">Client Contact</MenuItem>
                <MenuItem component={Link} to="client/clientcontacttype">Client Contact Type List</MenuItem>
              </Menu>

              <ListItem button onClick={(event) => handleClick(event, 'project')}>
                <ListItemText primary="Project" />
                <CreateNewFolderIcon />
              </ListItem>
              <Menu
                anchorEl={anchorEl?.project}
                open={Boolean(anchorEl?.project)}
                onClick={handleClose}
                onClose={handleClose}
                sx={{ mt: 2 }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem component={Link} to="project/projectlist">Project List</MenuItem>
                <MenuItem component={Link} to="project/projectemployee">Project Employee</MenuItem>
              </Menu>

              <ListItem button onClick={(event) => handleClick(event, 'sow')}>
                <ListItemText primary="SOW" />
                <AssessmentIcon />
              </ListItem>
              <Menu
                anchorEl={anchorEl?.sow}
                open={Boolean(anchorEl?.sow)}
                onClick={handleClose}
                onClose={handleClose}
                sx={{ mt: 2 }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem component={Link} to="sow/sowlist">SOW List</MenuItem>
                <MenuItem component={Link} to="sow/sowproposedteamlist">SOW Proposed Team List</MenuItem>
                <MenuItem component={Link} to="sow/sowrequirementlist">SOW Requirement List</MenuItem>
                <MenuItem component={Link} to="sow/sowstatuslist">SOW Status List</MenuItem>
              </Menu>

              <ListItem button onClick={(event) => handleClick(event, 'interviews')}>
                <ListItemText primary="Interviews" />
                <HowToRegIcon />
              </ListItem>
              <Menu
                anchorEl={anchorEl?.interviews}
                open={Boolean(anchorEl?.interviews)}
                onClick={handleClose}
                onClose={handleClose}
                sx={{ mt: 2 }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem component={Link} to="interview/interviewlist">Interview List</MenuItem>
                <MenuItem component={Link} to="interview/interviewstatuslist">Interview Status List</MenuItem>
              </Menu>

              <ListItem button onClick={(event) => handleClick(event, 'webinar')}>
                <ListItemText primary="Webinars" />
                <LiveTvIcon />
              </ListItem>
              <Menu
                anchorEl={anchorEl?.webinar}
                open={Boolean(anchorEl?.webinar)}
                onClick={handleClose}
                onClose={handleClose}
                sx={{ mt: 2 }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem component={Link} to="webinars/webinarlist">Webinar List</MenuItem>
              </Menu>

              <ListItem button onClick={(event) => handleClick(event, 'blogs')}>
                <ListItemText primary="Blogs" />
                <ArticleIcon />
              </ListItem>
              <Menu
                anchorEl={anchorEl?.blogs}
                open={Boolean(anchorEl?.blogs)}
                onClick={handleClose}
                onClose={handleClose}
                sx={{ mt: 2 }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem component={Link} to="blogs/blogslist">Blogs List</MenuItem>
              </Menu>

              <ListItem button onClick={(event) => handleClick(event, 'poc')}>
                <ListItemText primary="POC" />
                <CheckCircleIcon />
              </ListItem>
              <Menu
                anchorEl={anchorEl?.poc}
                open={Boolean(anchorEl?.poc)}
                onClick={handleClose}
                onClose={handleClose}
                sx={{ mt: 2 }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem component={Link} to="poc/poclist">POC List</MenuItem>
              </Menu>

              <ListItem button onClick={(event) => handleClick(event, 'certifications')}>
                <ListItemText primary="Certifications" />
                <WorkspacePremiumIcon />
              </ListItem>
              <Menu
                anchorEl={anchorEl?.certifications}
                open={Boolean(anchorEl?.certifications)}
                onClick={handleClose}
                onClose={handleClose}
                sx={{ mt: 2 }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem component={Link} to="certifications/certificationslist">Certifications List</MenuItem>
              </Menu>

              <ListItem button onClick={(event) => handleClick(event, 'successstories')}>
                <ListItemText primary="Success Stories" />
                <ThumbUpIcon />
              </ListItem>
              <Menu
                anchorEl={anchorEl?.successstories}
                open={Boolean(anchorEl?.successstories)}
                onClick={handleClose}
                onClose={handleClose}
                sx={{ mt: 2 }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem component={Link} to="successstories/successstorieslist">Success Stories List</MenuItem>
              </Menu>

              <ListItem button onClick={(event) => handleClick(event, 'trainings')}>
                <ListItemText primary="Trainings" />
                <EventNoteIcon />
              </ListItem>
              <Menu
                anchorEl={anchorEl?.trainings}
                open={Boolean(anchorEl?.trainings)}
                onClick={handleClose}
                onClose={handleClose}
                sx={{ mt: 2 }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem component={Link} to="trainings/trainingslist">Trainings List</MenuItem>
                <MenuItem component={Link} to="trainings/trainingteamlist">Training Team List</MenuItem>
              </Menu>

              <ListItem button onClick={(event) => handleClick(event, 'bestperformers')}>
                <ListItemText primary="Best Performers" />
                <GradeIcon />
              </ListItem>
              <Menu
                anchorEl={anchorEl?.bestperformers}
                open={Boolean(anchorEl?.bestperformers)}
                onClick={handleClose}
                onClose={handleClose}
                sx={{ mt: 2 }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem component={Link} to="bestperformers/bestperformerslist">Best Performers List</MenuItem>
              </Menu>

              <ListItem button onClick={(event) => handleClick(event, 'newleadenquiry')}>
                <ListItemText primary="New Lead Enquiry" />
                <ContactMailIcon />
              </ListItem>
              <Menu
                anchorEl={anchorEl?.newleadenquriy}
                open={Boolean(anchorEl?.newleadenquiry)}
                onClick={handleClose}
                onClose={handleClose}
                sx={{ mt: 2 }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem component={Link} to="newleadenquiry/newleadenquirylist">New Lead Enquiry List</MenuItem>
                <MenuItem component={Link} to="newleadenquiry/newleadenquirytechnologylist">New Lead Enquiry Technology List</MenuItem>
                <MenuItem component={Link} to="newleadenquiry/newleadenquiryfollowuplist">New Lead Enquiry Follow Up List</MenuItem>
                <MenuItem component={Link} to="newleadenquiry/newleadenquirydocumentslist">New Lead Enquiry Documents List</MenuItem>
              </Menu>
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
            <img src='/miraclelogodark.png' alt="Miracle Logo" style={{ width: '160px', marginLeft: '16px' }} />
            <Divider orientation="vertical" flexItem sx={{ margin: '0 16px' }} />
          </div>

          {/* Navigation Images */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href="https://miraclesoft.com/" target="_blank" rel="noopener noreferrer">
            <img src="https://images.miraclesoft.com/mss/images/newsletters/2020/May/M.png" alt="Page 1" style={{ width: '30px', height: '30px', marginRight: '8px' }} />
          </a>
          <a href="https://me.miraclesoft.com/login" target="_blank" rel="noopener noreferrer">
            <img src='https://images.miraclesoft.com/mss/images/newsletters/2020/May/MiracleMe_logo.png' alt="Page 2" style={{ width: '30px', height: '30px', marginRight: '8px' }} />
          </a>
          <a href="https://blog.miraclesoft.com/" target="_blank" rel="noopener noreferrer">
            <img src='https://images.miraclesoft.com/mss/images/newsletters/2020/May/B.png' alt="Page 3" style={{ width: '30px', height: '30px', marginRight: '8px' }} />
          </a>
          <a href="https://help.miraclesoft.com/login" target="_blank" rel="noopener noreferrer">
            <img src='https://images.miraclesoft.com/mss/images/newsletters/2020/May/H.png' alt="Page 4" style={{ width: '30px', height: '30px' }} />
          </a>
          <Divider orientation="vertical" flexItem sx={{ margin: '0 16px' }} />
        </div>
        <Box flexGrow={1} />

          {/* Username and Profile Avatar */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ marginRight: 1, color: 'black' }}>
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
            <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
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
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', fontWeight: '400' }}>
            <List>
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
        <Routes>
          <Route path='/' element={<SliderComponent  isDrawerOpen={isDrawerOpen} />} />
          <Route path='department/departmentlist' element={<DepartmentList isDrawerOpen={isDrawerOpen} />} />
          <Route path='designation/designationlist' element={<DesignationList isDrawerOpen={isDrawerOpen} />} />
          <Route path='technology/technologylist' element={<TechnologyList isDrawerOpen={isDrawerOpen} />} />
          <Route path='employees/employeelist' element={<EmployeeList isDrawerOpen={isDrawerOpen} />} />
          <Route path='blogs/blogslist' element={<BlogsList isDrawerOpen={isDrawerOpen} />} />
          <Route path='client/clientlist' element={<ClientList isDrawerOpen={isDrawerOpen} />} />
          <Route path='client/clientcontactlist' element={<ClientContactList isDrawerOpen={isDrawerOpen} />} />
          <Route path='client/clientcontacttypelist' element={<ContactTypeList isDrawerOpen={isDrawerOpen} />} />
          <Route path='project/projectlist' element={<ProjectList isDrawerOpen={isDrawerOpen} />} />
          <Route path='project/projectemployeelist' element={<ProjectEmployeeList isDrawerOpen={isDrawerOpen} />} />
          <Route path='interview/interviewlist' element={<InterviewList isDrawerOpen={isDrawerOpen} />} />
          <Route path='interview/interviewstatuslist' element={<InterviewStatusList isDrawerOpen={isDrawerOpen} />} />
          <Route path='webinars/webinarslist' element={<WebinarList isDrawerOpen={isDrawerOpen} />} />
          <Route path='sow/sowlist' element={<SOWList isDrawerOpen={isDrawerOpen} />} />
          <Route path='sow/sowproposedteamlist' element={<SOWProposedTeamList isDrawerOpen={isDrawerOpen} />} />
          <Route path='sow/sowrequirementlist' element={<SOWRequirementList isDrawerOpen={isDrawerOpen} />} />
          <Route path='sow/sowstatuslist' element={<SOWStatusList isDrawerOpen={isDrawerOpen} />} />
          <Route path='poc/poclist' element={<POCList isDrawerOpen={isDrawerOpen} />} />
          <Route path='certifications/certificationslist' element={<CertificationsList isDrawerOpen={isDrawerOpen} />} />
          <Route path='successStories/successStoriesList' element={<SuccessStoriesList isDrawerOpen={isDrawerOpen} />} />
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
