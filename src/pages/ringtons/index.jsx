import React, { useEffect, useState } from "react";
import Header from "../../common/Header";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Grid } from "@mui/material";
import EditRington from "../../components/rington/EditRington";
import PublishedRingtons from "../../components/rington/PublishedRingtons";
import UnpublishedRingtons from "../../components/rington/UnpublishedRingtones";
import TopRingtons from "../../components/rington/TopRingtons";
import PopularRingtons from "../../components/rington/PopularRingtons";
import RingtonCategories from "../../components/rington/RingtonCategories";

const ringtonsTabs = [
  "Published Ringtones",
  "Unpublished Ringtones",
  "Top Ringtones Search",
  "Popular Ringtones",
  "Ringtones Categories",
];

const Ringtons = () => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.login);

  const [activeRingtonTab, setActiveRingtonTab] = useState("");
  // const [tabs, setTabs] = useState(wallpaperTabs);
  // useEffect(() => {
  //   console.log();
  //   if (!userInfo?.isAdmin) {
  //     setActiveRingtonTab("Add New Wallpaper");
  //   }
  // }, [userInfo?.isAdmin]);

  useEffect(() => {
    if (location.state) {
      setActiveRingtonTab(location.state.component);
    } else if (!userInfo?.isAdmin) {
      setActiveRingtonTab("Add New Ringtone");
    } else {
      setActiveRingtonTab("Published Ringtones");
    }
  }, [location.state, userInfo?.isAdmin]);
  const handleChangeRingtonTab = (tabName) => {
    setActiveRingtonTab(tabName);
  };

  const getActiveTabComponent = (activeTab) => {
    switch (activeTab) {
      case "Published Ringtones":
        return (
          <PublishedRingtons
            selectedLanguage={location?.state?.selectedLanguage}
          />
        );
      case "Unpublished Ringtones":
        return (
          <UnpublishedRingtons
            selectedLanguage={location?.state?.selectedLanguage}
          />
        );
      case "Top Ringtones Search":
        return <TopRingtons />;
      case "Popular Ringtones":
        return <PopularRingtons />;
      case "Ringtones Categories":
        return <RingtonCategories />;
      case "Add New Ringtone":
        return <EditRington title={"Add New Ringtone"} />;
      default:
        return;
    }
  };

  const showBtnOnHeader = [
    "Published Ringtones",
    "Unpublished Ringtones",
    "Popular Ringtones",
  ];

  const headerProps = showBtnOnHeader.includes(activeRingtonTab)
    ? {
        btnText: "Add New Ringtone",
        onClick: () => handleChangeRingtonTab("Add New Ringtone"),
      }
    : {};

  return (
    <div className="wallpaper-wrapper flex flex-col h-full">
      <Header title={activeRingtonTab} {...headerProps} />

      <div className="flex-1 overflow-y-auto">
        {userInfo?.isAdmin && (
          <div className="py-2 px-2 mb-3 rounded-md wallpaper-tabs">
            <Grid
              container
              columns={{ xs: 12, sm: 12, md: 10 }}
              columnSpacing={1}
              rowSpacing={1}
            >
              {ringtonsTabs.map((tabName) => (
                <Grid item xs={12} sm={4} md={2} key={tabName}>
                  <div
                    className={`cursor-pointer rounded-md text-center py-2 tab ${
                      tabName === activeRingtonTab ? "active" : ""
                    }`}
                    onClick={() => handleChangeRingtonTab(tabName)}
                  >
                    {tabName}
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {getActiveTabComponent(activeRingtonTab)}
          {/* Ringtons */}
        </div>
      </div>
    </div>
  );
};

export default Ringtons;
