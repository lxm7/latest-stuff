import {
  Control,
  RegisterOptions,
  FieldName,
  FieldValues,
} from 'react-hook-form';
import { Option } from 'components/common/types';

/**
 * state values for the Date Picker
 */
export type DatePickerState = {
  [key: string]: Option;
  day: Option;
  month: Option;
  year: Option;
};

export type GroupInputErrorsParentPath = {
  [key: string]: {
    message: string;
  };
};

type nestedRegisterParams = {
  name: FieldName<FieldValues>;
  required?: boolean;
};

/**
 * the types of fieldSets that will be a datepicker
 */
export type FieldSetType = 'dob' | 'expiry' | 'travel-start' | 'issued';

/**
 * props passed in to our fieldset, in this case a datepicker
 */
export type DatePickerProps = {
  type: FieldSetType;
  disabled: boolean;
  setConcatValue: React.Dispatch<React.SetStateAction<string | null>>;
  fields: Omit<DatePickerState, 'currentDaysInMonth'>;
  name: string;
  control: Control<Record<string, any>>; // eslint-disable-line
  //  this is as close to the vendor types as I can get with out mocking out alot of the library
  register(arg0: nestedRegisterParams): any;  // eslint-disable-line
  required?: boolean;
  dropdownGroupLabel?: string;
  requiredFields?: boolean;
  rules?: RegisterOptions;
  errorPath?: GroupInputErrorsParentPath;
};
