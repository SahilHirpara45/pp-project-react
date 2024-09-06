import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { login, loginWithToken } from "../../store/login/login.slice";
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

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const loginLoading = useSelector((state) => state.login.loading);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("pixtunToken");

    if (token) {
      dispatch(loginWithToken()).then((res) => {
        if (res) {
          if (
            location.state?.currentPath &&
            location.state?.currentPath !== "/"
          ) {
            navigate(location.state.currentPath);
          } else {
            if (res?.payload?.isAdmin) {
              navigate("/");
            } else {
              navigate("/wallpapers");
            }
          }
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().email().required("Email is required"),
      password: yup.string().required("Password is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      dispatch(login(values))
        .then((res) => {
          const { token, data } = res.payload;
          if (token) {
            localStorage.setItem("pixtunToken", token);
            toastHandler("Login Successfully.", "success");
            data?.isAdmin ? navigate("/") : navigate("/wallpapers");
            resetForm();
          } else {
            toastHandler("Invalid email or password!", "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  const { handleSubmit } = formik;

  return isLoading ? (
    <Loading isLoading={true} />
  ) : (
    <div
      className="h-screen flex justify-center items-center"
      style={{ backgroundColor: "#2c2d30" }}
    >
      <Paper elevation={4} className="p-6 !max-w-md !w-full !rounded-2xl">
        <div className="login-form">
          <Avatar className="mx-auto">
            <LockPersonOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className="text-center">
            Sign in
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

              <TextInputField
                type="password"
                wrapperClassName="my-5"
                inputClassName="w-full"
                name="password"
                label="Password"
                formik={formik}
                autoComplete="current-password"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loginLoading}
                className="mb-2"
              >
                Sign In
                {loginLoading && (
                  <CircularProgress className="!w-4 !h-4 ml-2" />
                )}
              </Button>
              <div className="flex justify-center">
                <Link to="/forgot-password">Forgot Password ?</Link>
              </div>
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

export default Login;
