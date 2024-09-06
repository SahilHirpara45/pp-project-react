import React, { useEffect, useState } from "react";
import TextInputField from "../../common/inputFields/TextInputField.jsx";
import ButtonComponent from "../../common/ButtonComponent.jsx";
import { useFormik } from "formik";
// import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";
import { useQuill } from "react-quilljs";
import QuillMinimal from "./Editor.jsx";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  addAdmob,
  addNewPage,
  deleteHTMLPage,
  getAdmob,
  getHTMLPageDetails,
} from "../../store/settings/settings.slice.js";
import Loading from "../../common/Loading.jsx";
import AddNewPage from "./AddNewPage.jsx";
import { toast } from "react-toastify";
import { DeleteOutline } from "@mui/icons-material";
import ConfirmationModal from "../../common/ConfirmationModal.jsx";
import { Typography } from "@mui/material";
import SwitchComp from "../../common/Switch.jsx";

const ADS = () => {
  const dispatch = useDispatch();
  const [initialValue, setInitialValue] = useState({
    displayAd: false,
    count: 0,
  });
  const { loading, pageContent } = useSelector(
    (state) => state.settings.pagesTab
  );
  const { loading: loadingADS, ADMobDetails } = useSelector(
    (state) => state.settings.ADMobTab
  );
  const formik = useFormik({
    initialValues: initialValue,
    enableReinitialize: true,
    // validationSchema: yup.object().shape({
    //   width: yup.string().required("Enter Width"),
    //   height: yup.string().required("Enter Height"),
    //   resolution: yup
    //     .number()
    //     .max(100, "Enter Valid Resolution")
    //     .required("Enter Resolution"),
    // }),
    onSubmit: (values, { resetForm }) => {
      console.log(values, "values");
      dispatch(addAdmob(values)).then((res) => {
        if (res?.payload?.success) {
          toast.success(res?.payload?.message);
          dispatch(getAdmob());
        }
      });
    },
  });

  useEffect(() => {
    dispatch(getAdmob());
  }, []);

  useEffect(() => {
    if (ADMobDetails) {
      console.log(ADMobDetails, "pageContentADS");
      setInitialValue(ADMobDetails);
    }
  }, [ADMobDetails]);

  return (
    <>
      <Loading isLoading={loadingADS} />
      <div className="flex justify-between mb-3">
        <h1 className="text-2xl">ADS</h1>
      </div>
      <div
        className="mb-3 p-4 rounded-md"
        style={{ backgroundColor: "#2e2e32", overflowAnchor: "none" }}
      >
        <div className="flex items-center mb-5">
          <p style={{ fontSize: "20px" }}>ADS</p>
          <SwitchComp
            checked={formik.values.displayAd}
            onChange={(event) => {
              formik.setFieldValue("displayAd", event.target.checked);
            }}
          />
        </div>
        <div className="flex">
          <div style={{ fontSize: "19px" }} className="me-3">
            Number of clicks to show initial ads
          </div>
          <TextInputField name="count" formik={formik} type="number" />
        </div>
        <div className="mt-2">
          <ButtonComponent
            btnType="submit"
            btnText={"Update"}
            btnClass="btn-info"
            onClick={formik.handleSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default ADS;
