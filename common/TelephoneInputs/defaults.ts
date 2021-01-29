import { InitialTelephoneState, TelephoneInputsProps } from './types';

/**
 * Initial state of the telephone inputs
 */
export const fieldArgs: InitialTelephoneState = {
  countryCode: {
    key: 'GB',
    value: '+44',
    flag: 'gb',
    text: 'United Kingdom (+44)',
    content: 'United Kingdom (+44)',
    label: 'United Kingdom (+44)',
    field: 'Telephone',
    inputName: 'countryCode',
    error: '',
  },
  areaNumber: '',
  national: '',
};

/**
 * field defaults for an input set for a mobile number
 */
export const mobileFields: TelephoneInputsProps['fields'] = {
  countryCode: {
    field: 'Telephone Country',
    inputName: 'telephoneCountry',
    key: 'GB',
    value: '+44',
    flag: 'gb',
    text: 'United Kingdom (+44)',
    content: 'United Kingdom (+44)',
    label: 'United Kingdom (+44)',
    error: '',
  },
  national: '07888 888888',
};

/**
 * field defaults for an input set for a telephone number
 */
export const telephoneFields: TelephoneInputsProps['fields'] = {
  countryCode: {
    field: 'Telephone Country',
    inputName: 'telephoneCountry',
    error: 'string',
    value: 'value',
    label: 'label',
  },
  areaNumber: '07888',
  national: '888888',
};
