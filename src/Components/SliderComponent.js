import React, { useEffect, useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Typography, Box } from '@mui/material';

function SliderComponent({ isDrawerOpen }) {
    const [marginLeft, setMarginLeft] = useState(100); // Default margin
  
    useEffect(() => {
      // Adjust margin dynamically based on drawer state
      setMarginLeft(isDrawerOpen ? 300 : 100);
    }, [isDrawerOpen]);
  
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      autoplay: true,
      autoplaySpeed: 3000,
      responsive: [
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1, // Adjust for smaller screens
          },
        },
      ],
    };
  
    return (
    <div>
      <Box
        sx={{
          textAlign: 'center',
          mt: 10,
          ml: `${marginLeft}px`, // Adjust margin based on drawer state
          transition: 'margin-left 0.3s', // Smooth transition
        }}
      >
        <Typography variant="h5" sx={{ mb: 6, pt: 2 }}>
          Manage your tasks, appointments, and clients all in one place
        </Typography>  

        <Slider {...settings}>
          <div>
            <img src="/partner1.png" alt="Slide 1" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner2.png" alt="Slide 2" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner3.png" alt="Slide 3" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner4.png" alt="Slide 4" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner5.png" alt="Slide 5" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner6.png" alt="Slide 6" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner7.png" alt="Slide 7" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner8.png" alt="Slide 8" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner9.png" alt="Slide 9" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner10.png" alt="Slide 10" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner11.png" alt="Slide 11" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner12.png" alt="Slide 12" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner13.png" alt="Slide 13" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner14.png" alt="Slide 14" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner15.png" alt="Slide 15" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner16.png" alt="Slide 16" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner17.png" alt="Slide 17" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner18.png" alt="Slide 18" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner19.png" alt="Slide 19" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner20.png" alt="Slide 20" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner21.png" alt="Slide 21" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner22.png" alt="Slide 22" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner23.png" alt="Slide 23" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner24.png" alt="Slide 24" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner25.png" alt="Slide 25" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner26.png" alt="Slide 26" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner27.png" alt="Slide 27" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner28.png" alt="Slide 28" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner29.png" alt="Slide 29" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner30.png" alt="Slide 30" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner31.png" alt="Slide 31" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner32.png" alt="Slide 32" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner33.png" alt="Slide 33" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner34.png" alt="Slide 34" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner35.png" alt="Slide 35" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner36.png" alt="Slide 36" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner37.png" alt="Slide 37" style={{ width: '80%' }} />
          </div>
          <div>
            <img src="/partner38.png" alt="Slide 38" style={{ width: '80%' }} />
          </div>
        </Slider>
        <Typography variant="h5" sx={{ mt: 8, pt: 2 }}>
          Effortless management for busy professionals—because your time is valuable!
        </Typography>
      </Box>
    </div>
  )
}

export default SliderComponent
