import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';

import DocumentItem from './index';
import { DocumentItemProps } from './types';

import { config } from '../../consts';

/**
 * Default export metadata to control
 * how Storybook lists the stories
 */
export default {
  title: 'Eprofile/DocumentCard',
  component: DocumentItem,
  decorators: [
    (Story) => (
      <div style={{ width: '350px', height: '250px' }}>
        <Story />
      </div>
    ),
  ],
} as Meta;

/**
 * Set up story template with props passed in
 * @param args
 */
const Template: Story<DocumentItemProps> = (args) => {
  return <DocumentItem {...args} />;
};

/** Default document item components */
export const DocumentItemPassport = Template.bind({});
export const DocumentItemVisa = Template.bind({});
export const DocumentItemCitizenshipCard = Template.bind({});
export const DocumentItemFlight = Template.bind({});
export const DocumentItemHotel = Template.bind({});

/** Document details for passport */
const passportDetails = {
  id: '12344636',
  country: {
    formatted: 'United Kingdom',
    value: 'GB',
  },
  citizenship: {
    formatted: 'United Kingdom',
    value: 'GB',
  },
  expiry: '2021-10-11T00:00:00Z',
};

/** Document details for visa */
const visaDetails = {
  id: '12344636',
  type: {
    formatted: 'B1',
    value: 'b1',
  },
  country: {
    formatted: 'United Kingdom',
    value: 'GB',
  },
  expiry: '2021-10-11T00:00:00Z',
};

/** Document details for citizenship card */
const citizenshipCardDetails = {
  id: '1234567',
  country: {
    formatted: 'United Kingdom',
    value: 'GB',
  },
  issueDate: '2020-11-12T00:00:00Z',
  expiry: '2021-10-11T00:00:00Z',
};

/** Document details for flight programme */
const flightProgrammeDetails = {
  id: '1234567',
  supplierCode: 'LHKGK545',
  supplier: {
    value: 'easyjet',
    formatted: 'EasyJet',
  },
};

/** Document details for hotel programme */
const hotelProgrammeDetails = {
  id: '547859379',
  supplierCode: 'GKLFDJ574385',
  supplier: {
    value: 'hilton honours',
    formatted: 'Hilton Honours',
  },
};

const documentText = { altText: 'any', wrapperTitle: 'Title' };

/**
 * Args for each story
 */
DocumentItemPassport.args = {
  rowDetails: { ...config.passport, ...documentText },
  cardNumber: 1,
  documentDetails: passportDetails,
};

DocumentItemVisa.args = {
  rowDetails: { ...config.visa, ...documentText },
  cardNumber: 2,
  documentDetails: visaDetails,
};

DocumentItemCitizenshipCard.args = {
  rowDetails: { ...config.citizenCard, ...documentText },
  cardNumber: 3,
  documentDetails: citizenshipCardDetails,
};

DocumentItemFlight.args = {
  rowDetails: { ...config.flight, ...documentText },
  cardNumber: 4,
  documentDetails: flightProgrammeDetails,
};

DocumentItemHotel.args = {
  rowDetails: { ...config.hotel, ...documentText },
  cardNumber: 5,
  documentDetails: hotelProgrammeDetails,
};
