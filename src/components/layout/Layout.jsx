import React from "react";
import Sidebar from "./Sidebar";
import { useMediaQuery } from "@mui/material";
import MobileSidebar from "./MobileSidebar";

const Layout = ({ children }) => {
  const isMobile = useMediaQuery("(max-width:1024px)");

  return (
    <div className="layout">
      <div className="wrapper">
        {isMobile ? <MobileSidebar /> : <Sidebar />}
        <div className="main-content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
