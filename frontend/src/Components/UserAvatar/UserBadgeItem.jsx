import * as React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Avatar } from '@mui/material';

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <Stack direction="row" >
            <Chip color="success" label={user.name} avatar={<Avatar alt={user.name} src={user.picture} />} sx={{ cursor: 'pointer', fontSize: "12px" }}
                onDelete={handleFunction} />
        </Stack>
    );
}

export default UserBadgeItem;