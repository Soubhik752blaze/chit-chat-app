import React, { useState } from 'react'
import { Container, Box, Typography, Tabs, Tab } from '@mui/material'
import Login from "../Components/Authentication/Login"
import Signup from "../Components/Authentication/Signup"

function Homepage() {
  const [value, setValue] = useState('one');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="sm" sx={{ fontFamily: 'Open Sans' }} >
      <Box display="flex" alignItems="center" justifyContent="center"
        p={2} m="40px 0 15px 0" borderRadius="5px" sx={{ bgcolor: "white" }}>
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