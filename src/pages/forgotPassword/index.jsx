import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { Link } from "react-router-dom";
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
  forgotPassword,
  login,
  loginWithToken,
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

const ForgotPassword = () => {
  const dispatch = useDispatch();
  //   const navigate = useNavigate();
  //   const location = useLocation();

  const loading = useSelector((state) => state.login.forgotPassword.loading);

  const [isLoading, setIsLoading] = useState(false);

  //   useEffect(() => {
  //     const token = localStorage.getItem("pixtunToken");

  //     if (token) {
  //       dispatch(loginWithToken()).then((res) => {
  //         if (res) {
  //           if (location.state?.currentPath) {
  //             navigate(location.state.currentPath);
  //           } else {
  //             navigate("/");
  //           }
  //         }
  //         setIsLoading(false);
  //       });
  //     } else {
  //       setIsLoading(false);
  //     }
  //   }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      // confirmPassword: "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().email().required("Email is required"),
      // confirmPassword: yup.string().required("Confirm Password is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      dispatch(forgotPassword(values)).then((res) => {
        if (res?.payload?.success) {
          toastHandler(
            res?.payload?.message || "Password reset link sent successfully",
            "success"
          );
          resetForm();
        } else {
          toastHandler(res?.payload?.message, "error");
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
            Forgot Password
          </Typography>

          <Formik>
            <Form onSubmit={handleSubmit}>
              <TextInputField
                type="email"
                wrapperClassName="my-5"
                inputClassName="w-full"
                name="email"
                label="Email"
                formik={formik}
                autoFocus
              />

              {/* <TextInputField
                type="text"
                wrapperClassName="my-5"
                inputClassName="w-full"
                name="confirmPassword"
                label="Confirm Password"
                formik={formik}
                autoComplete="current-password"
              /> */}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                className="mb-3"
              >
                Submit
                {loading && <CircularProgress className="!w-4 !h-4 ml-2" />}
              </Button>
              <div className="flex justify-center">
                <Link to="/login">Login here</Link>
              </div>
            </Form>
          </Formik>

          {/* <Box mt={2}>
            <Copyright />
          </Box> */}
        </div>
      </Paper>
    </div>
  );
};

export default ForgotPassword;
