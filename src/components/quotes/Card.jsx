import React, { useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Typography } from "@mui/material";
import * as Yup from "yup";

import TextInputField from "../../common/inputFields/TextInputField";
import Barbi from "../../assets/images/barbi.png";
import ButtonComponent from "../../common/ButtonComponent";
import SelectInputField from "../../common/inputFields/SelectInputField";
import {
  deleteQuote,
  editQuote,
  publishQuote,
} from "../../store/quotes/quotes.slice";
import ConfirmationModal from "../../common/ConfirmationModal.jsx";
import { toastHandler } from "../../common/toast.js";
import AddTags from "../../common/AddTags.jsx";

const getInitialValues = (data) => {
  return {
    quote: data?.quote || "",
    category: data?.category?._id,
    favourite: data?.favourite || "",
    author: data?.author || "",
    tages: data?.tages || [],
  };
};
const ConfirmationContent = () => (
  <>
    <Typography id="transition-modal-title" variant="h6" component="h2">
      Delete
    </Typography>
    <Typography id="transition-modal-description" sx={{ mt: 2 }}>
      Are you sure you want to delete this Quote?
    </Typography>
  </>
);

const Card = ({ index, data, fetchFunction, selectHandler, checked }) => {
  const dispatch = useDispatch();

  const {
    categoriesTab: { categories },
  } = useSelector((state) => state.quotes);
  const {
    licensesTab: { licenses },
  } = useSelector((state) => state.settings);
  const { userInfo } = useSelector((state) => state.login);

  const [initialValue, setInitialValue] = useState(getInitialValues(data));
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const [deleteQuoteId, setDeleteQuoteId] = useState(null);
  const [isEditable, setIsEditable] = useState(false);

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: Yup.object().shape({
      quote: Yup.string().required("Enter Quote"),
      favourite: Yup.string().required("Enter Favourite"),
      // author: Yup.string().required("Enter Author"),
      category: Yup.string().required("Enter Category"),
    }),
    onSubmit: (values) => {
      const payload = {
        quote: values.quote,
        favourite: +values.favourite,
        author: values.author,
        category: values.category,
        tages: values.tages,
      };
      const formData = new FormData();
      Object.keys(payload).map((val) => formData.append(val, payload[val]));
      dispatch(editQuote({ id: data?._id, payload: formData })).then((res) => {
        if (res?.payload?.success) {
          setIsEditable(false);
          toastHandler("Quote updated successfully.", "success");
          fetchFunction();
        } else {
          toastHandler(
            res?.payload?.message || "Quote not getting update",
            "error"
          );
        }
      });
    },
  });

  const publishQuoteHandler = () => {
    dispatch(publishQuote({ language: data.language, id: [data?._id] })).then(
      (res) => {
        if (res?.payload?.success) {
          toastHandler("Quote published successfully.", "success");
          fetchFunction();
        } else {
          toastHandler(
            res?.payload?.message || "Something went wrong!!",
            "error"
          );
        }
      }
    );
  };

  const handleDeleteQuote = () => {
    setDeleteQuoteId(data._id);
    setIsOpenConfirmationModal(!isOpenConfirmationModal);
  };

  const handleToggleConfirmationModal = (type = "no") => {
    if (type === "yes") {
      dispatch(deleteQuote({ language: data.language, id: [deleteQuoteId] }))
        .then((res) => {
          if (res?.payload?.success) {
            toastHandler("Quote deleted successfully.", "success");
            fetchFunction();
          } else {
            toastHandler(
              res?.payload?.message || "Quote not deleted !!",
              "success"
            );
          }
        })
        .catch(() => {
          toastHandler("Delete error!", "error");
        });
    }
    setIsOpenConfirmationModal(!isOpenConfirmationModal);
  };

  const handleRemoveTag = (index) => {
    let newTags = [...formik.values.tages];
    newTags.splice(index, 1);
    formik.setFieldValue("tages", [...newTags]);
  };

  const handleBlur = (e) => {
    const tags = e.target.value.split(
      /[,،⸲⸴⹁⹉∘、︐︑﹐﹑，､·∘՝߸፣᠂᠈⹌꓾꘍꛵𑑍𑑚𖺗𝪇ʻʽ‚]+/u
    );
    const updatedTags = tags.filter(
      (tag) => !formik.values.tages.find((t) => t === tag)
    );
    // const hasTag = formik.values.tages.find((tag) => tag === e.target.value);
    if (e.target.value && updatedTags.length > 0) {
      formik.setFieldValue("tages", [...formik.values.tages, ...updatedTags]);
    }
    e.target.value = null;
  };

  return (
    <>
      <div className="flex flex-wrap justify-between text-white p-3 my-2 quotes-card-warpper">
        <Grid container columnSpacing={2} rowSpacing={1}>
          <Grid item xs={12} sm={6} md={6}>
            <div className="mr-10">
              <div className="flex">
                {userInfo?.isAdmin && (
                  <div className="pr-3">
                    <input
                      type="checkbox"
                      className="mr-3"
                      onClick={() => {
                        selectHandler(data._id);
                      }}
                      checked={checked}
                    />
                    <span>{index}</span>
                  </div>
                )}
                <div className="flex-1">
                  <TextInputField
                    formik={formik}
                    name="quote"
                    multiline
                    minRows={3}
                    maxRows={3}
                  />
                </div>
              </div>
              <div className="flex h-25">
                <div className="pr-3">Tages</div>
                <div className="flex-1 overflow-y-auto">
                  <AddTags
                    tags={formik.values.tages}
                    handleRemoveTag={handleRemoveTag}
                    handleBlur={handleBlur}
                    isDisabled={!isEditable}
                  />
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <div className="discription">
              <ul>
                <li>
                  <div className="flex items-center card-selector">
                    <div className="label">Category:</div>
                    <SelectInputField
                      wrapperClassName="w-full"
                      name="category"
                      options={
                        categories?.map((cat) => ({
                          label: cat.categoryName,
                          value: cat._id,
                        })) || []
                      }
                      placeholder="Select Category"
                      formik={formik}
                      disabled={!isEditable}
                    />
                  </div>
                </li>
                <li>
                  <div className="flex items-center card-selector">
                    <div className="label">Author Name:</div>
                    <TextInputField
                      name="author"
                      wrapperClassName="w-full mb-0"
                      formik={formik}
                      disabled={!isEditable}
                    />
                  </div>
                </li>
                <li>
                  <div className="flex items-center card-selector">
                    <div className="label">Favorite:</div>
                    <TextInputField
                      type="number"
                      wrapperClassName="w-full mb-0"
                      formik={formik}
                      value={formik.values.favourite || "0"}
                      name="favourite"
                      disabled={!isEditable}
                    />
                  </div>
                </li>
                <li>
                  <div className="flex items-center card-selector">
                    <div className="label">User Name:</div>
                    <span>{data?.user || ""}</span>
                  </div>
                </li>
              </ul>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={1}>
            <div className="flex flex-col">
              {(userInfo?.isAdmin ||
                (!data?.isPublished && userInfo?.name === data.user)) && (
                <ButtonComponent
                  onClick={() => setIsEditable(true)}
                  btnClass={"btn-warning"}
                  btnText={"Edit"}
                />
              )}
              {(userInfo?.isAdmin ||
                (!data?.isPublished && userInfo?.name === data.user)) && (
                <ButtonComponent
                  onClick={handleDeleteQuote}
                  btnClass={"btn-danger"}
                  btnText={"Delete"}
                />
              )}
              {(userInfo?.isAdmin ||
                (!data?.isPublished && userInfo?.name === data.user)) && (
                <ButtonComponent
                  onClick={formik.handleSubmit}
                  btnClass={"btn-info"}
                  btnText={"Save"}
                />
              )}
              {!data?.isPublished && userInfo?.isAdmin && (
                <ButtonComponent
                  onClick={publishQuoteHandler}
                  btnClass={"btn-info"}
                  btnText={"Publish"}
                />
              )}
            </div>
          </Grid>
        </Grid>
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

export default Card;
