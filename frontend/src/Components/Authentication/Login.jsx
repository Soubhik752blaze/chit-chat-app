import React, { useState } from 'react'
import Stack from '@mui/material/Stack';
import { FormControl, Input, InputLabel, InputAdornment, Box } from '@mui/material';
import Button from '@mui/material/Button';


function Login() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPass, setShowPass] = useState(false);

  const changeShowPass = (pic) => {
    setShowPass(!showPass);
  }

  const submitHandler = () => {

  }

  return (
    <Stack spacing={3} pl={3} pr={3}>

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

      <Button width="100%" variant="contained" onClick={submitHandler}>
        Login
      </Button>
      <Button width="100%" variant="contained" color='red' style={{color: "white", marginBottom: 10 }} onClick={() => {
        setEmail('guestuser@email.com');
        setPassword('guest123');
      }}>
        Get User Credentials
      </Button>


    </Stack>
  )
}

export default Login