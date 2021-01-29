import React, { useEffect, useState } from 'react';
import { Form, Grid, Message } from 'semantic-ui-react';
import { useQuery, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';

// components
import TextInput from 'components/common/TextInput';
import SelectDropdown, {
  countryDropdownComponents,
} from 'components/common/SelectDropdown';
import TelephoneInputs from 'components/eprofile/common/TelephoneInputs';

// styles / utils
import { StyledButton } from 'components/eprofile/common/Modal/styles';
import { FormRow, FormRowCentre } from 'components/common/styles';
import {
  addressLineValidation,
  telephoneCharacterValidation,
  telephoneLengthValidation,
  emailNotRequiredValidation,
  checkInvalidNumberError,
} from 'components/common/FormValidation';
import { inputPath } from 'components/eprofile/consts';
import { contactInformation, general } from 'components/eprofile/langEn';

import { StyledSubText } from 'components/eprofile/styles';
import { sanitiseDropdownsInForm, isDisabled } from 'components/eprofile/utils';
import { loadCountryOptions } from 'components/common/SelectDropdown/utils';
import { fieldArgs } from 'components/eprofile/common/TelephoneInputs/defaults';

import {
  ContactInfoFormProps,
  ContactNumbers,
  ContactInfoFormData,
  SuccessMessageState,
} from 'components/eprofile/types';

import { USER_CONTACT_INFO } from 'components/eprofile/queries';
import { UPDATE_CONTACT_INFO } from './queries';

const ContactInfoForm: React.FC<ContactInfoFormProps> = ({
  readOnly = false,
  confirmButton = false,
  isCompanyAdmin,
  readOnlyUserText,
}) => {
  const [errorMessage, setErrorMessage] = useState(false);
  const { data, loading } = useQuery(USER_CONTACT_INFO);
  const [
    updateContactInfo,
    { loading: contactInfoSaving, error: contactInfoError, called },
  ] = useMutation(UPDATE_CONTACT_INFO, {
    onError: () => setErrorMessage(true),
    // error state is set here at the point of an error being returned
  });

  const { handleSubmit, register, control, reset, errors } = useForm({
    defaultValues: { ...data } || null,
    mode: 'onBlur',
  });

  const [phoneNumber, setPhoneNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [successMessage, setSuccessMessage] = useState<SuccessMessageState>(
    false
  );

  /**
   * RHF reset sets its local state to display server values and update our form
   */
  useEffect(() => reset({ ...data }), [data, reset]);

  /**
   * This handles form submission / mutations to send to the server
   * @param {any} formData
   */
  const submit = (formData: ContactInfoFormData) => {
    setErrorMessage(false);

    const { user } = formData;

    const contactDetails: ContactNumbers = {
      phone: phoneNumber || '',
      mobile: mobileNumber || '',
    };

    // update contact info details
    updateContactInfo({
      variables: {
        input: {
          address: sanitiseDropdownsInForm(
            user.profile.contactInformation.address
          ),
          ...contactDetails,
        },
      },
    });
  };

  /** sets the state of the success message */
  useEffect(() => {
    if (!called || contactInfoError || contactInfoSaving) return;
    setSuccessMessage(true);
    // sets a timeout so that the message only displays for a short while
    const successTimeout = setTimeout(() => {
      setSuccessMessage(false);
    }, 3000);

    return () => {
      clearTimeout(successTimeout);
    };
  }, [called, contactInfoSaving]);

  /** function called on Dismiss of error message */
  const handleDismiss = () => {
    setErrorMessage(false);
  };

  /** disabled element */
  const disabled = isDisabled(!isCompanyAdmin, contactInfoSaving, loading);

  /** path to error object */
  const errorPath = errors.user?.profile?.contactInformation;

  return (
    <Form onSubmit={handleSubmit(submit)} data-testid="contact-info-form">
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <TextInput
              label={contactInformation.addressLine1}
              name={`${inputPath.contactInformation}.address.firstLine`}
              type="text"
              disabled={disabled}
              required
              placeholder={general.inputGenericPlaceholder}
              control={control}
              register={register}
              error={errorPath?.address?.firstLine?.message}
              rules={{
                required: contactInformation.hint.addressLine1,
                validate: addressLineValidation,
              }}
            />
          </Grid.Column>
          <Grid.Column>
            <TextInput
              label={contactInformation.addressLine2}
              name={`${inputPath.contactInformation}.address.secondLine`}
              type="text"
              disabled={disabled}
              placeholder={general.inputGenericPlaceholder}
              control={control}
              register={register}
              error={errorPath?.address?.secondLine?.message}
              rules={{
                validate: addressLineValidation,
              }}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <TextInput
              label={contactInformation.city}
              name={`${inputPath.contactInformation}.address.city`}
              type="text"
              disabled={disabled}
              required
              placeholder={general.inputGenericPlaceholder}
              control={control}
              register={register}
              error={errorPath?.address?.city?.message}
            />
          </Grid.Column>
          <Grid.Column>
            <TextInput
              label={contactInformation.county}
              name={`${inputPath.contactInformation}.address.county`}
              type="text"
              disabled={disabled}
              required
              placeholder={general.inputGenericPlaceholder}
              control={control}
              register={register}
              error={errorPath?.address?.county?.message}
              rules={{
                required: contactInformation.hint.county,
                validate: addressLineValidation,
              }}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <SelectDropdown
              isClearable
              label={contactInformation.country}
              inputName={`${inputPath.contactInformation}.address.country`}
              disabled={disabled}
              required
              placeholder={general.selectGenericPlaceholder}
              loadOptions={loadCountryOptions}
              components={countryDropdownComponents}
              control={control}
              register={register}
              error={errorPath?.address?.country?.message}
              rules={{ required: contactInformation.hint.country }}
            />
          </Grid.Column>
          <Grid.Column>
            <TextInput
              label={contactInformation.postcode}
              name={`${inputPath.contactInformation}.address.postcode`}
              type="text"
              disabled={disabled}
              required
              placeholder={general.inputGenericPlaceholder}
              control={control}
              register={register}
              error={errorPath?.address?.postcode?.message}
              rules={{
                required: contactInformation.hint.postcode,
              }}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <TelephoneInputs
              fields={fieldArgs}
              label={contactInformation.telephone}
              name={`${inputPath.contactInformation}.phone`}
              disabled={disabled}
              control={control}
              register={register}
              setPhoneNumber={setPhoneNumber}
              numberError={errorPath?.phone?.national?.message}
              numberRules={{
                validate: {
                  pattern: telephoneCharacterValidation,
                  length: telephoneLengthValidation,
                },
              }}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <TelephoneInputs
              label={contactInformation.mobile}
              fields={fieldArgs}
              required
              name={`${inputPath.contactInformation}.mobile`}
              disabled={disabled}
              control={control}
              register={register}
              setPhoneNumber={setMobileNumber}
              numberError={errorPath?.mobile?.national?.message}
              numberRules={{
                required: contactInformation.hint.number,
                validate: {
                  pattern: telephoneCharacterValidation,
                  length: telephoneLengthValidation,
                },
              }}
              diallingCodeRules={{
                required: contactInformation.hint.dialcode,
              }}
              diallingCodeError={errorPath?.mobile?.countryCode?.message}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <TextInput
              label={contactInformation.emailAddress}
              name="user.username"
              type="text"
              disabled={disabled}
              required
              placeholder={general.inputGenericPlaceholder}
              control={control}
              register={register}
              rules={{
                required: contactInformation.hint.email,
                validate: emailNotRequiredValidation,
              }}
              error={errors.user?.username?.message}
            />
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
                list={[checkInvalidNumberError(contactInfoError!.message)]}
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
              loading={loading || contactInfoSaving}
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

export default ContactInfoForm;
