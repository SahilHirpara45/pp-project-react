import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { get } from "lodash";
import { TextField, Autocomplete } from "@mui/material";

const SelectInputField = ({
  inputClassName = "",
  wrapperClassName = "",
  placeholder = "",
  isShowError = true,
  label = "",
  name = "",
  options = [],
  disabled = false,
  formik = null,
  getOptionLabel = null,
  getOptionValue = null,
  ...props
}) => {
  const { values, touched, errors, setFieldValue, setFieldTouched } =
    formik || {};

  const errorMessage = useMemo(
    () => get(errors, name, ""),
    [get(errors, name, "")]
  );

  const isError = useMemo(
    () => !disabled && !!get(touched, name, "") && !!errorMessage,
    [disabled, get(touched, name, ""), errorMessage]
  );

  const selectOptions = useMemo(
    () =>
      getOptionLabel || getOptionValue
        ? options.map((option) => ({
            label: getOptionLabel ? getOptionLabel(option) : option.label,
            value: getOptionValue ? getOptionValue(option) : option.value,
          }))
        : options,
    [options]
  );

  const formikProps = formik
    ? {
        name,
        onChange: (_, option) => setFieldValue(name, option.value),
        onBlur: () => setFieldTouched(name, true),
        value:
          selectOptions?.find(
            (option) => option?.value === get(values, name, "")
          ) || null,
        renderInput: (params) => (
          <TextField
            {...params}
            label={label}
            error={isError}
            placeholder={placeholder}
          />
        ),
      }
    : {};

  return (
    <div className={`${wrapperClassName}`}>
      <Autocomplete
        className={`w-full rounded-md bg-white ${inputClassName}`}
        size="small"
        options={selectOptions}
        disabled={disabled}
        renderInput={(params) => (
          <TextField {...params} label={label} placeholder={placeholder} />
        )}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.value}>
              {option.label}
            </li>
          );
        }}
        componentsProps={{
          popper: {
            popperOptions: {
              strategy: "fixed",
            },
          },
        }}
        disableClearable
        {...formikProps}
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

SelectInputField.propTypes = {
  inputClassName: PropTypes.string,
  placeholder: PropTypes.string,
  wrapperClassName: PropTypes.string,
  formik: PropTypes.object,
  label: PropTypes.string,
  isShowError: PropTypes.bool,
  name: PropTypes.string,
  options: PropTypes.array,
  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,
  disabled: PropTypes.bool,
  changeHandler: PropTypes.func,
  selectValue: PropTypes.number,
};

export default SelectInputField;
