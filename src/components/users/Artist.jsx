import React, { useEffect, useState } from "react";
import BaseTable from "../../common/table/BaseTable";
import ButtonComponent from "../../common/ButtonComponent";
import * as yup from "yup";
import { Form, Formik, useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import SelectInputField from "../../common/inputFields/SelectInputField";
import { getLanguages } from "../../store/common/common.slice";
import {
  deactiveUser,
  deleteUser,
  getUsers,
  setUser,
  updateUser,
} from "../../store/users/users.slice";
import ConfirmationModal from "../../common/ConfirmationModal";
import { Grid, Typography } from "@mui/material";
import TextInputField from "../../common/inputFields/TextInputField";
import Loading from "../../common/Loading";
import { toastHandler } from "../../common/toast";

const ConfirmationContent = () => {
  return (
    <>
      <Typography id="transition-modal-title" variant="h6" component="h2">
        Delete
      </Typography>
      <Typography id="transition-modal-description" sx={{ mt: 2 }}>
        Are you sure you want to delete this user?
      </Typography>
    </>
  );
};
const ConfirmationContentForDeactiveUser = ({ activeStatus }) => {
  return (
    <>
      <Typography id="transition-modal-title" variant="h6" component="h2">
        {activeStatus ? "Active User" : "Deactive User"}
      </Typography>
      <Typography id="transition-modal-description" sx={{ mt: 2 }}>
        {`Are you sure you want to ${
          activeStatus ? "activate" : "deactivate"
        } this user?`}
      </Typography>
    </>
  );
};

const Artist = () => {
  const dispatch = useDispatch();

  const { languages } = useSelector((state) => state.common);
  const { loading, artists } = useSelector((state) => state.users.artist);

  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const [isDisableUserConformationModal, setIsDisableUserConformationModal] =
    useState({ showModal: false, userId: null, currentStatus: null });
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    dispatch(getLanguages());
    getAllUsers();
  }, []);

  const formik = useFormik({
    initialValues: {
      language: "",
      name: "",
      email: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      language: yup.string().required("Language is required"),
      name: yup.string().required("Name is required"),
      email: yup.string().required("Email is required"),
      password: yup.string().required("Password is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log(values, "submit");

      if (editUserId) {
        dispatch(updateUser({ id: editUserId, payload: values }))
          .then((res) => {
            if (res?.payload?.success) {
              toastHandler("User edited successfully.", "success");
              getAllUsers();
            } else {
              toastHandler(res?.payload?.message || "Edit error!", "error");
            }
          })
          .catch((error) => {
            console.log(error);
            toastHandler("Edit error!", "error");
          });

        setEditUserId(null);
      } else {
        dispatch(setUser(values))
          .then((res) => {
            if (res?.payload?.success) {
              toastHandler("User created successfully.", "success");
              getAllUsers();
            } else {
              toastHandler(res?.payload?.message || "Create error!", "error");
            }
          })
          .catch((error) => {
            console.log(error);
            toastHandler("Create error!", "error");
          });
      }
      resetForm();
    },
  });

  const { handleSubmit, resetForm, setValues } = formik;

  const getAllUsers = () => {
    dispatch(getUsers());
  };

  const handleToggleConfirmationModal = (type = "no") => {
    if (type === "yes") {
      dispatch(deleteUser(deleteUserId))
        .then((res) => {
          if (res?.payload?.success) {
            toastHandler("User deleted successfully.", "success");
            getAllUsers();
          } else {
            toastHandler(res?.payload?.message || "Delete error!", "error");
          }
        })
        .catch(() => {
          toastHandler("Delete error!", "error");
        });
    }
    setIsOpenConfirmationModal(!isOpenConfirmationModal);
    setDeleteUserId(null);
  };
  const handleInactiveUserConfirmationModal = (type = "no") => {
    if (type === "yes") {
      dispatch(
        deactiveUser({
          id: isDisableUserConformationModal.userId,
          status: !isDisableUserConformationModal.currentStatus,
        })
      )
        .then((res) => {
          if (res?.payload?.success) {
            getAllUsers();
            toastHandler(
              `User ${
                isDisableUserConformationModal.currentStatus
                  ? "Activated"
                  : "Disabled"
              } successfully.`,
              "success"
            );
          } else {
            toastHandler(
              res?.payload?.message || "User Inactive error!",
              "error"
            );
          }
        })
        .catch(() => {
          toastHandler("User Inactive error!", "error");
        });
    }
    setIsDisableUserConformationModal({
      showModal: false,
      userId: null,
      currentStatus: null,
    });
  };

  const handleEditUser = ({ _id, language, name, email }) => {
    const values = {
      language: language._id,
      name,
      email,
      password: "",
    };
    setValues(values);
    setEditUserId(_id);
  };

  const handleDeleteUser = (item) => {
    setDeleteUserId(item._id);
    setIsOpenConfirmationModal(!isOpenConfirmationModal);
  };

  const columns = [
    {
      title: "No.",
      renderCell: (_, rowIndex, page, pageSize) => (
        <div>{(page - 1) * pageSize + rowIndex + 1}</div>
      ),
    },
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    { title: "Language", field: "language.language" },
    {
      title: "Status",
      renderCell: (item) => (
        <ButtonComponent
          onClick={() => {
            setIsDisableUserConformationModal({
              showModal: true,
              userId: item._id,
              currentStatus: item?.isDisabled,
            });
          }}
          btnText={item?.isDisabled ? "Disabled" : "Active"}
          btnClass={item?.isDisabled ? "btn-danger" : "btn-success"}
        />
      ),
    },
    {
      title: "Delete",
      renderCell: (item) => (
        <ButtonComponent
          btnText="Delete"
          btnClass={"btn-danger"}
          onClick={() => handleDeleteUser(item)}
        />
      ),
    },
    {
      title: "Action",
      renderCell: (item) => (
        <div className="cursor-pointer" onClick={() => handleEditUser(item)}>
          Change password
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <Loading isLoading={loading} />

      <div className="text-lg">Add New artist User</div>

      <div className="my-4">
        <Formik>
          <Form onSubmit={handleSubmit}>
            <Grid container columnSpacing={2} rowSpacing={1}>
              <Grid item xs={12} sm={6} md={3}>
                <div className="mb-1">Choose Language</div>
                <SelectInputField
                  formik={formik}
                  name="language"
                  options={
                    languages.map((lan) => ({
                      label: lan.language,
                      value: lan._id,
                    })) || []
                  }
                  placeholder="Select Language"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <div className="mb-1">Name</div>
                <TextInputField name="name" formik={formik} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <div className="mb-1">Email</div>
                <TextInputField name="email" formik={formik} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <div className="mb-1">Password</div>
                <TextInputField
                  type="password"
                  name="password"
                  formik={formik}
                />
              </Grid>
            </Grid>

            <div className="mt-2">
              <ButtonComponent
                btnType="submit"
                btnText={editUserId ? "Save" : "Add"}
                btnClass="btn-info"
              />
              {editUserId && (
                <span className="ml-2">
                  <ButtonComponent
                    btnClass="btn-danger"
                    btnText="Cancel"
                    onClick={() => {
                      resetForm();
                      setEditUserId(null);
                    }}
                  />
                </span>
              )}
            </div>
          </Form>
        </Formik>
      </div>

      <div>
        <BaseTable columns={columns} data={artists} />
      </div>

      <ConfirmationModal
        open={isOpenConfirmationModal}
        handleToggle={handleToggleConfirmationModal}
        btns={["No", "Yes"]}
        content={<ConfirmationContent />}
      />
      <ConfirmationModal
        open={isDisableUserConformationModal.showModal}
        handleToggle={handleInactiveUserConfirmationModal}
        btns={["No", "Yes"]}
        content={
          <ConfirmationContentForDeactiveUser
            activeStatus={isDisableUserConformationModal.currentStatus}
          />
        }
      />
    </div>
  );
};

export default Artist;
