import React, { useEffect, useState } from 'react';
import { Form, Grid, Message } from 'semantic-ui-react';
import { useQuery, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';

// components
import TextInput from 'components/common/TextInput';
import TelephoneInputs from 'components/eprofile/common/TelephoneInputs';

// styles / utils
import { StyledButton } from 'components/eprofile/common/Modal/styles';
import { FormRow, FormRowCentre } from 'components/common/styles';
import { StyledSubText } from 'components/eprofile/styles';
import {
  nameValidation,
  telephoneCharacterValidation,
  telephoneLengthValidation,
  checkInvalidNumberError,
} from 'components/common/FormValidation';
import { fieldArgs } from 'components/eprofile/common/TelephoneInputs/defaults';
import { inputPath } from 'components/eprofile/consts';
import { emergencyContact, general } from 'components/eprofile/langEn';
import {
  EmergencyContactFormProps,
  SuccessMessageState,
  EmergencyContactFormData,
} from 'components/eprofile/types';
import { isDisabled } from 'components/eprofile/utils';
import { EMERGENCY_CONTACT_INFO } from 'components/eprofile/queries';
import { UPDATE_EMERGENCY_CONTACT_INFO } from './queries';

const EmergencyContactForm: React.FC<EmergencyContactFormProps> = ({
  readOnly = false,
  confirmButton = false,
  isCompanyAdmin,
  readOnlyUserText,
}) => {
  const [errorMessage, setErrorMessage] = useState(false);
  const { data, loading } = useQuery(EMERGENCY_CONTACT_INFO, {
    errorPolicy: 'all',
  });
  const [
    updateEmergencyContactDetails,
    { loading: emergencyContactSaving, error: emergencyContactError, called },
  ] = useMutation(UPDATE_EMERGENCY_CONTACT_INFO, {
    onError: () => setErrorMessage(true),
    // error state is set here at the point of an error being returned
  });

  const { handleSubmit, register, control, reset, errors } = useForm({
    defaultValues: { ...data },
    mode: 'onBlur',
  });

  const [phoneNumber, setPhoneNumber] = useState('');
  const [successMessage, setSuccessMessage] = useState<SuccessMessageState>(
    false
  );

  /**
   * This hook sets our local state to display server values and update our form
   */
  useEffect(() => reset({ ...data }), [data, reset]);

  /**
   * This handles form submission / mutations to send to the server
   * @param {EmergencyContactFormData} formData
   */
  const submit = (formData: EmergencyContactFormData) => {
    setErrorMessage(false);

    const {
      user: {
        profile: {
          associates: {
            emergencyContact: { name },
          },
        },
      },
    } = formData;

    // update company address details
    updateEmergencyContactDetails({
      variables: {
        input: {
          emergencyContact: {
            ContactName: name,
            Phone: phoneNumber || '',
          },
        },
      },
    });
  };

  useEffect(() => {
    // sets the state of the success message
    if (!called || emergencyContactError || emergencyContactSaving) return;
    setSuccessMessage(true);
    // sets a timeout so that the message only displays for a short while
    const successTimeout = setTimeout(() => {
      setSuccessMessage(false);
    }, 3000);

    return () => {
      clearTimeout(successTimeout);
    };
  }, [called, emergencyContactSaving]);

  /** function called on Dismiss of error message */
  const handleDismiss = () => {
    setErrorMessage(false);
  };

  /** disabled element */
  const disabled = isDisabled(!isCompanyAdmin, emergencyContactSaving, loading);

  /** path to error object */
  const errorPath = errors.user?.profile?.associates?.emergencyContact;

  return (
    <Form onSubmit={handleSubmit(submit)} data-testid="emergency-contact-form">
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <TextInput
              label={emergencyContact.name}
              name={`${inputPath.emergencyContact}.name`}
              type="text"
              disabled={disabled}
              required
              placeholder={emergencyContact.hint.name}
              control={control}
              register={register}
              rules={{
                required: emergencyContact.hint.name,
                validate: (value) =>
                  nameValidation(value, emergencyContact.name),
              }}
              error={errorPath?.name?.message}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <TelephoneInputs
              fields={fieldArgs}
              label={emergencyContact.telephone}
              disabled={disabled}
              name={`${inputPath.emergencyContact}.telephone`}
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
      {!readOnly && (
        <>
          {!successMessage && !errorMessage && <FormRow />}
          {errorMessage && (
            <FormRow>
              <Message
                negative
                onDismiss={handleDismiss}
                header={general.errorMessage}
                list={[checkInvalidNumberError(emergencyContactError!.message)]}
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
              loading={loading || emergencyContactSaving}
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

export default EmergencyContactForm;
