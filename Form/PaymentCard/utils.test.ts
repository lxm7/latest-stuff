import { PaymentCardType } from 'components/travelBookings/common/CardDropdown';
import {
  getSelectedServicePaymentTypes,
  getAvailablePaymentTypeOptions,
  isCardNumber,
  isCardExpiry,
  isStripeValidationError,
} from './utils';
import {
  paymentCardsWithUserType,
  paymentCardsWithUserAndHotelType,
} from './fixture';

describe('PaymentCard Form utils', () => {
  describe('getSelectedServicePaymentTypes', () => {
    it('Should return the options previously selected', () => {
      const result1 = getSelectedServicePaymentTypes(paymentCardsWithUserType);
      const result2 = getSelectedServicePaymentTypes(
        paymentCardsWithUserAndHotelType
      );
      const result3 = getSelectedServicePaymentTypes(undefined);

      expect(result1).toStrictEqual([
        { value: PaymentCardType.USER, label: PaymentCardType.USER },
      ]);
      expect(result2).toStrictEqual([
        { value: PaymentCardType.USER, label: PaymentCardType.USER },
        { value: PaymentCardType.HOTEL, label: PaymentCardType.HOTEL },
      ]);

      expect(result3).toStrictEqual([]);
    });
  });

  describe('getAvailablePaymentTypeOptions', () => {
    it('Should return the options not yet selected', () => {
      const result1 = getAvailablePaymentTypeOptions(paymentCardsWithUserType);
      const result2 = getAvailablePaymentTypeOptions(
        paymentCardsWithUserAndHotelType
      );
      const result3 = getAvailablePaymentTypeOptions(undefined);

      expect(result1).toStrictEqual([
        { label: 'Hotel', value: PaymentCardType.HOTEL },
        { label: 'Company', value: PaymentCardType.COMPANY },
      ]);
      expect(result2).toStrictEqual([
        { label: 'Company', value: PaymentCardType.COMPANY },
      ]);
      expect(result3).toStrictEqual([
        { label: 'Hotel', value: PaymentCardType.HOTEL },
        { label: 'Company', value: PaymentCardType.COMPANY },
        { label: 'User', value: PaymentCardType.USER },
      ]);
    });
  });

  describe('isCardNumber', () => {
    it('Should return a boolean if the element type passed is cardNumber', () => {
      expect(isCardNumber('cardNumber')).toBe(true);
      expect(isCardNumber('cardExpiry')).toBe(false);
    });
  });

  describe('isCardExpiry', () => {
    it('Should return a boolean if the element type passed is cardExpiry', () => {
      expect(isCardExpiry('cardExpiry')).toBe(true);
      expect(isCardExpiry('cardNumber')).toBe(false);
    });
  });

  describe('isStripeValidationError', () => {
    it('Should return a boolean if there is a stripe error message passed in', () => {
      expect(isStripeValidationError('Please enter a card number')).toBe(true);
      expect(isStripeValidationError('')).toBe(false);
    });
  });
});
