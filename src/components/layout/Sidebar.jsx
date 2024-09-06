import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { resetUser } from "../../store/login/login.slice";
import { Typography } from "@mui/material";
import ConfirmationModal from "../../common/ConfirmationModal";

const menuList = [
  { name: "Wallpapers", path: "/wallpapers" },
  { name: "Live Wallpapers", path: "/live-wallpapers" },
  { name: "Ringtones", path: "/ringtones" },
  { name: "Quotes", path: "/quotes" },
];

const ConfirmationContent = () => {
  return (
    <Typography id="transition-modal-description">
      Are you sure you want to logout?
    </Typography>
  );
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.login);
  console.log(userInfo, "userInfo in sidebar");
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const [menu, setMenu] = useState(menuList);

  useEffect(() => {
    if (userInfo?.isAdmin) {
      setMenu([
        { name: "Dashboard", path: "/" },
        ...menu,
        { name: "Users", path: "/users" },
        { name: "Settings", path: "/settings" },
        { name: "Language Bulk Upload", path: "/language-bulk-upload" },
      ]);
    }
  }, [userInfo?.isAdmin]);

  const handleToggleConfirmationModal = (type = "no") => {
    if (type === "yes") {
      localStorage.removeItem("pixtunToken");
      dispatch(resetUser());
      navigate("/login", { replace: true });
    }
    setIsOpenConfirmationModal(!isOpenConfirmationModal);
  };

  const handleLogout = () => {
    setIsOpenConfirmationModal(!isOpenConfirmationModal);
  };

  return (
    <div className="sidebar">
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

export default Sidebar;
