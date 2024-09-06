import React, { useEffect } from "react";
import { Form, Formik, useFormik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { Grid } from "@mui/material";

import {
  getOtherSettingDetails,
  updateOtherSettingDetails,
} from "../../store/settings/settings.slice";
import { toastHandler } from "../../common/toast";
import ButtonComponent from "../../common/ButtonComponent";
import TextInputField from "../../common/inputFields/TextInputField";

const OtherSettings = () => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: { width: 0, height: 0, resolution: 0 },
    validationSchema: yup.object().shape({
      width: yup.string().required("Enter Width"),
      height: yup.string().required("Enter Height"),
      resolution: yup
        .number()
        .max(100, "Enter Valid Resolution")
        .required("Enter Resolution"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        width: +values.width,
        height: +values.height,
        resolution: +values.resolution,
      };
      dispatch(updateOtherSettingDetails(payload)).then((res) => {
        if (res?.payload?.success) {
          toastHandler("Thumbnail Details Updated Successfully", "success");
        } else {
          toastHandler(
            res?.payload?.message || "Thumbnail Details Not Updated",
            "error"
          );
        }
      });
    },
  });

  useEffect(() => {
    dispatch(getOtherSettingDetails()).then((res) => {
      formik.setValues({
        width: res?.payload?.width || "",
        height: res?.payload?.height || "",
        resolution: res?.payload?.resolution || "",
      });
    });
  }, []);

  const { handleSubmit } = formik;

  return (
    <>
      <div className="my-3 text-lg">Wallpaper thumbnail dimensions</div>

      <div
        className="p-4 mb-3 rounded-md"
        style={{ backgroundColor: "#2e2e32" }}
      >
        <Formik>
          <Form onSubmit={handleSubmit} className="w-full">
            <Grid container columnSpacing={2} rowSpacing={1}>
              <Grid item xs={12} sm={4} md={4}>
                <div className="mb-1">Width</div>
                <TextInputField name="width" formik={formik} type="number" />
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <div className="mb-1">Height</div>
                <TextInputField name="height" formik={formik} type="number" />
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <div className="mb-1">Resolution</div>
                <TextInputField
                  name="resolution"
                  formik={formik}
                  type="number"
                />
              </Grid>
            </Grid>

            <div className="mt-2">
              <ButtonComponent
                btnType="submit"
                btnText={"Update"}
                btnClass="btn-info"
              />
            </div>
          </Form>
        </Formik>
      </div>
      {/* <div className="my-3 text-lg">Live Wallpaper Quality</div> */}

      {/* <div
        className="p-4 mb-3 rounded-md"
        style={{ backgroundColor: "#2e2e32" }}
      >
        <Formik>
          <Form onSubmit={handleSubmit} className="w-full">
            <Grid container columnSpacing={2} rowSpacing={1}>
              <Grid item xs={12} sm={6} md={6}>
                <div className="mb-1">Resolution</div>
                <TextInputField
                  name="resolution"
                  formik={formik}
                  type="number"
                />
              </Grid>
            </Grid>

            <div className="mt-2">
              <ButtonComponent
                btnType="submit"
                btnText={true ? "Update" : "Add"}
                btnClass="btn-info"
              />
              {false && (
                <span className="ml-2">
                  <ButtonComponent
                    btnClass="btn-danger"
                    btnText="Cancel"
                    onClick={() => {
                      // resetForm();
                      // setEditUserId(null);
                    }}
                  />
                </span>
              )}
            </div>
          </Form>
        </Formik>
      </div> */}
    </>
  );
};

export default OtherSettings;
