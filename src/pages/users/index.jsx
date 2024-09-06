import React, { useState } from "react";
import Header from "../../common/Header";
import Administrator from "../../components/users/Administrator";
import Artist from "../../components/users/Artist";
import { Grid } from "@mui/material";

const userTabs = ["Administrator", "Artist"];

const Users = () => {
  const [activeUserTab, setActiveUserTab] = useState("Administrator");

  const handleChangeUserTab = (tabName) => {
    setActiveUserTab(tabName);
  };

  const getActiveTabComponent = (activeTab) => {
    switch (activeTab) {
      case "Administrator":
        return <Administrator />;
      case "Artist":
        return <Artist />;
      default:
        return;
    }
  };

  return (
    <div className="wallpaper-wrapper flex flex-col h-full">
      <Header title="Administrator" />

      <div className="py-2 px-2 mb-3 rounded-md wallpaper-tabs">
        <Grid container columnSpacing={{ xs: 1, sm: 2 }} rowSpacing={1}>
          {userTabs.map((tabName) => (
            <Grid item xs={6} md={3} key={tabName}>
              <div
                className={`cursor-pointer rounded-md text-center py-2 tab ${
                  tabName === activeUserTab ? "active border-none" : ""
                }`}
                onClick={() => handleChangeUserTab(tabName)}
              >
                {tabName}
              </div>
            </Grid>
          ))}
        </Grid>
      </div>

      <div className="flex-1 overflow-y-auto">
        {getActiveTabComponent(activeUserTab)}
      </div>
    </div>
  );
};

export default Users;
