import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <div
      className="h-screen flex flex-col justify-center items-center text-white"
      style={{ backgroundColor: "#2c2d30" }}
    >
      <div className="text-2xl mb-5">Opps Page Not Found !!!</div>
      <Button variant="contained" onClick={navigateBack}>
        Go Back
      </Button>
    </div>
  );
};

export default PageNotFound;
