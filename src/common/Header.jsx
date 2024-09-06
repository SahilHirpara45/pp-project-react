import React from "react";
import { useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../store/layout/layout.slice";

const Header = ({ title, btnText = "", onClick = () => {} }) => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:1024px)");

  const handleClickOpenSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div className="header">
      <div className="flex items-center">
        {isMobile && (
          <div
            className="mr-3 cursor-pointer flex items-center"
            onClick={handleClickOpenSidebar}
          >
            <MenuIcon />
          </div>
        )}
        <div>{title}</div>
      </div>
      {btnText && <button onClick={onClick}>{btnText}</button>}
    </div>
  );
};

export default Header;
