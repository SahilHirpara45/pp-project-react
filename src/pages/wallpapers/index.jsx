import React, { useEffect, useState } from "react";
import TopWallpaper from "../../components/wallpaper/TopWallpaper";
import PublishedWallpapers from "../../components/wallpaper/PublishedWallpapers";
import UnpublishedWallpapers from "../../components/wallpaper/UnpublishedWallpapers";
import WallpaperCategories from "../../components/wallpaper/WallpaperCategories";
import PopularWallpapers from "../../components/wallpaper/PopularWallpapers";
import EditWallpaper from "../../components/wallpaper/EditWallpaper";
import Header from "../../common/Header";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Grid } from "@mui/material";

const wallpaperTabs = [
  "Published Wallpapers",
  "Unpublished Wallpapers",
  "Popular Wallpapers",
  "Top Wallpaper Search",
  "Wallpaper Categories",
];

const Wallpaper = () => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.login);
  console.log(location.state, "userInfo in wallpaper");

  const [activeWallpaperTab, setActiveWallpaperTab] = useState("");
  // const [tabs, setTabs] = useState(wallpaperTabs);
  // useEffect(() => {
  //   console.log();
  //   if (!userInfo?.isAdmin) {
  //     setActiveWallpaperTab("Add New Wallpaper");
  //   }
  // }, [userInfo?.isAdmin]);

  useEffect(() => {
    if (location.state) {
      console.log(location.state, "location state");
      setActiveWallpaperTab(location.state.component);
    } else if (!userInfo?.isAdmin) {
      setActiveWallpaperTab("Add New Wallpaper");
    } else {
      setActiveWallpaperTab("Published Wallpapers");
    }
  }, [location.state, userInfo?.isAdmin]);
  const handleChangeWallpaperTab = (tabName) => {
    setActiveWallpaperTab(tabName);
  };

  const getActiveTabComponent = (activeTab) => {
    switch (activeTab) {
      case "Published Wallpapers":
        return (
          <PublishedWallpapers
            selectedLanguage={location?.state?.selectedLanguage}
          />
        );
      case "Unpublished Wallpapers":
        return (
          <UnpublishedWallpapers
            selectedLanguage={location?.state?.selectedLanguage}
          />
        );
      case "Top Wallpaper Search":
        return <TopWallpaper />;
      case "Popular Wallpapers":
        return <PopularWallpapers />;
      case "Wallpaper Categories":
        return <WallpaperCategories />;
      case "Add New Wallpaper":
        return <EditWallpaper title={"Add New Wallpaper"} />;
      default:
        return;
    }
  };

  const showBtnOnHeader = [
    "Published Wallpapers",
    "Unpublished Wallpapers",
    "Popular Wallpapers",
  ];

  const headerProps = showBtnOnHeader.includes(activeWallpaperTab)
    ? {
        btnText: "Add New Wallpaper",
        onClick: () => handleChangeWallpaperTab("Add New Wallpaper"),
      }
    : {};

  return (
    <div className="wallpaper-wrapper flex flex-col h-full">
      <Header title={activeWallpaperTab} {...headerProps} />

      <div className="flex-1 overflow-y-auto">
        {userInfo?.isAdmin && (
          <div className="py-2 px-2 mb-3 rounded-md wallpaper-tabs">
            <Grid
              container
              columns={{ xs: 12, sm: 12, md: 10 }}
              columnSpacing={1}
              rowSpacing={1}
            >
              {wallpaperTabs.map((tabName) => (
                <Grid item xs={12} sm={4} md={2} key={tabName}>
                  <div
                    className={`cursor-pointer rounded-md text-center py-2 tab ${
                      tabName === activeWallpaperTab ? "active" : ""
                    }`}
                    onClick={() => handleChangeWallpaperTab(tabName)}
                  >
                    {tabName}
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {getActiveTabComponent(activeWallpaperTab)}
        </div>
      </div>
    </div>
  );
};

export default Wallpaper;
