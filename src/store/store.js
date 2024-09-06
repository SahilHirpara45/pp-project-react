import { configureStore } from "@reduxjs/toolkit";
import layoutReducer from "./layout/layout.slice";
import loginReducer from "./login/login.slice";
import commonReducer from "./common/common.slice";
import settingsReducer from "./settings/settings.slice";
import wallpapersReducer from "./wallpapers/wallpapers.slice";
import liveWallpapersReducer from "./liveWallpapers/liveWallpapers.slice";
import ringtonsReducer from "./ringtons/ringtons.slice";
import quotesReducer from "./quotes/quotes.slice";
import usersReducer from "./users/users.slice";
import dashboardReducer from "./dashboard/dashboard.slice";

export const store = configureStore({
  reducer: {
    layout: layoutReducer,
    login: loginReducer,
    common: commonReducer,
    settings: settingsReducer,
    wallpapers: wallpapersReducer,
    liveWallpapers: liveWallpapersReducer,
    ringtons: ringtonsReducer,
    quotes: quotesReducer,
    users: usersReducer,
    dashboard: dashboardReducer,
  },
});
