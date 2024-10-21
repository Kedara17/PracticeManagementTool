import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs, Typography, Box } from '@mui/material';

const CustomBreadcrumbs = ({ paths, isDrawerOpen, currentPath }) => {

    const [marginLeft, setMarginLeft] = useState(100);
  
    useEffect(() => {
      setMarginLeft(isDrawerOpen ? 250 : 0);
    }, [isDrawerOpen]);

    return (
        <Box sx={{ ml: `${marginLeft}px`, transition: 'margin-left 0.3s'}}>
           <Breadcrumbs separator="›" aria-label="breadcrumb">
                {paths.map((path, index) => (
                    <Typography
                        key={index}
                        component={path.link ? Link : 'span'} 
                        to={path.link}
                        style={{
                            textDecoration: 'none',
                            color: path.link === currentPath ? '#00aae7' : 'inherit', 
                            pointerEvents: path.link === currentPath ? 'none' : 'auto', 
                            fontFamily: 'Montserrat'
                        }}
                    >
                        {path.label}
                    </Typography>
                ))}
            </Breadcrumbs>
      </Box>
        
    );
};

export default CustomBreadcrumbs;
