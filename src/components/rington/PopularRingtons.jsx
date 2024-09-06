import React, { useEffect, useState } from "react";
import Card from "./Card";
import ButtonComponent from "../../common/ButtonComponent";
import SelectInputField from "../../common/inputFields/SelectInputField";
import { useDispatch, useSelector } from "react-redux";
import { getLanguages, resetLanguages } from "../../store/common/common.slice";
import { getLicenses } from "../../store/settings/settings.slice";
import { Pagination, Typography } from "@mui/material";
import { toastHandler } from "../../common/toast";
import ConfirmationModal from "../../common/ConfirmationModal";
import Loading from "../../common/Loading";
import {
  deleteRington,
  getRingtons,
  getRingtonsCategories,
  resetRingtonCategory,
  resetRingtons,
} from "../../store/ringtons/ringtons.slice";
import TextInputField from "../../common/inputFields/TextInputField";

const RingtoneTypes = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Ringtone",
    value: "ringtone",
  },
  {
    label: "Notification",
    value: "notification",
  },
  {
    label: "Alarm",
    value: "alarm",
  },
];

const ConfirmationContent = () => (
  <>
    <Typography id="transition-modal-title" variant="h6" component="h2">
      Delete
    </Typography>
    <Typography id="transition-modal-description" sx={{ mt: 2 }}>
      Are you sure you want to delete this ringtone?
    </Typography>
  </>
);

const PopularRingtons = () => {
  const dispatch = useDispatch();
  const { ringtons, loading } = useSelector(
    (state) => state.ringtons.ringtonsTab
  );
  const { languages } = useSelector((state) => state.common);
  const { userInfo } = useSelector((state) => state.login);

  const [selectedLang, setSelectedLang] = useState({ label: "", value: "" });
  const [selectedRingtoneType, setSelectedRingtoneType] = useState({
    label: "All",
    value: "",
  });
  const [searchString, setSearchString] = useState("");
  const [selectedRingtons, setSelectedRingtons] = useState([]);
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const getAllRingtons = (params) => {
    const payload = {
      published: true,
      lang: selectedLang.value,
      sortBy: "favourite",
      q: searchString,
      page: currentPage,
      limit: 10,
      type: selectedRingtoneType.value,
      ...params,
    };
    if (payload.lang) {
      dispatch(getRingtons(payload));
    }
  };

  const getAllCategory = (params) => {
    dispatch(getRingtonsCategories({ lang: selectedLang.value, ...params }));
  };

  const handleChangeCurrentPage = (event, value) => {
    setCurrentPage(value);
    getAllRingtons({ lang: selectedLang?.value, page: value, limit: 10 });
  };

  const changeRingtoneTypeHandler = (_, ringtoneType) => {
    setSelectedRingtoneType(ringtoneType);
    getAllRingtons({ type: ringtoneType?.value, page: 1 });
    setCurrentPage(1);
  };

  const changeLanguageHandler = (_, language) => {
    setSelectedLang(language);
    getAllRingtons({ lang: language?.value });
  };

  const searchHandler = (e) => {
    setSearchString(e.target.value);
    getAllRingtons({ q: e.target.value, page: 1 });
    setCurrentPage(1);
  };

  const selectHandler = (id) => {
    if (selectedRingtons.includes(id)) {
      setSelectedRingtons(selectedRingtons.filter((item) => item !== id));
    } else {
      setSelectedRingtons([...selectedRingtons, id]);
    }
  };
  const selectAllHandler = (event) => {
    if (event.target.checked) {
      setSelectedRingtons(Ringtons?.map((rington) => rington._id));
    } else {
      setSelectedRingtons([]);
    }
  };
  const handleToggleConfirmationModal = (type = "no") => {
    if (type === "yes") {
      dispatch(
        deleteRington({
          language: selectedLang.value,
          id: selectedRingtons,
        })
      )
        .then((res) => {
          if (res?.payload?.success) {
            toastHandler("Ringtone deleted successfully.", "success");
            getAllRingtons();
          } else {
            toastHandler(res?.payload?.message || "Delete error!", "error");
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
        getAllRingtons({ lang: defaultLan?._id });
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
      dispatch(resetRingtonCategory([]));
      dispatch(resetRingtons([]));
    };
  }, []);
  const { data: Ringtons, total_page } = ringtons;

  return (
    <>
      <Loading isLoading={loading && !searchString} />
      <div className="published-rington-wrapper flex flex-col h-full">
        <div className="grid grid-cols-1 md:grid-cols-3 place-items-center filters my-2">
          <div className="flex items-center justify-between my-5 languages">
            <div className="whitespace-nowrap me-2">Choose Language</div>
            <SelectInputField
              wrapperClassName="w-full"
              inputClassName="form-control"
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
          <div className="flex items-center justify-between my-5 languages">
            <div className="whitespace-nowrap me-2">Ringtone Type</div>
            <SelectInputField
              wrapperClassName="w-full"
              inputClassName="form-control"
              options={RingtoneTypes}
              value={selectedRingtoneType}
              onChange={changeRingtoneTypeHandler}
              isShowError={false}
              placeholder="Select Ringtone Type"
            />
          </div>
          <div className="search-bar">
            {/* <input
              type="text"
              placeholder="Search The ringtons by title and Tags"
              onChange={searchHandler}
            /> */}
            <TextInputField
              value={searchString}
              onChange={searchHandler}
              placeholder="Search The ringtones by title and Tags"
              isShowError={false}
            />
          </div>
        </div>

        {Ringtons && Ringtons.length > 0 ? (
          <div>
            {userInfo?.isAdmin && (
              <div className="flex justify-between items-center rounded-md px-3 py-1 actions">
                <div>
                  <input
                    type="checkbox"
                    className="mr-3"
                    onChange={selectAllHandler}
                    checked={
                      selectedRingtons.length > 0 &&
                      selectedRingtons.length === Ringtons?.length
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
              {Ringtons?.map((rington, index) => {
                return (
                  <Card
                    index={(currentPage - 1) * 10 + index + 1}
                    key={rington._id}
                    data={rington}
                    fetchFunction={getAllRingtons}
                    selectHandler={selectHandler}
                    checked={selectedRingtons.includes(rington._id)}
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
            <h1 className="text-2xl text-center">No ringtones found</h1>
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

export default PopularRingtons;
