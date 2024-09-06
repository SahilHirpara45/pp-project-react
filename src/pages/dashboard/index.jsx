import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SelectInputField from "../../common/inputFields/SelectInputField";
import Header from "../../common/Header.jsx";
import { getLanguages } from "../../store/common/common.slice.js";
import BaseTable from "../../common/table/BaseTable.jsx";
import { getCounts } from "../../store/dashboard/dashboard.slice.js";
import Loading from "../../common/Loading.jsx";

const navigateUrl = {
  Wallpapers: {
    path: "/wallpapers",
    published: "Published Wallpapers",
    unpublished: "Unpublished Wallpapers",
  },
  "Live Wallpapers": {
    path: "/live-wallpapers",
    published: "Published Live Wallpapers",
    unpublished: "Unpublished Live Wallpapers",
  },
  Ringtones: {
    path: "/ringtones",
    published: "Published Ringtones",
    unpublished: "Unpublished Ringtones",
  },
  Quotes: {
    path: "/quotes",
    published: "Published Quotes",
    unpublished: "Unpublished Quotes",
  },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { languages } = useSelector((state) => state.common);
  const { loading, counts } = useSelector((state) => state.dashboard);

  const [selectedLanguage, setSelectedLanguage] = useState({
    label: "",
    value: "",
  });

  useEffect(() => {
    dispatch(getLanguages()).then(({ payload }) => {
      const defaultLanguage = payload?.find(
        (lang) => lang?.language === "English"
      );
      setSelectedLanguage({
        label: defaultLanguage?.language || "",
        value: defaultLanguage?._id || "",
      });
      getAllCounts({ lang: defaultLanguage?._id });
    });
  }, []);

  const getAllCounts = (params) => {
    dispatch(getCounts({ ...params }));
  };

  const columns = [
    {
      title: "Post",
      field: "post",
    },
    {
      title: "Published",
      renderCell: (item) => {
        const handleNavigate = () => {
          navigate(navigateUrl[item.post]["path"], {
            state: {
              component: navigateUrl[item.post]["published"],
              selectedLanguage,
            },
          });
        };

        return (
          <div className="cursor-pointer" onClick={handleNavigate}>
            {item.published}
          </div>
        );
      },
    },
    {
      title: "Unpublished",
      renderCell: (item) => {
        const handleNavigate = () => {
          navigate(navigateUrl[item.post]["path"], {
            state: {
              component: navigateUrl[item.post]["unpublished"],
              selectedLanguage,
            },
          });
        };

        return (
          <div className="cursor-pointer" onClick={handleNavigate}>
            {item.unpublished}
          </div>
        );
      },
    },
  ];

  return (
    <div className="dashboard">
      <Loading isLoading={loading} />

      <Header title="Dashboard" />

      <div className="flex gap-2 my-5">
        <div className="w-32">Choose Language</div>
        <SelectInputField
          wrapperClassName="w-full max-w-md"
          options={
            languages.map((lan) => ({
              label: lan?.language,
              value: lan?._id,
            })) || []
          }
          value={selectedLanguage}
          onChange={(_, option) => {
            setSelectedLanguage(option);
            getAllCounts({ lang: option.value });
          }}
          isShowError={false}
          placeholder="Select Language"
        />
      </div>

      <div className="overflow-y-auto">
        <BaseTable columns={columns} data={counts} />
      </div>
    </div>
  );
};

export default Dashboard;
