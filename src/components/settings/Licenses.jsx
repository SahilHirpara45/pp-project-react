import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { Form, Formik, useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Typography } from "@mui/material";
import TextInputField from "../../common/inputFields/TextInputField";
import {
  deleteLicense,
  getLicenses,
  setLicense,
  updateLicense,
} from "../../store/settings/settings.slice";
import BaseTable from "../../common/table/BaseTable";
import ButtonComponent from "../../common/ButtonComponent";
import Loading from "../../common/Loading";
import { toastHandler } from "../../common/toast";
import ConfirmationModal from "../../common/ConfirmationModal";

const ConfirmationContent = () => {
  return (
    <>
      <Typography id="transition-modal-title" variant="h6" component="h2">
        Delete
      </Typography>
      <Typography id="transition-modal-description" sx={{ mt: 2 }}>
        Are you sure you want to delete this license?
      </Typography>
    </>
  );
};

const Licenses = () => {
  const dispatch = useDispatch();

  const {
    licensesTab: { licenses, loading },
  } = useSelector((state) => state.settings);

  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const [deleteLicenseId, setDeleteLicenseId] = useState(null);
  const [editLicenseId, setEditLicenseId] = useState(null);

  useEffect(() => {
    dispatch(getLicenses());
  }, []);

  const formik = useFormik({
    initialValues: {
      licenseName: "",
      licenseDesc: "",
    },
    validationSchema: yup.object().shape({
      licenseName: yup.string().required("Name must be required"),
      licenseDesc: yup.string().required("Description must be required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        license: values.licenseName,
        description: values.licenseDesc,
      };
      if (editLicenseId) {
        dispatch(updateLicense({ id: editLicenseId, payload }))
          .then((res) => {
            if (res?.payload?.success) {
              toastHandler("License edited successfully.", "success");
              dispatch(getLicenses());
            } else {
              toastHandler(res?.payload?.message || "Edit error!", "error");
            }
          })
          .catch(() => {
            toastHandler("Edit error!", "error");
          });

        setEditLicenseId(null);
      } else {
        dispatch(setLicense(payload))
          .then((res) => {
            if (res?.payload?.success) {
              toastHandler("License created successfully.", "success");
              dispatch(getLicenses());
            } else {
              toastHandler(res?.payload?.message || "Create error!", "error");
            }
          })
          .catch(() => {
            toastHandler("Create error!", "error");
          });
      }
      resetForm();
    },
  });

  const { handleSubmit, setValues, resetForm } = formik;

  const handleToggleConfirmationModal = (type = "no") => {
    if (type === "yes") {
      dispatch(deleteLicense(deleteLicenseId))
        .then((res) => {
          if (res?.payload?.success) {
            toastHandler("License deleted successfully.", "success");
            dispatch(getLicenses());
          } else {
            toastHandler(res?.payload?.message || "Delete error!", "error");
          }
        })
        .catch(() => {
          toastHandler("Delete error!", "error");
        });
    }
    setDeleteLicenseId(null);
    setIsOpenConfirmationModal(!isOpenConfirmationModal);
  };

  const handleEditLicense = (item) => {
    const values = {
      licenseName: item.license,
      licenseDesc: item.description,
    };
    setValues(values);
    setEditLicenseId(item._id);
  };

  const handleDeleteLicense = (item) => {
    setDeleteLicenseId(item._id);
    setIsOpenConfirmationModal(!isOpenConfirmationModal);
  };

  const columns = [
    {
      title: "No.",
      renderCell: (_, rowIndex, page, pageSize) => (
        <div>{(page - 1) * pageSize + rowIndex + 1}</div>
      ),
    },
    { title: "Licenses Name", field: "license" },
    { title: "License Description", field: "description" },
    {
      title: "Action",
      renderCell: (item) => (
        <div className="flex justify-center m-2">
          <ButtonComponent
            btnText="Edit"
            btnClass={"btn-warning"}
            onClick={() => handleEditLicense(item)}
          />
          <ButtonComponent
            btnText="Delete"
            btnClass={"btn-danger"}
            onClick={() => handleDeleteLicense(item)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="licenses-container">
      <Loading isLoading={loading} />

      <Formik>
        <Form onSubmit={handleSubmit} className="w-full">
          <div
            className="mb-3 p-4 rounded-md"
            style={{ backgroundColor: "#2e2e32" }}
          >
            <Grid
              container
              columnSpacing={2}
              rowSpacing={1}
              alignItems="center"
            >
              <Grid item xs={12} md={4}>
                <div className="mb-1">Licenses Name</div>
                <TextInputField name="licenseName" formik={formik} />
              </Grid>
              <Grid item xs={12} md={5}>
                <div className="mb-1">License Description</div>
                <TextInputField
                  multiline
                  minRows={10}
                  name="licenseDesc"
                  formik={formik}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <ButtonComponent
                  btnType="submit"
                  btnText={editLicenseId ? "Save" : "Add"}
                  btnClass="btn-info"
                />
                {editLicenseId && (
                  <span className="ml-2">
                    <ButtonComponent
                      btnClass="btn-danger"
                      btnText="Cancel"
                      onClick={() => {
                        resetForm();
                        setEditLicenseId(null);
                      }}
                    />
                  </span>
                )}
              </Grid>
            </Grid>
          </div>
        </Form>
      </Formik>

      <div>
        <BaseTable columns={columns} data={licenses} />
      </div>

      <ConfirmationModal
        open={isOpenConfirmationModal}
        handleToggle={handleToggleConfirmationModal}
        btns={["No", "Yes"]}
        content={<ConfirmationContent />}
      />
    </div>
  );
};

export default Licenses;
