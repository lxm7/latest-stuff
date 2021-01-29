import React, { useEffect, useState } from 'react';
import { Form, Grid, Message } from 'semantic-ui-react';
import { useForm, UseFormMethods } from 'react-hook-form';
import { useQuery, useMutation } from '@apollo/client';

// components
import TextInput from 'components/common/TextInput';
import SelectDropdown from 'components/common/SelectDropdown';

// styles / utils
import { StyledButton } from 'components/eprofile/common/Modal/styles';
import { FormRow, FormRowCentre } from 'components/common/styles';
import { StyledSubText } from 'components/eprofile/styles';
import { inputPath } from 'components/eprofile/consts';
import {
  isDisabled,
  addLabelToDropdownOptions,
} from 'components/eprofile/utils';
import { DocumentType } from 'components/eprofile/DocumentWrapper/types';
import { searchFilteredResultsByLabel } from 'components/common/SelectDropdown/utils';
import { hotelLoyaltyDetails, general } from 'components/eprofile/langEn';

import {
  SuccessMessageState,
  LoyaltyProgramFormData,
  LoyaltyProgramProps,
} from 'components/eprofile/types';

// queries
import {
  GET_LOYALTY_PROGRAMS,
  UPDATE_LOYALTY_PROGRAM,
} from 'components/eprofile/queries';
import { GET_HOTEL_OPTIONS } from './queries';

const HotelForm: React.FC<LoyaltyProgramProps> = ({
  readOnly = false,
  confirmButton = false,
  isCompanyAdmin,
  readOnlyUserText,
}) => {
  const [errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState<SuccessMessageState>(
    false
  );
  const { data, loading } = useQuery(GET_LOYALTY_PROGRAMS, {
    variables: {
      type: DocumentType.HOTEL,
    },
  });
  const { data: hotelOptions } = useQuery(GET_HOTEL_OPTIONS);
  const [
    updateLoyaltyProgram,
    { loading: hotelSaving, error: hotelError, called },
  ] = useMutation(UPDATE_LOYALTY_PROGRAM, {
    onError: () => setErrorMessage(true),
    // error state is set here at the point of an error being returned
  });
  const { handleSubmit, register, control, reset, errors } = useForm({
    defaultValues: { ...data },
    mode: 'onBlur',
  });

  /**
   * This hook sets our local state to display server values and update our form
   */
  useEffect(() => reset({ ...data }), [data, reset]);

  /**
   * This handles form submission / mutations to send to the server
   * @param {LoyaltyProgramFormData} formData
   */
  const submit = (formData: LoyaltyProgramFormData) => {
    setErrorMessage(false);
    const {
      user: {
        profile: {
          preferences: {
            loyaltyPrograms: {
              id,
              supplier: {
                value: { value },
              },
            },
          },
        },
      },
    } = formData;

    /** call to mutation to update/add a hotel loyalty program */
    updateLoyaltyProgram({
      variables: {
        input: {
          id,
          type: DocumentType.HOTEL,
          supplier: value,
        },
      },
    });
  };

  useEffect(() => {
    // sets the state of the success message
    if (!called || hotelError || hotelSaving) return;

    setSuccessMessage(true);
    // sets a timeout so that the message only displays for a short while
    const successTimeout = setTimeout(() => {
      setSuccessMessage(false);
    }, 3000);

    return () => {
      clearTimeout(successTimeout);
    };
  }, [called, hotelSaving]);

  /** function called on Dismiss of error message */
  const handleDismiss = () => {
    setErrorMessage(false);
  };

  /** disabled element */
  const disabled = isDisabled(!isCompanyAdmin, hotelSaving, loading);

  /** path to error object */
  const errorPath = errors.user?.profile?.preferences?.loyaltyPrograms;

  return (
    <Form onSubmit={handleSubmit(submit)} data-testid="hotel-form">
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <TextInput
              label={hotelLoyaltyDetails.number}
              name={`${inputPath.loyaltyPrograms}.id`}
              type="text"
              disabled={disabled}
              required
              placeholder={hotelLoyaltyDetails.hint.number}
              control={control}
              register={register}
              error={errorPath?.id?.message}
              rules={{
                required: hotelLoyaltyDetails.hint.number,
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
              label={hotelLoyaltyDetails.supplier}
              inputName={`${inputPath.loyaltyPrograms}.supplier.value`}
              required
              placeholder={general.selectGenericPlaceholder}
              disabled={disabled}
              // No way to pass our query data into loadOptions
              loadOptions={async (search) => {
                const filteredOptions = searchFilteredResultsByLabel(
                  search,
                  addLabelToDropdownOptions(
                    hotelOptions?.options.membershipSuppliers.hotel
                  )
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
                  name: `${inputPath.loyaltyPrograms}.supplier.value`,
                }) as unknown) as UseFormMethods['register']
              }
              error={errorPath?.supplier?.value?.message}
              rules={{
                required: hotelLoyaltyDetails.hint.supplier,
              }}
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
                list={[hotelError!.message]}
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
              loading={hotelSaving || loading}
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

export default HotelForm;
