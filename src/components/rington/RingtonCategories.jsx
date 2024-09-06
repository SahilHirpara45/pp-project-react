import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Typography } from "@mui/material";
import * as yup from "yup";
import { Form, Formik, useFormik } from "formik";
import CategoryCard from "./CategoryCard";
import SelectInputField from "../../common/inputFields/SelectInputField";
import { getLanguages } from "../../store/common/common.slice";
import TextInputField from "../../common/inputFields/TextInputField";
import Loading from "../../common/Loading";
import { toastHandler } from "../../common/toast";
import ConfirmationModal from "../../common/ConfirmationModal";
import ButtonComponent from "../../common/ButtonComponent";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { isValidFileType } from "../../utils/validFileType";
import PreviewFile from "../../common/PreviewFile";
import {
  deleteRingtonCategory,
  getRingtonsCategories,
  rearrangeRingtonsCategory,
  setRingtonCategory,
  updateRingtonCategory,
} from "../../store/ringtons/ringtons.slice";

const ConfirmationContent = () => {
  return (
    <>
      <Typography id="transition-modal-title" variant="h6" component="h2">
        Delete
      </Typography>
      <Typography id="transition-modal-description" sx={{ mt: 2 }}>
        Are you sure you want to delete this category?
      </Typography>
    </>
  );
};

const RingtonCategories = () => {
  const dispatch = useDispatch();

  const {
    ringtonsTab: { ringtons, loading },
  } = useSelector((state) => state.ringtons);
  const { languages } = useSelector((state) => state.common);

  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [selectedLang, setSelectedLang] = useState({ label: "", value: "" });
  const [categoriesList, setCategoriesList] = useState([]);

  const getAllRingtonCategory = (params) => {
    dispatch(
      getRingtonsCategories({ lang: selectedLang.value, ...params })
    ).then((res) => {
      setCategoriesList(res?.payload || []);
    });
  };

  useEffect(() => {
    dispatch(getLanguages()).then(() => {
      const defaultLan = languages.find((lang) => lang.language === "English");
      setSelectedLang({ label: defaultLan.language, value: defaultLan._id });
      getAllRingtonCategory({ lang: defaultLan._id });
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      language: "",
      categoryName: "",
      // photo: "",
    },
    validationSchema: yup.object().shape({
      language: yup.string().required("Language is required"),
      categoryName: yup.string().required("Category name is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const formData = new FormData();
      Object.keys(values).map((key) => formData.append(key, values[key]));

      if (editCategoryId) {
        dispatch(
          updateRingtonCategory({ id: editCategoryId, payload: formData })
        )
          .then((res) => {
            if (res?.payload?.success) {
              toastHandler("Category edited successfully.", "success");
              getAllRingtonCategory();
            } else {
              toastHandler(res?.payload?.message || "Edit error!", "error");
            }
          })
          .catch((error) => {
            console.log(error);
            toastHandler("Edit error!", "error");
          });

        setEditCategoryId(null);
      } else {
        dispatch(setRingtonCategory(formData))
          .then((res) => {
            if (res?.payload?.success) {
              toastHandler("Category created successfully.", "success");
              getAllRingtonCategory();
            } else {
              toastHandler(res?.payload?.message || "Create error!", "error");
            }
          })
          .catch((error) => {
            console.log(error);
            toastHandler("Create error!", "error");
          });
      }
      resetForm();
    },
  });

  const { handleSubmit, setValues, resetForm, values } = formik;

  const handleToggleConfirmationModal = (type = "no") => {
    if (type === "yes") {
      dispatch(deleteRingtonCategory(deleteCategoryId))
        .then((res) => {
          if (res?.payload?.success) {
            toastHandler("Category deleted successfully.", "success");
            getAllRingtonCategory();
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

  const handleEditCategory = ({ _id, language, categoryName }) => {
    const values = {
      language,
      categoryName,
    };
    setValues(values);
    setEditCategoryId(_id);
  };

  const handleDeleteCategory = (id) => {
    setDeleteCategoryId(id);
    setIsOpenConfirmationModal(!isOpenConfirmationModal);
  };

  const changeLanguageHandler = (_, language) => {
    setSelectedLang(language);
    getAllRingtonCategory({ lang: language?.value });
  };

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setCategoriesList((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })
    );
  }, []);

  const rearrangeHandler = () => {
    const payload = {
      lang: selectedLang.value,
      id: categoriesList?.map((cat) => cat._id),
    };
    dispatch(rearrangeRingtonsCategory(payload)).then((res) => {
      if (res?.payload?.success) {
        toastHandler("Categories rearranged successfully.", "success");
        getAllRingtonCategory();
      } else {
        toastHandler(res?.payload?.message || "Something went wrong!", "error");
      }
    });
  };

  return (
    <div className="wallpapercategory-container">
      <Loading isLoading={loading} />

      <div
        className="p-5 rounded-md"
        style={{
          backgroundColor: "#2e2e32",
        }}
      >
        <div className="mb-3 text-lg">Add New Category</div>
        <Grid container columnSpacing={2} rowSpacing={1}>
          <Grid item xs={12} md={6}>
            <Formik>
              <Form onSubmit={handleSubmit} className="w-full">
                <div className="mb-2">
                  <div className="mb-1">Choose Language</div>
                  <SelectInputField
                    formik={formik}
                    name="language"
                    options={
                      languages.map((lan) => ({
                        label: lan.language,
                        value: lan._id,
                      })) || []
                    }
                    placeholder="Select Language"
                  />
                </div>
                <div className="mb-2">
                  <div className="mb-1">Category Name</div>
                  <TextInputField formik={formik} name="categoryName" />
                </div>
                <div>
                  <ButtonComponent
                    btnType="submit"
                    btnText={editCategoryId ? "Save" : "Add"}
                    btnClass="btn-info"
                  />
                  {editCategoryId && (
                    <span className="ml-2">
                      <ButtonComponent
                        btnClass="btn-danger"
                        btnText="Cancel"
                        onClick={() => {
                          resetForm();
                          setEditCategoryId(null);
                        }}
                      />
                    </span>
                  )}
                </div>
              </Form>
            </Formik>
          </Grid>
          {/* <Grid item xs={12} md={6}>
            {values.photo && (
              <div>
                <PreviewFile file={values.photo} />
              </div>
            )}
          </Grid> */}
        </Grid>
      </div>

      <div className="my-5">
        <Grid
          container
          columnSpacing={2}
          rowSpacing={1}
          justifyContent="space-between"
        >
          <Grid item xs={12} sm={4}>
            <div className="flex items-center">
              <div className="mr-2">Choose Language</div>
              <SelectInputField
                wrapperClassName="w-full"
                options={
                  languages.map((lan) => ({
                    label: lan.language,
                    value: lan._id,
                  })) || []
                }
                value={selectedLang}
                onChange={changeLanguageHandler}
                isShowError={false}
                placeholder="Select Language"
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={5}></Grid>
          <Grid item xs={12} sm={3}>
            <div className="flex justify-end">
              <ButtonComponent
                btnClass="btn-info"
                btnText="Rearrange"
                onClick={rearrangeHandler}
              />
            </div>
          </Grid>
        </Grid>
      </div>

      <DndProvider backend={HTML5Backend}>
        <div>
          {categoriesList?.map((category, index) => {
            return (
              <CategoryCard
                key={category._id}
                index={index}
                category={category}
                handleDeleteCategory={handleDeleteCategory}
                handleEditCategory={handleEditCategory}
                moveCard={moveCard}
                id={category._id}
                priority={category.priority}
              />
            );
          })}
        </div>
      </DndProvider>

      <ConfirmationModal
        open={isOpenConfirmationModal}
        handleToggle={handleToggleConfirmationModal}
        btns={["No", "Yes"]}
        content={<ConfirmationContent />}
      />
    </div>
  );
};

export default RingtonCategories;
