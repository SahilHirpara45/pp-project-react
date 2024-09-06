import { Backdrop, Box, Fade, Modal } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import TextInputField from "../../common/inputFields/TextInputField";
import QuillMinimal from "./Editor";
import ButtonComponent from "../../common/ButtonComponent";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import {
  addNewPage,
  getHTMLPageDetails,
  // resetAddNewPageResp,
} from "../../store/settings/settings.slice";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 3,
};

const AddNewPage = ({ open, handleToggle }) => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      pageTitle: "",
      pageContent: "",
    },
    validationSchema: Yup.object().shape({
      pageTitle: Yup.string().required("Page name is required"),
      pageContent: Yup.string().required("Page content is required"),
    }),
    onSubmit: (values) => {
      dispatch(
        addNewPage({
          file: values.pageTitle,
          data: values.pageContent,
        })
      ).then((res) => {
        if (res?.payload?.success) {
          dispatch(getHTMLPageDetails());
          handleToggle();
          toast.success("Page added successfully");
        } else {
          toast.error(res?.payload?.message || "Page not added");
        }
      });
    },
  });
  useEffect(() => {
    if (!open) {
      formik.resetForm();
      // dispatch(resetAddNewPageResp());
    }
  }, [open]);
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleToggle}
      closeAfterTransition
      //   slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <form onSubmit={formik.handleSubmit}>
          <Box className={`w-full max-w-xl`} sx={style}>
            <p className="text-xl mb-2">Add New Page</p>
            <hr />
            <div className="my-3">
              <div className="mb-1">Page Name</div>
              <TextInputField formik={formik} name="pageTitle" />
            </div>
            <div>
              <div className="mb-1">Page Content</div>
              <QuillMinimal value={formik.values.pageContent} formik={formik} />
              {formik.touched.pageContent && formik.errors.pageContent && (
                <div className="h-2 text-xs text-red-500">
                  {formik.errors.pageContent}
                </div>
              )}
            </div>
            <div className="flex justify-end my-3">
              <ButtonComponent
                btnType="button"
                btnClass="btn-danger"
                btnText="Cancel"
                onClick={handleToggle}
              />
              <ButtonComponent
                btnType="submit"
                btnClass="btn-info"
                btnText="submit"
              />
            </div>
          </Box>
        </form>
      </Fade>
    </Modal>
  );
};

export default AddNewPage;
