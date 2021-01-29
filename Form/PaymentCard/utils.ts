import { paymentType } from 'components/eprofile/consts';
import { CardObject } from 'components/travelBookings/common/CardDropdown';
import { Option } from 'components/common/types/SelectOption';
import { PaymentCardsQueryData } from 'components/eprofile/types';

/**
 * We reduce over the list of cards, if any, and return an array with just
 * the payment types already in use, in the same structure as a dropdown Option
 *
 * @param {PaymentCardsQueryData} data this is the data fetched for the list of payment cards
 * @returns {Array<Option>} acc
 */
export const getSelectedServicePaymentTypes = (
  data: PaymentCardsQueryData | undefined
) => {
  const cards =
    data?.user?.cards?.cards && Array.isArray(data.user.cards.cards)
      ? data.user.cards.cards
      : [];

  return cards.reduce((acc: Option[], { card }: { card: CardObject }) => {
    acc.push({ value: card.type, label: card.type });
    return acc;
  }, []);
};

/**
 * We compare all the paymentTypes with the result of getSelectedServicePaymentTypes
 * above and return the one that haven't yet been selected and return Option[]
 * ready for the dropdown options for payment types
 *
 * @param {PaymentCardsQueryData} data this is the data fetched for the list of payment cards
 * @returns {Array<Option>} acc
 */
export const getAvailablePaymentTypeOptions = (
  data: PaymentCardsQueryData | undefined
) =>
  paymentType.filter((o1) =>
    getSelectedServicePaymentTypes(data).every(
      (o2: Option) => o1.value !== o2?.value
    )
  );

/** Checks if the stripe element type passed in is card number */
export const isCardNumber = (elementType: string) =>
  elementType === 'cardNumber';

/** Checks if the stripe element type passed in is card expiry */
export const isCardExpiry = (elementType: string) =>
  elementType === 'cardExpiry';

/** Checks if there is a stripe validation error */
export const isStripeValidationError = (error: string) => error !== '';
