import { Box, Button, Modal, Typography } from '@mui/material';
import * as React from 'react';

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

const ConfirmationModal = ({ children, text1, text2, Btn1Text, Btn2Text, Btn1Handler, Btn2Handler }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <span onClick={handleOpen}>{children}</span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
            {text1}
          </Typography>

          {text2 && <Typography id="modal-modal-description" sx={{ my: 2 }} variant="body2">
            {text2}
          </Typography>}

          <Box display="flex" gap={2} marginLeft={"auto"} >
            <Button variant='contained' color="success" onClick={Btn1Handler ? Btn1Handler : handleClose}>{Btn1Text}</Button>
            <Button variant='contained' color='error' onClick={Btn2Handler}>{Btn2Text}</Button>
          </Box>

        </Box>


      </Modal>

    </>
  )
}

export default ConfirmationModal