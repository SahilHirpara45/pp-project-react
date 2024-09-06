import { Grid } from "@mui/material";
import { FieldArray, Form, Formik, useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import TextInputField from "../../common/inputFields/TextInputField";
import ButtonComponent from "../../common/ButtonComponent";
import SelectInputField from "../../common/inputFields/SelectInputField";
import { useDispatch, useSelector } from "react-redux";
import { getLicenses } from "../../store/settings/settings.slice";
import { getLanguages, resetLanguages } from "../../store/common/common.slice";
import AddTags from "../../common/AddTags";
import {
  getLiveWallpaperCategories,
  resetBulkLiveWallpaper,
  uploadBulkLiveWallpaper,
  uploadLiveWallpaper,
} from "../../store/liveWallpapers/liveWallpapers.slice";
import { isEmpty } from "lodash";
import { toast } from "react-toastify";
import * as Yup from "yup";

const LiveWallpaperBulkUpload = () => {
  const dispatch = useDispatch();

  const originalVideoRef = useRef();
  const [initialValue, setInitialValue] = useState({
    license: "",
    authorName: "",
    videoSource: "",
    originalVideo: "",
    wallpapers: [],
  });
  const [isLoading,setIsLoading]=useState(false)
  const {
    licensesTab: { licenses },
  } = useSelector((state) => state.settings);
  const { languages } = useSelector((state) => state.common);
  const {
    categoriesTab: { categories },
  } = useSelector((state) => state.wallpapers);
  const { loading, bulkLiveWallpaperRes } = useSelector(
    (state) => state.liveWallpapers.uploadLiveWallpaper
  );

  const [liveWallpaperCategories, setLiveWallpaperCategories] = useState({});
  const [liveWallpapers, setLiveWallpapers] = useState([]);

  useEffect(() => {
    dispatch(getLanguages());
    dispatch(getLicenses());

    return () => {
      dispatch(resetLanguages([]));
      dispatch(resetBulkLiveWallpaper(undefined));
    };
  }, []);

  useEffect(() => {
    console.log(languages, "languages in liveWallpaperBulkUpload");
    const categories = {};
    const wallpapers = [];
    if (
      languages.length > 0 &&
      Object.keys(liveWallpaperCategories).length === 0
    ) {
      for (let index = 0; index < languages.length; index++) {
        const language = languages[index];
        wallpapers.push({
          displayName: "",
          category: "",
          language: language._id,
          tages: [],
          isChecked: true,
        });
        dispatch(getLiveWallpaperCategories({ lang: language?._id })).then(
          (data) => {
            categories[`${language?._id}`] = data?.payload?.map((item) => {
              return { label: item?.categoryName, value: item?._id };
            });
          }
        );
      }
    }
    setInitialValue((prev) => ({ ...prev, wallpapers }));
    setLiveWallpapers(wallpapers);
    setLiveWallpaperCategories(categories);
  }, [languages]);

  const formik = useFormik({
    initialValues: initialValue,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      license: Yup.string().required("Enter license"),
      wallpapers: Yup.array().of(
        Yup.object().shape({
          isChecked: Yup.boolean(),
          // displayName: Yup.string().test({
          //   test: function (value) {
          //     const isChecked = this.parent.isChecked;
          //     return isChecked ? !!value : true;
          //   },
          //   message: "Enter display name",
          // }),
          category: Yup.string().test({
            test: function (value) {
              const isChecked = this.parent.isChecked;
              return isChecked ? !!value : true;
            },
            message: "Enter category",
          }),
        })
      ),
    }),
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true)
      const finalWallapers = values.wallpapers
        .filter((item) => item.isChecked)
        .map((item) => {
          delete item.isChecked;
          return item;
        });
      const payload = {
        size: bulkLiveWallpaperRes?.size,
        rawUrl: bulkLiveWallpaperRes?.rawUrl,
        thumbUrl: bulkLiveWallpaperRes?.thumbUrl,
        smallUrl: bulkLiveWallpaperRes?.smallUrl,
        author: values.authorName,
        sourceUrl: values.videoSource,
        license: values.license,
        isPublished: true,
        wallpapers: finalWallapers,
      };
      dispatch(uploadBulkLiveWallpaper(payload)).then((res) => {
        if (res?.payload?.success) {
          toast.success(res?.payload?.message);
          resetForm({
            values: {
              ...initialValue,
              wallpapers: liveWallpapers,
            },
          });
          originalVideoRef.current.value = null;
          dispatch(resetBulkLiveWallpaper(undefined));
          setIsLoading(false)
        }
        else{
          toast.error('Something went wrong !');
          resetForm({
            values: {
              ...initialValue,
              wallpapers: liveWallpapers,
            },
          });
          originalVideoRef.current.value = null;
          dispatch(resetBulkLiveWallpaper(undefined));
          setIsLoading(false)
        }
      });
      
    },
  });
  console.log(liveWallpaperCategories, "liveWallpaperCategories");

  const handleBlur = (e, index) => {
    const tages = e.target.value.split(
      /[,،⸲⸴⹁⹉∘、︐︑﹐﹑，､·∘՝߸፣᠂᠈⹌꓾꘍꛵𑑍𑑚𖺗𝪇ʻʽ‚]+/u
    );
    const currentTages = formik.values.wallpapers[index].tages;
    const updatedTages = tages.filter(
      (tag) => !currentTages.find((t) => t === tag)
    );
    if (e.target.value && updatedTages.length > 0) {
      formik.setFieldValue(`wallpapers.${index}.tages`, [
        ...currentTages,
        ...updatedTages,
      ]);
    }
    e.target.value = null;
  };
  const handleRemoveTag = (tagIndex, index) => {
    let newTages = [...formik.values.wallpapers[index].tages];
    newTages.splice(tagIndex, 1);
    formik.setFieldValue(`wallpapers.${index}.tages`, [...newTages]);
  };

  return (
    <div>
      <Formik>
        {/* <Form onSubmit={formik.handleSubmit} className="w-full"> */}
        <>
          <div
            className="p-4 mb-3 rounded-md"
            style={{ backgroundColor: "#2e2e32" }}
          >
            <Grid container columnSpacing={2} rowSpacing={1}>
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
              <Grid item xs={12} sm={6} md={4}>
                <div className="mb-1">Original Video</div>
                <TextInputField
                  formik={formik}
                  name="originalVideo"
                  type="file"
                  inputRef={originalVideoRef}
                />
              </Grid>
              <Grid item xs={12} sm={2} md={2} className="flex items-end pb-1">
                <ButtonComponent
                  btnType="button"
                  btnText={"Upload"}
                  btnClass="btn-info"
                  isDisabled={loading}
                  onClick={() => {
                    const formData = new FormData();
                    formData.append("video", originalVideoRef.current.files[0]);
                    dispatch(uploadLiveWallpaper(formData)).then((res) => {
                      if (res?.payload?.success) {
                        toast.success(res?.payload?.message);
                      }
                    });
                  }}
                />
              </Grid>
            </Grid>
          </div>

          {bulkLiveWallpaperRes ? (
            <FieldArray
              name="wallpapers"
              render={(arrayHelpers) => {
                return (
                  <div>
                    {formik.values.wallpapers.map((wallpaper, index) => {
                      return (
                        <div
                          className="p-4 mb-3 rounded-md"
                          style={{ backgroundColor: "#2e2e32" }}
                        >
                          <div className="flex items-center mb-5">
                            <input
                              type="checkbox"
                              className="mr-3"
                              name={`wallpapers.${index}.isChecked`}
                              onChange={formik.handleChange}
                              checked={
                                formik.values.wallpapers[index].isChecked
                              }
                            />
                            <p
                              style={{ fontSize: "20px" }}
                              className="text-white"
                            >
                              {
                                languages.find(
                                  (lang) => lang._id === wallpaper?.language
                                )?.language
                              }
                            </p>
                          </div>
                          <div>
                            <Grid container columnSpacing={2} rowSpacing={1}>
                              <Grid item xs={12} sm={6} md={4}>
                                <div className="mb-1">Live Wallpaper Name</div>
                                <TextInputField
                                  formik={formik}
                                  name={`wallpapers.${index}.displayName`}
                                  disabled={
                                    !formik.values.wallpapers[index].isChecked
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <div className="mb-1">Category</div>
                                <SelectInputField
                                  formik={formik}
                                  name={`wallpapers.${index}.category`}
                                  options={
                                    liveWallpaperCategories[
                                      `${wallpaper?.language}`
                                    ] || []
                                  }
                                  placeholder="Select Category"
                                  disabled={
                                    !formik.values.wallpapers[index].isChecked
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={6}>
                                <div className="mb-1">Live Wallpaper Tags</div>
                                <AddTags
                                  tags={formik.values.wallpapers[index].tages}
                                  handleRemoveTag={(tagIndex) =>
                                    handleRemoveTag(tagIndex, index)
                                  }
                                  handleBlur={(e) => handleBlur(e, index)}
                                  isDisabled={
                                    !formik.values.wallpapers[index].isChecked
                                  }
                                />
                              </Grid>
                            </Grid>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }}
            />
          ) : (
            <h1 className="text-center" style={{ fontSize: "20px" }}>
              {formik.values.wallpapers.length > 0
                ? "Upload Live Wallpaper First"
                : "No Language Found"}
            </h1>
          )}

          {/* {languages?.length > 0 &&
              languages.map((lan) => {
                return (
                  <div
                    className="p-4 mb-3 rounded-md"
                    style={{ backgroundColor: "#2e2e32" }}
                  >
                    <p style={{ fontSize: "20px" }} className="text-white mb-5">
                      {lan.language}
                    </p>
                    <div>
                      <Grid container columnSpacing={2} rowSpacing={1}>
                        <Grid item xs={12} sm={6} md={4}>
                          <div className="mb-1">Live Wallpaper Name</div>
                          <TextInputField
                            formik={formik}
                            name="liveWallpaperName"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <div className="mb-1">Category</div>
                          <SelectInputField
                            formik={formik}
                            name="category"
                            options={
                              liveWallpaperCategories[`${lan?.language}`] || []
                            }
                            placeholder="Select Category"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                          <div className="mb-1">Live Wallpaper Tags</div>
                          <AddTags
                            tags={formik.values.liveWallpaperTags}
                            handleRemoveTag={() => {}}
                            handleBlur={() => {}}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                );
              })} */}
          {bulkLiveWallpaperRes && formik.values.wallpapers.length > 0 && (
            <div className="mt-2">
              <ButtonComponent
                btnType="submit"
                btnText={"Update"}
                btnClass="btn-info"
                onClick={formik.handleSubmit}
                isDisabled={isLoading}
              />
            </div>
          )}
        </>
        {/* </Form> */}
      </Formik>
    </div>
  );
};

export default LiveWallpaperBulkUpload;
