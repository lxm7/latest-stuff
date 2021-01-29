import React, { useState, useEffect } from 'react';
import { Form, Grid, Message } from 'semantic-ui-react';
import { useQuery, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';

// components
import TextInput from 'components/common/TextInput';
import SelectDropdown, {
  countryDropdownComponents,
} from 'components/common/SelectDropdown';
import TelephoneInputs from 'components/eprofile/common/TelephoneInputs';

// styles, utils and queries
import {
  addressLineValidation,
  telephoneCharacterValidation,
  telephoneLengthValidation,
  checkInvalidNumberError,
} from 'components/common/FormValidation';
import { FormRow, FormRowCentre } from 'components/common/styles';
import { StyledButton } from 'components/eprofile/common/Modal/styles';
import { StyledSubText } from 'components/eprofile/styles';
import { sanitiseDropdownsInForm, isDisabled } from 'components/eprofile/utils';
import { loadCountryOptions } from 'components/common/SelectDropdown/utils';
import {
  CompanyAddressFormProps,
  CompanyAddressFormData,
  SuccessMessageState,
} from 'components/eprofile/types';
import { fieldArgs } from 'components/eprofile/common/TelephoneInputs/defaults';
import { inputPath } from 'components/eprofile/consts';
import { companyAddress, general } from 'components/eprofile/langEn';

import { COMPANY_ADDRESS, UPDATE_COMPANY_ADDRESS } from './queries';

const CompanyAddressForm: React.FC<CompanyAddressFormProps> = ({
  readOnly = false,
  confirmButton = false,
  isCompanyAdmin,
  readOnlyUserText,
}) => {
  const [errorMessage, setErrorMessage] = useState(false);
  const { data, loading } = useQuery(COMPANY_ADDRESS, {
    errorPolicy: 'all',
  });
  const [
    updateCompanyDetails,
    { loading: companyAddressSaving, error: companyAddressError, called },
  ] = useMutation(UPDATE_COMPANY_ADDRESS, {
    onError: () => setErrorMessage(true),
    // error state is set here at the point of an error being returned
  });

  const [phoneNumber, setPhoneNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [successMessage, setSuccessMessage] = useState<SuccessMessageState>(
    false
  );

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
    if (!called || companyAddressError || companyAddressSaving) return;
    setSuccessMessage(true);
    // sets a timeout so that the message only displays for a short while
    const successTimeout = setTimeout(() => {
      setSuccessMessage(false);
    }, 3000);

    return () => {
      clearTimeout(successTimeout);
    };
  }, [called, companyAddressSaving]);

  /** function called on dismiss of error message */
  const handleDismiss = () => {
    setErrorMessage(false);
  };

  /**
   * This handles form submission / mutations to send to the server
   * @param {CompanyAddressFormData} formData
   */
  const submit = (formData: CompanyAddressFormData) => {
    setErrorMessage(false);
    const { company } = formData;

    const contactDetails = {
      phone: phoneNumber || '',
      mobile: mobileNumber || '',
    };

    // update company address details
    updateCompanyDetails({
      variables: {
        input: {
          address: sanitiseDropdownsInForm(company.address),
          contactInformation: contactDetails,
        },
      },
    });
  };

  /** disabled element */
  const disabled = isDisabled(!isCompanyAdmin, companyAddressSaving, loading);

  /** path to error object */
  const errorPath = errors?.company?.address;

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <FormRow data-testid="company-address-form">
        <Grid stackable columns="equal">
          <Grid.Column>
            <TextInput
              label={companyAddress.addressLine1}
              name={`${inputPath.companyAddress}.firstLine`}
              type="text"
              disabled={disabled}
              required
              placeholder={general.inputGenericPlaceholder}
              control={control}
              register={register}
              error={errorPath?.firstLine?.message}
              rules={{
                required: companyAddress.hint.addressLine1,
                validate: addressLineValidation,
              }}
            />
          </Grid.Column>
          <Grid.Column>
            <TextInput
              label={companyAddress.addressLine2}
              name={`${inputPath.companyAddress}.secondLine`}
              disabled={disabled}
              type="text"
              placeholder={general.inputGenericPlaceholder}
              control={control}
              register={register}
              error={errorPath?.secondLine?.message}
              rules={{ validate: addressLineValidation }}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <TextInput
              label={companyAddress.city}
              name={`${inputPath.companyAddress}.city`}
              type="text"
              disabled={disabled}
              required
              placeholder={general.inputGenericPlaceholder}
              control={control}
              register={register}
              error={errorPath?.city?.message}
            />
          </Grid.Column>
          <Grid.Column>
            <TextInput
              label={companyAddress.county}
              name={`${inputPath.companyAddress}.county`}
              type="text"
              disabled={disabled}
              required
              placeholder={general.inputGenericPlaceholder}
              control={control}
              register={register}
              error={errorPath?.county?.message}
              rules={{
                required: companyAddress.hint.county,
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
              label={companyAddress.country}
              inputName={`${inputPath.companyAddress}.country`}
              required
              disabled={disabled}
              loadOptions={loadCountryOptions}
              components={countryDropdownComponents}
              control={control}
              register={register}
              error={errorPath?.country?.message}
              rules={{ required: companyAddress.hint.country }}
            />
          </Grid.Column>
          <Grid.Column>
            <TextInput
              label={companyAddress.postcode}
              name={`${inputPath.companyAddress}.postcode`}
              type="text"
              disabled={disabled}
              required
              placeholder={general.inputGenericPlaceholder}
              control={control}
              register={register}
              error={errorPath?.postcode?.message}
              rules={{ required: companyAddress.hint.postcode }}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <TelephoneInputs
              fields={fieldArgs}
              label={companyAddress.telephone}
              name="company.contactInformation.phone"
              disabled={disabled}
              control={control}
              register={register}
              setPhoneNumber={setPhoneNumber}
              numberError={
                errors.company?.contactInformation?.phone?.national?.message
              }
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
              fields={fieldArgs}
              label={companyAddress.mobile}
              required
              name="company.contactInformation.mobile"
              disabled={disabled}
              control={control}
              register={register}
              setPhoneNumber={setMobileNumber}
              numberError={
                errors.company?.contactInformation?.mobile?.national?.message
              }
              numberRules={{
                required: companyAddress.hint.number,
                validate: {
                  pattern: telephoneCharacterValidation,
                  length: telephoneLengthValidation,
                },
              }}
              diallingCodeRules={{ required: companyAddress.hint.dialcode }}
              diallingCodeError={
                errors.company?.contactInformation?.mobile?.countryCode?.message
              }
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
                list={[checkInvalidNumberError(companyAddressError!.message)]}
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
              loading={loading || companyAddressSaving}
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

export default CompanyAddressForm;
