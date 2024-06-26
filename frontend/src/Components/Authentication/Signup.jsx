import React, { useState } from 'react'
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { FormControl, Input, InputLabel, InputAdornment, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import {picTypes} from '../../Assets/constants';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'


function Signup() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [pic, setPic] = useState('');
  const [picname, setPicname] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showconfPass, setShowconfpass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [snackbarmessage, setSnackbarmessage] = useState('');
  const navigate = useNavigate();

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const postPicture = (pic) => {
    setLoading(true);
    if (pic === undefined) {
      setSnackbarmessage('Please select an image to upload');
      setOpen(true);
      return;
    }

    if (picTypes.includes(pic.type)) {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chit-chat-app");
      data.append("cloud_name", 'soubhik');
      fetch('https://api.cloudinary.com/v1_1/soubhik/image/upload', {
        method: 'post',
        body: data
      }).then((res) => (res.json()))
        .then((data) => {
          // console.log(pic);
          setPic(data.url.toString());
          setPicname(pic.name);
          setLoading(false);
        }).catch((err) => {
          // console.log(err);
          setLoading(false);
        })
    }
    else {
      setLoading(false);
      setSnackbarmessage('Please upload only image in jpeg/png format');
      setOpen(true);
      return;
    }

  }

  const changeShowPass = () => {
    setShowPass(!showPass);
  }

  const changeShowPass2 = () => {
    setShowconfpass(!showconfPass);
  }

  const vertical = 'top'
  const horizontal = 'center'


  const submitHandler = async () => {
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setSnackbarmessage('Please fill all fields');
      setOpen(true);
      setLoading(false);
      return;
    }

    else if (password !== confirmPassword) {
      setSnackbarmessage('Passwords donot match!');
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

      const { data } = await axios.post("/api/user/", { name, email, password, pic }, config);
      // console.log(data);

      setSnackbarmessage('Registration successful');
      setOpen(true);

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate('/chats')
    }
    catch (e) {
      // console.log(e);
      setSnackbarmessage('Error while signing up. Try again');
      setOpen(true);
      setLoading(false);
    }

  }

  return (
    <Stack spacing={3} pl={3} pr={3} style={{ scale: "0.9" }}>
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

      <FormControl required={true} >
        <InputLabel shrink htmlFor="confirmPassword">Confirm Passowrd</InputLabel>
        <Input
          id="confirmPassword"
          type={showconfPass ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <Button onClick={changeShowPass2} mb={3}>
                {showconfPass ? 'Hide' : 'Show'}
              </Button>
            </InputAdornment>
          }
        />

      </FormControl>

      <FormControl required={false} fullWidth variant="outlined">
        <InputLabel shrink htmlFor="file">Profile Picture</InputLabel>
        <Box sx={{ mt: 2, display: 'flex', gap: "1rem", alignItems: "center" }}>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            onChange={(e) => postPicture(e.target.files[0])}
          >
            Upload file
            <VisuallyHiddenInput type="file" />
          </Button>
          <span style={{ display: picname !== '' ? "flex" : "hidden", fontSize: "10px" }}>
            {picname}
          </span>
        </Box>
      </FormControl>


      <LoadingButton
        loading={loading}
        width="100%"
        variant="contained"
        sx={{ marginBottom: 10 }}
        onClick={submitHandler} >
        Signup
      </LoadingButton>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        autoHideDuration={3000}
        message={snackbarmessage}
        key={vertical + horizontal}
      />
    </Stack>
  )
}

export default Signup