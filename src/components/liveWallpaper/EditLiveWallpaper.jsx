import React, { useEffect, useRef } from "react";
import * as yup from "yup";
import { Formik, useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@mui/material";

import TextInputField from "../../common/inputFields/TextInputField";
import SelectInputField from "../../common/inputFields/SelectInputField";
import { getLanguages, resetLanguages } from "../../store/common/common.slice";
import {
  addLiveWallpaper,
  getLiveWallpaperCategories,
} from "../../store/liveWallpapers/liveWallpapers.slice";
import { getLicenses } from "../../store/settings/settings.slice";
import { toastHandler } from "../../common/toast";
import AddTags from "../../common/AddTags";
import ButtonComponent from "../../common/ButtonComponent";
import { isValidFileType } from "../../utils/validFileType";
import Loading from "../../common/Loading";
// import PreviewFile from "../../common/PreviewFile";
// import { isValidFileType } from "../../utils/validFileType";

const initialValue = {
  liveWallpaperName: "",
  language: "",
  originalVideo: "",
  authorName: "",
  category: "",
  liveWallpaperTags: [],
  license: "",
  videoSource: "",
  // smallSizeVideo: "",
  // thumbnailVideo: "",
};

const EditLiveWallpaper = ({ title, isEdit }) => {
  const dispatch = useDispatch();
  const originalVideoRef = useRef();
  // const smallVideoRef = useRef();
  // const thumbnailVideoRef = useRef();

  const { categories } = useSelector(
    (state) => state.liveWallpapers.categoriesTab
  );
  const { languages } = useSelector((state) => state.common);
  const { licenses } = useSelector((state) => state.settings.licensesTab);
  const { loading } = useSelector(
    (state) => state.liveWallpapers.addLiveWallpapers
  );
  const { userInfo } = useSelector((state) => state.login);

  useEffect(() => {
    dispatch(getLanguages());
    dispatch(getLicenses());

    return () => {
      dispatch(resetLanguages([]));
    };
  }, []);

  useEffect(() => {
    if (!userInfo?.isAdmin) {
      formik.setFieldValue("language", userInfo?.language);
    }
  }, [userInfo?.isAdmin]);

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: yup.object().shape({
      language: yup.string().required("Language is required"),
      // liveWallpaperName: yup
      //   .string()
      //   .required("Live wallpaper name is required"),
      category: yup.string().required("Category is required"),
      license: yup.string().required("License is required"),
      // thumbnailVideo: yup
      //   .mixed()
      //   .required("Image is required")
      //   .test("is-valid-type", "Supported type (mp4)", (value) =>
      //     isValidFileType(value && value.name.toLowerCase(), "video")
      //   ),
      // smallSizeVideo: yup
      //   .mixed()
      //   .required("Video is required")
      //   .test("is-valid-type", "Supported type (mp4)", (value) =>
      //     isValidFileType(value && value.name.toLowerCase(), "video")
      //   )
      //   .test(
      //     "is-valid-size",
      //     "Max allowed size is 5MB",
      //     (value) => value && value.size <= MAX_FILE_SIZE
      //   ),
      originalVideo: yup
        .mixed()
        .required("Video is required")
        .test("is-valid-type", "Supported type (mp4)", (value) =>
          isValidFileType(value && value.name.toLowerCase(), "video")
        ),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        displayName: values.liveWallpaperName,
        language: values.language,
        video: values.originalVideo,
        favourite: 0,
        author: values.authorName,
        user: userInfo?.name,
        category: values.category,
        tages: values.liveWallpaperTags,
        license: values.license,
        sourceUrl: values.videoSource,
        // smallVideo: values.smallSizeVideo,
        // thumbVideo: values.thumbnailVideo,
        isPublished: userInfo?.isAdmin ? true : false,
      };

      const formData = new FormData();
      Object.keys(payload).map((key) => formData.append(key, payload[key]));

      dispatch(addLiveWallpaper(formData))
        .then((res) => {
          if (res?.payload?.success) {
            toastHandler("Live wallapper created successfully.", "success");
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
      originalVideoRef.current.value = "";
      // thumbnailVideoRef.current.value = "";
      // smallVideoRef.current.value = "";
    },
  });

  const { values, handleSubmit, setFieldValue } = formik;

  const handleRemoveTag = (index) => {
    let newTags = [...values.liveWallpaperTags];
    newTags.splice(index, 1);
    setFieldValue("liveWallpaperTags", [...newTags]);
  };

  const handleBlur = (e) => {
    const tags = e.target.value.split(
      /[,،⸲⸴⹁⹉∘、︐︑﹐﹑，､·∘՝߸፣᠂᠈⹌꓾꘍꛵𑑍𑑚𖺗𝪇ʻʽ‚]+/u
    );
    const updatedTags = tags.filter(
      (tag) => !formik.values.liveWallpaperTags.find((t) => t === tag)
    );
    if (e.target.value && updatedTags.length > 0) {
      setFieldValue("liveWallpaperTags", [
        ...values.liveWallpaperTags,
        ...updatedTags,
      ]);
    }
    e.target.value = null;
  };

  useEffect(() => {
    if (values.language) {
      dispatch(getLiveWallpaperCategories({ lang: values.language }));
    }
  }, [values.language]);

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
                <div className="mb-1">Live Wallpaper Name</div>
                <TextInputField formik={formik} name="liveWallpaperName" />
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
                <div className="mb-1">Video Source</div>
                <TextInputField formik={formik} name="videoSource" />
              </Grid>

              {/* <Grid item xs={12} sm={6} md={4}>
                <div className="mb-1">Thumbnail Image</div>
                <TextInputField
                  formik={formik}
                  name="thumbnailImage"
                  type="file"
                  inputRef={thumbnailImageRef}
                />
              </Grid> */}

              {/* <Grid item xs={12} sm={6} md={4}>
                <div className="mb-1">Thumbnail Video</div>
                <TextInputField
                  formik={formik}
                  name="thumbnailVideo"
                  type="file"
                  inputRef={thumbnailVideoRef}
                />
              </Grid> */}

              <Grid item xs={12} sm={6} md={4}>
                <div className="mb-1">Original Video</div>
                <TextInputField
                  formik={formik}
                  name="originalVideo"
                  type="file"
                  inputRef={originalVideoRef}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <div className="mb-1">Live Wallpaper Tags</div>
                <AddTags
                  tags={values.liveWallpaperTags}
                  handleRemoveTag={handleRemoveTag}
                  handleBlur={handleBlur}
                />
              </Grid>
            </Grid>

            <div className="mt-2">
              <ButtonComponent
                btnClass="btn-info text-white"
                btnText={isEdit ? "Update" : "Upload"}
                onClick={handleSubmit}
                isDisabled={loading}
              />
            </div>
          </>
        </Formik>

        {/* {values.wallpaperImage && (
        <div className="w-2/4 flex align-middle mt-7">
          <PreviewFile file={values.wallpaperImage} />
        </div>
      )} */}
      </div>
    </>
  );
};

export default EditLiveWallpaper;
