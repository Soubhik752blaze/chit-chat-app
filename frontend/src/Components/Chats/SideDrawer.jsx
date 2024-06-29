import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Box, Button, CircularProgress, Menu, MenuItem, MenuList, Tooltip, Typography, useMediaQuery } from '@mui/material'
import Divider from '@mui/material/Divider';
import { ChatState } from "../../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { FaSearch } from "react-icons/fa";
import { defaultUserpic } from "../../Assets/constants"
import { IoIosNotifications } from "react-icons/io";
import ProfileModal from "../Modals/ProfileModal";
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import ChatLoading from '../UserAvatar/ChatLoading'
import UserCard from "../UserAvatar/UserCard";
import NotificationBadge, { Effect } from 'react-notification-badge';
import io from 'socket.io-client'
import ConfirmationModal from "../Modals/ConfirmationModal";

const ENDPOINT = "http://localhost:5000";
var socket;

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [snackbarmessage, setSnackbarmessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const navigate = useNavigate();

  //context use
  const { setSelectedChat, user, setUser, notifications, setNotifications, chats, setChats } = ChatState();

  //mui specific states and functions
  const vertical = 'bottom'
  const horizontal = 'center'
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [anchorEl2, setAnchorEl2] = useState(null);
  const openNotification = Boolean(anchorEl2);

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenToast(false);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpenDrawer(newOpen);
    resetForm();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl2(null);
  };

  const handleSearch = async () => {
    if (!search) {
      setSnackbarmessage('Please Enter something in search');
      setOpenToast(true);
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      if (error.response.request.status == 401) {
        setSnackbarmessage("Session timeout!! Redirecting to Login");
        setOpenToast(true);
        setTimeout(() => {
          localStorage.removeItem("userInfo");
          setUser({});
          navigate("/")
        }, 3500)
        return;
      }
      setSnackbarmessage("Error Occured");
      setOpenToast(true);
      setLoading(false);
    }
  }

  const accessChat = async (userId) => {
    // console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      //if chat is already present, then keep the chat at the front of all the chats
      if (!chats.find((c) => c._id === data._id))
        setChats([data, ...chats]);
      // console.log(data);
      setSelectedChat(data);
      setLoadingChat(false);
      setOpenDrawer(false);
    } catch (error) {
      if (error.response.request.status == 401) {
        setSnackbarmessage("Session timeout!! Redirecting to Login");
        setOpenToast(true);
        setTimeout(() => {
          localStorage.removeItem("userInfo");
          setUser({});
          navigate("/")
        }, 3500)
        return;
      }
      setSnackbarmessage("Error Occured while loading the chat");
      setOpenToast(true);
      setLoadingChat(false);
    }
  };


  //business logic
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const fetchNotifications = async () => {
    try {
      let config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get('/api/notification/', config);
      if (response.status !== 200)
        throw new Error('Failed to fetch notifications')
      const notificationsArray = response.data;
      // console.log('notificationsArray', notificationsArray)
      setNotifications(notificationsArray);
    } catch (error) {
      console.error(error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: 'api/notification/markAllasRead',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.request(config)
      if (!data.success)
        throw new Error('Failed to mark all notifications as read')
      setNotifications([])
      return;
    } catch (error) {
      console.error(error);
      setSnackbarmessage('Failed to mark all notifications as read');
      setOpenToast(true);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      let config = {
        method: 'patch',
        url: '/api/notification/markasRead',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        data: { "notificationId": notificationId }
      };
      const { data } = await axios.request(config)
      // console.log(data);
      if (!data.success)
        throw new Error('Failed to mark notifications as read')
      setNotifications(notifications.filter((notification) => notification._id !== notificationId))
    } catch (error) {
      console.error(error);
      setSnackbarmessage(error.message);
      setOpenToast(true);
    }
  };

  const resetForm = () => {
    setSearch('');
    setSearchResult([]);
};


  //useEffects
  useEffect(() => {
    //establish socket connection
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    if (!notifications.length)
      fetchNotifications();
  }, [])

  useEffect(() => {
    if (!socketConnected)
      return;
    socket.on("new notification", (newNotification) => {
      // Show a notification to the user
      // For simplicity, let's assume you have a function showNotification(message) that displays the notification
      setNotifications((notifications) => [newNotification, ...notifications]);
    });

    return () => {
      socket.off("new notification");
    };
  }, [socketConnected]);


  //Drawer Component
  const DrawerList = (
    <Box sx={{ width: 300 }} role="presentation">
      <Typography variant='h6' component='h6' p="5px 20px">
        Search Users
      </Typography>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 0.5 },
          display: 'flex'
        }}
        noValidate
        autoComplete="off"
      >
        <TextField id="outlined-basic" placeholder="Search for users to chat" variant="outlined" size="small"
          value={search}
          onChange={(e) => { setSearch(e.target.value) }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && search){
              e.preventDefault();
              handleSearch();
            } 
          }} />
        <Button sx={{ backgroundColor: 'eee', padding: "2px", margin: "0" }} size="small" onClick={handleSearch}>Go</Button>
      </Box>
      <Divider />
      {loading ? (<ChatLoading />) :
        (
          searchResult?.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              handleFunction={() => accessChat(user._id)}
            />
          )))
      }
      {loadingChat && <CircularProgress variant="indeterminate" sx={{ ml: '8rem', mt: "1rem" }} />}
    </Box>
  );

  // console.log(notifications)
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ background: "white", borderWidth: "5px" }}
        width="100%"
        p="5px 10px"
      >
        <Tooltip title="Search Users to chat" placement="bottom-end">
          <Button onClick={toggleDrawer(true)}>
            <FaSearch />
            <Typography display={isMdUp ? 'flex' : 'none'} px={2}
            >
              Search User
            </Typography>
          </Button>
        </Tooltip>

        <Typography variant='h6'>
          Chat-Chat
        </Typography>

        <div style={{ marginRight: "10px" }}>

          <Button
            id="notification-button"
            aria-controls={openNotification ? 'notification-menu' : undefined}
            aria-haspopup="true"
            color="secondary"
            aria-expanded={openNotification ? 'true' : undefined}
            onClick={handleNotificationClick}
            sx={{ position: 'relative' }}
          >

            <IoIosNotifications size={25} />
            {notifications.length !== 0 &&
              <div style={{ zIndex: 10, position: 'absolute', top: 0, right: 10 }}>
                <NotificationBadge count={notifications.length} effect={Effect.SCALE} />
              </div>}
          </Button>
          <Menu
            id="notifications-menu"
            anchorEl={anchorEl2}
            open={openNotification}
            onClose={handleNotificationClose}
            MenuListProps={{
              'aria-labelledby': 'notifications-button',
            }}
          >
            <MenuList sx={{ px: !notifications.length ? 2 : 0, pb: !notifications.length ? 1 : 0, my: 0, display: 'flex', flexDirection: 'column', fontSize: '12px', overflowY: "scroll" }}>
              {notifications.length == 0 && "No New Messages"}
              {
                notifications.length != 0 &&
                (notifications.map((n) =>
                (<MenuItem key={n._id} sx={{ fontWeight: 'bold', backgroundColor: '#F8F8F8', mx: 1, mb: 1, px: 2, borderRadius: '10px', fontSize: '12px' }}
                  onClick={() => {
                    setSelectedChat(n.chat);
                    markNotificationAsRead(n._id);
                    handleNotificationClose();
                  }}
                >
                  {/* New Message */}
                  {n.chat.isGroupChat ?
                    `New Message in Group - ${n.chat.chatName}` :
                    n.message}
                </MenuItem>)
                ))
              }
              {notifications.length != 0 &&
                <Button variant='text' sx={{ width: '6rem', ml: 'auto', mr: 1, fontSize: '12px' }} onClick={markAllNotificationsAsRead}>
                  Clear All
                </Button>}

            </MenuList>

          </Menu>

          <Button
            id="menu-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            color="secondary"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <Avatar sx={{ height: "24px", width: "24px" }} alt={user.name ? user.name : "User"} src={user.picture ? user.picture : defaultUserpic} />
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <ProfileModal User={user}>
              <MenuItem p={1}>
                Profile
              </MenuItem>
            </ProfileModal>

            <ConfirmationModal text1={"Logout Account"} text2={"Are you sure you want to log out? Once you logout you need to login again. Are you Ok?"}
              Btn1Text={"Cancel"} Btn2Text={"Yes, Logout!"} Btn2Handler={logoutHandler}>
              <MenuItem p={1}>
                Logout
              </MenuItem>
            </ConfirmationModal>

          </Menu>
        </div>
      </Box >

      {/* Side Drawer  */}
      < Drawer open={openDrawer} onClose={toggleDrawer(false)} >
        {DrawerList}
      </Drawer >

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

export default SideDrawer;