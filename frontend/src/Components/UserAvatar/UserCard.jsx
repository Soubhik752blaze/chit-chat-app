import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';

function UserCard({ user, handleFunction }) {

  return (
    <Box
      onClick={handleFunction}
      sx={{
        cursor: 'pointer',
        bgcolor: '#E8E8E8',
        display: 'flex',
        alignItems: 'center',
        color: 'black',
        paddingX: 2,
        paddingY: 1,
        marginTop: '0.5rem',
        marginX: 2,
        borderRadius: '12px',
        '&:hover': {
          backgroundColor: '#20a7db',
          color: 'white',
        },
      }}
    >
      <Avatar 
        sx={{ marginRight: 2, cursor: 'pointer' }} 
        size="small" 
        alt={user.name} 
        src={user.picture} 
      />
      <Box>
        <Typography variant="body1" sx={{fontSize: {xs: '12px', sm: '16px'},}} >
          {user.name}
        </Typography>
        <Typography variant="caption" sx={{fontSize: {xs: '10px', sm: '14px'},}}>
          <b>Email : {user.email}</b>
        </Typography>
      </Box>
    </Box>
  );
}

export default UserCard;
