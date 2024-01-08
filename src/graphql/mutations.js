/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSample = /* GraphQL */ `
  mutation CreateSample(
    $input: CreateSampleInput!
    $condition: ModelSampleConditionInput
  ) {
    createSample(input: $input, condition: $condition) {
      device_id
      sample_time
      data
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateSample = /* GraphQL */ `
  mutation UpdateSample(
    $input: UpdateSampleInput!
    $condition: ModelSampleConditionInput
  ) {
    updateSample(input: $input, condition: $condition) {
      device_id
      sample_time
      data
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteSample = /* GraphQL */ `
  mutation DeleteSample(
    $input: DeleteSampleInput!
    $condition: ModelSampleConditionInput
  ) {
    deleteSample(input: $input, condition: $condition) {
      device_id
      sample_time
      data
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
