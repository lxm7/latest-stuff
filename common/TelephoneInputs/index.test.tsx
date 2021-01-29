import React from 'react';
import { render } from '@testing-library/react';

import TelephoneInputs from '.';
import { TelephoneInputsProps } from './types';

/**
 * We need to mock react-hook-form and pass a React
 * component to Contoller so we can essentially stub it out
 * and render our actual Datepicker
 */
jest.mock('react-hook-form', () => ({
  Controller: () => <div />,
}));

const defaultProps = {
  fields: {
    countryCode: {
      field: 'Telephone Country',
      inputName: 'telephoneCountry',
      key: 'GB',
      value: '+44',
      flag: 'gb',
      text: 'United Kingdom (+44)',
      content: 'United Kingdom (+44)',
      label: 'United Kingdom (+44)',
      error: '',
    },
    national: '07888 888888',
  },
  setPhoneNumber: jest.fn(),
};

/** Additional props for the test scenario */
const telephoneFields = {
  ...defaultProps,
  dataTestId: 'telephone-inputs',
};

const mobileFields = {
  ...defaultProps,
  dataTestId: 'mobile-inputs',
};

const renderComponent = (props: TelephoneInputsProps) =>
  render(<TelephoneInputs {...props} />);

describe('<TelephoneInputs />', () => {
  it('Should render telephone inputs container', () => {
    const { getByTestId } = renderComponent(
      (telephoneFields as unknown) as TelephoneInputsProps
    );
    expect(getByTestId('telephone-inputs')).toBeInTheDocument();
  });

  it('Should render mobile inputs container', () => {
    const { getByTestId } = renderComponent(
      (mobileFields as unknown) as TelephoneInputsProps
    );
    expect(getByTestId('mobile-inputs')).toBeInTheDocument();
  });
});
