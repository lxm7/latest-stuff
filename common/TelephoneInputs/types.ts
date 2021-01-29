import { Control, RegisterOptions, UseFormMethods } from 'react-hook-form';

import { Option } from '../../../common/types';

export type InitialTelephoneState = {
  countryCode: Option;
  national: string;
  areaNumber?: string;
};

/** Props for the telephone input */
export type TelephoneInputsProps = {
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  fields: InitialTelephoneState;
  control: Control<Record<string, any>>; // eslint-disable-line
  register: UseFormMethods['register'];
  name: string;
  label?: string;
  dataTestId?: string;
  disabled?: boolean;
  required?: boolean;
  dropdownGroupLabel?: string;
  requiredFields?: boolean;
  diallingCodeRules?: RegisterOptions;
  diallingCodeError?: string;
  numberRules?: RegisterOptions;
  numberError?: string;
};
