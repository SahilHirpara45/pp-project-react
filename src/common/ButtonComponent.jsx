import { Button } from "@mui/material";
import React from "react";

const ButtonComponent = ({
  btnClass = "",
  btnText = "",
  btnType = "button",
  onClick = () => {},
  variant = "contained",
  isDisabled = false,
}) => {
  return (
    <Button
      variant={variant}
      type={btnType}
      className={`!m-1 ${btnClass}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {btnText}
    </Button>
  );
};

export default ButtonComponent;
