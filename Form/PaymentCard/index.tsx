import React, { useState, useEffect } from 'react';
import { Form, Grid, Message } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@apollo/client';
import {
  CardNumberElement,
  CardExpiryElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

// components
import TextInput from 'components/common/TextInput';
import SelectDropdown from 'components/common/SelectDropdown';
import StripeProviderWrapper from 'components/common/StripeProviderWrapper';

// styles / utils
import { StyledButton } from 'components/eprofile/common/Modal/styles';
import {
  FormRow,
  FormRowCentre,
  InputLabel,
  StripeElementContainer,
  StripeInput,
  StyledRequiredStar,
  StyledInputError,
} from 'components/common/styles';
import { inputPath } from 'components/eprofile/consts';
import {
  PaymentCardFormData,
  PaymentCardFormProps,
  SuccessMessageState,
} from 'components/eprofile/types';
import { isDisabled } from 'components/eprofile/utils';
import { paymentCards, general } from 'components/eprofile/langEn';
import {
  GET_PAYMENT_CARDS,
  CREATE_PAYMENT_CARD,
  CONFIRM_PAYMENT_CARD,
} from 'components/eprofile/queries';
import {
  getAvailablePaymentTypeOptions,
  isCardExpiry,
  isCardNumber,
  isStripeValidationError,
} from 'components/eprofile/Form/PaymentCard/utils';
import { requiredStar } from 'components/common/Consts';
import { StripeCardNumberElement } from '@stripe/stripe-js';
import { StripeElementEvent } from './types';

const PaymentCardForm: React.FC<PaymentCardFormProps> = ({
  confirmButton = false,
}) => {
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<SuccessMessageState>(
    false
  );
  const [errorMessage, setErrorMessage] = useState(false);
  const [stripeMutationError, setStripeMutationError] = useState('');
  const [stripeNumberError, setStripeNumberError] = useState('');
  const [stripeNumberEmpty, setStripeNumberEmpty] = useState(true);
  const [stripeExpiryError, setStripeExpiryError] = useState('');
  const [stripeExpiryEmpty, setStripeExpiryEmpty] = useState(true);

  // Needed for checking remaining options for the payment type dropdown
  // as well as the error paths
  const { data } = useQuery(GET_PAYMENT_CARDS);
  const [createPaymentCard, { error: createPaymentCardError }] = useMutation(
    CREATE_PAYMENT_CARD,
    {
      onError: () => setErrorMessage(true),
    }
  );
  const [
    confirmPaymentCard,
    {
      called: confirmPaymentCardCalled,
      loading: confirmPaymentCardSaving,
      error: confirmPaymentCardError,
    },
  ] = useMutation(CONFIRM_PAYMENT_CARD, {
    onError: () => setErrorMessage(true),
  });

  const { handleSubmit, register, control, errors } = useForm({
    defaultValues: { ...data },
    mode: 'onBlur',
  });

  const stripe = useStripe();
  const element = useElements();

  /** disabled element */
  const disabled = isDisabled(false, false, false);

  /** path to error object */
  const errorPath = errors.user?.cards?.cards?.card;

  /**
   * checks the list of cards and the types already assigned and
   * returns the remaining available
   */
  const availablePaymentTypeOptions = getAvailablePaymentTypeOptions(data);

  /** function called on dismiss of error message */
  const handleDismiss = () => {
    setErrorMessage(false);
  };

  const onSubmit = async (formData: PaymentCardFormData) => {
    setErrorMessage(false);
    if (stripeNumberEmpty) setStripeNumberError(paymentCards.hint.cardnumber);
    if (stripeExpiryEmpty) setStripeExpiryError(paymentCards.hint.expiry);

    if (
      stripeNumberError ||
      stripeExpiryError ||
      stripeNumberEmpty ||
      stripeExpiryEmpty
    )
      return;

    setLoading(true);

    const { nameOnCard, type } = formData.user.cards.cards.card;

    // fetches client secret from createPaymentCard mutation
    const {
      data: { createPaymentCard: clientID },
    } = await createPaymentCard({
      variables: {
        type: type.value,
      },
    });

    // gets references to the stripe elements
    const cardNumberElement = element?.getElement(CardNumberElement);

    if ((!stripe && !cardNumberElement) || !clientID) return;

    // calls confirmCardSetup with client secret and card data from the form and stripe elements
    const result = await stripe?.confirmCardSetup(clientID, {
      // eslint-disable-next-line
      payment_method: {
        card: cardNumberElement as StripeCardNumberElement,
        // eslint-disable-next-line
        billing_details: {
          name: nameOnCard,
        },
      },
    });

    if (result?.error?.message) {
      setErrorMessage(true);
      setStripeMutationError(result?.error?.message);
      return;
    }

    // calls our API with setup intent returned from stripe
    await confirmPaymentCard({
      variables: {
        id: result?.setupIntent?.id,
      },
    });

    setLoading(false);
  };

  /** Function called on change of stripe elements. Takes a stripe element event.
   * Used to handle validation and set the state with error messages. */
  const stripeElementsOnChange = ({
    error,
    elementType,
    empty,
  }: StripeElementEvent) => {
    if (isCardNumber(elementType)) {
      setStripeNumberEmpty(empty);
      if (error) {
        setStripeNumberError(error.message);
        return;
      }
      if (isStripeValidationError(stripeNumberError)) setStripeNumberError('');
    }
    if (isCardExpiry(elementType)) {
      setStripeExpiryEmpty(empty);
      if (error) {
        setStripeExpiryError(error.message);
        return;
      }
      if (isStripeValidationError(stripeExpiryError)) setStripeExpiryError('');
    }
  };

  /** Handles loading state on form opening to display to the user the form
   * is not yet ready for submission */
  useEffect(() => {
    if (!stripe || !element) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [stripe, element]);

  /** Handles loading state on submission when an error occurs */
  useEffect(() => {
    if (
      stripeMutationError ||
      createPaymentCardError ||
      confirmPaymentCardError
    )
      setLoading(false);
  }, [stripeMutationError, createPaymentCardError, confirmPaymentCardError]);

  /** Handles state to display success message */
  useEffect(() => {
    if (
      !confirmPaymentCardCalled ||
      confirmPaymentCardSaving ||
      stripeMutationError
    )
      return;

    setSuccessMessage(true);
    // sets a timeout so that the message only displays for a short while
    const successTimer = setTimeout(() => {
      setSuccessMessage(false);
    }, 3000);

    return () => clearTimeout(successTimer);
  }, [confirmPaymentCardCalled, confirmPaymentCardSaving, stripeMutationError]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)} data-testid="payment-card-form">
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <SelectDropdown
              label={paymentCards.type}
              inputName={`${inputPath.paymentCard}.type`}
              required
              placeholder={paymentCards.hint.type}
              disabled={disabled}
              loadOptions={async () => ({
                options: availablePaymentTypeOptions,
                loadMore: false,
              })}
              isClearable
              control={control}
              register={register}
              error={errorPath?.type?.message}
              rules={{
                required: paymentCards.hint.type,
              }}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <TextInput
              label={paymentCards.nameOnCard}
              name={`${inputPath.paymentCard}.nameOnCard`}
              type="text"
              disabled={disabled}
              required
              placeholder={paymentCards.hint.nameOnCard}
              control={control}
              register={register}
              error={errorPath?.nameOnCard?.message}
              rules={{
                required: paymentCards.hint.nameOnCard,
              }}
            />
          </Grid.Column>
        </Grid>
      </FormRow>
      <FormRow>
        <Grid stackable columns="equal">
          <Grid.Column>
            <InputLabel htmlFor="card-number">
              {paymentCards.cardNumber}
            </InputLabel>{' '}
            <StyledRequiredStar>{requiredStar}</StyledRequiredStar>
            <StripeElementContainer error={!!stripeNumberError}>
              <CardNumberElement
                id="card-number"
                options={{ style: StripeInput }}
                onChange={stripeElementsOnChange}
              />
            </StripeElementContainer>
            <StyledInputError>{stripeNumberError}</StyledInputError>
          </Grid.Column>
          <Grid.Column>
            <InputLabel htmlFor="card-expiry">{paymentCards.expiry}</InputLabel>{' '}
            <StyledRequiredStar>{requiredStar}</StyledRequiredStar>
            <StripeElementContainer error={!!stripeExpiryError}>
              <CardExpiryElement
                id="card-expiry"
                options={{ style: StripeInput }}
                onChange={stripeElementsOnChange}
              />
            </StripeElementContainer>
            <StyledInputError>{stripeExpiryError}</StyledInputError>
          </Grid.Column>
        </Grid>
      </FormRow>
      {errorMessage && (
        <FormRow>
          <Message
            negative
            onDismiss={handleDismiss}
            header={general.errorMessage}
            list={[
              createPaymentCardError?.message,
              confirmPaymentCardError?.message,
              stripeMutationError,
            ]}
          />
        </FormRow>
      )}
      {successMessage && (
        <FormRow>
          <Message positive>{general.successMessage}</Message>
        </FormRow>
      )}
      <FormRowCentre>
        <StyledButton basic loading={loading} disabled={disabled}>
          {confirmButton ? 'Confirm' : 'Save'}
        </StyledButton>
      </FormRowCentre>
    </Form>
  );
};

const WrappedPaymentCardForm: React.FC<PaymentCardFormProps> = ({
  ...rest
}) => (
  <StripeProviderWrapper>
    <PaymentCardForm {...rest} />
  </StripeProviderWrapper>
);

export default WrappedPaymentCardForm;
