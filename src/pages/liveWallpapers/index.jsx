import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Grid } from "@mui/material";

import TopLiveWallpaper from "../../components/liveWallpaper/TopLiveWallpaper";
import PublishedLiveWallpapers from "../../components/liveWallpaper/PublishedLiveWallpapers";
import UnpublishedLiveWallpapers from "../../components/liveWallpaper/UnpublishedLiveWallpapers";
import LiveWallpaperCategories from "../../components/liveWallpaper/LiveWallpaperCategories";
import PopularLiveWallpapers from "../../components/liveWallpaper/PopularLiveWallpapers";
import EditLiveWallpaper from "../../components/liveWallpaper/EditLiveWallpaper";
import Header from "../../common/Header";

const liveWallpaperTabs = [
  "Published Live Wallpapers",
  "Unpublished Live Wallpapers",
  "Popular Live Wallpapers",
  "Top Live Wallpaper Search",
  "Live Wallpaper Categories",
];

const LiveWallpapers = () => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.login);

  const [activeLiveWallpaperTab, setActiveLiveWallpaperTab] = useState("");

  useEffect(() => {
    if (location.state) {
      setActiveLiveWallpaperTab(location.state.component);
    } else if (!userInfo?.isAdmin) {
      setActiveLiveWallpaperTab("Add New Live Wallpaper");
    } else {
      setActiveLiveWallpaperTab("Published Live Wallpapers");
    }
  }, [location.state, userInfo?.isAdmin]);

  const handleChangeLiveWallpaperTab = (tabName) => {
    setActiveLiveWallpaperTab(tabName);
  };

  const getActiveTabComponent = (activeTab) => {
    switch (activeTab) {
      case "Published Live Wallpapers":
        return (
          <PublishedLiveWallpapers
            selectedLanguage={location?.state?.selectedLanguage}
          />
        );
      case "Unpublished Live Wallpapers":
        return (
          <UnpublishedLiveWallpapers
            selectedLanguage={location?.state?.selectedLanguage}
          />
        );
      case "Top Live Wallpaper Search":
        return <TopLiveWallpaper />;
      case "Popular Live Wallpapers":
        return <PopularLiveWallpapers />;
      case "Live Wallpaper Categories":
        return <LiveWallpaperCategories />;
      case "Add New Live Wallpaper":
        return <EditLiveWallpaper title={"Add New Live Wallpaper"} />;
      default:
        return;
    }
  };

  const showBtnOnHeader = [
    "Published Live Wallpapers",
    "Unpublished Live Wallpapers",
    "Popular Live Wallpapers",
  ];

  const headerProps = showBtnOnHeader.includes(activeLiveWallpaperTab)
    ? {
        btnText: "Add New Live Wallpaper",
        onClick: () => handleChangeLiveWallpaperTab("Add New Live Wallpaper"),
      }
    : {};

  return (
    <div className="wallpaper-wrapper flex flex-col h-full">
      <Header title={activeLiveWallpaperTab} {...headerProps} />

      <div className="flex-1 overflow-y-auto">
        {userInfo?.isAdmin && (
          <div className="py-2 px-2 mb-3 rounded-md wallpaper-tabs">
            <Grid
              container
              columns={{ xs: 12, sm: 12, md: 10 }}
              columnSpacing={1}
              rowSpacing={1}
            >
              {liveWallpaperTabs.map((tabName) => (
                <Grid item xs={12} sm={4} md={2} key={tabName}>
                  <div
                    className={`cursor-pointer rounded-md text-center py-2 tab ${
                      tabName === activeLiveWallpaperTab ? "active" : ""
                    }`}
                    onClick={() => handleChangeLiveWallpaperTab(tabName)}
                  >
                    {tabName}
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {getActiveTabComponent(activeLiveWallpaperTab)}
        </div>
      </div>
    </div>
  );
};

export default LiveWallpapers;
