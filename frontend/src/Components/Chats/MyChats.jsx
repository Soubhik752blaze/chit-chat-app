import React from "react";
import { Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
// import { getSender } from "../config/ChatLogics";
import ChatLoading from './../UserAvatar/ChatLoading'
// import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../../Context/ChatProvider";
import Snackbar from '@mui/material/Snackbar';
import { getSender } from "../../Config/ChatLogics";
import GroupChatModal from "../Modals/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [openToast, setOpenToast] = useState(false);
  const [snackbarmessage, setSnackbarmessage] = useState('');
  const vertical = 'bottom'
  const horizontal = 'center'

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenToast(false);
  };

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
      // console.log('fetched Chats', data);
    } catch (error) {
      setSnackbarmessage("Failed to load chats");
      setOpenToast(true);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <>
      <Box
        sx={{
          display: { xs: selectedChat ? 'none' : 'flex', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          px: 2,
          py: 2,
          bgcolor: 'white',
          width: { xs: '100%', md: '31%'},
          borderRadius: '12px',
          borderWidth: '1px',
        }}
      >
        <Box
          sx={{
            pb: 1,
            fontSize: { xs: '20px', md: '24px' },
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          My Chats
          <GroupChatModal>
          <Tooltip title="Create a new group chat" placement="top-end">
            <Button
              size='small'
              onClick={() => { }}
              sx={{
                display: 'flex',
                fontSize: { xs: '18px', lg: '12px' },
                px: 2
              }}
            >
              New Group Chat
            </Button>
          </Tooltip>

          </GroupChatModal>
        </Box>

        {/* render all chats */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            px: 1,
            py: 2,
            bgcolor: '#F8F8F8',
            width: '100%',
            height: '100%',
            borderRadius: '12px',
            overflowY: 'hidden',
          }}
        >
          {chats ? (
            <Stack spacing={1} sx={{ overflowY: 'scroll' }}>
              {chats.map((chat) => (
                <Box
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: selectedChat === chat ? '#38B2AC' : '#E8E8E8',
                    color: selectedChat === chat ? 'white' : 'black',
                    px: 2,
                    py: 1,
                    borderRadius: '12px',
                  }}
                >
                  <Typography sx={{ fontSize: '0.75rem' }} variant="overline" >
                    {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                  </Typography>
                  {chat.latestMessage && (
                    <Typography sx={{ fontSize: '0.6rem' }}>
                      <b>{chat.latestMessage.sender.name} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + '...'
                        : chat.latestMessage.content}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
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
};

export default MyChats;