import { PaymentCardType } from 'components/travelBookings/common/CardDropdown';
import { secondLineData, formatPaymentCardType } from './utils';

describe('secondLineData', () => {
  it('should return appropriate key and value pair when passed document and document type', () => {
    const document = {
      id: '12345',
      type: { formatted: 'ESTA', value: 'ESTA' },
    };
    const documentType = 'visa';
    const expected = { key: 'Visa type', value: 'ESTA' };
    expect(secondLineData(documentType, document)).toEqual(expected);
  });
});

describe('formatPaymentPaymentCardType', () => {
  it('should return a user suitable string when passed a card type', () => {
    expect(formatPaymentCardType(PaymentCardType.USER)).toBe('Personal card');
    expect(formatPaymentCardType(PaymentCardType.COMPANY)).toBe('Company card');
  });
});
