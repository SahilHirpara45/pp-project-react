import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";
import { TextField } from "@mui/material";

// function that stop users to write e, +, -, and decimal point in number field.
// e => 69
// + => 107, 187
// - => 109, 189
// . => 110, 190
const invalidKeys = [69, 107, 109, 187, 189];
const onlyNumberKeys = (e) => {
  if (invalidKeys.includes(e.nativeEvent.which)) {
    e.preventDefault();
  }
};

const TextInputField = ({
  inputClassName = "",
  wrapperClassName = "",
  label = "",
  placeholder = "",
  name = "",
  type = "text",
  disabled = false,
  endAdornment = null,
  isCapitalize = false,
  disableCopyPaste = false,
  multiline = false,
  minRows = 1,
  maxRows = 1,
  errorMessage = "",
  isShowError = true,
  formik = {},
  ...props
}) => {
  const { values, touched, errors, setFieldValue, handleBlur } = formik || {};
  const isError =
    !disabled && !!get(touched, name, "") && !!get(errors, name, "");

  const copyPasteHandler = (e) => {
    if (disableCopyPaste) e.preventDefault();
  };

  const inputTypeNumberProps =
    type === "number" ? { onKeyDown: onlyNumberKeys } : {};

  const textFieldInputProps =
    type === "number" ? { inputProps: { min: 0 } } : {};

  return (
    <div className={`${wrapperClassName}`}>
      <TextField
        className={`w-full rounded-md text-lg bg-white ${inputClassName}`}
        label={label}
        size="small"
        name={name}
        value={type !== "file" ? get(values, name, "") : null}
        type={type}
        InputProps={{
          endAdornment,
          ...textFieldInputProps,
        }}
        placeholder={placeholder}
        onChange={(e) => {
          const value = type === "file" ? e.target.files[0] : e.target.value;
          setFieldValue(name, value);
        }}
        inputProps={{
          style: { textTransform: isCapitalize ? "uppercase" : "unset" },
        }}
        onBlur={handleBlur}
        error={isError || !!errorMessage}
        disabled={disabled}
        onCopy={copyPasteHandler}
        onPaste={copyPasteHandler}
        autoComplete="off"
        multiline={multiline}
        minRows={minRows}
        maxRows={maxRows}
        {...inputTypeNumberProps}
        {...props}
      />

      {isShowError && (
        <div className="h-2 text-xs text-red-500">
          {get(touched, name, "") ? get(errors, name, "") || errorMessage : ""}
        </div>
      )}
    </div>
  );
};

TextInputField.propTypes = {
  inputClassName: PropTypes.string,
  wrapperClassName: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  endAdornment: PropTypes.element,
  isCapitalize: PropTypes.bool,
  disableCopyPaste: PropTypes.bool,
  multiline: PropTypes.bool,
  minRows: PropTypes.number,
  maxRows: PropTypes.number,
  errorMessage: PropTypes.string,
  isShowError: PropTypes.bool,
  formik: PropTypes.object,
};

export default TextInputField;
