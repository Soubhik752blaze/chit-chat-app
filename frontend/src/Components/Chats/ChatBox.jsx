import React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { ChatState } from '../../Context/ChatProvider';
import SingleChat from './SingleChat';

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: { xs: selectedChat ? 'flex' : 'none', md: 'flex' },
        alignItems: 'center',
        flexDirection: 'column',
        py: 2,
        px: 1,
        backgroundColor: 'white',
        width: { xs: '100%', md: '68%' },
        borderRadius: theme.shape.borderRadius,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.divider,
      }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
