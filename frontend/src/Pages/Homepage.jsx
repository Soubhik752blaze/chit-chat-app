import React, { useEffect, useState } from 'react'
import { Container, Box, Typography, Tabs, Tab } from '@mui/material'
import Login from "../Components/Authentication/Login"
import { useNavigate } from "react-router-dom";
import Signup from "../Components/Authentication/Signup"

function Homepage() {
  const [value, setValue] = useState('one');
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) 
        navigate("/chats");
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  return (
    <Container maxWidth="sm" sx={{ fontFamily: 'Open Sans' }} >
      <Box display="flex" alignItems="center" justifyContent="center"
        p={2} m="30px 0 15px 0" borderRadius="5px" sx={{ bgcolor: "white" }}>
        <Typography variant="body1">
          Chit - Chat 
        </Typography>
      </Box>

      <Box p={1} borderRadius="5px" sx={{ bgcolor: "white", width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{ marginBottom: 3 }}
        >
          <Tab value="one" label="Login" sx={{ width: "50%" }} />
          <Tab value="two" label="Signup" sx={{ width: "50%" }} />
        </Tabs>
        {value === "one" && <Login />}
        {value === "two" && <Signup />}

      </Box>

    </Container >

  )
}

export default Homepage