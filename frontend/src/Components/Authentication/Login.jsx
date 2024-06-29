import React, { useState } from 'react'
import Stack from '@mui/material/Stack';
import { FormControl, Input, InputLabel, InputAdornment } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom'
import Snackbar from '@mui/material/Snackbar';
import axios from 'axios';

function Login() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [snackbarmessage, setSnackbarmessage] = useState('');


  const vertical = 'bottom'
  const horizontal = 'center'
  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const changeShowPass = (pic) => {
    setShowPass(!showPass);
  }

  const submitHandler = async () => {
    setLoading(true);

    if (!email || !password) {
      setSnackbarmessage('Please fill all fields to login');
      setOpen(true);
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      };

      const { data } = await axios.post("/api/user/login", { email, password }, config);
      // console.log(data);

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate('/chats');
    }
    catch (error) {
      // console.log(error.response.status);
      if (error.response.status == '500')
        setSnackbarmessage('Chit-Chat server unreachable');
      else
        setSnackbarmessage(error.response.data.message);
      setOpen(true);
      setLoading(false);
    }

  }

  return (
    <>
      {/* input stack  */}
      <Stack spacing={3} pl={3} pr={3}>

        <FormControl required={true}>
          <InputLabel shrink htmlFor="email" >Email</InputLabel>
          <Input id="Email" value={email} aria-describedby="Email" onChange={(e) => setEmail(e.target.value)} />

        </FormControl>

        <FormControl required={true} >
          <InputLabel shrink htmlFor="password">Password</InputLabel>
          <Input
            onKeyDown={(e) => {
              if(e.key === "Enter" && password)
                submitHandler()
            }}
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

      </Stack>

      {/* Button Stack  */}
      <Stack spacing={2} pl={3} pr={3} mt={4}>
        <LoadingButton
          loading={loading}
          width="100%"
          variant="contained"
          onClick={submitHandler} >
          Login
        </LoadingButton>
        <Button width="100%" variant="contained" color='success' style={{ color: "white", marginBottom: 20 }} onClick={() => {
          setEmail("guestuser@test.com");
          setPassword('12346789');
        }}>
          Get Guest Credentials
        </Button>
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        autoHideDuration={3000}
        message={snackbarmessage}
        key={vertical + horizontal}
      />
    </>
  )
}

export default Login