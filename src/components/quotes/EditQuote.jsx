import React, { useEffect, useRef } from "react";
import TextInputField from "../../common/inputFields/TextInputField";
import * as yup from "yup";
import { Formik, useFormik } from "formik";
import SelectInputField from "../../common/inputFields/SelectInputField";
import PreviewFile from "../../common/PreviewFile";
import { useDispatch, useSelector } from "react-redux";
import { getLanguages, resetLanguages } from "../../store/common/common.slice";
import {
  addQuotes,
  getQuotesCategories,
} from "../../store/quotes/quotes.slice";
import { toastHandler } from "../../common/toast";
import AddTags from "../../common/AddTags";
import Loading from "../../common/Loading";
import { Grid } from "@mui/material";
import ButtonComponent from "../../common/ButtonComponent";
import { isValidFileType } from "../../utils/validFileType";

const initialValue = {
  language: "",
  quote: "",
  category: "",
  authorName: "",
  quoteTags: [],
};

const EditQuotes = ({ title, isEdit }) => {
  const dispatch = useDispatch();

  const {
    categoriesTab: { categories },
  } = useSelector((state) => state.quotes);
  const { languages } = useSelector((state) => state.common);
  const { userInfo } = useSelector((state) => state.login);
  const { loading } = useSelector((state) => state.quotes.addQuote);

  useEffect(() => {
    dispatch(getLanguages());

    return () => {
      dispatch(resetLanguages([]));
    };
  }, []);

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: yup.object().shape({
      language: yup.string().required("Language name must be required"),
      quote: yup.string().required("Quote must be required"),
      category: yup.string().required("Category must be required"),
      // authorName: yup.string().required("Author name must be required"),
      // imageSource: yup.string().required("Image source must be required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        quote: values.quote,
        language: values.language,
        favourite: 0,
        author: values.authorName,
        user: userInfo?.name,
        category: values.category,
        tages: values.quoteTags,
        isPublished: userInfo?.isAdmin ? true : false,
      };
      const formData = new FormData();
      Object.keys(payload).map((key) => formData.append(key, payload[key]));
      dispatch(addQuotes(formData))
        .then((res) => {
          if (res?.payload?.success) {
            toastHandler("Quote created successfully.", "success");
            // resetForm();
            resetForm({
              values: {
                ...initialValue,
                language: userInfo?.isAdmin ? "" : userInfo?.language,
              },
            });
          } else {
            toastHandler(
              res?.payload?.message || "Something went wrong.",
              "error"
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  const { values, handleSubmit, setFieldValue } = formik;

  const handleRemoveTag = (index) => {
    let newTags = [...values.quoteTags];
    newTags.splice(index, 1);
    setFieldValue("quoteTags", [...newTags]);
  };

  const handleBlur = (e) => {
    const tags = e.target.value.split(
      /[,،⸲⸴⹁⹉∘、︐︑﹐﹑，､·∘՝߸፣᠂᠈⹌꓾꘍꛵𑑍𑑚𖺗𝪇ʻʽ‚]+/u
    );
    const updatedTags = tags.filter(
      (tag) => !formik.values.quoteTags.find((t) => t === tag)
    );
    if (e.target.value && updatedTags.length > 0) {
      setFieldValue("quoteTags", [...values.quoteTags, ...updatedTags]);
    }
    e.target.value = null;
  };

  useEffect(() => {
    if (values.language) {
      dispatch(getQuotesCategories({ lang: values.language }));
    }
  }, [values.language]);

  useEffect(() => {
    if (!userInfo?.isAdmin) {
      formik.setFieldValue("language", userInfo?.language);
    }
  }, [userInfo?.isAdmin]);

  return (
    <>
      <Loading isLoading={loading} />
      <div
        className="p-5 rounded-md"
        style={{
          backgroundColor: "#2e2e32",
        }}
      >
        <div className="mb-6 text-lg">{title}</div>

        <Formik>
          <>
            <Grid container columnSpacing={2} rowSpacing={1}>
              {!isEdit && (
                <Grid item xs={12}>
                  <div className="mb-1">Choose Language</div>
                  <SelectInputField
                    formik={formik}
                    name="language"
                    options={
                      languages.map((lang) => ({
                        label: lang.language,
                        value: lang._id,
                      })) || []
                    }
                    placeholder="Select Language"
                    disabled={!userInfo?.isAdmin}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <div className="mb-1">Quote</div>
                <TextInputField
                  formik={formik}
                  name="quote"
                  multiline
                  minRows={3}
                  maxRows={3}
                />
              </Grid>

              <Grid item xs={12}>
                <div className="mb-1">Category</div>
                <SelectInputField
                  formik={formik}
                  name="category"
                  options={
                    categories.map((cat) => ({
                      label: cat.categoryName,
                      value: cat._id,
                    })) || []
                  }
                  placeholder="Select Category"
                />
              </Grid>

              {/* <Grid item xs={12} sm={6} md={4}>
              <div className="mb-1">License</div>
              <SelectInputField
                formik={formik}
                name="license"
                options={
                  licenses.map((cat) => ({
                    label: cat.license,
                    value: cat._id,
                  })) || []
                }
                placeholder="Select License"
              />
            </Grid> */}

              <Grid item xs={12}>
                <div className="mb-1">Author Name</div>
                <TextInputField formik={formik} name="authorName" />
              </Grid>

              {/* <Grid item xs={12} sm={6} md={4}>
              <div className="mb-1">Image Source</div>
              <TextInputField formik={formik} name="imageSource" />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <div className="mb-1">Wallpaper Image</div>
              <TextInputField
                formik={formik}
                name="wallpaperImage"
                type="file"
                inputRef={imgRef}
              />
            </Grid> */}

              <Grid item xs={12}>
                <div className="mb-1">Quote Tags</div>
                <AddTags
                  tags={values.quoteTags}
                  handleRemoveTag={handleRemoveTag}
                  handleBlur={handleBlur}
                />
              </Grid>
            </Grid>

            <div className="mt-2">
              <ButtonComponent
                btnClass="btn-info"
                btnText={isEdit ? "Update" : "Upload"}
                onClick={handleSubmit}
                isDisabled={loading}
              />
            </div>
          </>
        </Formik>
      </div>
    </>
  );
};

export default EditQuotes;
