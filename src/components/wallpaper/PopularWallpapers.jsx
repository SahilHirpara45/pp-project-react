import React, { useEffect, useState } from "react";
import { Pagination, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import Card from "./Card";
import ButtonComponent from "../../common/ButtonComponent";
import SelectInputField from "../../common/inputFields/SelectInputField";
import { getLanguages, resetLanguages } from "../../store/common/common.slice";
import {
  deleteWallpaper,
  getWallpaperCategories,
  getWallpapers,
  resetWallpaperCategory,
  resetWallpapers,
} from "../../store/wallpapers/wallpapers.slice";
import { getLicenses } from "../../store/settings/settings.slice";
import { toastHandler } from "../../common/toast";
import ConfirmationModal from "../../common/ConfirmationModal";
import Loading from "../../common/Loading";
import TextInputField from "../../common/inputFields/TextInputField";

const ConfirmationContent = () => (
  <>
    <Typography id="transition-modal-title" variant="h6" component="h2">
      Delete
    </Typography>
    <Typography id="transition-modal-description" sx={{ mt: 2 }}>
      Are you sure you want to delete this wallapper?
    </Typography>
  </>
);

const PopularWallpapers = () => {
  const dispatch = useDispatch();
  const { wallpapers, loading } = useSelector(
    (state) => state.wallpapers.wallpapersTab
  );
  const { languages } = useSelector((state) => state.common);
  const { userInfo } = useSelector((state) => state.login);

  const [selectedLang, setSelectedLang] = useState({ label: "", value: "" });
  const [searchString, setSearchString] = useState("");
  const [selectedWallpapers, setSelectedWallpapers] = useState([]);
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const getAllWallpapers = (params) => {
    const payload = {
      published: true,
      lang: selectedLang.value,
      sortBy: "favourite",
      q: searchString,
      page: currentPage,
      limit: 10,
      ...params,
    };
    if (payload.lang) {
      dispatch(getWallpapers(payload));
    }
  };

  const getAllCategory = (params) => {
    dispatch(getWallpaperCategories({ lang: selectedLang.value, ...params }));
  };

  const handleChangeCurrentPage = (event, value) => {
    setCurrentPage(value);
    getAllWallpapers({ lang: selectedLang?.value, page: value, limit: 10 });
  };

  const changeLanguageHandler = (_, language) => {
    setSelectedLang(language);
    getAllWallpapers({ lang: language?.value });
  };

  const searchHandler = (e) => {
    setSearchString(e.target.value);
    getAllWallpapers({ q: e.target.value, page: 1 });
    setCurrentPage(1);
  };

  const selectHandler = (id) => {
    if (selectedWallpapers.includes(id)) {
      setSelectedWallpapers(selectedWallpapers.filter((item) => item !== id));
    } else {
      setSelectedWallpapers([...selectedWallpapers, id]);
    }
  };
  const selectAllHandler = (event) => {
    if (event.target.checked) {
      setSelectedWallpapers(Wallpapers?.map((wallpaper) => wallpaper._id));
    } else {
      setSelectedWallpapers([]);
    }
  };
  const handleToggleConfirmationModal = (type = "no") => {
    if (type === "yes") {
      dispatch(
        deleteWallpaper({
          language: selectedLang.value,
          id: selectedWallpapers,
        })
      )
        .then((res) => {
          if (res?.payload?.success) {
            toastHandler("Wallpaper deleted successfully.", "success");
            getAllWallpapers();
          } else {
            toastHandler(
              res?.payload?.message || "Something went wrong.",
              "error"
            );
          }
        })
        .catch(() => {
          toastHandler("Delete error!", "error");
        });
    }
    setIsOpenConfirmationModal(!isOpenConfirmationModal);
  };

  useEffect(() => {
    dispatch(getLanguages()).then((res) => {
      if (res?.payload?.length) {
        const defaultLan = res?.payload?.find(
          (lang) => lang.language === "English"
        );
        getAllWallpapers({ lang: defaultLan?._id });
        getAllCategory({ lang: defaultLan?._id });
        setSelectedLang({
          label: defaultLan?.language || "",
          value: defaultLan?._id || "",
        });
      }
    });

    dispatch(getLicenses());
    return () => {
      dispatch(resetLanguages([]));
      dispatch(resetWallpaperCategory([]));
      dispatch(resetWallpapers([]));
    };
  }, []);
  const { data: Wallpapers, total_page } = wallpapers;

  return (
    <>
      <Loading isLoading={loading && !searchString} />

      <div className="published-wallpaper-wrapper flex flex-col h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 place-items-center filters my-2">
          <div className="flex items-center my-5 languages">
            <div>Choose Language</div>
            <SelectInputField
              wrapperClassName="w-full"
              options={
                languages.map((lang) => ({
                  label: lang.language,
                  value: lang._id,
                })) || []
              }
              value={selectedLang}
              onChange={changeLanguageHandler}
              isShowError={false}
              placeholder="Select Language"
            />
          </div>

          <div className="search-bar">
            <TextInputField
              value={searchString}
              onChange={searchHandler}
              placeholder="Search The wallpapers by title and Tags"
              isShowError={false}
            />
          </div>
        </div>

        {Wallpapers && Wallpapers.length > 0 ? (
          <div>
            {userInfo?.isAdmin && (
              <div className="flex justify-between items-center rounded-md px-3 py-1 actions">
                <div>
                  <input
                    type="checkbox"
                    className="mr-3"
                    onChange={selectAllHandler}
                    checked={
                      selectedWallpapers.length > 0 &&
                      selectedWallpapers.length === Wallpapers?.length
                    }
                  />
                  <span>Select all</span>
                </div>
                <div>
                  <ButtonComponent
                    onClick={() =>
                      setIsOpenConfirmationModal(!isOpenConfirmationModal)
                    }
                    btnText={"Delete"}
                    btnClass={"btn-danger"}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {Wallpapers?.map((wallpaper, index) => {
                return (
                  <Card
                    index={(currentPage - 1) * 10 + index + 1}
                    key={wallpaper._id}
                    data={wallpaper}
                    fetchFunction={getAllWallpapers}
                    selectHandler={selectHandler}
                    checked={selectedWallpapers.includes(wallpaper._id)}
                  />
                );
              })}
            </div>

            <div className="bg-white flex justify-end">
              <Pagination
                variant="outlined"
                showFirstButton
                showLastButton
                color="primary"
                size="large"
                siblingCount={2}
                boundaryCount={2}
                count={total_page}
                page={currentPage}
                onChange={handleChangeCurrentPage}
              />
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl text-center">No wallpapers found</h1>
          </div>
        )}
      </div>

      <ConfirmationModal
        open={isOpenConfirmationModal}
        handleToggle={handleToggleConfirmationModal}
        btns={["No", "Yes"]}
        content={<ConfirmationContent />}
      />
    </>
  );
};

export default PopularWallpapers;
