import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";

import PublishedQuotes from "../../components/quotes/PublishedQuotes";
import UnpublishedQuotes from "../../components/quotes/UnpublishedQuotes";
import PopularQuotes from "../../components/quotes/PopularQuotes";
import TopQuotes from "../../components/quotes/TopQuotes";
import QuotesCategories from "../../components/quotes/QuotesCategories";
import EditQuote from "../../components/quotes/EditQuote";
import Header from "../../common/Header";

const quoteTabs = [
  "Published Quotes",
  "Unpublished Quotes",
  "Popular Quotes",
  "Top Quotes Search",
  "Quotes Categories",
];

const Quotes = () => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.login);

  const [activeQuoteTab, setActiveQuoteTab] = useState("");

  useEffect(() => {
    if (location.state) {
      setActiveQuoteTab(location.state.component);
    } else if (!userInfo?.isAdmin) {
      setActiveQuoteTab("Add New Quote");
    } else {
      setActiveQuoteTab("Published Quotes");
    }
  }, [location.state, userInfo?.isAdmin]);

  const handleChangeQuoteTab = (tabName) => {
    setActiveQuoteTab(tabName);
  };

  const getActiveTabComponent = (activeTab) => {
    switch (activeTab) {
      case "Published Quotes":
        return (
          <PublishedQuotes
            selectedLanguage={location?.state?.selectedLanguage}
          />
        );
      case "Unpublished Quotes":
        return (
          <UnpublishedQuotes
            selectedLanguage={location?.state?.selectedLanguage}
          />
        );
      case "Top Quotes Search":
        return <TopQuotes />;
      case "Popular Quotes":
        return <PopularQuotes />;
      case "Quotes Categories":
        return <QuotesCategories />;
      case "Add New Quote":
        return <EditQuote title={"Add New Quote"} />;
      default:
        return;
    }
  };

  const showBtnOnHeader = [
    "Published Quotes",
    "Unpublished Quotes",
    "Popular Quotes",
  ];

  const headerProps = showBtnOnHeader.includes(activeQuoteTab)
    ? {
        btnText: "Add New Quote",
        onClick: () => handleChangeQuoteTab("Add New Quote"),
      }
    : {};

  return (
    <div className="flex flex-col h-full wallpaper-wrapper">
      <Header title={activeQuoteTab} {...headerProps} />

      <div className="flex-1 overflow-y-auto">
        {userInfo?.isAdmin && (
          <div className="py-2 px-2 mb-3 rounded-md wallpaper-tabs">
            <Grid
              container
              columns={{ xs: 12, sm: 12, md: 10 }}
              columnSpacing={1}
              rowSpacing={1}
            >
              {quoteTabs.map((tabName) => (
                <Grid item xs={12} sm={4} md={2} key={tabName}>
                  <div
                    className={`cursor-pointer rounded-md text-center py-2 tab ${
                      tabName === activeQuoteTab ? "active" : ""
                    }`}
                    onClick={() => handleChangeQuoteTab(tabName)}
                  >
                    {tabName}
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {getActiveTabComponent(activeQuoteTab)}
          {/* Quotes */}
        </div>
      </div>
    </div>
  );
};

export default Quotes;
