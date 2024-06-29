import React, { useState, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Box, Button, Snackbar, TextField } from '@mui/material';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserCard from '../UserAvatar/UserCard';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import { modalBoxStyle } from '../../Assets/constants';
import { debounce } from '../../Config/Enhancements';

const style = modalBoxStyle;

function GroupChatModal({ children }) {

    const [groupChatName, setGroupChatName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    // context use
    const { user, setChats, chats } = ChatState();

    // toast specific config
    const vertical = 'bottom';
    const horizontal = 'center';
    const [openToast, setOpenToast] = useState(false);
    const [snackbarmessage, setSnackbarmessage] = useState('');
    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenToast(false);
    };

    // modal use
    const [open, setOpen] = useState(false);

    const resetForm = () => {
        setGroupChatName('');
        setSelectedUsers([]);
        setSearch('');
        setSearchResult([]);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        resetForm();
    }

    const handleSearch = async (query) => {
        if (!query) {
            setSearchResult([]);
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${query}`, config);
            // console.log(data);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            // console.log(error);
            setLoading(false);
        }
    };

    const debouncedHandleSearch = useCallback(debounce(handleSearch, 300), []);

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            setSnackbarmessage("User already added");
            setOpenToast(true);
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleSubmit = async () => {
        if (!groupChatName || selectedUsers.length === 0) {
            setSnackbarmessage("Please Fill all the fields");
            setOpenToast(true);
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                `/api/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config
            );
            setChats([data, ...chats]);
            handleClose();
            setSnackbarmessage("New Group Chat Created!");
            setOpenToast(true);
        } catch (error) {
            setSnackbarmessage(error.response.message ? error.response.message : "Error while creating group chat");
            setOpenToast(true);
        }
    };

    const handleDelete = (userToDelete) => {
        let newUsersArray = selectedUsers.filter((user) => user._id !== userToDelete._id);
        setSelectedUsers(newUsersArray);
    };

    return (
        <>
            <span onClick={handleOpen}> {children}</span>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} component="form">
                    <Typography id="group-modal-title" variant="h5" component="h2" sx={{ mb: 3 }}>
                        Create Group Chat
                    </Typography>
                    <TextField id="outlined-basic" placeholder="Chat Name" variant="outlined" size="small" sx={{ mb: 2 }}
                        value={groupChatName}
                        onChange={(e) => { setGroupChatName(e.target.value); }} />
                    <TextField id="outlined-basic" placeholder="Add Users" variant="outlined" size="small" sx={{ mb: 1 }}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            debouncedHandleSearch(e.target.value);
                        }} />

                    {/* selected users  */}
                    <Box sx={{ width: '100%', display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
                        {selectedUsers.map((user) => (
                            <UserBadgeItem
                                key={user._id}
                                user={user}
                                handleFunction={() => handleDelete(user)}
                            />
                        ))}
                    </Box>
                    {/* render searched users */}
                    {loading ? (<div style={{ margin: "auto" }}> Loading...</div>) : (
                        searchResult?.slice(0, 4).map((user) => (
                            <UserCard
                                key={user._id}
                                user={user}
                                handleFunction={() => handleGroup(user)}
                            />
                        ))
                    )}

                    <Button onClick={handleSubmit} variant='contained' size='medium' sx={{ width: '8rem', marginLeft: 'auto', marginBottom: 0, marginTop: "0.5rem" }}>
                        Create Chat
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
        </>
    );
}

export default GroupChatModal;