import React, { useState } from "react";
import LanguageSettings from "../../components/settings/LanguageSettings";
import Licenses from "../../components/settings/Licenses";
import Header from "../../common/Header";
import { Grid } from "@mui/material";
import WallpaperBulkUpload from "../../components/languageBulkUpload/WallpaperBulkUpload";
import LiveWallpaperBulkUpload from "../../components/languageBulkUpload/LiveWallpaperBulkUpload";
import RingtoneBulkUpload from "../../components/languageBulkUpload/RingtoneBulkUpload";

const settingTabs = ["Wallpaper", "Live Wallpaper", "Ringtone"];

const LanguageBulkUpload = () => {
  const [activeSettingTab, setActiveSettingTab] = useState("Wallpaper");

  const handleChangeSettingTab = (tabName) => {
    setActiveSettingTab(tabName);
  };

  const getActiveTabComponent = (activeTab) => {
    switch (activeTab) {
      case "Wallpaper":
        return <WallpaperBulkUpload />;
      case "Live Wallpaper":
        return <LiveWallpaperBulkUpload />;
      case "Ringtone":
        return <RingtoneBulkUpload />;
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

export default LanguageBulkUpload;
