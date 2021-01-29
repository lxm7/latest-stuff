import React, { useEffect, useState } from 'react';
import { Form, Grid, Message } from 'semantic-ui-react';
import { useQuery, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import _ from 'lodash';

// components
import TextInput from 'components/common/TextInput';
import TelephoneInputs from 'components/eprofile/common/TelephoneInputs';

// styles / utils
import {
  emailNotRequiredValidation,
  telephoneLengthValidation,
  telephoneCharacterValidation,
  checkInvalidNumberError,
  nameValidation,
} from 'components/common/FormValidation';
import { StyledButton } from 'components/eprofile/common/Modal/styles';
import { FormRow, FormRowCentre } from 'components/common/styles';
import { inputPath } from 'components/eprofile/consts';
import {
  assistantInformation,
  companyAddress,
  general,
} from 'components/eprofile/langEn';
import { StyledSubText } from 'components/eprofile/styles';
import {
  AssistantInfoFormProps,
  AssistantInfoFormData,
  SuccessMessageState,
} from 'components/eprofile/types';
import { isDisabled } from 'components/eprofile/utils';
import { fieldArgs } from 'components/eprofile/common/TelephoneInputs/defaults';
import { USER_ASSISTANT_INFO, UPDATE_ASSISTANT_INFO } from './queries';

const AssistantInfoForm: React.FC<AssistantInfoFormProps> = ({
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
  const { data, loading } = useQuery(USER_ASSISTANT_INFO, {
    errorPolicy: 'all',
  });

  const [
    setAssociates,
    { loading: assistantInfoSaving, error: assistantInfoError, called },
  ] = useMutation(UPDATE_ASSISTANT_INFO, {
    // error state is set here at the point of an error being returned
    onError: () => setErrorMessage(true),
  });

  // Local state to merge multiple dropdowns to a single string
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  /**
   * RHF reset sets its local state to display server values and update our form
   */
  const { handleSubmit, register, control, reset, errors } = useForm({
    defaultValues: { ...data } || null,
    mode: 'onBlur',
  });

  useEffect(() => {
    reset({ ...data });
  }, [data, reset]);

  /** sets the state of the success message */
  useEffect(() => {
    // sets the state of the success message
    if (!called || assistantInfoError || assistantInfoSaving) return;
    setSuccessMessage(true);
    // sets a timeout so that the message only displays for a short while
    const successTimeout = setTimeout(() => {
      setSuccessMessage(false);
    }, 3000);

    return () => {
      clearTimeout(successTimeout);
    };
  }, [called, assistantInfoSaving]);

  /** function called on Dismiss of error message */
  const handleDismiss = () => {
    setErrorMessage(false);
  };

  /**
   * This handles form submission / mutations to send to the server
   * @param {any} formData
   */
  const submit = (formData: AssistantInfoFormData) => {
    setErrorMessage(false);
    const { user } = formData;
    const contactDetails = {
      phone: phoneNumber || '',
      mobile: mobileNumber || '',
    };

    // update company address details
    setAssociates({
      variables: {
        input: {
          assistant: {
            // omit the contactDetails derived from the query structure and instead send
            // single strings values we've prepped locally for mobile and telephone
            ..._.omit(user.profile.associates.assistant, [
              'telephone',
              'mobile',
            ]),
            ...contactDetails,
          },
        },
      },
    });
  };

  /** disabled element */
  const disabled = isDisabled(!isCompanyAdmin, assistantInfoSaving, loading);

  /** path to error object  */
  const errorPath = errors.user?.profile?.associates?.assistant;

  return (
    <Form onSubmit={handleSubmit(submit)} data-testid="assistant-info-form">
      <FormRow>
        <TextInput
          label={assistantInformation.name}
          name={`${inputPath.assistantInformation}.name`}
          type="text"
          disabled={disabled}
          required
          placeholder={general.inputGenericPlaceholder}
          control={control}
          register={register}
          rules={{
            required: assistantInformation.hint.name,
            validate: (value) => nameValidation(value, 'Assistant name'),
          }}
          error={errorPath?.name?.message}
        />
      </FormRow>
      <FormRow>
        <TextInput
          label={assistantInformation.email}
          name={`${inputPath.assistantInformation}.email`}
          type="text"
          disabled={disabled}
          placeholder={general.inputGenericPlaceholder}
          control={control}
          register={register}
          rules={{
            validate: emailNotRequiredValidation,
          }}
          error={errorPath?.email?.message}
        />
      </FormRow>
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <TelephoneInputs
              label={assistantInformation.telephone}
              name={`${inputPath.assistantInformation}.telephone`}
              fields={fieldArgs}
              disabled={disabled}
              control={control}
              register={register}
              setPhoneNumber={setPhoneNumber}
              numberRules={{
                validate: {
                  pattern: telephoneCharacterValidation,
                  length: telephoneLengthValidation,
                },
              }}
              numberError={errorPath?.telephone?.national?.message}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <TelephoneInputs
              label={assistantInformation.mobile}
              fields={fieldArgs}
              required
              name={`${inputPath.assistantInformation}.mobile`}
              disabled={disabled}
              control={control}
              register={register}
              setPhoneNumber={setMobileNumber}
              diallingCodeRules={{
                required: companyAddress.hint.dialcode,
              }}
              diallingCodeError={errorPath?.mobile?.countryCode?.message}
              numberRules={{
                required: companyAddress.hint.number,
                validate: {
                  pattern: telephoneCharacterValidation,
                  length: telephoneLengthValidation,
                },
              }}
              numberError={errorPath?.mobile?.national?.message}
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
                list={[checkInvalidNumberError(assistantInfoError!.message)]}
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
              loading={assistantInfoSaving || loading}
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

export default AssistantInfoForm;
