/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  TextAreaField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createSample } from "../graphql/mutations";
const client = generateClient();
export default function SampleCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    device_id: "",
    sample_time: "",
    data: "",
  };
  const [device_id, setDevice_id] = React.useState(initialValues.device_id);
  const [sample_time, setSample_time] = React.useState(
    initialValues.sample_time
  );
  const [data, setData] = React.useState(initialValues.data);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setDevice_id(initialValues.device_id);
    setSample_time(initialValues.sample_time);
    setData(initialValues.data);
    setErrors({});
  };
  const validations = {
    device_id: [{ type: "Required" }],
    sample_time: [{ type: "Required" }],
    data: [{ type: "JSON" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          device_id,
          sample_time,
          data,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: createSample.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "SampleCreateForm")}
      {...rest}
    >
      <TextField
        label="Device id"
        isRequired={true}
        isReadOnly={false}
        value={device_id}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              device_id: value,
              sample_time,
              data,
            };
            const result = onChange(modelFields);
            value = result?.device_id ?? value;
          }
          if (errors.device_id?.hasError) {
            runValidationTasks("device_id", value);
          }
          setDevice_id(value);
        }}
        onBlur={() => runValidationTasks("device_id", device_id)}
        errorMessage={errors.device_id?.errorMessage}
        hasError={errors.device_id?.hasError}
        {...getOverrideProps(overrides, "device_id")}
      ></TextField>
      <TextField
        label="Sample time"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={sample_time}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              device_id,
              sample_time: value,
              data,
            };
            const result = onChange(modelFields);
            value = result?.sample_time ?? value;
          }
          if (errors.sample_time?.hasError) {
            runValidationTasks("sample_time", value);
          }
          setSample_time(value);
        }}
        onBlur={() => runValidationTasks("sample_time", sample_time)}
        errorMessage={errors.sample_time?.errorMessage}
        hasError={errors.sample_time?.hasError}
        {...getOverrideProps(overrides, "sample_time")}
      ></TextField>
      <TextAreaField
        label="Data"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              device_id,
              sample_time,
              data: value,
            };
            const result = onChange(modelFields);
            value = result?.data ?? value;
          }
          if (errors.data?.hasError) {
            runValidationTasks("data", value);
          }
          setData(value);
        }}
        onBlur={() => runValidationTasks("data", data)}
        errorMessage={errors.data?.errorMessage}
        hasError={errors.data?.hasError}
        {...getOverrideProps(overrides, "data")}
      ></TextAreaField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
