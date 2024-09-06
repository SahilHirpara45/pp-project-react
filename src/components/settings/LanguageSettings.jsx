import React, { useEffect, useState } from "react";
import ButtonComponent from "../../common/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  addLanguage,
  deleteLanguage,
  getLanguages,
  updateLanguage,
} from "../../store/common/common.slice.js";
import TextInputField from "../../common/inputFields/TextInputField.jsx";
import { Form, Formik, useFormik } from "formik";
import * as yup from "yup";
import { toastHandler } from "../../common/toast.js";
import Loading from "../../common/Loading.jsx";
import BaseTable from "../../common/table/BaseTable.jsx";
import ConfirmationModal from "../../common/ConfirmationModal.jsx";
import { Typography } from "@mui/material";

const ConfirmationContent = () => {
  return (
    <>
      <Typography id="transition-modal-title" variant="h6" component="h2">
        Delete
      </Typography>
      <Typography id="transition-modal-description" sx={{ mt: 2 }}>
        Are you sure you want to delete this language?
      </Typography>
    </>
  );
};

const LanguageSettings = () => {
  const dispatch = useDispatch();

  const { languages, loading: getLanguagesLoading } = useSelector(
    (state) => state.common
  );

  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const [deleteLanguageId, setDeleteLanguageId] = useState(null);
  const [editLanguageId, setEditLanguageId] = useState(null);

  useEffect(() => {
    dispatch(getLanguages());
  }, []);

  const formik = useFormik({
    initialValues: { languageName: "" },
    validationSchema: yup.object().shape({
      languageName: yup.string().required("Enter Language Name"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        language: values.languageName,
      };

      if (editLanguageId) {
        dispatch(updateLanguage({ id: editLanguageId, payload }))
          .then((res) => {
            if (res?.payload?.success) {
              toastHandler("Language edited successfully.", "success");
              dispatch(getLanguages());
            } else {
              toastHandler(res?.payload?.message || "Edit error!", "error");
            }
          })
          .catch(() => {
            toastHandler("Edit error!", "error");
          });

        setEditLanguageId(null);
      } else {
        dispatch(addLanguage(payload))
          .then((res) => {
            if (res?.payload?.success) {
              toastHandler("Language created successfully.", "success");
              dispatch(getLanguages());
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
      dispatch(deleteLanguage(deleteLanguageId))
        .then((res) => {
          if (res?.payload?.success) {
            toastHandler("Language deleted successfully.", "success");
            dispatch(getLanguages());
          } else {
            toastHandler(res?.payload?.message || "Delete error!", "error");
          }
        })
        .catch(() => {
          toastHandler("Delete error!", "error");
        });
    }
    setDeleteLanguageId(null);
    setIsOpenConfirmationModal(!isOpenConfirmationModal);
  };

  const handleEditLanguage = (item) => {
    const values = {
      languageName: item.language,
    };
    setValues(values);
    setEditLanguageId(item._id);
  };

  const handleDeleteLanguage = (item) => {
    setDeleteLanguageId(item._id);
    setIsOpenConfirmationModal(!isOpenConfirmationModal);
  };

  const columns = [
    {
      title: "No.",
      renderCell: (_, rowIndex, page, pageSize) => (
        <div>{(page - 1) * pageSize + rowIndex + 1}</div>
      ),
    },
    { title: "Language Name", field: "language" },
    {
      title: "Action",
      renderCell: (item) => (
        <div className="flex justify-center m-2">
          <ButtonComponent
            btnText="Edit"
            btnClass={"btn-warning"}
            onClick={() => handleEditLanguage(item)}
          />
          <ButtonComponent
            btnText="Delete"
            btnClass={"btn-danger"}
            onClick={() => handleDeleteLanguage(item)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="language-container">
      <Loading isLoading={getLanguagesLoading} />

      <Formik>
        <Form onSubmit={handleSubmit} className="w-full">
          <div
            className="flex flex-wrap mb-3 p-4 rounded-md"
            style={{ backgroundColor: "#2e2e32" }}
          >
            <div className="mr-5">Language Name</div>

            <div className="max-w-md w-full">
              <TextInputField
                wrapperClassName="w-full"
                name="languageName"
                formik={formik}
              />
            </div>

            <div className="mx-5">
              <ButtonComponent
                btnType="submit"
                btnText={editLanguageId ? "Save" : "Add"}
                btnClass="btn-info"
              />
              {editLanguageId && (
                <span className="ml-2">
                  <ButtonComponent
                    btnClass="btn-danger"
                    btnText="Cancel"
                    onClick={() => {
                      resetForm();
                      setEditLanguageId(null);
                    }}
                  />
                </span>
              )}
            </div>
          </div>
        </Form>
      </Formik>

      <div>
        <BaseTable columns={columns} data={languages} />
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

export default LanguageSettings;
