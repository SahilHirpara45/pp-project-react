import React, { useEffect, useRef } from "react";
import TextInputField from "../../common/inputFields/TextInputField";
import * as yup from "yup";
import { Formik, useFormik } from "formik";
import SelectInputField from "../../common/inputFields/SelectInputField";
import PreviewFile from "../../common/PreviewFile";
import { useDispatch, useSelector } from "react-redux";
import { getLanguages, resetLanguages } from "../../store/common/common.slice";
import {
  addWallpaper,
  getWallpaperCategories,
} from "../../store/wallpapers/wallpapers.slice";
import { getLicenses } from "../../store/settings/settings.slice";
import { toastHandler } from "../../common/toast";
import AddTags from "../../common/AddTags";
import Loading from "../../common/Loading";
import { Grid } from "@mui/material";
import ButtonComponent from "../../common/ButtonComponent";
import { isValidFileType } from "../../utils/validFileType";

const initialValue = {
  language: "",
  wallpaperName: "",
  category: "",
  license: "",
  authorName: "",
  imageSource: "",
  wallpaperImage: "",
  wallpaperTags: [],
};

const EditWallpaper = ({ title, isEdit }) => {
  const dispatch = useDispatch();
  const imgRef = useRef();

  const {
    categoriesTab: { categories },
  } = useSelector((state) => state.wallpapers);
  const { languages } = useSelector((state) => state.common);
  const {
    licensesTab: { licenses },
  } = useSelector((state) => state.settings);
  const { userInfo } = useSelector((state) => state.login);
  const { loading } = useSelector((state) => state.wallpapers.addWallpaper);

  useEffect(() => {
    dispatch(getLanguages());
    dispatch(getLicenses());

    return () => {
      dispatch(resetLanguages([]));
    };
  }, []);

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: yup.object().shape({
      language: yup.string().required("Language name must be required"),
      // wallpaperName: yup.string().required("Wallpaper name must be required"),
      category: yup.string().required("Category must be required"),
      license: yup.string().required("License must be required"),
      // authorName: yup.string().required("Author name must be required"),
      // imageSource: yup.string().required("Image source must be required"),
      wallpaperImage: yup
        .mixed()
        .required("Image is required")
        .test(
          "is-valid-type",
          "Supported type (png, jpg, jpeg, svg, gif, webp)",
          (value) => isValidFileType(value && value.name.toLowerCase(), "image")
        ),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        displayName: values.wallpaperName,
        language: values.language,
        photo: values.wallpaperImage,
        favourite: 0,
        author: values.authorName,
        user: userInfo?.name,
        category: values.category,
        tages: values.wallpaperTags,
        license: values.license,
        sourceUrl: values.imageSource,
        isPublished: userInfo?.isAdmin ? true : false,
      };
      const formData = new FormData();
      Object.keys(payload).map((key) => formData.append(key, payload[key]));
      dispatch(addWallpaper(formData))
        .then((res) => {
          console.log(res, "response from addWallpaper");
          if (res?.payload?.success) {
            toastHandler("Wallapper created successfully.", "success");
            // formik.setValues((prev) => ({
            //   ...prev,
            //   // language: "",
            //   wallpaperName: "",
            //   category: "",
            //   license: "",
            //   authorName: "",
            //   imageSource: "",
            //   wallpaperImage: "",
            //   wallpaperTags: [],
            // }));
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
      imgRef.current.value = "";
    },
  });

  const { values, handleSubmit, setFieldValue } = formik;

  const handleRemoveTag = (index) => {
    let newTags = [...values.wallpaperTags];
    newTags.splice(index, 1);
    setFieldValue("wallpaperTags", [...newTags]);
  };

  const handleBlur = (e) => {
    // /[,،⸲⸴⹁⹉∘、︐︑﹐﹑，､·∘՝߸፣᠂᠈⹌꓾꘍꛵𑑍𑑚𖺗𝪇ʻʽ ‍̒ ‍̓ ‍̔ ‚]+/u;

    const tags = e.target.value.split(
      /[,،⸲⸴⹁⹉∘、︐︑﹐﹑，､·∘՝߸፣᠂᠈⹌꓾꘍꛵𑑍𑑚𖺗𝪇ʻʽ‚]+/u
    );
    console.log(tags,"tags");
    const updatedTags = tags.filter(
      (tag) => !formik.values.wallpaperTags.find((t) => t === tag)
    ).map((tag)=>tag.trim());

    if (e.target.value && updatedTags.length > 0) {
      setFieldValue("wallpaperTags", [...values.wallpaperTags, ...updatedTags]);
    }
    e.target.value = null;
  };

  useEffect(() => {
    if (values.language) {
      dispatch(getWallpaperCategories({ lang: values.language }));
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
                <Grid item xs={12} sm={6} md={4}>
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

              <Grid item xs={12} sm={6} md={4}>
                <div className="mb-1">Wallpaper Name</div>
                <TextInputField formik={formik} name="wallpaperName" />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
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

              <Grid item xs={12} sm={6} md={4}>
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
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <div className="mb-1">Author Name</div>
                <TextInputField formik={formik} name="authorName" />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
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
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <div className="mb-1">Wallpaper Tags</div>
                <AddTags
                  tags={values.wallpaperTags}
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

        {values.wallpaperImage && (
          <div className="w-2/4 flex align-middle mt-7">
            <PreviewFile file={values.wallpaperImage} />
          </div>
        )}
      </div>
    </>
  );
};

export default EditWallpaper;
