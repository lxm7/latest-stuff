import { OptionFromServer } from 'components/common/types';
import { DateTime } from 'luxon';
import { config, DATE_TIME_FORMAT } from 'components/eprofile/consts';
import { PaymentCardType } from 'components/travelBookings/common/CardDropdown';
import { Document } from '../../DocumentWrapper/types';
import { valueOrNone } from '../../DocumentWrapper/utils';

const { payment, citizenCard, flight } = config;

/** A function which takes the document type and returns the relevant key and
 * values for the second line text on the document item cards */
export const secondLineData = (documentType: string, document: Document) => {
  const lookup: {
    [index: string]: {
      key: string;
      value: string | number | OptionFromServer;
    };
  } = {
    passport: {
      key: 'Country of issue',
      value: valueOrNone(document?.country?.formatted),
    },
    visa: {
      key: 'Visa type',
      value: valueOrNone(document?.type?.formatted),
    },
    [citizenCard.documentName]: {
      key: 'Date of issue',
      value: document.issueDate
        ? DateTime.fromISO(document.issueDate).toFormat(DATE_TIME_FORMAT)
        : '-',
    },
    [flight.documentName]: {
      key: 'Airline code',
      value: valueOrNone(document?.supplier?.value),
    },
    hotel: {
      key: 'Hotel code',
      value: valueOrNone(document?.supplier?.value),
    },
    [payment.documentName]: {
      key: 'Card number',
      value: valueOrNone(document?.card?.description),
    },
  };

  return lookup[documentType];
};

/** Function to format the payment card types into reader usable strings
 * @param {PaymentCardType} type takes a PaymentCardType enum
 */
export const formatPaymentCardType = (type: PaymentCardType) => {
  switch (type) {
    case PaymentCardType.USER:
      return 'Personal card';
    case PaymentCardType.COMPANY:
      return 'Company card';
    default:
      return 'Hotel guarantee card';
  }
};
