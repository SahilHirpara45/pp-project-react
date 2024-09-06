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
  deleteWallpaper,
  editWallpaper,
  publishWallpaper,
} from "../../store/wallpapers/wallpapers.slice";
import ConfirmationModal from "../../common/ConfirmationModal.jsx";
import { toastHandler } from "../../common/toast.js";
import AddTags from "../../common/AddTags.jsx";

const getInitialValues = (data) => {
  return {
    name: data?.displayName || "",
    category: data?.category?._id,
    license: data?.license?._id,
    favourite: data?.favourite || "",
    tages: data?.tages || [],
  };
};
const ConfirmationContent = () => (
  <>
    <Typography id="transition-modal-title" variant="h6" component="h2">
      Delete
    </Typography>
    <Typography id="transition-modal-description" sx={{ mt: 2 }}>
      Are you sure you want to delete this wallapper?
    </Typography>
  </>
);

const Card = ({ index, data, fetchFunction, selectHandler, checked }) => {
  const dispatch = useDispatch();
  console.log(data, "data in card");
  const {
    categoriesTab: { categories },
  } = useSelector((state) => state.wallpapers);
  const {
    licensesTab: { licenses },
  } = useSelector((state) => state.settings);
  const { userInfo } = useSelector((state) => state.login);

  const [initialValue, setInitialValue] = useState(getInitialValues(data));
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const [deleteWallpaperId, setDeleteWallpaperId] = useState(null);
  const [isEditable, setIsEditable] = useState(false);

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: Yup.object().shape({
      // name: Yup.string().required("Enter Name"),
      category: Yup.string().required("Enter Category"),
      license: Yup.string().required("Enter License"),
      // favourite: Yup.string().required("Enter Favourite"),
    }),
    onSubmit: (values) => {
      const payload = {
        displayName: values.name,
        category: values.category,
        license: values.license,
        favourite: +values.favourite,
        tages: values.tages,
      };
      const formData = new FormData();
      Object.keys(payload).map((val) => formData.append(val, payload[val]));
      dispatch(editWallpaper({ id: data?._id, payload: formData })).then(
        (res) => {
          if (res?.payload?.success) {
            setIsEditable(false);
            toastHandler("Wallpaper updated successfully.", "success");
            fetchFunction();
          } else {
            toastHandler(res?.payload?.message || "Update error!", "error");
          }
        }
      );
    },
  });

  const publishWallpaperHandler = () => {
    dispatch(
      publishWallpaper({ language: data.language, id: [data?._id] })
    ).then((res) => {
      if (res?.payload?.success) {
        toastHandler("Wallpaper published successfully.", "success");
        fetchFunction();
      } else {
        toastHandler(res?.payload?.message || "Something went wrong.", "error");
      }
    });
  };

  const handleDeleteWallpaper = () => {
    setDeleteWallpaperId(data._id);
    setIsOpenConfirmationModal(!isOpenConfirmationModal);
  };

  const handleToggleConfirmationModal = (type = "no") => {
    if (type === "yes") {
      dispatch(
        deleteWallpaper({ language: data.language, id: [deleteWallpaperId] })
      )
        .then((res) => {
          if (res?.payload?.success) {
            toastHandler("Wallpaper deleted successfully.", "success");
            fetchFunction();
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
      <div className="flex flex-wrap justify-between text-white p-3 my-2 wallpaper-card-warpper">
        <Grid container columnSpacing={2} rowSpacing={1}>
          <Grid item xs={12} sm={6} md={3}>
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
              <div className="image-container">
                <img src={data?.rawUrl || Barbi} alt="" />
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <div className="discription">
              <ul>
                <li>
                  <div className="flex items-center card-selector">
                    <div className="label">Name:</div>
                    <TextInputField
                      name="name"
                      wrapperClassName="w-full mb-0"
                      inputClassName="form-control"
                      formik={formik}
                      disabled={!isEditable}
                    />
                    {/* <input type="text" value={formik.values.name} /> */}
                  </div>
                </li>
                <li>
                  <div className="flex items-center card-selector">
                    <div className="label">Category:</div>
                    <SelectInputField
                      wrapperClassName="w-full"
                      inputClassName="form-control"
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
                  {/* Category:{" "}
              <select name="cars" id="cars" className="text-black">
                <option value="volvo">Volvo</option>
                <option value="saab">Saab</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
              </select> */}
                </li>
                <li>
                  <div className="flex items-center card-selector">
                    <div className="label">License:</div>
                    <SelectInputField
                      wrapperClassName="w-full"
                      inputClassName="form-control"
                      name="license"
                      options={
                        licenses?.map((cat) => ({
                          label: cat.license,
                          value: cat._id,
                        })) || []
                      }
                      formik={formik}
                      // isShowError={false}
                      placeholder="Select License"
                      disabled={!isEditable}
                    />
                  </div>
                  {/* License:{" "}
              <select name="cars" id="cars" className="text-black">
                <option value="volvo">Volvo</option>
                <option value="saab">Saab</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
              </select> */}
                </li>
                <li>
                  <div className="flex items-center card-selector">
                    <div className="label">Favorite:</div>
                    <TextInputField
                      type="number"
                      wrapperClassName="w-full mb-0"
                      inputClassName="form-control"
                      formik={formik}
                      value={formik.values.favourite || "0"}
                      name="favourite"
                      disabled={!isEditable}
                    />
                    {/* <input type="text" value={formik.values.favourite} /> */}
                  </div>
                </li>
                <li>
                  <div className="flex items-center card-selector">
                    <div className="label">User:</div>
                    <span>{data?.user || ""}</span>
                  </div>
                </li>
                <li>
                  <div className="flex items-center card-selector">
                    <div className="label">W x H:</div>
                    <span>{data?.resolution || ""}</span>
                  </div>
                </li>
                <li>
                  <div className="flex items-center card-selector">
                    <div className="label">Size:</div>
                    <span>{data?.size || ""}</span>
                  </div>
                </li>
                <li>
                  <div className="flex items-center card-selector">
                    <div className="label">author:</div>
                    <span>{data?.author || ""}</span>
                  </div>
                </li>
                <li>
                  <div className="flex items-center card-selector">
                    <div className="label">source:</div>
                    <span>{data?.sourceUrl || ""}</span>
                  </div>
                </li>
              </ul>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <div className="mx-5">
              <div className="mb-1">Tages</div>
              <div>
                <AddTags
                  tags={formik.values.tages}
                  handleRemoveTag={handleRemoveTag}
                  handleBlur={handleBlur}
                  isDisabled={!isEditable}
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={1}>
            <div className="flex flex-col">
              <ButtonComponent
                onClick={() => {
                  window.open(data?.url, "_blank");
                }}
                btnClass={"btn-success"}
                btnText={"View"}
              />
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
                  onClick={handleDeleteWallpaper}
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
                  onClick={publishWallpaperHandler}
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
