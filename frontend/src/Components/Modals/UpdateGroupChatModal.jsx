import React, { useState } from 'react'
import { modalBoxStyle } from '../../Assets/constants'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Button, CircularProgress, FormControl, IconButton, Snackbar, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import { FaEye } from 'react-icons/fa';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserCard from '../UserAvatar/UserCard';
const style = modalBoxStyle


const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {

    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);

    //context use
    const { selectedChat, setSelectedChat, user } = ChatState();

    //modal use
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //snackbar use
    const vertical = 'bottom'
    const horizontal = 'center'
    const [openToast, setOpenToast] = useState(false);
    const [snackbarmessage, setSnackbarmessage] = useState('');
    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenToast(false);
    };

    //business logic
    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            setSnackbarmessage("Only admins can remove someone!");
            setOpenToast(true);
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers:
                {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put(
                `/api/chat/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            //if user removes himself, the selected chat shouldnt be visible anymore, else it should be same
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            setSnackbarmessage(error.response.data.message ? error.response.data.message : "Error Occured!");
            setOpenToast(true);
            setRenameLoading(false);
        }
    }

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            setSearchResult([]);
            return;
        }

        try {
            setLoading(true);
            let config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            // console.log(data);
            setLoading(false);
            setSearchResult(data);
        }
        catch (error) {
            // console.log(error);
            setLoading(false);
        }

    }

    const handleAddUser = async (user1) => {
        // console.log(selectedChat.users);
        // console.log(user1._id);
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            setSnackbarmessage("User Already in group!");
            setOpenToast(true);
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            setSnackbarmessage("Only Admins can add someone");
            setOpenToast(true);
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers:
                {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put(
                `/api/chat/groupadd`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            //if user removes himself, the selected chat shouldnt be visible anymore, else it should be same
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            setSnackbarmessage(error.response.data.message ? error.response.data.message : "Error Occured!");
            setOpenToast(true);
            setRenameLoading(false);
        }
    }

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/rename`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );

            // console.log(data._id);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            setSnackbarmessage("Error Occured!");
            setOpenToast(true);
            setRenameLoading(false);
        }
        setGroupChatName("");
    };


    return (
        <div>
            <IconButton aria-label='Open Group Settings' onClick={handleOpen}>
                <FaEye />
            </IconButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="updateGroupChatModal"
                aria-describedby="Modal to update a group chat settings"
            >
                <Box sx={style}>
                    <Typography id="ChatName" variant="h6" component="h2" sx={{ mb: 2 }}>
                        {selectedChat.chatName}
                    </Typography>

                    {/* Group chat Users  */}
                    <Box sx={{ width: '100%', display: 'flex', gap: '2px', flexWrap: 'wrap', mt: '1rem' }} >

                        {selectedChat?.users.map((u) => (
                            <UserBadgeItem
                                key={u._id}
                                user={u}
                                handleFunction={() => handleRemove(u)}
                            />
                        ))
                        }
                    </Box>

                    <FormControl sx={{ display: 'flex', width: '100%', flexDirection: 'row', alignItems: 'center', mt: 2 }}>
                        <TextField id="outlined-basic" placeholder="Chat Name" variant="outlined" size="small" sx={{ width: '100%' }}
                            value={groupChatName}
                            onChange={(e) => setGroupChatName(e.target.value)} />
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ ml: 1 }}
                            onClick={handleRename}
                            disabled={renameloading}
                        >
                            {renameloading ? <CircularProgress size={24} /> : 'Update'}
                        </Button>
                    </FormControl>
                    <FormControl sx={{ mt: 1 }}>
                        <TextField id="outlined-basic" placeholder="Add User to group" variant="outlined" size="small"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)} />
                    </FormControl>

                    {/* search Results  */}
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : (
                        searchResult?.map((u) => (
                            <UserCard
                                key={u._id}
                                user={u}
                                handleFunction={() => handleAddUser(u)}
                            />
                        ))
                    )}

                    {/* Leave Group  */}
                    <Button onClick={() => handleRemove(user)} variant='contained' color='error' size='medium' sx={{ padding: '0.5rem 1rem', marginLeft: 'auto', marginBottom: 0, marginTop: "2.5rem" }}>
                        Leave Group
                    </Button>
                </Box>


            </Modal>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={openToast}
                onClose={handleCloseToast}
                autoHideDuration={3000}
                message={snackbarmessage}
                key={vertical + horizontal}
            />
        </div>
    );
}

export default UpdateGroupChatModal