import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import { Box, CircularProgress, IconButton, Snackbar, TextField, Typography } from '@mui/material';
import { IoMdArrowBack } from "react-icons/io";
import ProfileModal from '../Modals/ProfileModal';
import { getSender, getSenderFull } from '../../Config/ChatLogics';
import UpdateGroupChatModal from '../Modals/UpdateGroupChatModal';
import axios from 'axios';
import styles from './style.module.css'
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'
import { useNavigate } from 'react-router-dom';

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const { selectedChat, setSelectedChat, user, setUser, } = ChatState();
  const navigate = useNavigate();

  useEffect(() => {
    //establish socket connection
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
  }, [])

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessage) => {
      // console.log('newMessage', newMessage)
      // console.log('selectedChatCompare', selectedChatCompare);
      if (!selectedChatCompare || selectedChatCompare._id !== newMessage.chat._id) {
        //if chat is not selected or doesn't match current chat then give notification
        setFetchAgain((fetchAgain) => !fetchAgain);
      } else {
        // console.log('Updating selected Chat messages')
        setMessages((messages) => [...messages, newMessage]);
      }


      // Cleanup function to remove the event listener when the component unmounts
      return () => {
        socket.off("message recieved");
      };
    });
  }, []);

  //snackbar logic
  const [open, setOpen] = useState(false);
  const [snackbarmessage, setSnackbarmessage] = useState('');
  const vertical = 'bottom'
  const horizontal = 'center'


  //business logic
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const fetchMessages = async () => {
    if (!selectedChat)
      return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      // console.log(data);
      setMessages(data);
      setLoading(false);

      //use socket.io to join the chat room
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      if (error.response.request.status == 401) {
        setSnackbarmessage("Session timeout!! Redirecting to Login");
        setOpen(true);
        setTimeout(() => {
          localStorage.removeItem("userInfo");
          setUser({});
          navigate("/")
        }, 3500)
        return;
      }
      setOpen(true);
      setSnackbarmessage("Failed to load messages");
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        //doesnot invoke immediately as the state change is batched
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        // console.log(data);
        // console.log(messages);

        socket.emit("new message", data);
        setMessages([...messages, data]);

      } catch (error) {
        if (error.response.request.status == 401) {
          setSnackbarmessage("Session timeout!! Redirecting to Login");
          setOpen(true);
          setTimeout(() => {
            localStorage.removeItem("userInfo");
            setUser({});
            navigate("/")
          }, 3500)
          return;
        }
        setOpen(true);
        setSnackbarmessage("Failed to send the Message");
      }
    }
    else
      return;

  };

  //using as a closure to implement debouncing
  const typingHandler = (() => {
    let typingTimeout;

    return (e) => {
      setNewMessage(e.target.value);

      //typing indicator logic
      if (!socketConnected) return;

      if (!typing) {
        setTyping(true);
        socket.emit("typing", selectedChat._id);
      }

      var timerLength = 5000;

      // Clear the existing timeout if it exists
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      // Set a new timeout
      typingTimeout = setTimeout(() => {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }, timerLength);
    };
  })();

  return (
    <>
      {selectedChat ?
        (
          <>
            {/* Header Section */}
            <Typography
              variant="h5"
              sx={{
                pb: 1,
                px: 2,
                width: '100%',
                display: 'flex',
                justifyContent: { xs: 'space-between' },
                alignItems: 'center',
              }}
            >
              {/* Back Button  */}
              <IconButton color="secondary"
                sx={{ display: { xs: 'flex', md: 'none' } }}
                onClick={() => setSelectedChat('')}
              >
                <IoMdArrowBack />
              </IconButton>

              {/* Chat Name  */}
              {
                (!selectedChat.isGroupChat ? (
                  <>
                    {getSender(user, selectedChat.users)}
                    <ProfileModal User={getSenderFull(user, selectedChat.users)} />
                  </>
                ) : (
                  <>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                  </>
                ))}
            </Typography>

            {/* Chat Content  */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                p: 3,
                bgcolor: '#E8E8E8',
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                overflowY: 'hidden',
              }}
            >
              {
                !loading ? (<div className={styles.messages}>
                  <ScrollableChat messages={messages} istyping={istyping} />
                </div>) :
                  < CircularProgress size={36} sx={{ margin: "auto", alignSelf: "center" }} />
              }


              {/* Input for typing message  */}
              <TextField id="outlined-basic" placeholder="Enter a message" variant="outlined" size="small"
                sx={{ backgroundColor: "#F8F8F8", mt: 2 }}
                onKeyDown={sendMessage}
                value={newMessage}
                onChange={typingHandler} />
            </Box>
          </>
        )
        :
        (<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="body1" sx={{ pb: 3 }}>
            Click on a user to start chatting
          </Typography>
        </Box>)}

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

export default SingleChat