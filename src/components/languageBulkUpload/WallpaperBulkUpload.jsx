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
  addBulkWallpaper,
  bulkUploadWallpaper,
  getWallpaperCategories,
  resetBulkUploadWallpaper,
} from "../../store/wallpapers/wallpapers.slice";
import { toast } from "react-toastify";
import * as Yup from "yup";

const WallpaperBulkUpload = () => {
  const dispatch = useDispatch();
  const [initialValue, setInitialValue] = useState({
    license: "",
    authorName: "",
    imageSource: "",
    wallpaperImage: "",
    wallpapers: [],
  });
  const [isLoading,setIsLoading]=useState(false)
  const imgRef = useRef(null);
  const {
    licensesTab: { licenses },
  } = useSelector((state) => state.settings);
  const { languages } = useSelector((state) => state.common);
  const { loading, bulkUploadWallpaperRes } = useSelector(
    (state) => state.wallpapers.bulkUploadWallpaper
  );
  const {
    categoriesTab: { categories },
  } = useSelector((state) => state.wallpapers);
  const [wallpaperCategories, setWallpaperCategories] = useState({});
  const [wallpapers, setWallpapers] = useState([]);

  useEffect(() => {
    dispatch(getLanguages());
    dispatch(getLicenses());

    return () => {
      dispatch(resetLanguages([]));
      dispatch(resetBulkUploadWallpaper(undefined));
    };
  }, []);

  useEffect(() => {
    const categories = {};
    const wallpapers = [];
    if (languages.length > 0) {
      for (let index = 0; index < languages.length; index++) {
        const language = languages[index];
        wallpapers.push({
          displayName: "",
          category: "",
          language: language._id,
          tages: [],
          isChecked: true,
        });
        dispatch(getWallpaperCategories({ lang: language?._id })).then(
          (data) => {
            categories[`${language?._id}`] = data?.payload?.map((item) => {
              return { label: item?.categoryName, value: item?._id };
            });
          }
        );
      }
    }
    setInitialValue((prev) => ({
      ...prev,
      wallpapers,
    }));
    setWallpapers(wallpapers);
    console.log(categories, "categories");
    setWallpaperCategories(categories);
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
      setIsLoading(true);
      const finalWallapers = values.wallpapers
        .filter((item) => item.isChecked)
        .map((item) => {
          delete item.isChecked;
          return item;
        });
      const payload = {
        size: bulkUploadWallpaperRes?.size,
        resolution: bulkUploadWallpaperRes?.resolution,
        url: bulkUploadWallpaperRes?.url,
        rawUrl: bulkUploadWallpaperRes?.rawUrl,
        author: values?.authorName,
        sourceUrl: values?.imageSource,
        license: values?.license,
        isPublished: true,
        wallpapers: finalWallapers,
      };
      dispatch(addBulkWallpaper(payload)).then((res) => {
        if (res?.payload?.success) {
          setIsLoading(false)
          toast.success(res?.payload?.message);
          dispatch(resetBulkUploadWallpaper(undefined));
          resetForm({
            values: {
              ...initialValue,
              wallpapers,
            },
          });
          imgRef.current.value = null;
        }
        else{
          setIsLoading(false);
          toast.error("Something went wrong !");
          resetForm({
            values: {
              ...initialValue,
              wallpapers,
            },
          });
          imgRef.current.value = null;

        }
      });
      
    },
  });

  const handleBlur = (e, index) => {
    const tages = e.target.value.split(
      /[,،⸲⸴⹁⹉∘、︐︑﹐﹑，､·∘՝߸፣᠂᠈⹌꓾꘍꛵𑑍𑑚𖺗𝪇ʻʽ‚]+/u
    );
    const currentTages = formik.values.wallpapers[index].tages;
    const updatedTages = tages.filter(
      (tag) => !currentTages.find((t) => t === tag)
    ).map((tag)=>tag.trim());
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
  console.log(formik.errors, "errors");
  return (
    <div>
      <Formik>
        {/* <Form className="w-full"> */}
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
              <Grid item xs={12} sm={2} md={2} className="flex items-end pb-1">
                <ButtonComponent
                  btnType="button"
                  btnText={"Upload"}
                  btnClass="btn-info"
                  isDisabled={loading}
                  onClick={() => {
                    const formData = new FormData();
                    formData.append("photo", imgRef.current.files[0]);
                    dispatch(bulkUploadWallpaper(formData)).then((res) => {
                      if (res?.payload?.success) {
                        toast.success(res?.payload?.message);
                      }
                    });
                  }}
                />
              </Grid>
            </Grid>
          </div>
          {bulkUploadWallpaperRes ? (
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
                                <div className="mb-1">Wallpaper Name</div>
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
                                    wallpaperCategories[
                                      `${wallpaper.language}`
                                    ] || []
                                  }
                                  placeholder="Select Category"
                                  disabled={
                                    !formik.values.wallpapers[index].isChecked
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={6}>
                                <div className="mb-1">Wallpaper Tags</div>
                                <AddTags
                                  tags={
                                    formik.values.wallpapers[index]?.tages || []
                                  }
                                  handleRemoveTag={(tagIndex) =>
                                    handleRemoveTag(tagIndex, index)
                                  }
                                  handleBlur={(e) => {
                                    handleBlur(e, index);
                                  }}
                                  isDisabled={
                                    !formik.values.wallpapers[index]?.isChecked
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
                ? "Upload Wallpaper First"
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
                          <div className="mb-1">Wallpaper Name</div>
                          <TextInputField
                            formik={formik}
                            name="wallpaperName"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <div className="mb-1">Category</div>
                          <SelectInputField
                            formik={formik}
                            name="category"
                            options={
                              wallpaperCategories[`${lan?.language}`] || []
                            }
                            placeholder="Select Category"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                          <div className="mb-1">Wallpaper Tags</div>
                          <AddTags
                            tags={formik.values.authorName || []}
                            handleRemoveTag={() => {}}
                            handleBlur={() => {}}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                );
              })} */}
          {bulkUploadWallpaperRes && formik.values.wallpapers.length > 0 && (
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

export default WallpaperBulkUpload;
