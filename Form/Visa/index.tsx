import React, { useEffect, useState } from 'react';
import { Form, Grid, Message } from 'semantic-ui-react';
import { useQuery, useMutation } from '@apollo/client';
import { useForm, UseFormMethods } from 'react-hook-form';

// components
import TextInput from 'components/common/TextInput';
import SelectDropdown, {
  countryDropdownComponents,
} from 'components/common/SelectDropdown';
import DatePicker from 'components/eprofile/common/DatePicker';

// styles / utils
import { fieldArgs } from 'components/eprofile/common/DatePicker/defaults';
import { StyledButton } from 'components/eprofile/common/Modal/styles';
import { FormRow, FormRowCentre } from 'components/common/styles';
import { inputPath } from 'components/eprofile/consts';
import { visaDetails, general } from 'components/eprofile/langEn';
import { StyledSubText } from 'components/eprofile/styles';

import {
  VisaFormData,
  SuccessMessageState,
  VisaFormProps,
} from 'components/eprofile/types';
import {
  addLabelToDropdownOptions,
  isDisabled,
} from 'components/eprofile/utils';
import {
  loadCountryOptions,
  searchFilteredResultsByLabel,
} from 'components/common/SelectDropdown/utils';

import {
  GET_VISA_DOCUMENT,
  UPDATE_VISA_DOCUMENT,
  GET_VISA_OPTIONS,
} from './queries';

const VisaForm: React.FC<VisaFormProps> = ({
  readOnly = false,
  confirmButton = false,
  isCompanyAdmin,
  readOnlyUserText,
}) => {
  const [errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState<SuccessMessageState>(
    false
  );

  const { data, loading } = useQuery(GET_VISA_DOCUMENT, {
    errorPolicy: 'all',
  });

  const { data: visaOptions } = useQuery(GET_VISA_OPTIONS);

  const [
    updateVisaDetails,
    { loading: visaSaving, error: visaError, called },
  ] = useMutation(UPDATE_VISA_DOCUMENT, {
    onError: () => setErrorMessage(true),
    // error state is set here at the point of an error being returned
  });

  const { handleSubmit, register, control, reset, errors } = useForm({
    defaultValues: { ...data },
    mode: 'onBlur',
  });

  const [expiryValue, setExpiryValue] = useState<string | null>('');

  /**
   * This hook sets our local state to display server values and update our form
   */
  useEffect(() => reset({ ...data }), [data, reset]);

  /**
   * This handles form submission / mutations to send to the server
   * @param {VisaFormData} formData
   */
  const submit = (formData: VisaFormData) => {
    setErrorMessage(false);
    const {
      user: {
        profile: {
          visas: {
            id,
            country: { value: countryValue },
            type: { value: visaType },
          },
        },
      },
    } = formData;

    // update visa details
    updateVisaDetails({
      variables: {
        input: {
          id,
          // if undefined/yet to be set set a string as opposed to undefined in order
          // to fetch clearer erroring
          expiry: expiryValue || '',
          type: visaType,
          country: countryValue,
        },
      },
    });
  };

  useEffect(() => {
    // sets the state of the success message
    if (!called || visaError || visaSaving) return;

    setSuccessMessage(true);
    // sets a timeout so that the message only displays for a short while
    const successTimeout = setTimeout(() => {
      setSuccessMessage(false);
    }, 3000);

    return () => {
      clearTimeout(successTimeout);
    };
  }, [called, visaSaving]);

  /** function called on Dismiss of error message */
  const handleDismiss = () => {
    setErrorMessage(false);
  };

  /** disabled element */
  const disabled = isDisabled(!isCompanyAdmin, visaSaving, loading);

  /** path to error object */
  const errorPath = errors.user?.profile?.visas;

  return (
    <Form onSubmit={handleSubmit(submit)} data-testid="visa-form">
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <TextInput
              label={visaDetails.number}
              name={`${inputPath.visa}.id`}
              type="text"
              disabled={disabled}
              required
              placeholder={visaDetails.hint.number}
              control={control}
              register={register}
              error={errorPath?.id?.message}
              rules={{
                required: visaDetails.hint.number,
              }}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <SelectDropdown
              label={visaDetails.country}
              inputName={`${inputPath.visa}.country`}
              required
              disabled={disabled}
              loadOptions={loadCountryOptions}
              components={countryDropdownComponents}
              isClearable
              control={control}
              register={
                (register({
                  required: true,
                  name: `${inputPath.visa}.country`,
                }) as unknown) as UseFormMethods['register']
              }
              error={errorPath?.country?.message}
              rules={{
                required: visaDetails.hint.country,
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
              label={visaDetails.type}
              inputName={`${inputPath.visa}.type`}
              required
              placeholder={general.selectGenericPlaceholder}
              disabled={disabled}
              loadOptions={async (search) => {
                const filteredOptions = searchFilteredResultsByLabel(
                  search,
                  addLabelToDropdownOptions(visaOptions?.options.visaTypes)
                );
                return {
                  options: filteredOptions,
                  hasMore: false,
                };
              }}
              control={control}
              register={
                (register({
                  required: true,
                  name: `${inputPath.visa}.type`,
                }) as unknown) as UseFormMethods['register']
              }
              error={errorPath?.type?.message}
              rules={{ required: visaDetails.hint.type }}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <DatePicker
              dropdownGroupLabel={visaDetails.expiry}
              disabled={disabled}
              required
              type="expiry"
              fields={fieldArgs}
              name={`${inputPath.visa}.expiry`}
              control={control}
              register={register}
              setConcatValue={setExpiryValue}
              errorPath={errorPath?.expiry}
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
                data-testid="error-message"
                onDismiss={handleDismiss}
                header={general.errorMessage}
                list={[visaError!.message]}
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
              loading={loading || visaSaving}
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

export default VisaForm;
