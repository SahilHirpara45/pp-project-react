import React, { useState } from "react";
import LanguageSettings from "../../components/settings/LanguageSettings";
import Licenses from "../../components/settings/Licenses";
import OtherSettings from "../../components/settings/OtherSettings";
import Pages from "../../components/settings/Pages";
import Header from "../../common/Header";
import { Grid } from "@mui/material";
import ADS from "../../components/settings/ADS";

const settingTabs = [
  "Pages",
  "Language Settings",
  "Licenses",
  "Other Settings",
  "ADS",
];

const Settings = () => {
  const [activeSettingTab, setActiveSettingTab] = useState("Pages");

  const handleChangeSettingTab = (tabName) => {
    setActiveSettingTab(tabName);
  };

  const getActiveTabComponent = (activeTab) => {
    switch (activeTab) {
      case "Pages":
        return <Pages />;
      case "Language Settings":
        return <LanguageSettings />;
      case "Licenses":
        return <Licenses />;
      case "Other Settings":
        return <OtherSettings />;
      case "ADS":
        return <ADS />;
      default:
        return;
    }
  };

  return (
    <div className="wallpaper-wrapper flex flex-col h-full">
      <Header title="Administrator" />

      <div className="py-2 px-2 mb-3 rounded-md wallpaper-tabs">
        <Grid container columnSpacing={{ xs: 1, sm: 2 }} rowSpacing={1}>
          {settingTabs.map((tabName) => (
            <Grid item xs={12} sm={6} md={2} key={tabName}>
              <div
                className={`cursor-pointer rounded-md text-center py-2 tab ${
                  tabName === activeSettingTab ? "active" : ""
                }`}
                onClick={() => handleChangeSettingTab(tabName)}
              >
                {tabName}
              </div>
            </Grid>
          ))}
        </Grid>
      </div>

      <div className="flex-1 overflow-y-auto">
        {getActiveTabComponent(activeSettingTab)}
      </div>
    </div>
  );
};

export default Settings;
