import React, { useEffect, useState } from "react";
import { Form, Formik, useFormik } from "formik";
import * as yup from "yup";
import { Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import ButtonComponent from "../../common/ButtonComponent.jsx";
import TextInputField from "../../common/inputFields/TextInputField.jsx";
import SelectInputField from "../../common/inputFields/SelectInputField.jsx";
import {
  addSearchLiveWallpaperTerm,
  deleteSearchLiveWallpaperTerm,
  getTopLiveWallpaperSearchTerms,
} from "../../store/liveWallpapers/liveWallpapers.slice.js";
import Loading from "../../common/Loading.jsx";
import BaseTable from "../../common/table/BaseTable.jsx";
import ConfirmationModal from "../../common/ConfirmationModal.jsx";
import { toastHandler } from "../../common/toast.js";
import { getLanguages } from "../../store/common/common.slice.js";

const ConfirmationContent = () => (
  <>
    <Typography id="transition-modal-title" variant="h6" component="h2">
      Delete
    </Typography>
    <Typography id="transition-modal-description" sx={{ mt: 2 }}>
      Are you sure you want to delete live wallpaper search term?
    </Typography>
  </>
);

const TopLiveWallpaper = () => {
  const dispatch = useDispatch();

  const [editSearchTermId, setEditSearchTermId] = useState(null);
  const [deleteSearchTermId, setDeleteSearchTermId] = useState(null);
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);

  const { topLiveWallpaperSearch, loading } = useSelector(
    (state) => state.liveWallpapers.topLiveWallpaperSearchTab
  );
  const { languages } = useSelector((state) => state.common);

  const formik = useFormik({
    initialValues: { languageId: "", searchTerm: "", noOfSearchTerm: 0 },
    validationSchema: yup.object().shape({
      searchTerm: yup.string().required("Enter Search Term"),
      noOfSearchTerm: yup.number().required("Enter No of Search Term"),
      languageId: yup.string().required("Select Language"),
    }),
    onSubmit: (values) => {
      const payload = {
        searchTerm: values.searchTerm,
        number: values.noOfSearchTerm,
        language: values.languageId,
      };

      if (editSearchTermId) {
        dispatch(
          addSearchLiveWallpaperTerm({ _id: editSearchTermId, ...payload })
        )
          .then((res) => {
            if (res?.payload?.success) {
              toastHandler("Search term edited successfully.", "success");
              getAllTopLiveWallpaperSearchTerm();
            } else {
              toastHandler(res?.payload?.message || "Edit error!", "error");
            }
          })
          .catch(() => {
            toastHandler("Edit error!", "error");
          });

        setEditSearchTermId(null);
      } else {
        dispatch(addSearchLiveWallpaperTerm(payload))
          .then((res) => {
            if (res?.payload?.success) {
              toastHandler("Search term created successfully.", "success");
              getAllTopLiveWallpaperSearchTerm();
            } else {
              toastHandler(res?.payload?.message || "Create error!", "error");
            }
          })
          .catch(() => {
            toastHandler("Create error!", "error");
          });
      }

      clearInput();
    },
  });

  const {
    values,
    handleSubmit,
    setValues,
    setErrors,
    setFieldValue,
    setTouched,
    resetForm,
  } = formik;
  console.log(formik.errors, "errors");
  useEffect(() => {
    dispatch(getLanguages()).then((res) => {
      const defaultLan = languages.find((lang) => lang.language === "English");
      setFieldValue("languageId", defaultLan?._id || "");
    });
  }, []);

  useEffect(() => {
    if (values.languageId) {
      getAllTopLiveWallpaperSearchTerm();
    }
  }, [values.languageId]);

  const clearInput = () => {
    setValues((prev) => ({ ...prev, searchTerm: "", noOfSearchTerm: 0 }));
    setTouched({});
    setErrors({});
  };

  const getAllTopLiveWallpaperSearchTerm = () => {
    const payload = {
      lang: values.languageId,
    };
    dispatch(getTopLiveWallpaperSearchTerms(payload));
  };

  const handleEditSearchTerm = ({ _id, searchTerm, language, number }) => {
    const values = {
      searchTerm: searchTerm,
      noOfSearchTerm: number,
      languageId: language,
    };
    setValues((prev) => ({ ...prev, ...values }));
    setEditSearchTermId(_id);
  };

  const handleDeleteSearchTerm = (item) => {
    setDeleteSearchTermId(item._id);
    setIsOpenConfirmationModal(!isOpenConfirmationModal);
  };

  const handleToggleConfirmationModal = (type = "no") => {
    if (type === "yes") {
      dispatch(deleteSearchLiveWallpaperTerm(deleteSearchTermId))
        .then((res) => {
          if (res?.payload?.success) {
            toastHandler("Search term deleted successfully.", "success");
            getAllTopLiveWallpaperSearchTerm();
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
    setDeleteSearchTermId(null);
  };

  const columns = [
    {
      title: "No.",
      renderCell: (_, rowIndex, page, pageSize) => (
        <div>{(page - 1) * pageSize + rowIndex + 1}</div>
      ),
    },
    { title: "Search Term", field: "searchTerm" },
    { title: "Number of Search", field: "number" },
    {
      title: "Action",
      renderCell: (item) => (
        <div>
          <ButtonComponent
            btnText="Edit"
            btnClass={"btn-warning"}
            onClick={() => handleEditSearchTerm(item)}
          />
          <ButtonComponent
            btnText="Delete"
            btnClass={"btn-danger"}
            onClick={() => handleDeleteSearchTerm(item)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Loading isLoading={loading} />

      <div
        className="mb-3 p-4 rounded-md"
        style={{ backgroundColor: "#2e2e32" }}
      >
        <Formik>
          <Form onSubmit={handleSubmit}>
            <Grid container columnSpacing={2} rowSpacing={1}>
              <Grid item xs={12} sm={4} md={4}>
                <div className="mb-1">Choose Language</div>
                <SelectInputField
                  name="languageId"
                  options={
                    languages.map((lang) => ({
                      label: lang.language,
                      value: lang._id,
                    })) || []
                  }
                  placeholder="Select Language"
                  formik={formik}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <div className="mb-1">Search term </div>
                <TextInputField name="searchTerm" formik={formik} />
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <div className="mb-1">Number of search </div>
                <TextInputField name="noOfSearchTerm" formik={formik} />
              </Grid>
            </Grid>

            <div className="mt-2">
              <ButtonComponent
                btnType="submit"
                btnText={editSearchTermId ? "Save" : "Add"}
                btnClass="btn-info"
              />
              {editSearchTermId && (
                <span className="ml-2">
                  <ButtonComponent
                    btnClass="btn-danger"
                    btnText="Cancel"
                    onClick={() => {
                      clearInput();
                      setEditSearchTermId(null);
                    }}
                  />
                </span>
              )}
            </div>
          </Form>
        </Formik>
      </div>

      <BaseTable columns={columns} data={topLiveWallpaperSearch} />

      <ConfirmationModal
        open={isOpenConfirmationModal}
        handleToggle={handleToggleConfirmationModal}
        btns={["No", "Yes"]}
        content={<ConfirmationContent />}
      />
    </>
  );
};

export default TopLiveWallpaper;
