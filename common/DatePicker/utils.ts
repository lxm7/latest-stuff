import { DateTime } from 'luxon';

import { FieldSetType, DatePickerState } from './types';
import { Option } from '../../../common/types';

/**
 * this returns true only when we have been given an error message
 * from parent component and the input value is still empty (usually on mount)
 * @param {any} field - this the value entered in input
 * @returns {Boolean}
 */
export const hasError = (field: Option) => !field.value && field.error;

/**
 * returns an array of options with all the days up to the days in month
 * @param daysInMonth the calculated number of days in month selected
 */
export const getDays = (daysInMonth = 31) => {
  const daysArray = [];
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push({
      key: i,
      value: i.toString(),
      label: i.toString(),
      field: 'day',
    });
  }
  return daysArray;
};

/**
 * @param {number} minYears
 * @param {number} maxYears
 *
 * @returns {array} yearsArray with key, value, label, field porps for dropdown
 */
export const getYears = (minYears: number, maxYears: number) => {
  const yearsArray = [];
  for (let i = minYears; i <= maxYears; i++) {
    yearsArray.push({ key: i, value: i, label: i, field: 'year' });
  }
  return yearsArray;
};

/**
 * @param {FieldSetType} fieldSetType
 *
 * @returns {array} getYears yearsArray with custom params derived by fieldSetType
 */
export const getYearsOptions = (fieldSetType: FieldSetType) => {
  switch (fieldSetType) {
    case 'expiry':
      return getYears(DateTime.local().year, DateTime.local().year + 20);
    case 'issued':
      return getYears(DateTime.local().year - 30, DateTime.local().year);
    case 'travel-start':
      return getYears(DateTime.local().year, DateTime.local().year + 5);
    case 'dob':
    default:
      return getYears(DateTime.local().year - 100, DateTime.local().year);
  }
};

/**
 * @param {FieldSetType} fieldSetType
 * @param {DatePickerState} valueSet
 *
 * @returns {boolean} returns true if user selects a date after today for an isssued type document
 */
export const isIssuedAfterToday = (
  fieldSetType: FieldSetType,
  valueSet: DatePickerState
): boolean => {
  const dateValue = DateTime.local(
    +valueSet.year?.value,
    +valueSet.month?.value || 1,
    +valueSet.day?.value || 1
  );

  return fieldSetType === 'issued' && dateValue > DateTime.local();
};
