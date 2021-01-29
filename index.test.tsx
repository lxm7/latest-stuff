import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { USER } from 'components/common/Queries';
import { EProfile } from './index';

const mocks = [
  {
    request: {
      query: USER,
    },
    result: {
      data: {
        user: {
          id: '1234',
          role: { value: 'COMPANY_ADMIN', formatted: 'Company Admin' },
        },
      },
    },
  },
];

const renderComponent = () => {
  return render(
    <MockedProvider mocks={mocks}>
      <EProfile />
    </MockedProvider>
  );
};

describe('<Eprofile />', () => {
  it('Renders correctly on screen', () => {
    const { getByText } = renderComponent();
    expect(getByText('Set up profile')).toBeInTheDocument();
  });
});
