import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import ButtonComponent from "../../common/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewPage,
  getHTMLPageDetails,
  setHTMLPageDetails,
} from "../../store/settings/settings.slice";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const QuillMinimal = ({ isEditMode, fileName, value, formik }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState(value);
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["link", "blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "script",
    "indent",
    "link",
    "direction",
    "color",
    "background",
    "align",
  ];

  // const { quill, quillRef } = useQuill({ modules, formats });
  // quill?.on("text-change", () => {
  //   onChangeHandler
  //     ? onChangeHandler(quill.root.innerHTML)
  //     : setContent(quill.root.innerHTML);
  // });

  // useEffect(() => {
  //   console.log(!content, "valuesss");
  //   !content && setContent(value);
  // }, [value]);
  return (
    <div>
      {/* <div
        ref={quillRef}
        style={{ backgroundColor: "white", color: "black" }}
      /> */}
      <ReactQuill
        theme="snow"
        value={formik ? formik.values?.pageContent : content}
        modules={modules}
        formats={formats}
        className={"bg-white text-black"}
        onChange={(text) => {
          formik ? formik.setFieldValue("pageContent", text) : setContent(text);
        }}
      />
      {isEditMode && (
        <div className="flex justify-end my-3">
          <ButtonComponent
            btnClass="btn-info"
            btnText="Submit"
            onClick={() => {
              dispatch(addNewPage({ data: content, file: fileName })).then(
                (res) => {
                  if (res?.payload?.success) {
                    toast.success("Updated successfully");
                    dispatch(getHTMLPageDetails());
                  } else {
                    toast.error(res?.payload?.message || "Page not updated");
                  }
                }
              );
            }}
          />
        </div>
      )}
    </div>
  );
};
export default QuillMinimal;
