import React, { useEffect, useState } from "react";
import * as yup from "yup";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Form, Formik, useFormik } from "formik";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import LockPersonOutlinedIcon from "@mui/icons-material/LockPersonOutlined";
import {
  login,
  loginWithToken,
  resetPassword,
} from "../../store/login/login.slice";
import TextInputField from "../../common/inputFields/TextInputField";
import { toastHandler } from "../../common/toast";
import Loading from "../../common/Loading";

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "} {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const ResetPassword = () => {
  const dispatch = useDispatch();
  const [params] = useSearchParams();
  const loading = useSelector((state) => state.login.resetPassword.loading);

  // const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const token = localStorage.getItem("pixtunToken");

  //   if (token) {
  //     dispatch(loginWithToken()).then((res) => {
  //       if (res) {
  //         if (
  //           location.state?.currentPath &&
  //           location.state?.currentPath !== "/"
  //         ) {
  //           navigate(location.state.currentPath);
  //         } else {
  //           if (res?.payload?.isAdmin) {
  //             navigate("/");
  //           } else {
  //             navigate("/wallpapers");
  //           }
  //         }
  //       }
  //       setIsLoading(false);
  //     });
  //   } else {
  //     setIsLoading(false);
  //   }
  // }, []);

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: yup.object().shape({
      newPassword: yup.string().required("New Password is required"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword")], "New Password must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        password: values.newPassword,
        id: params.get("id"),
      };
      dispatch(resetPassword(payload)).then((res) => {
        if (res?.payload?.success) {
          toastHandler("Password reset successfully", "success");
          resetForm();
        } else {
          toastHandler(res?.payload?.message, "error");
          // resetForm();
        }
      });
    },
  });

  const { handleSubmit } = formik;

  return (
    <div
      className="h-screen flex justify-center items-center"
      style={{ backgroundColor: "#2c2d30" }}
    >
      <Paper elevation={4} className="p-6 !max-w-md !w-full !rounded-2xl">
        <div className="login-form">
          {/* <Avatar className="mx-auto">
            <LockPersonOutlinedIcon />
          </Avatar> */}
          <Typography component="h1" variant="h5" className="text-center">
            Reset Password
          </Typography>

          <Formik>
            <Form onSubmit={handleSubmit}>
              <TextInputField
                type="password"
                wrapperClassName="my-5"
                inputClassName="w-full"
                name="newPassword"
                label="New Password"
                formik={formik}
                autoFocus
              />

              <TextInputField
                type="text"
                wrapperClassName="my-5"
                inputClassName="w-full"
                name="confirmPassword"
                label="Confirm Password"
                formik={formik}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                className="mb-2"
              >
                Submit
                {loading && <CircularProgress className="!w-4 !h-4 ml-2" />}
              </Button>
              {/* <div className="flex justify-center">
                <Link to="/forgot-password">Forgot Password ?</Link>
              </div> */}
            </Form>
          </Formik>

          <Box mt={2}>
            <Copyright />
          </Box>
        </div>
      </Paper>
    </div>
  );
};

export default ResetPassword;
