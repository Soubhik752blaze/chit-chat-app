import React, { useState } from 'react'
import Stack from '@mui/material/Stack';
import { FormControl, Input, InputLabel, InputAdornment, Box } from '@mui/material';
import Button from '@mui/material/Button';


function Signup() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPass, setShowPass] = useState(false);

  const postDetails = async (e) => {

  }

  const changeShowPass = (pic) => {
    setShowPass(!showPass);
  }

  const submitHandler = () => {

  }

  return (
    <Stack spacing={3} pl={3} pr={3}>
      <FormControl required={true}>
        <InputLabel shrink htmlFor="name" >Name</InputLabel>
        <Input id="name" aria-describedby="Name" onChange={(e) => setName(e.target.value)} />
      </FormControl>

      <FormControl required={true}>
        <InputLabel shrink htmlFor="email" >Email</InputLabel>
        <Input id="Email" aria-describedby="Email" onChange={(e) => setEmail(e.target.value)} />
      </FormControl>

      <FormControl required={true} >
        <InputLabel shrink htmlFor="password">Password</InputLabel>
        <Input
          id="password"
          type={showPass ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <Button onClick={changeShowPass} mb={3}>
                {showPass ? 'Hide' : 'Show'}
              </Button>
            </InputAdornment>
          }
        />

      </FormControl>

      <FormControl required={false} fullWidth variant="outlined">
        <InputLabel shrink htmlFor="file">Profile Picture</InputLabel>
        <Box sx={{ mt: 2 }}>
          <input
            id="file"
            type="file"
            onChange={(e) => postDetails(e.target.files[0])}
            style={{ display: 'block', marginTop: '8px' }}
          />
        </Box>
      </FormControl>

      <Button width="100%" variant="contained" style={{ marginBottom: 20 }} onClick={submitHandler}>
        Signup
      </Button>


    </Stack>
  )
}

export default Signup