import * as React from 'react';
import Box from '@mui/material/Box';
import { Avatar, Button, FormControl, IconButton, Snackbar } from '@mui/material'
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FaEye } from "react-icons/fa";
import { defaultUserpic, picTypes } from "../../Assets/constants"
import { ChatState } from '../../Context/ChatProvider';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    transform: 'translate(-50%, -50%)',
    width: 400,
    borderRadius: '10px',
    bgcolor: 'background.paper',
    border: '1px solid #eee',
    boxShadow: 24,
    p: 4,
};

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

function ProfileModal({ User, children }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [pic, setPic] = React.useState('');
    const [picname, setPicname] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const { user, setUser } = ChatState();

    //snackbar logic
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarmessage, setSnackbarmessage] = React.useState('');
    const vertical = 'bottom'
    const horizontal = 'center'

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    //business logic
    const postPicture = (pic) => {
        setLoading(true);
        if (pic === undefined) {
            setSnackbarmessage('Please select an image to upload');
            openSnackbar(true);
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

    const saveProfilePicture = async () => {
        try {
            let config = {
                method: 'post',
                url: '/api/User/changePic',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${User.token}`
                },
                data: { "pic": pic }
            };
            const { data } = await axios.request(config);
            const updatedUserInfo = {
                ...User,
                picture: pic
            };

            setPic('');
            setPicname('');
            setUser(updatedUserInfo);
            localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        }
        catch (e) {
            console.error(e);
            setSnackbarmessage(`Error in updating profile picture`);
            setOpenSnackbar(true);
        }

    }


    return (
        <>
            {children ? <span onClick={handleOpen}> {children}</span> : (
                <IconButton aria-label='Open Information' onClick={handleOpen}>
                    <FaEye />
                </IconButton>

            )}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h5" component="h2">
                        {User.name ? User.name : 'User'}
                    </Typography>
                    <Avatar sx={{ height: "100px", width: "100px" }} alt={User.name ? User.name : "User"} src={User.picture ? User.picture : defaultUserpic} />
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: { xs: '14px', md: '20px' }
                        }}
                    >
                        Email : {User.email ? User.email : 'User Email'}
                    </Typography>

                    {
                        (user._id === User._id) &&
                        <FormControl required={false} fullWidth variant="outlined">
                            <Box sx={{ mt: 2, ml: "auto", display: 'flex', gap: "1rem", alignItems: "center" }}>
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    loading={loading}
                                    disabled={pic}
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
                    }


                    {pic && (
                        <Box>
                            <Button onClick={saveProfilePicture}>Save Changes</Button>
                            <Button onClick={() => {
                                setPic('');
                                setPicname('');
                            }}> Cancel</Button>
                        </Box>
                    )}

                </Box>
            </Modal>

            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={openSnackbar}
                onClose={handleSnackbarClose}
                autoHideDuration={3000}
                message={snackbarmessage}
                key={vertical + horizontal}
            />
        </>
    );
}

export default ProfileModal
