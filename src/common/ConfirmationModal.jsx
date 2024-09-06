import React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 3,
};

const ConfirmationModal = ({
  open,
  handleToggle,
  btns,
  content,
  modalClass = "",
}) => {
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        // onClose={handleToggle}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box className={`w-full max-w-sm ${modalClass}`} sx={style}>
            <div className="mb-7 confirmation-content">{content}</div>
            <div className="flex justify-end">
              <Button variant="contained" onClick={handleToggle}>
                {btns[0]}
              </Button>
              <Button
                sx={{ marginLeft: "10px" }}
                color="success"
                variant="contained"
                onClick={() => handleToggle("yes")}
              >
                {btns[1]}
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ConfirmationModal;
