import React from 'react';
import { render, screen, act, cleanup } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { fireEvent, waitFor } from '@testing-library/dom';

import { businessInformation } from 'components/eprofile/langEn';
import BusinessInfoForm from '.';
import { BUSINESS_INFO } from './queries';

// mocked query and mutation for getting business information and updating it
const mocks = [
  {
    request: {
      query: BUSINESS_INFO,
    },
    result: {
      data: {
        company: {
          name: 'Taptrip',
          id: '1234',
          vat: '1234',
          businessNumber: '1234',
        },
        user: {
          id: 'c1c573a1-2979-4e67-99e5-a7aeceb8efc4',
          firstName: 'test',
          lastName: 'test',
          title: {
            value: 'Mr',
            formatted: 'Mr',
          },
          jobRole: 'Engineer',
          profile: {
            gender: {
              value: 'Male',
              formatted: 'Male',
            },
            dateOfBirth: null,
          },
        },
      },
    },
  },
];

const validationMocks = [
  {
    request: {
      query: BUSINESS_INFO,
    },
    result: {
      data: {
        company: {
          name: '',
          id: '1234',
          vat: '1234',
          businessNumber: '1234',
        },
        user: {
          id: 'c1c573a1-2979-4e67-99e5-a7aeceb8efc4',
          firstName: 'test',
          lastName: 'test',
          title: {
            value: 'Mr',
            formatted: 'Mr',
          },
          jobRole: 'Engineer',
          profile: {
            gender: {
              value: 'Male',
              formatted: 'Male',
            },
            dateOfBirth: null,
          },
        },
      },
    },
  },
];

const renderComponent = (mocks: object, isCompanyAdmin = false) =>
  render(
    <MockedProvider
      mocks={(mocks as unknown) as ReadonlyArray<MockedResponse>}
      addTypename={false}>
      <BusinessInfoForm
        readOnly={false}
        confirmButton={false}
        isCompanyAdmin={isCompanyAdmin}
      />
    </MockedProvider>
  );

afterEach(() => {
  cleanup();
});

describe('<BusinessInfoForm />', () => {
  it('Should render form without error', async () => {
    const { getByTestId } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => getByTestId(/business-info-form/i));
    });

    expect(getByTestId('business-info-form')).toBeInTheDocument();
  });

  it('Should display values retrieved from the query as defaultValues within the inputs', async () => {
    const { queryByDisplayValue } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => queryByDisplayValue('Taptrip'));
    });

    const firstLineVal = screen.getByDisplayValue('Taptrip');
    expect(firstLineVal).toBeInTheDocument();
  });

  it('Should be disable if isCompanyAdmin flag is false', async () => {
    const { container } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => container.querySelector('input'));
    });

    expect(container.querySelector('input')).toBeDisabled();
  });

  it('Should display validation error message if company name is not completed', async () => {
    const { getByText } = renderComponent(validationMocks);
    await act(async () => {
      await waitFor(() => getByText('Save'));
    });

    fireEvent.submit(getByText('Save'));

    await act(async () => {
      await waitFor(() => getByText(businessInformation.hint.companyName));
      expect(
        getByText(businessInformation.hint.companyName)
      ).toBeInTheDocument();
    });
  });
});
