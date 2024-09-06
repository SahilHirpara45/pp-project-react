import React from "react";
import { Chip } from "@mui/material";

const AddTags = ({
  tags = [],
  handleRemoveTag = () => {},
  handleBlur = () => {},
  isDisabled = false,
}) => {
  return (
    <div
      className={"p-2 bg-white rounded-md w-full"}
      style={{ minHeight: "100px" }}
    >
      {tags.map((tag, index) => (
        <Chip
          key={tag}
          style={{ margin: "3px" }}
          label={tag}
          onDelete={() => handleRemoveTag(index)}
          disabled={isDisabled}
        />
      ))}

      <input
        className="text-black outline-none ml-2 w-full"
        autocomplete="on"
        placeholder="Add tag"
        onBlur={handleBlur}
        disabled={isDisabled}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            handleBlur(e);
          }
        }}
      />
    </div>
  );
};

export default AddTags;
