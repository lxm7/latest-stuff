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
import { citizenshipCard, general } from 'components/eprofile/langEn';
import { StyledSubText } from 'components/eprofile/styles';
import {
  SuccessMessageState,
  CitizenshipCardFormProps,
  CitizenshipCardFormData,
} from 'components/eprofile/types';
import { isDisabled } from 'components/eprofile/utils';
import { loadCountryOptions } from 'components/common/SelectDropdown/utils';
import { DocumentType } from 'components/eprofile/DocumentWrapper/types';
import {
  GET_USER_DOCUMENT,
  UPDATE_USER_DOCUMENT,
} from 'components/eprofile/queries';

const CitizenshipCardForm: React.FC<CitizenshipCardFormProps> = ({
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
      docType: DocumentType.CITIZENSHIP_CARD,
    },
    errorPolicy: 'all',
  });

  const [
    updateDocumentation,
    { loading: CitizenshipCardSaving, error: CitizenshipCardError, called },
  ] = useMutation(UPDATE_USER_DOCUMENT, {
    // error state is set here at the point of an error being returned
    onError: () => setErrorMessage(true),
  });

  const { handleSubmit, register, control, reset, errors } = useForm({
    defaultValues: { ...data },
    mode: 'onBlur',
  });

  const [expiryValue, setExpiryValue] = useState<string | null>(null);
  const [issueValue, setIssueValue] = useState<string | null>(null);

  /**
   * This hook sets our local state to display server values and update our form
   */
  useEffect(() => reset({ ...data }), [data, reset]);

  /**
   * This handles form submission / mutations to send to the server
   * @param {CitizenshipCardFormData} formData
   */
  const submit = (formData: CitizenshipCardFormData) => {
    setErrorMessage(false);

    const {
      user: {
        profile: {
          documentation: {
            id,
            country: { value: countryValue },
          },
        },
      },
    } = formData;

    // update CitizenshipCard details
    updateDocumentation({
      variables: {
        input: {
          id,
          // if undefined/yet to be set set a string as opposed to undefined in order
          // to fetch clearer erroring
          country: countryValue || '',
          type: DocumentType.CITIZENSHIP_CARD,
          expiry: expiryValue || null,
          issueDate: issueValue || null,
        },
      },
    });
  };

  useEffect(() => {
    // sets the state of the success message
    if (!called || CitizenshipCardError || CitizenshipCardSaving) return;
    setSuccessMessage(true);
    // sets a timeout so that the message only displays for a short while
    const successTimeout = setTimeout(() => {
      setSuccessMessage(false);
    }, 3000);

    return () => {
      clearTimeout(successTimeout);
    };
  }, [called, CitizenshipCardSaving]);

  /** function called on Dismiss of error message */
  const handleDismiss = () => {
    setErrorMessage(false);
  };

  /** disabled element */
  const disabled = isDisabled(!isCompanyAdmin, CitizenshipCardSaving, loading);

  /** path to error object */
  const errorPath = errors.user?.profile?.documentation;

  return (
    <Form onSubmit={handleSubmit(submit)} data-testid="citizenship-card-form">
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <TextInput
              label={citizenshipCard.number}
              name={`${inputPath.documentation}.id`}
              type="text"
              disabled={disabled}
              required
              placeholder={citizenshipCard.hint.number}
              control={control}
              register={register}
              error={errorPath?.id?.message}
              rules={{ required: citizenshipCard.hint.number }}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <SelectDropdown
              isClearable
              label={citizenshipCard.country}
              inputName={`${inputPath.documentation}.country`}
              required
              disabled={disabled}
              loadOptions={loadCountryOptions}
              components={countryDropdownComponents}
              control={control}
              register={
                (register({
                  required: true,
                  name: `${inputPath.documentation}.country`,
                }) as unknown) as UseFormMethods['register']
              }
              error={errorPath?.country?.message}
              rules={{ required: citizenshipCard.hint.country }}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <DatePicker
              dropdownGroupLabel={citizenshipCard.issue}
              disabled={disabled}
              type="issued"
              fields={fieldArgs}
              name={`${inputPath.documentation}.issueDate`}
              control={control}
              register={register}
              setConcatValue={setIssueValue}
              errorPath={errorPath?.issueDate}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <DatePicker
              dropdownGroupLabel={citizenshipCard.expiry}
              required
              disabled={disabled}
              type="expiry"
              fields={fieldArgs}
              name={`${inputPath.documentation}.expiry`}
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
                list={[CitizenshipCardError!.message]}
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
              loading={loading || CitizenshipCardSaving}
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

export default CitizenshipCardForm;
