import React, { ReactNode } from 'react';
import { Story } from '@storybook/react';
import EProfileModal from '.';
import { EProfileModalProps } from './types';
import { StyledStoryChild } from './styles';

/** Meta information for the Storybook display. */
export default {
  component: EProfileModal,
  title: 'Eprofile/Modal',
};

/** Reusable template calling the component. */
const Template: Story<EProfileModalProps> = (args) => (
  <EProfileModal {...args} />
);

/** Story consts. */
export const Default = Template.bind({});
export const Disabled = Template.bind({});
export const SaveSubtext = Template.bind({});
export const NotRequired = Template.bind({});
export const AlternativeIcon = Template.bind({});

/** Image consts. */
const hotelIcon = '/images/hotel(Modal).svg';
const citizenshipImage = '/images/citizenship(Modal).svg';

/** Example child passed inside the modal */
const exampleChild: ReactNode = (
  <StyledStoryChild>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </StyledStoryChild>
);

/** Stories with different args */
Default.args = {
  title: 'Default Modal',
  icon: hotelIcon,
  children: exampleChild,
  open: true,
};

Disabled.args = {
  ...Default.args,
  requiredText: false,
  open: true,
};

SaveSubtext.args = {
  ...Default.args,
  saveSubText: true,
  open: true,
};

NotRequired.args = {
  ...Default.args,
  requiredText: false,
  saveSubText: false,
  open: true,
};

AlternativeIcon.args = {
  title: 'Add your citizenship',
  icon: citizenshipImage,
  children: exampleChild,
  requiredText: true,
  saveSubText: true,
  open: true,
};
