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
  getRingtonsCategories,
  resetUploadRingtone,
  uploadBulkRingtones,
  uploadRingtone,
} from "../../store/ringtons/ringtons.slice";
import { toast } from "react-toastify";
import * as Yup from "yup";

const RingtoneTypes = [
  {
    label: "Ringtone",
    value: "ringtone",
  },
  {
    label: "Notification",
    value: "notification",
  },
  {
    label: "Alarm",
    value: "alarm",
  },
];

const RingtoneBulkUpload = () => {
  const dispatch = useDispatch();

  const ringtonRef = useRef();
  const [initialValue, setInitialValue] = useState({
    license: "",
    authorName: "",
    soundSource: "",
    ringtoneType: "",
    ringtone: "",
    ringtones: [],
  });
  const [isLoading,setIsLoading]=useState(false);
  const {
    licensesTab: { licenses },
  } = useSelector((state) => state.settings);
  const { languages } = useSelector((state) => state.common);
  const {
    categoriesTab: { categories },
  } = useSelector((state) => state.wallpapers);
  const { loading, bulkUploadRingtoneRes } = useSelector(
    (state) => state.ringtons.uploadRingtone
  );
  const [ringtoneCategories, setRingtoneCategories] = useState({});
  const [ringtones, setRingtones] = useState([]);

  useEffect(() => {
    dispatch(getLanguages());
    dispatch(getLicenses());

    return () => {
      dispatch(resetLanguages([]));
      dispatch(resetUploadRingtone(undefined));
    };
  }, []);

  useEffect(() => {
    console.log(languages, "languages");
    const categories = {};
    const ringtones = [];
    if (languages.length > 0) {
      for (let index = 0; index < languages.length; index++) {
        const language = languages[index];
        ringtones.push({
          displayName: "",
          category: "",
          language: language._id,
          tages: [],
          isChecked: true,
        });
        dispatch(getRingtonsCategories({ lang: language?._id })).then(
          (data) => {
            categories[`${language?._id}`] = data?.payload?.map((item) => {
              return { label: item?.categoryName, value: item?._id };
            });
          }
        );
      }
    }
    console.log(categories, "categories");
    setInitialValue((prev) => ({
      ...prev,
      ringtones,
    }));
    setRingtones(ringtones);
    setRingtoneCategories(categories);
  }, [languages]);

  const formik = useFormik({
    initialValues: initialValue,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      license: Yup.string().required("Enter license"),
      ringtones: Yup.array().of(
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
      const finalRingtones = values.ringtones
        .filter((item) => item.isChecked)
        .map((item) => {
          delete item.isChecked;
          return item;
        });
      const payload = {
        size: bulkUploadRingtoneRes?.size,
        url: bulkUploadRingtoneRes?.url,
        time: bulkUploadRingtoneRes?.time,
        author: values.authorName,
        type: values.ringtoneType,
        sourceUrl: values.soundSource,
        license: values.license,
        isPublished: true,
        ringtones: finalRingtones,
      };
      dispatch(uploadBulkRingtones(payload)).then((data) => {
        if (data?.payload?.success) {
          toast.success(data?.payload?.message);
          dispatch(resetUploadRingtone(undefined));
          resetForm({
            values: {
              ...initialValue,
              ringtones,
            },
          });
          ringtonRef.current.value = null;
        }
        else{
          toast.error('Something went wrong !');
          dispatch(resetUploadRingtone(undefined));
          resetForm({
            values: {
              ...initialValue,
              ringtones,
            },
          });
          ringtonRef.current.value = null;
          setIsLoading(false)
        }
      });
      
    },
  });

  const handleBlur = (e, index) => {
    const tages = e.target.value.split(
      /[,،⸲⸴⹁⹉∘、︐︑﹐﹑，､·∘՝߸፣᠂᠈⹌꓾꘍꛵𑑍𑑚𖺗𝪇ʻʽ‚]+/u
    );
    const currentTages = formik.values.ringtones[index].tages;
    const updatedTages = tages.filter(
      (tag) => !currentTages.find((t) => t === tag)
    );
    if (e.target.value && updatedTages.length > 0) {
      formik.setFieldValue(`ringtones.${index}.tages`, [
        ...currentTages,
        ...updatedTages,
      ]);
    }
    e.target.value = null;
  };
  const handleRemoveTag = (tagIndex, index) => {
    let newTages = [...formik.values.ringtones[index].tages];
    newTages.splice(tagIndex, 1);
    formik.setFieldValue(`ringtones.${index}.tages`, [...newTages]);
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
                <div className="mb-1">Sound Source</div>
                <TextInputField formik={formik} name="soundSource" />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <div className="mb-1">Ringtone Type</div>
                <SelectInputField
                  formik={formik}
                  name="ringtoneType"
                  options={RingtoneTypes}
                  placeholder="Select Ringtone Type"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <div className="mb-1">Upload the Ringtone</div>
                <TextInputField
                  formik={formik}
                  name="ringtone"
                  type="file"
                  inputRef={ringtonRef}
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
                    formData.append("ringtone", ringtonRef.current.files[0]);
                    dispatch(uploadRingtone(formData)).then((res) => {
                      if (res?.payload?.success) {
                        toast.success(res?.payload?.message);
                      }
                    });
                  }}
                />
              </Grid>
            </Grid>
          </div>

          {bulkUploadRingtoneRes ? (
            <FieldArray
              name="ringtones"
              render={(arrayHelpers) => {
                return (
                  <div>
                    {formik.values.ringtones.map((ringtone, index) => {
                      return (
                        <div
                          className="p-4 mb-3 rounded-md"
                          style={{ backgroundColor: "#2e2e32" }}
                        >
                          <div className="flex items-center mb-5">
                            <input
                              type="checkbox"
                              className="mr-3"
                              name={`ringtones.${index}.isChecked`}
                              onChange={formik.handleChange}
                              checked={formik.values.ringtones[index].isChecked}
                            />
                            <p
                              style={{ fontSize: "20px" }}
                              className="text-white"
                            >
                              {
                                languages.find(
                                  (lang) => lang._id === ringtone?.language
                                )?.language
                              }
                            </p>
                          </div>
                          <div>
                            <Grid container columnSpacing={2} rowSpacing={1}>
                              <Grid item xs={12} sm={6} md={4}>
                                <div className="mb-1">Rington Name</div>
                                <TextInputField
                                  formik={formik}
                                  name={`ringtones.${index}.displayName`}
                                  disabled={
                                    !formik.values.ringtones[index].isChecked
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <div className="mb-1">Category</div>
                                <SelectInputField
                                  formik={formik}
                                  name={`ringtones.${index}.category`}
                                  options={
                                    ringtoneCategories[
                                      `${ringtone?.language}`
                                    ] || []
                                  }
                                  placeholder="Select Category"
                                  disabled={
                                    !formik.values.ringtones[index].isChecked
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={6}>
                                <div className="mb-1">Rington Tags</div>
                                <AddTags
                                  tags={formik.values.ringtones[index].tages}
                                  handleRemoveTag={(tagIndex) =>
                                    handleRemoveTag(tagIndex, index)
                                  }
                                  handleBlur={(e) => handleBlur(e, index)}
                                  isDisabled={
                                    !formik.values.ringtones[index].isChecked
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
              {formik.values.ringtones.length > 0
                ? "Upload Ringtone First"
                : "No Language Found"}
            </h1>
          )}

          {/* {languages?.length > 0 &&
              languages.map((lan) => {
                return (
                  
                );
              })} */}
          {bulkUploadRingtoneRes && formik.values.ringtones.length > 0 && (
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

export default RingtoneBulkUpload;
