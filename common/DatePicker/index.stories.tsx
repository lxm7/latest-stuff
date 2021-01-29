import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import { useForm } from 'react-hook-form';

import DatePicker from '.';
import { DatePickerProps } from './types';
import { fieldArgs } from './defaults';

/**
 * Default export metadata to control
 * how Storybook lists the stories
 */
export default {
  title: 'Eprofile/DatePicker',
  component: DatePicker,
} as Meta;

/**
 * Set up story template with props passed in
 * @param args
 */
const Template: Story<DatePickerProps> = (args) => {
  const { control } = useForm();
  return <DatePicker {...args} control={control} />;
};

/**
 * Default date picker components
 */
export const DatePickerThreeFields = Template.bind({});
export const DatePickerVisa = Template.bind({});
export const DatePickerDateOfBirth = Template.bind({});
export const DatePickerWithError = Template.bind({});
export const DatePickerWithExpiry = Template.bind({});

const fieldArgsWithErrors = {
  day: {
    key: null,
    value: '',
    label: 'Day',
    field: 'day',
    inputName: 'day',
    error: 'Please select a Day',
  },
  month: {
    key: null,
    value: '',
    label: 'Month',
    field: 'month',
    inputName: 'month',
    error: 'Please select a Month',
  },
  year: {
    key: null,
    value: '',
    label: 'Year',
    field: 'year',
    inputName: 'year',
    error: 'Please select a Year',
  },
};

/**
 * Args for each story
 */
DatePickerThreeFields.args = {
  type: 'dob',
  fields: { ...fieldArgs },
};

DatePickerVisa.args = {
  dropdownGroupLabel: 'Visa Date of Expiry',
  type: 'expiry',
  fields: { ...fieldArgs },
};

DatePickerDateOfBirth.args = {
  dropdownGroupLabel: 'Date of Birth',
  type: 'dob',
  requiredFields: false,
  fields: { ...fieldArgs },
};

DatePickerWithError.args = {
  type: 'dob',
  fields: { ...fieldArgsWithErrors },
};

DatePickerWithExpiry.args = {
  dropdownGroupLabel: 'Passport Date of Expiry',
  type: 'expiry',
  fields: { ...fieldArgs },
};
