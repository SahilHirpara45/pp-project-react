import React, { useEffect, useState } from "react";
import { Form, Formik, useFormik } from "formik";
import * as yup from "yup";
import { Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import ButtonComponent from "../../common/ButtonComponent.jsx";
import SelectInputField from "../../common/inputFields/SelectInputField.jsx";
import { getLanguages } from "../../store/common/common.slice.js";
import {
  addSearchQuotesTerm,
  deleteSearchQuotesTerm,
  getSearchQuotesTerms,
} from "../../store/quotes/quotes.slice";
import Loading from "../../common/Loading.jsx";
import BaseTable from "../../common/table/BaseTable.jsx";
import ConfirmationModal from "../../common/ConfirmationModal.jsx";
import { toastHandler } from "../../common/toast.js";
import TextInputField from "../../common/inputFields/TextInputField.jsx";

const ConfirmationContent = () => (
  <>
    <Typography id="transition-modal-title" variant="h6" component="h2">
      Delete
    </Typography>
    <Typography id="transition-modal-description" sx={{ mt: 2 }}>
      Are you sure you want to delete quote search term?
    </Typography>
  </>
);

const TopQuotes = () => {
  const dispatch = useDispatch();

  const [searchQuoteTermId, setSearchQuoteTermId] = useState(null);
  const [deleteSearchTermId, setDeleteSearchTermId] = useState(null);
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);

  const { topQuotesSearch, loading } = useSelector(
    (state) => state.quotes.topQuotesSearchTab
  );
  const { languages } = useSelector((state) => state.common);

  const clearInput = () => {
    setValues((prev) => ({ ...prev, searchTerm: "", noOfSearchTerm: 0 }));
    setTouched({});
    setErrors({});
  };

  const getAllTopQuotesSearch = (params) => {
    const payload = {
      lang: formik.values.languageId,
      ...params,
    };
    if (payload.lang) {
      dispatch(getSearchQuotesTerms(payload));
    }
  };

  const handleEditQuotesSearchTerm = ({
    _id,
    searchTerm,
    language,
    number,
  }) => {
    const values = {
      searchTerm: searchTerm,
      noOfSearchTerm: number,
      languageId: language,
    };
    setValues((prev) => ({ ...prev, ...values }));
    setSearchQuoteTermId(_id);
  };

  const handleDeleteSearchTerm = (item) => {
    setDeleteSearchTermId(item._id);
    setIsOpenConfirmationModal(!isOpenConfirmationModal);
  };

  const handleToggleConfirmationModal = (type = "no") => {
    if (type === "yes") {
      dispatch(deleteSearchQuotesTerm(deleteSearchTermId))
        .then((res) => {
          if (res?.payload?.success) {
            toastHandler("Search Term deleted successfully.", "success");
            getAllTopQuotesSearch();
          } else {
            toastHandler(
              res?.payload?.message || "Something went wrong!!",
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

      if (searchQuoteTermId) {
        dispatch(addSearchQuotesTerm({ _id: searchQuoteTermId, ...payload }))
          .then((res) => {
            if (res?.payload?.success) {
              toastHandler("Search Term edited successfully.", "success");
              getAllTopQuotesSearch();
            } else {
              toastHandler(
                res?.payload?.message || "Something went wrong!!",
                "error"
              );
            }
          })
          .catch(() => {
            toastHandler("Edit error!", "error");
          });

        setSearchQuoteTermId(null);
      } else {
        dispatch(addSearchQuotesTerm(payload))
          .then((res) => {
            if (res?.payload?.success) {
              toastHandler("Search Term created successfully.", "success");
              getAllTopQuotesSearch();
            } else {
              toastHandler(
                res?.payload?.message || "Something went wrong!!",
                "error"
              );
            }
          })
          .catch(() => {
            toastHandler("Create error!", "error");
          });
      }
      clearInput();
    },
  });

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
        <div className="flex justify-center m-2">
          <ButtonComponent
            btnText="Edit"
            btnClass={"btn-warning"}
            onClick={() => handleEditQuotesSearchTerm(item)}
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

  useEffect(() => {
    dispatch(getLanguages()).then((res) => {
      const defaultLan = languages.find((lang) => lang.language === "English");
      setFieldValue("languageId", defaultLan?._id || "");
    });
  }, []);

  useEffect(() => {
    getAllTopQuotesSearch({ lang: formik.values.languageId });
  }, [formik.values.languageId]);

  const {
    handleSubmit,
    setValues,
    setErrors,
    setTouched,
    setFieldValue,
    resetForm,
  } = formik;
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
                btnText={searchQuoteTermId ? "Save" : "Add"}
                btnClass="btn-info"
              />
              {searchQuoteTermId && (
                <span className="ml-2">
                  <ButtonComponent
                    btnClass="btn-danger"
                    btnText="Cancel"
                    onClick={() => {
                      clearInput();
                      setSearchQuoteTermId(null);
                    }}
                  />
                </span>
              )}
            </div>
          </Form>
        </Formik>
      </div>

      <BaseTable columns={columns} data={topQuotesSearch} />

      <ConfirmationModal
        open={isOpenConfirmationModal}
        handleToggle={handleToggleConfirmationModal}
        btns={["No", "Yes"]}
        content={<ConfirmationContent />}
      />
    </>
  );
};

export default TopQuotes;
