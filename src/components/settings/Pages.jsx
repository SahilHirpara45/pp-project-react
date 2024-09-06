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
  addNewPage,
  deleteHTMLPage,
  getHTMLPageDetails,
} from "../../store/settings/settings.slice.js";
import Loading from "../../common/Loading.jsx";
import AddNewPage from "./AddNewPage.jsx";
import { toast } from "react-toastify";
import { DeleteOutline } from "@mui/icons-material";
import ConfirmationModal from "../../common/ConfirmationModal.jsx";
import { Typography } from "@mui/material";

const ConfirmationContent = () => (
  <>
    <Typography id="transition-modal-title" variant="h6" component="h2">
      Delete
    </Typography>
    <Typography id="transition-modal-description" sx={{ mt: 2 }}>
      Are you sure you want to delete this Page?
    </Typography>
  </>
);

const Pages = () => {
  const dispatch = useDispatch();
  const [addNewPageModal, setAddNewPageModal] = useState(false);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState({
    showModal: false,
    pageId: undefined,
  });
  const { loading, pageContent } = useSelector(
    (state) => state.settings.pagesTab
  );
  const [pageData, setPageData] = useState(pageContent);

  useEffect(() => {
    dispatch(getHTMLPageDetails());
  }, []);

  const handleToggleModal = () => {
    setAddNewPageModal((prev) => !prev);
  };

  const deleteHandler = (id) => {
    setDeleteConfirmationModal({
      showModal: true,
      pageId: id,
    });
  };

  const onDeleteHandler = (clickedBtn) => {
    if (clickedBtn === "yes") {
      dispatch(deleteHTMLPage({ id: deleteConfirmationModal.pageId })).then(
        (res) => {
          if (res?.payload?.success) {
            dispatch(getHTMLPageDetails());
            setDeleteConfirmationModal({
              showModal: false,
              pageId: undefined,
            });
            toast.success("Page deleted successfully");
          } else {
            toast.error(res?.payload?.message || "Page not deleted");
          }
        }
      );
    } else {
      setDeleteConfirmationModal({
        showModal: false,
        pageId: undefined,
      });
    }
  };

  return (
    <>
      <Loading isLoading={loading} />
      <div className="flex justify-between mb-3">
        <h1 className="text-2xl">Pages</h1>
        <ButtonComponent
          btnClass="btn-info"
          btnText="Add New Page"
          onClick={handleToggleModal}
        />
      </div>
      <div
        className="flex flex-wrap mb-3 p-4 rounded-md"
        style={{ backgroundColor: "#2e2e32", overflowAnchor: "none" }}
      >
        {pageContent &&
          pageContent.map((page, index) => {
            return (
              <div
                key={Math.random()}
                className="w-full py-5 px-10 rounded-md"
                style={{
                  backgroundColor: "#292929",
                }}
              >
                <div className="flex justify-between items-center">
                  <h2 className="mb-3" style={{ fontSize: "20px" }}>
                    {page.file}
                  </h2>
                  <DeleteOutline onClick={() => deleteHandler(page._id)} />
                </div>
                <QuillMinimal
                  isEditMode={true}
                  fileName={page.file}
                  value={page.data}
                />
              </div>
            );
          })}
      </div>
      <AddNewPage open={addNewPageModal} handleToggle={handleToggleModal} />
      <ConfirmationModal
        open={deleteConfirmationModal.showModal}
        handleToggle={onDeleteHandler}
        btns={["No", "Yes"]}
        content={<ConfirmationContent />}
      />
    </>
  );
};

export default Pages;
