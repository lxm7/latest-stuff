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
import { hotelLoyaltyDetails } from 'components/eprofile/langEn';
import HotelForm from '.';
import { GET_LOYALTY_PROGRAMS, UPDATE_LOYALTY_PROGRAM } from '../../queries';

const mocks = [
  {
    request: {
      query: GET_LOYALTY_PROGRAMS,
      variables: {
        type: DocumentType.HOTEL,
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
                  type: DocumentType.HOTEL,
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
          id: '234324',
          type: DocumentType.HOTEL,
          supplier: 'AC',
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
      <HotelForm />
    </MockedProvider>
  );

afterEach(() => {
  cleanup();
});

describe('<HotelForm />', () => {
  it('Should render without error', () => {
    const { getByTestId } = renderComponent(mocks);
    expect(getByTestId('hotel-form')).toBeInTheDocument();
  });

  it('Should display an empty form for adding a new hotel loyalty program', async () => {
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

  it('Should display validation error if hotel name is empty', async () => {
    const { getByText } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => getByText('Save'));
    });

    fireEvent.submit(getByText('Save'));

    await act(async () => {
      await waitFor(() => getByText(hotelLoyaltyDetails.hint.supplier));
      expect(getByText(hotelLoyaltyDetails.hint.supplier)).toBeInTheDocument();
    });
  });
});
