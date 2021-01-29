import React from 'react';
import { Story } from '@storybook/react';

import { ModalButtonProps } from './types';

import ModalButton from '.';

const addressImageSrc = '/images/companyAddress.svg';
const businessInfoImageSrc = '/images/businessInformation.svg';
const contactInfoImageSrc = '/images/contactInformation.svg';

/**
 * Default export metadata to control
 * how Storybook lists the stories
 */
export default {
  title: 'Eprofile/ModalButton',
  component: ModalButton,
};

/**
 * On change that is used as a test function
 */
const onClick = () => console.log('test');

/**
 * Set up story template with props passed in
 * @param args
 */
const Template: Story<ModalButtonProps> = (args) => <ModalButton {...args} />;

/**
 * Each story template const
 */
export const CompanyAddress = Template.bind({});
export const BusinessInformation = Template.bind({});
export const ContactInformation = Template.bind({});
export const AssistantInformation = Template.bind({});
export const EmergencyContact = Template.bind({});

/**
 * Args for each story
 */
CompanyAddress.args = {
  icon: addressImageSrc,
  label: 'Company Address',
  onClick,
};

BusinessInformation.args = {
  onClick,
  icon: businessInfoImageSrc,
  label: 'Business Information',
};

ContactInformation.args = {
  onClick,
  icon: contactInfoImageSrc,
  label: 'Contact Information',
};

AssistantInformation.args = {
  onClick,
  icon: '',
  label: 'Assistant Information',
};

EmergencyContact.args = {
  onClick,
  icon: '',
  label: 'Emergency Contact',
};
