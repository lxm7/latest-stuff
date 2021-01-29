import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';

import ProgressBar from '.';
import { ProgressBarProps } from './types';

/**
 * Default export metadata to control
 * how Storybook lists the stories
 */
export default {
  title: 'Eprofile/ProgressBar',
  component: ProgressBar,
  decorators: [
    (Story) => (
      <div style={{ width: '800px', height: '100%' }}>
        <Story />
      </div>
    ),
  ],
} as Meta;

/**
 * Set up story template with props passed in
 * @param args
 */
const Template: Story<ProgressBarProps> = (args: ProgressBarProps) => {
  return <ProgressBar {...args} />;
};

/** Default progress bar components */
export const CompletedProgressBar = Template.bind({});
export const PartCompleteProgressBar = Template.bind({});
export const EmptyProgressBar = Template.bind({});

/**
 * Args for each story
 */
CompletedProgressBar.args = {
  profilePic: true,
  passport: true,
  paymentCard: true,
  contactInfo: true,
  emergencyContactInfo: true,
};

PartCompleteProgressBar.args = {
  profilePic: true,
  passport: true,
  paymentCard: false,
  contactInfo: false,
  emergencyContactInfo: false,
};

EmptyProgressBar.args = {
  profilePic: false,
  passport: false,
  paymentCard: false,
  contactInfo: false,
  emergencyContactInfo: false,
};
