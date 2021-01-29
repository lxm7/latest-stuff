import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import { useForm } from 'react-hook-form';

import TelephoneInputs from '.';
import { TelephoneInputsProps } from './types';
import { mobileFields, telephoneFields } from './defaults';

/**
 * Default export metadata to control
 * how Storybook lists the stories
 */
export default {
  title: 'Eprofile/TelephoneInputs',
  component: TelephoneInputs,
} as Meta;

/**
 * Set up story template with props passed in
 * @param args
 */
const Template: Story<TelephoneInputsProps> = (args) => {
  const { control } = useForm();
  return <TelephoneInputs {...args} control={control} />;
};

/**
 * Default telephone input components
 */
export const TelephoneInputsTwoFields = Template.bind({});
export const TelephoneInputsThreeFields = Template.bind({});

/**
 * Args for each story
 */
TelephoneInputsTwoFields.args = {
  dataTestId: 'mobile-inputs',
  fields: mobileFields,
  setPhoneNumber: () => '1234565789',
};

TelephoneInputsThreeFields.args = {
  dataTestId: 'telephone-inputs',
  fields: telephoneFields,
  setPhoneNumber: () => '1234565789',
};
