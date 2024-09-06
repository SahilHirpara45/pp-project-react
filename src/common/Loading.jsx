import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

const Loading = ({ isLoading }) => {
  return (
    <div className="z-50">
      <Backdrop open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Loading;
