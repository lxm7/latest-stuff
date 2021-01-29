/* eslint-disable no-return-assign */
import React from 'react';
import {
  render,
  fireEvent,
  act,
  cleanup,
  waitFor,
} from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';

import { DocumentType } from 'components/eprofile/DocumentWrapper/types';

import { flightLoyaltyDetails } from 'components/eprofile/langEn';
import FlightForm from '.';
import { GET_LOYALTY_PROGRAMS, UPDATE_LOYALTY_PROGRAM } from '../../queries';

const mocks = [
  {
    request: {
      query: GET_LOYALTY_PROGRAMS,
      variables: {
        type: DocumentType.AIR,
      },
    },
    result: {
      data: {
        user: {
          profile: {
            preferences: {
              loyaltyPrograms: [
                {
                  id: '',
                  supplier: {
                    formatted: '',
                    value: '',
                  },
                  type: DocumentType.AIR,
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_LOYALTY_PROGRAM,
      variables: {
        input: {
          id: '12345678',
          type: DocumentType.AIR,
          supplier: 'AA',
        },
      },
    },
    result: {
      data: {
        updateLoyaltyProgram: '',
      },
    },
    // An Apollo convention for testing the mutation
    newData: jest.fn(() => ({
      data: {
        updateLoyaltyProgram: '',
      },
    })),
  },
];

const renderComponent = (mocks: object) =>
  render(
    <MockedProvider
      mocks={(mocks as unknown) as ReadonlyArray<MockedResponse>}
      addTypename={false}>
      <FlightForm />
    </MockedProvider>
  );

afterEach(() => {
  cleanup();
});

describe('<FlightForm />', () => {
  it('Should render without error', () => {
    const { getByTestId } = renderComponent(mocks);
    expect(getByTestId('flight-form')).toBeInTheDocument();
  });

  it('Should display an empty form for adding a new flight loyalty program', async () => {
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
    });
  });

  it('Should display validation error if airline name is empty', async () => {
    const { getByText } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => getByText('Save'));
    });

    fireEvent.submit(getByText('Save'));

    await act(async () => {
      await waitFor(() => getByText(flightLoyaltyDetails.hint.supplier));
      expect(getByText(flightLoyaltyDetails.hint.supplier)).toBeInTheDocument();
    });
  });
});
