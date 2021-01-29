/**
 * this is essentially the input state but we need it separate from
 * currentDaysInMonth for storybook and tests
 */
export const fieldArgs = {
  day: {
    key: null,
    value: '',
    label: 'Day',
    field: '',
    inputName: 'day',
    error: '',
  },
  month: {
    key: null,
    value: '',
    label: 'Month',
    field: '',
    inputName: 'month',
    error: '',
  },
  year: {
    key: null,
    value: '',
    label: 'Year',
    field: '',
    inputName: 'year',
    error: '',
  },
};

/**
 * All the month options available to select
 */
export const months = [
  { key: 1, value: '1', label: 'January', field: 'month' },
  { key: 2, value: '2', label: 'February', field: 'month' },
  { key: 3, value: '3', label: 'March', field: 'month' },
  { key: 4, value: '4', label: 'April', field: 'month' },
  { key: 5, value: '5', label: 'May', field: 'month' },
  { key: 6, value: '6', label: 'June', field: 'month' },
  { key: 7, value: '7', label: 'July', field: 'month' },
  { key: 8, value: '8', label: 'August', field: 'month' },
  { key: 9, value: '9', label: 'September', field: 'month' },
  { key: 10, value: '10', label: 'October', field: 'month' },
  { key: 11, value: '11', label: 'November', field: 'month' },
  { key: 12, value: '12', label: 'December', field: 'month' },
];
