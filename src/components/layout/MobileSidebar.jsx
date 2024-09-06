import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toggleSidebar } from "../../store/layout/layout.slice";
import { resetUser } from "../../store/login/login.slice";
import ConfirmationModal from "../../common/ConfirmationModal";

const menuList = [
  { name: "Wallpapers", path: "/wallpapers" },
  { name: "Live Wallpapers", path: "/live-wallpapers" },
  { name: "Ringtons", path: "/ringtones" },
  { name: "Quotes", path: "/quotes" },
];

const ConfirmationContent = () => {
  return (
    <Typography id="transition-modal-description">
      Are you sure you want to logout?
    </Typography>
  );
};

const MobileSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isShowSidebar = useSelector((state) => state.layout.isShowSidebar);
  const { userInfo } = useSelector((state) => state.login);

  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const [menu, setMenu] = useState(menuList);

  useEffect(() => {
    if (userInfo.isAdmin) {
      setMenu([
        { name: "Dashboard", path: "/" },
        ...menu,
        { name: "Users", path: "/users" },
        { name: "Settings", path: "/settings" },
        { name: "Language Bulk Upload", path: "/settings" },
      ]);
    }
  }, [userInfo.isAdmin]);

  const handleToggleConfirmationModal = (type = "no") => {
    if (type === "yes") {
      localStorage.removeItem("pixtunToken");
      dispatch(resetUser());
      navigate("/login", { replace: true });
    }
    setIsOpenConfirmationModal(!isOpenConfirmationModal);
  };

  const handleLogout = () => {
    dispatch(toggleSidebar());
    setIsOpenConfirmationModal(!isOpenConfirmationModal);
  };

  const handleClickCloseSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div className={`sidebar mobile-sidebar ${isShowSidebar ? "active" : ""}`}>
      <div className="flex justify-end mb-3">
        <span
          className="cursor-pointer text-white"
          onClick={handleClickCloseSidebar}
        >
          <CloseIcon />
        </span>
      </div>

      {menu.map((menu) => (
        <NavLink
          key={menu.path}
          className="nav-link"
          to={menu.path}
          style={({ isActive }) => {
            return {
              backgroundColor: isActive ? "#005E4D" : "",
            };
          }}
          onClick={handleClickCloseSidebar}
        >
          {menu.name}
        </NavLink>
      ))}
      <div className="nav-link" onClick={handleLogout}>
        Logout
      </div>

      <ConfirmationModal
        open={isOpenConfirmationModal}
        handleToggle={handleToggleConfirmationModal}
        btns={["Cancel", "Logout"]}
        content={<ConfirmationContent />}
      />
    </div>
  );
};

export default MobileSidebar;
