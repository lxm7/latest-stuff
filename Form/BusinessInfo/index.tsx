import React, { useState, useEffect } from 'react';
import { Form, Grid, Message } from 'semantic-ui-react';
import { useQuery, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';

// components
import TextInput from 'components/common/TextInput';
import SelectDropdown from 'components/common/SelectDropdown';
import DatePicker from 'components/eprofile/common/DatePicker';

// styles / utils
import { fieldArgs } from 'components/eprofile/common/DatePicker/defaults';
import {
  nameValidation,
  noSpecialCharsValidation,
} from 'components/common/FormValidation';
import { StyledP, StyledSubText } from 'components/eprofile/styles';
import { StyledButton } from 'components/eprofile/common/Modal/styles';
import { FormRow, FormRowCentre } from 'components/common/styles';
import { inputPath } from 'components/eprofile/consts';
import { businessInformation, general } from 'components/eprofile/langEn';

import {
  loadTitleOptions,
  loadGenderOptions,
  sanitiseDropdownsInForm,
  isDisabled,
} from 'components/eprofile/utils';

import {
  BusinessInfoFormProps,
  BusinessInfoFormData,
  SuccessMessageState,
} from 'components/eprofile/types';
import { UPDATE_USER_DETAILS } from 'components/eprofile/queries';
import { BUSINESS_INFO, UPDATE_COMPANY_DETAILS } from './queries';

const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({
  readOnly = false,
  confirmButton = false,
  isCompanyAdmin,
  readOnlyUserText,
}) => {
  // Form submission msgs
  const [errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState<SuccessMessageState>(
    false
  );
  /**
   * Apollo data - useQuery fetches this forms data for the user
   *
   * sometimes we get half the values resolved, and others are
   * null. these nulls can sometimes throw a graphql error
   * and as default wont show any data even if its one value
   * thats errored. This setting will show all data thats
   * resolved whilst giving us an option to handle errored fields also
   */
  const { data, loading } = useQuery(BUSINESS_INFO, {
    errorPolicy: 'all',
  });

  const [
    updateCompanyDetails,
    {
      loading: companyNameSaving,
      error: companyNameError,
      called: companyCalled,
    },
  ] = useMutation(UPDATE_COMPANY_DETAILS, {
    // error state is set here at the point of an error being returned
    onError: () => setErrorMessage(true),
  });
  const [
    updateUserDetails,
    { loading: userDetailsSaving, error: userDetailsError, called: userCalled },
  ] = useMutation(UPDATE_USER_DETAILS, {
    onError: () => setErrorMessage(true),
  });

  // Local state to merge multiple dropdowns to a single string
  const [dobValue, setDobValue] = useState<string | null>(null);

  // RHF initialisation
  const { handleSubmit, register, control, reset, errors } = useForm({
    defaultValues: { ...data } || null,
    mode: 'onBlur',
  });

  /**
   * RHF reset sets its local state to display server values and update our form
   */
  useEffect(() => reset({ ...data }), [data, reset]);

  /** sets the state of the success message */
  useEffect(() => {
    // sets the state of the success message
    if (
      !companyCalled ||
      !userCalled ||
      companyNameError ||
      companyNameSaving ||
      userDetailsError ||
      userDetailsSaving
    )
      return;
    setSuccessMessage(true);
    // sets a timeout so that the message only displays for a short while
    const successTimeout = setTimeout(() => {
      setSuccessMessage(false);
    }, 3000);

    return () => {
      clearTimeout(successTimeout);
    };
  }, [companyCalled, userCalled, userDetailsSaving, companyNameSaving]);

  /** function called on Dismiss of error message */
  const handleDismiss = () => {
    setErrorMessage(false);
  };

  /**
   * This handles form submission / mutations to send to the server
   * @param {object} formData
   */
  const submit = (formData: BusinessInfoFormData) => {
    setErrorMessage(false);
    const {
      company: { name, vat, businessNumber },
      user,
    } = formData;

    // update company name
    updateCompanyDetails({
      variables: {
        input: {
          name,
          vat,
          businessNumber,
        },
      },
    });

    // update user details
    updateUserDetails({
      variables: {
        id: data.user.id,
        input: {
          ...sanitiseDropdownsInForm(user),
          // We hardcode this bit here as we dont want to pass individual
          // dateofbirth input names into the mutation, just the concat string value
          profile: {
            gender: sanitiseDropdownsInForm(user).profile.gender,
            dateOfBirth: dobValue || null,
          },
        },
      },
    });
  };

  /** disabled element */
  const disabled = isDisabled(
    !isCompanyAdmin,
    companyNameSaving && userDetailsSaving,
    loading
  );

  return (
    <Form onSubmit={handleSubmit(submit)} data-testid="business-info-form">
      <FormRow>
        <TextInput
          label={businessInformation.companyName}
          disabled={disabled}
          name={`${inputPath.company}.name`}
          type="text"
          required
          placeholder={general.inputGenericPlaceholder}
          control={control}
          register={register}
          rules={{ required: businessInformation.hint.companyName }}
          error={errors.company?.name?.message}
        />
      </FormRow>
      <FormRow>
        <TextInput
          label={businessInformation.businessNumber}
          disabled={disabled}
          name={`${inputPath.company}.businessNumber`}
          type="text"
          placeholder={general.inputGenericPlaceholder}
          control={control}
          register={register}
          rules={{
            validate: (value) =>
              noSpecialCharsValidation(
                value,
                businessInformation.businessNumber
              ),
          }}
          error={errors.company?.businessNumber?.message}
        />
      </FormRow>
      <FormRow>
        <TextInput
          label={businessInformation.vat}
          disabled={disabled}
          name={`${inputPath.company}.vat`}
          type="text"
          placeholder={general.inputGenericPlaceholder}
          control={control}
          register={register}
          rules={{
            validate: (value) =>
              noSpecialCharsValidation(value, businessInformation.vat),
          }}
          error={errors.company?.vat?.message}
        />
      </FormRow>
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <SelectDropdown
              isClearable
              label={businessInformation.userTitle}
              placeholder={general.selectGenericPlaceholder}
              disabled={disabled}
              inputName={`${inputPath.businessInformation}.title`}
              loadOptions={loadTitleOptions}
              control={control}
              register={register}
            />
          </Grid.Column>
          <Grid.Column>
            <SelectDropdown
              isClearable
              label={businessInformation.gender}
              placeholder={general.selectGenericPlaceholder}
              disabled={disabled}
              inputName={`${inputPath.userProfile}.gender`}
              loadOptions={loadGenderOptions}
              control={control}
              register={register}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <StyledP>{businessInformation.notice}</StyledP>
      </FormRow>
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <TextInput
              label={businessInformation.firstName}
              disabled={disabled}
              name={`${inputPath.businessInformation}.firstName`}
              type="text"
              placeholder={general.inputGenericPlaceholder}
              control={control}
              register={register}
              rules={{
                validate: (value) =>
                  nameValidation(value, businessInformation.firstName),
              }}
              error={errors.user?.firstName?.message}
            />
          </Grid.Column>
          <Grid.Column>
            <TextInput
              label={businessInformation.lastName}
              disabled={disabled}
              name={`${inputPath.businessInformation}.lastName`}
              type="text"
              placeholder={general.inputGenericPlaceholder}
              control={control}
              register={register}
              rules={{
                validate: (value) =>
                  nameValidation(value, businessInformation.lastName),
              }}
              error={errors.user?.lastName?.message}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <DatePicker
          dropdownGroupLabel={businessInformation.dateOfBirth}
          disabled={
            !isCompanyAdmin ||
            (companyNameSaving && userDetailsSaving) ||
            loading
          }
          type="dob"
          fields={fieldArgs}
          name={`${inputPath.userProfile}.dateOfBirth`}
          control={control}
          register={register}
          setConcatValue={setDobValue}
        />
      </FormRow>
      <FormRow>
        <Grid stackable data-testid="jobAndTravellerType" columns="equal">
          <Grid.Column>
            <TextInput
              label={businessInformation.jobPosition}
              disabled={disabled}
              name={`${inputPath.businessInformation}.jobRole`}
              type="text"
              required
              placeholder={general.inputGenericPlaceholder}
              control={control}
              register={register}
              rules={{ required: businessInformation.hint.jobTitle }}
              error={errors.user?.jobRole?.message}
            />
          </Grid.Column>
          <Grid.Column>
            {/* <SelectDropdown isClearable
              placeholder={general.inputGenericPlaceholder}
              disabled={disabled}
              label={businessInformation.travellerType}
              inputName={`${inputPath}.travellerType}`}
              required
              loadOptions={loadTravellerTypeOptions}
              control={control}
              register={register}
            /> */}
          </Grid.Column>
        </Grid>
      </FormRow>
      {!readOnly && (
        <>
          {!successMessage && !errorMessage && <FormRow />}
          {errorMessage && (
            <FormRow>
              <Message
                negative
                onDismiss={handleDismiss}
                header={general.errorMessage}
                list={[companyNameError?.message, userDetailsError?.message]}
              />
            </FormRow>
          )}
          {successMessage && (
            <FormRow>
              <Message positive>{general.successMessage}</Message>
            </FormRow>
          )}
          <FormRowCentre>
            <StyledButton
              basic
              loading={(companyNameSaving && userDetailsSaving) || loading}
              disabled={disabled}>
              {confirmButton ? 'Confirm' : 'Save'}
            </StyledButton>
            {!isCompanyAdmin && (
              <StyledSubText data-testid="no-edit-subtext">
                {readOnlyUserText}
              </StyledSubText>
            )}
          </FormRowCentre>
        </>
      )}
    </Form>
  );
};

export default BusinessInfoForm;
