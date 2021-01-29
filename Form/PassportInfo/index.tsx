import React, { useState, useEffect } from 'react';
import { Form, Grid, Message } from 'semantic-ui-react';
import { useQuery, useMutation } from '@apollo/client';
import { useForm, UseFormMethods } from 'react-hook-form';

// components
import TextInput from 'components/common/TextInput';
import SelectDropdown, {
  countryDropdownComponents,
} from 'components/common/SelectDropdown';
import DatePicker from 'components/eprofile/common/DatePicker';

// styles, utils and queries
import {
  nameValidation,
  noSpecialCharsValidation,
} from 'components/common/FormValidation';
import { fieldArgs } from 'components/eprofile/common/DatePicker/defaults';
import { FormRow, FormRowCentre } from 'components/common/styles';
import { StyledButton } from 'components/eprofile/common/Modal/styles';
import { StyledSubText } from 'components/eprofile/styles';
import { isDisabled, loadGenderOptions } from 'components/eprofile/utils';
import { loadCountryOptions } from 'components/common/SelectDropdown/utils';
import { DocumentType } from 'components/eprofile/DocumentWrapper/types';
import {
  PassportInfoFormProps,
  PassportInfoFormData,
  SuccessMessageState,
  DatePickerValueState,
} from 'components/eprofile/types';
import {
  UPDATE_USER_DETAILS,
  GET_USER_DOCUMENT,
  UPDATE_USER_DOCUMENT,
} from 'components/eprofile/queries';
import { passportDetails, general } from 'components/eprofile/langEn';
import { inputPath } from 'components/eprofile/consts';

const PassportInfoForm: React.FC<PassportInfoFormProps> = ({
  readOnly = false,
  confirmButton = false,
  isCompanyAdmin,
  readOnlyUserText,
}) => {
  const [errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState<SuccessMessageState>(
    false
  );

  const { data, loading } = useQuery(GET_USER_DOCUMENT, {
    variables: {
      docType: DocumentType.PASSPORT,
    },
    errorPolicy: 'all',
  });

  const [
    updateUserDetails,
    { loading: userDetailsSaving, error: userDetailsError, called: userCalled },
  ] = useMutation(UPDATE_USER_DETAILS, {
    onError: () => setErrorMessage(true),
  });

  const [
    updatePassportInformation,
    {
      loading: passportInfoSaving,
      error: passportInfoError,
      called: passportCalled,
    },
  ] = useMutation(UPDATE_USER_DOCUMENT, {
    onError: () => setErrorMessage(true),
  });

  const { handleSubmit, register, control, reset, errors } = useForm({
    defaultValues: { ...data } || null,
    mode: 'onBlur',
  });

  const [dobValue, setDobValue] = useState<DatePickerValueState>(null);
  const [issueDateValue, setIssueDateValue] = useState<DatePickerValueState>(
    null
  );
  const [expiryDateValue, setExpiryDateValue] = useState<DatePickerValueState>(
    null
  );

  /**
   * RHF reset sets its local state to display server values and update our form
   */
  useEffect(() => reset({ ...data }), [data, reset]);

  /**
   * This handles form submission / mutations to send to the server
   * @param {PassportInfoFormData} formData
   */
  const submit = (formData: PassportInfoFormData) => {
    setErrorMessage(false);

    const {
      user: {
        firstName,
        lastName,
        profile: {
          gender: { value: genderValue },
          documentation: {
            id,
            country: { value: countryValue },
            citizenship: { value: citizenshipValue },
          },
        },
      },
    } = formData;

    updatePassportInformation({
      variables: {
        input: {
          id,
          country: countryValue,
          type: DocumentType.PASSPORT,
          citizenship: citizenshipValue,
          issueDate: issueDateValue || null,
          expiry: expiryDateValue || null,
        },
      },
    });

    updateUserDetails({
      variables: {
        id: data.user.id,
        input: {
          firstName,
          lastName,
          profile: {
            dateOfBirth: dobValue || null,
            gender: genderValue,
          },
        },
      },
    });
  };

  /** sets the state of the success message */
  useEffect(() => {
    if (
      !passportCalled ||
      !userCalled ||
      passportInfoSaving ||
      passportInfoError ||
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
  }, [userCalled, userDetailsSaving, passportCalled, passportInfoSaving]);

  /** function called on dismiss of error message */
  const handleDismiss = () => {
    setErrorMessage(false);
  };

  /** disabled element */
  const disabled = isDisabled(
    !isCompanyAdmin,
    userDetailsSaving && passportInfoSaving,
    loading
  );

  /** path to error object */
  const errorPathPassport = errors.user?.profile?.documentation;

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <FormRow data-testid="passport-info-form">
        <Grid stackable columns="equal">
          <Grid.Column>
            <TextInput
              label={passportDetails.number}
              name={`${inputPath.documentation}.id`}
              type="text"
              disabled={disabled}
              required
              placeholder={passportDetails.hint.number}
              control={control}
              register={register}
              error={errorPathPassport?.id?.message}
              rules={{
                required: passportDetails.hint.number,
                validate: (value) =>
                  noSpecialCharsValidation(value, passportDetails.number),
              }}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <Grid>
          <Grid.Column>
            <SelectDropdown
              isClearable
              label={passportDetails.countryIssued}
              inputName={`${inputPath.documentation}.country`}
              placeholder={general.selectGenericPlaceholder}
              required
              disabled={disabled}
              loadOptions={loadCountryOptions}
              components={countryDropdownComponents}
              control={control}
              register={
                (register({
                  required: true,
                  name: `${inputPath.userProfile}.documentation.country`,
                }) as unknown) as UseFormMethods['register']
              }
              error={errorPathPassport?.country?.message}
              rules={{
                required: passportDetails.hint.country,
              }}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <TextInput
              label={passportDetails.firstName}
              name="user.firstName"
              type="text"
              disabled={disabled}
              required
              placeholder={general.inputGenericPlaceholder}
              control={control}
              register={register}
              rules={{
                required: passportDetails.hint.firstName,
                validate: (value: string) =>
                  nameValidation(value, passportDetails.firstName),
              }}
              error={errors?.user?.firstName?.message}
            />
          </Grid.Column>
          <Grid.Column>
            <TextInput
              label={passportDetails.lastName}
              name="user.lastName"
              type="text"
              disabled={disabled}
              required
              placeholder={general.inputGenericPlaceholder}
              control={control}
              register={register}
              rules={{
                required: passportDetails.hint.lastName,
                validate: (value: string) =>
                  nameValidation(value, passportDetails.lastName),
              }}
              error={errors?.user?.lastName?.message}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <SelectDropdown
              isClearable
              label={passportDetails.nationality}
              placeholder={general.selectGenericPlaceholder}
              inputName={`${inputPath.documentation}.citizenship`}
              required
              disabled={disabled}
              loadOptions={loadCountryOptions}
              components={countryDropdownComponents}
              control={control}
              register={
                (register({
                  required: true,
                  name: `${inputPath.documentation}.citizenship`,
                }) as unknown) as UseFormMethods['register']
              }
              error={errorPathPassport?.citizenship?.message}
              rules={{
                required: passportDetails.hint.nationality,
              }}
            />
          </Grid.Column>
          <Grid.Column>
            <SelectDropdown
              isClearable
              disabled={disabled}
              label={passportDetails.gender}
              placeholder={general.selectGenericPlaceholder}
              required
              inputName={`${inputPath.userProfile}.gender`}
              loadOptions={loadGenderOptions}
              control={control}
              register={
                (register({
                  required: true,
                  name: `${inputPath.userProfile}.gender`,
                }) as unknown) as UseFormMethods['register']
              }
              error={errors?.user?.profile?.gender?.message}
              rules={{
                required: passportDetails.hint.gender,
              }}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <DatePicker
          dropdownGroupLabel={passportDetails.dateOfBirth}
          disabled={disabled}
          type="dob"
          required
          fields={fieldArgs}
          name={`${inputPath.userProfile}.dateOfBirth`}
          control={control}
          register={register}
          setConcatValue={setDobValue}
          errorPath={errors?.user?.profile?.dateOfBirth}
        />
      </FormRow>
      <FormRow>
        <DatePicker
          dropdownGroupLabel={passportDetails.issue}
          disabled={disabled}
          type="issued"
          fields={fieldArgs}
          name={`${inputPath.documentation}.issueDate`}
          control={control}
          register={register}
          setConcatValue={setIssueDateValue}
        />
      </FormRow>
      <FormRow>
        <DatePicker
          dropdownGroupLabel={passportDetails.expiry}
          disabled={disabled}
          type="expiry"
          required
          fields={fieldArgs}
          name={`${inputPath.documentation}.expiry`}
          control={control}
          register={register}
          setConcatValue={setExpiryDateValue}
          errorPath={errorPathPassport?.expiry}
        />
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
                list={[passportInfoError?.message, userDetailsError?.message]}
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
              type="submit"
              basic
              loading={(userDetailsSaving && passportInfoSaving) || loading}
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

export default PassportInfoForm;
