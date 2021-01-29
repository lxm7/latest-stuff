/* eslint-disable no-return-assign */
import React from 'react';
import { render, act, cleanup } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { fireEvent, waitFor } from '@testing-library/dom';

import { GET_USER_DOCUMENT } from 'components/eprofile/queries';
import { passportDetails } from 'components/eprofile/langEn';
import PassportInfoForm from '.';

const id = 'c1c573a1-2979-4e67-99e5-a7aeceb8efc4';

// mocked query and mutation for getting business information and updating it
const mocks = [
  {
    request: {
      query: GET_USER_DOCUMENT,
    },
    result: {
      data: {
        user: {
          id,
          firstName: '',
          lastName: '',
          profile: {
            dateOfBirth: '',
            gender: {
              value: '',
              formatted: '',
            },
            documentation: {
              id: '',
              citizenship: {
                formatted: '',
                value: '',
              },
              country: {
                value: '',
                formatted: '',
              },
              expiry: '',
              issueDate: '',
            },
          },
        },
      },
    },
  },
];

const validationMocks = [
  {
    request: {
      query: GET_USER_DOCUMENT,
    },
    result: {
      data: {
        user: {
          id,
          firstName: '',
          lastName: 'Cain',
          profile: {
            dateOfBirth: '2000-10-11T00:00:00Z',
            gender: {
              value: 'F',
              formatted: 'F',
            },
            documentation: {
              id: '123445',
              citizenship: {
                formatted: 'GB',
                value: 'GB',
              },
              country: {
                value: 'GB',
                formatted: 'GB',
              },
              expiry: '2021-10-11T00:00:00Z',
              issueDate: '2017-10-11T00:00:00Z',
            },
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
      <PassportInfoForm
        readOnly={false}
        confirmButton={false}
        isCompanyAdmin={isCompanyAdmin}
      />
    </MockedProvider>
  );

afterEach(() => {
  cleanup();
});

describe('<PassportInfoForm />', () => {
  it('Should render form without error', async () => {
    const { getByTestId } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => getByTestId(/passport-info-form/i));
    });

    expect(getByTestId('passport-info-form')).toBeInTheDocument();
  });

  it('Should display an empty form for adding a new citizenship Card', async () => {
    const { queryAllByDisplayValue } = renderComponent(mocks);
    let formInputs: HTMLInputElement[];
    await act(async () => {
      await waitFor(
        () =>
          (((formInputs as unknown) as HTMLElement[]) = queryAllByDisplayValue(
            ''
          ))
      );
      expect(formInputs[0].value).toContain('');
      expect(formInputs[2].value).toContain('');
    });
  });

  it('Should be disable if isCompanyAdmin flag is false', async () => {
    const { container } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => container.querySelector('input'));
    });

    expect(container.querySelector('input')).toBeDisabled();
  });

  it('Should display validation error message if first name is not completed', async () => {
    const { getByText } = renderComponent(validationMocks);
    await act(async () => {
      await waitFor(() => getByText('Save'));
    });

    fireEvent.submit(getByText('Save'));

    await act(async () => {
      await waitFor(() => getByText(passportDetails.hint.firstName));
      expect(getByText(passportDetails.hint.firstName)).toBeInTheDocument();
    });
  });
});
