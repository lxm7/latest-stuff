import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';

import AddDocumentItem from '.';
import { AddDocumentItemProps } from '../types';

import { config } from '../../../consts';

/**
 * Default export metadata to control
 * how Storybook lists the stories
 */
export default {
  title: 'Eprofile/AddDocumentCard',
  component: AddDocumentItem,
  decorators: [
    (Story) => (
      <div style={{ width: '400px', height: '250px' }}>
        <Story />
      </div>
    ),
  ],
} as Meta;

/**
 * Set up story template with props passed in
 * @param args
 */
const Template: Story<AddDocumentItemProps> = (args) => {
  return <AddDocumentItem {...args} />;
};

/** Default add document item components */
export const AddDocumentItemPassport = Template.bind({});
export const AddDocumentItemFlight = Template.bind({});

const documentText = { altText: 'any', wrapperTitle: 'Title' };

/**
 * Args for each story
 */
AddDocumentItemPassport.args = {
  rowDetails: { ...config.passport, ...documentText },
};

AddDocumentItemFlight.args = {
  rowDetails: { ...config.flight, ...documentText },
};
