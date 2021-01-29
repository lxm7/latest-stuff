/* eslint-disable no-return-assign */
import React from 'react';
import { render, act, fireEvent, cleanup } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitFor } from '@testing-library/dom';

import { visaDetails } from 'components/eprofile/langEn';
import VisaForm from '.';
import { GET_VISA_DOCUMENT, UPDATE_VISA_DOCUMENT } from './queries';

const mocks = [
  {
    request: {
      query: GET_VISA_DOCUMENT,
    },
    result: {
      data: {
        user: {
          profile: {
            visas: [
              {
                id: '',
                expiry: '',
                type: {
                  formatted: '',
                  value: '',
                },
                country: {
                  value: '',
                  formatted: '',
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_VISA_DOCUMENT,
      variables: {
        input: {
          country: 'GB',
          expiry: '2022-01-01T00:00:00.000+00:00',
          id: '1234567',
          type: 'ES',
        },
      },
    },
    result: {
      data: {
        updateVisa: '',
      },
    },
    // An Apollo convention for testing the mutation
    newData: jest.fn(() => ({
      data: {
        updateVisa: '',
      },
    })),
  },
];

const validationMocks = [
  {
    request: {
      query: GET_VISA_DOCUMENT,
    },
    result: {
      data: {
        user: {
          profile: {
            visas: [
              {
                id: '1234567',
                expiry: '2022-01-01T00:00:00.000+00:00',
                type: {
                  formatted: 'ESTA',
                  value: 'ES',
                },
                country: {
                  value: 'GB',
                  formatted: 'GB',
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_VISA_DOCUMENT,
      variables: {
        input: {
          country: 'AD',
          expiry: '2021-01-01T00:00:00Z',
          id: '123231',
          type: 'ES',
        },
      },
    },
    result: {
      data: {
        updateVisa: '',
      },
    },
    error: new Error('A network error has occured'),
  },
];

const renderComponent = (mocks: object, isCompanyAdmin = false) =>
  render(
    <MockedProvider
      mocks={(mocks as unknown) as ReadonlyArray<MockedResponse>}
      addTypename={false}>
      <VisaForm
        readOnly={false}
        confirmButton={false}
        isCompanyAdmin={isCompanyAdmin}
      />
    </MockedProvider>
  );

afterEach(() => {
  cleanup();
});

describe('<VisaForm />', () => {
  it('Should render form without error', async () => {
    const { getByTestId } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => getByTestId(/visa-form/i));
    });

    expect(getByTestId('visa-form')).toBeInTheDocument();
  });

  it('Should display an empty form for adding a new visa', async () => {
    const { queryAllByDisplayValue } = renderComponent(mocks);
    let formInputs: HTMLInputElement[];
    await act(async () => {
      await waitFor(
        () =>
          (((formInputs as unknown) as HTMLElement[]) = queryAllByDisplayValue(
            ''
          ))
      ); // eslint-disable-line
      expect(formInputs[0].value).toContain('');
      expect(formInputs[2].value).toContain('');
    });
  });

  it('Should be disabled if isCompanyAdmin flag is false', async () => {
    const { container } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => container.querySelector('input'));
    });

    expect(container.querySelector('input')).toBeDisabled();
  });

  it('Should display validation error if visa name empty', async () => {
    const { getByText } = renderComponent(validationMocks);
    await act(async () => {
      await waitFor(() => getByText('Save'));
    });

    fireEvent.submit(getByText('Save'));

    await act(async () => {
      await waitFor(() => getByText(visaDetails.hint.type));
      expect(getByText(visaDetails.hint.type)).toBeInTheDocument();
    });
  });
});
