import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DepartmentList from '../DepartmentServices/DepartmentList';
import DesignationList from '../DesignationService/DesignationList';
import EmployeeList from '../EmployeeServices/EmployeeList';
import TechnologyList from '../TechnologyServices/TechnologyList';
import EmployeeTechnologyList from '../EmployeeServices/EmployeeTechnologyList';
import BlogsList from '../BlogsServices/BlogsList';
import ClientList from '../ClientServices/ClientList';
import ClientContactList from '../ClientServices/ClientContactList';
import ContactTypeList from '../ClientServices/ContactTypeList';
import ProjectList from '../ProjectServices/ProjectList';
import ProjectEmployeeList from '../ProjectServices/ProjectEmployeeList';
import ProjectTechnologyList from '../ProjectServices/ProjectTechnologyList';
import InterviewList from '../InterviewServices/InterviewList';
import InterviewStatusList from '../InterviewServices/InterviewStatusList';
import WebinarList from '../WebinarServices/WebinarList';
import SOWList from '../SOWServices/SOWList';
import SOWProposedTeamList from '../SOWServices/SOWProposedTeamList';
import SOWRequirementList from '../SOWServices/SOWRequirementList';
import SOWStatusList from '../SOWServices/SOWStatusList';
import POCList from '../POCServices/POCList';

const drawerWidth = 240;

export default function Home() {
  const [view, setView] = useState('home');
  const [openClient, setOpenClient] = useState(false);
  const [openProject, setOpenProject] = useState(false);
  const [openInterview, setOpenInterview] = useState(false);
  const [openSOW, setOpenSOW] = useState(false);
  const [role, setRole] = useState('');

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

  const handleListItemClick = (view) => {

    if (view === 'client') {
      setOpenClient(!openClient);
      // setOpenProject(false); // Close employee menu when client menu is toggled
    } else if (view === 'project') {
      setOpenProject(!openProject);
      setOpenClient(false); // Close client menu when project menu is toggled
    } else if (view === 'interview') {
      setOpenInterview(!openInterview);
      //setOpenProject(false);
    } else if (view === 'sow') {
      setOpenSOW(!openSOW);
      //setOpenClient(false); // Close client menu when project menu is toggled
    }
    else {
      // setOpenEmployee(false);
      setOpenClient(false);
      setOpenProject(false);
      setOpenInterview(false);
      setOpenSOW(false);
      setView(view);
    }
  };

  const renderEmployeeForm = () => (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={() => handleListItemClick('employee')}>
          <ListItemText primary="Employee" />
        </ListItemButton>
      </ListItem>
    </>
  )

  const renderAdminForms = () => (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={() => handleListItemClick('department')}>
          <ListItemText primary="Department" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton onClick={() => handleListItemClick('designation')}>
          <ListItemText primary="Designation" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton onClick={() => handleListItemClick('technology')}>
          <ListItemText primary="Technology" />
        </ListItemButton>
      </ListItem>
      {renderOtherRoleForms()}

    </>
  );

  const renderOtherRoleForms = () => (
    <>
      {renderEmployeeForm()}

      <ListItem disablePadding>
        <ListItemButton onClick={() => handleListItemClick('client')}>
          <ListItemText primary="Client" />
          {openClient ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
        </ListItemButton>
      </ListItem>
      <Collapse in={openClient} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button sx={{ pl: 4, bgcolor: '#d3d3d3', '&:hover': { bgcolor: '#b0b0b0' } }} onClick={() => setView('client')}>
            <ListItemText primary="Client List" />
          </ListItem>
          <ListItem button sx={{ pl: 4, bgcolor: '#d3d3d3', '&:hover': { bgcolor: '#b0b0b0' } }} onClick={() => setView('clientcontact')}>
            <ListItemText primary="Client Contact" />
          </ListItem>
          <ListItem button sx={{ pl: 4, bgcolor: '#d3d3d3', '&:hover': { bgcolor: '#b0b0b0' } }} onClick={() => setView('contacttype')}>
            <ListItemText primary="Contact Type" />
          </ListItem>
        </List>
      </Collapse>
      <ListItem disablePadding>
        <ListItemButton onClick={() => handleListItemClick('project')}>
          <ListItemText primary="Project" />
          {openProject ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
        </ListItemButton>
      </ListItem>
      <Collapse in={openProject} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button sx={{ pl: 4, bgcolor: '#d3d3d3', '&:hover': { bgcolor: '#b0b0b0' } }} onClick={() => setView('project')}>
            <ListItemText primary="Project List" />
          </ListItem>
          <ListItem button sx={{ pl: 4, bgcolor: '#d3d3d3', '&:hover': { bgcolor: '#b0b0b0' } }} onClick={() => setView('projectemployee')}>
            <ListItemText primary="Project Employee" />
          </ListItem>
        </List>
      </Collapse>
      <ListItem disablePadding>
        <ListItemButton onClick={() => handleListItemClick('sow')}>
          <ListItemText primary="SOW" />
          {openSOW ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
        </ListItemButton>
      </ListItem>
      <Collapse in={openSOW} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button sx={{ pl: 4, bgcolor: '#d3d3d3', '&:hover': { bgcolor: '#b0b0b0' } }} onClick={() => setView('sow')}>
            <ListItemText primary="SOW List" />
          </ListItem>
          <ListItem button sx={{ pl: 4, bgcolor: '#d3d3d3', '&:hover': { bgcolor: '#b0b0b0' } }} onClick={() => setView('sowproposedteam')}>
            <ListItemText primary="SOW ProposedTeam" />
          </ListItem>
          <ListItem button sx={{ pl: 4, bgcolor: '#d3d3d3', '&:hover': { bgcolor: '#b0b0b0' } }} onClick={() => setView('sowrequirement')}>
            <ListItemText primary="SOW Requirement" />
          </ListItem>
          <ListItem button sx={{ pl: 4, bgcolor: '#d3d3d3', '&:hover': { bgcolor: '#b0b0b0' } }} onClick={() => setView('sowstatus')}>
            <ListItemText primary="SOW Status" />
          </ListItem>
        </List>
      </Collapse>
      <ListItem disablePadding>
        <ListItemButton onClick={() => handleListItemClick('interview')}>
          <ListItemText primary="Interview" />
          {openInterview ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
        </ListItemButton>
      </ListItem>
      <Collapse in={openInterview} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button sx={{ pl: 4, bgcolor: '#d3d3d3', '&:hover': { bgcolor: '#b0b0b0' } }} onClick={() => setView('interview')}>
            <ListItemText primary="Interview List" />
          </ListItem>
          <ListItem button sx={{ pl: 4, bgcolor: '#d3d3d3', '&:hover': { bgcolor: '#b0b0b0' } }} onClick={() => setView('interviewstatus')}>
            <ListItemText primary="Interview Status" />
          </ListItem>
        </List>
      </Collapse>

      <ListItem disablePadding>
        <ListItemButton onClick={() => handleListItemClick('blogs')}>
          <ListItemText primary="Blogs" />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton onClick={() => handleListItemClick('webinar')}>
          <ListItemText primary="Webinar" />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton onClick={() => handleListItemClick('poc')}>
          <ListItemText primary="POC" />
        </ListItemButton>
      </ListItem>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, bgcolor: 'black', color: 'white', boxShadow: 1 }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4" noWrap component="div">
            Organization Application
          </Typography>
          <Button
            type="submit"
            variant="contained"
            color="error"
            sx={{ mt: 1, mb: 1 }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            // bgcolor: 'black', // Black background
            // color: 'white',

            borderRight: '1px solid white', // White border
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar sx={{ bgcolor: 'black', color: 'white' }}>Dashboard</Toolbar>
        <Divider />
        <List>
          {role === 'Admin' ? renderAdminForms() : renderOtherRoleForms()}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 3 }}>
        <Toolbar />
        {view === 'home' && (
          <Typography variant="h5" paragraph>
            Welcome to the Organization Application.
          </Typography>
        )}
        {view === 'department' && <DepartmentList />}
        {view === 'designation' && <DesignationList />}
        {view === 'technology' && <TechnologyList />}
        {view === 'employee' && <EmployeeList />}
        {view === 'employeetechnology' && <EmployeeTechnologyList />}
        {view === 'blogs' && <BlogsList />}
        {view === 'client' && <ClientList />}
        {view === 'clientcontact' && <ClientContactList />}
        {view === 'contacttype' && <ContactTypeList />}
        {view === 'project' && <ProjectList />}
        {view === 'projectemployee' && <ProjectEmployeeList />}
        {view === 'projecttechnology' && <ProjectTechnologyList />}
        {view === 'interview' && <InterviewList />}
        {view === 'interviewstatus' && <InterviewStatusList />}
        {view === 'webinar' && <WebinarList />}
        {view === 'sow' && <SOWList />}
        {view === 'sowproposedteam' && <SOWProposedTeamList />}
        {view === 'sowrequirement' && <SOWRequirementList />}
        {view === 'sowstatus' && <SOWStatusList />}
        {view === 'poc' && <POCList />}
      </Box>
    </Box>
  );
}
