/* eslint-disable no-return-assign */
import React from 'react';
import { render, act, fireEvent, cleanup } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitFor } from '@testing-library/dom';

import { DocumentType } from 'components/eprofile/DocumentWrapper/types';
import { citizenshipCard } from 'components/eprofile/langEn';
import CitizenshipCardForm from '.';
import { GET_USER_DOCUMENT, UPDATE_USER_DOCUMENT } from '../../queries';
/** Empty result set for a citzenship card we can use in our mocks */
const result = {
  data: {
    user: {
      profile: {
        documentation: {
          id: '',
          expiry: '',
          type: '',
          issueDate: '',
          citizenship: {
            value: '',
            formatted: '',
          },
          country: {
            formatted: '',
            value: '',
          },
        },
      },
    },
  },
};

const mocks = [
  {
    request: {
      query: GET_USER_DOCUMENT,
    },
    result,
  },
  {
    request: {
      query: UPDATE_USER_DOCUMENT,
      variables: {
        input: {
          country: 'ES',
          expiry: '2021-01-01T00:00:00.000+00:00',
          id: '31233121232222',
          issueDate: null,
          type: DocumentType.CITIZENSHIP_CARD,
        },
      },
    },
    result: {
      data: {
        updateDocumentation: '',
      },
    },
    // An Apollo convention for testing the mutation
    newData: jest.fn(() => ({
      data: {
        updateDocumentation: '',
      },
    })),
  },
];

const validationMocks = [
  {
    request: {
      query: UPDATE_USER_DOCUMENT,
    },
    result,
  },
  {
    request: {
      query: UPDATE_USER_DOCUMENT,
      variables: {
        input: {
          country: 'ES',
          expiry: '2021-01-01T00:00:00.000+00:00',
          id: '31233121232222',
          issueDate: null,
          type: DocumentType.CITIZENSHIP_CARD,
        },
      },
    },
    result: {
      data: {
        updateDocumentation: '',
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
      <CitizenshipCardForm
        readOnly={false}
        confirmButton={false}
        isCompanyAdmin={isCompanyAdmin}
      />
    </MockedProvider>
  );

afterEach(() => {
  cleanup();
});

describe('<CitizenshipCardForm />', () => {
  it('Should render form without error', async () => {
    const { getByTestId } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => getByTestId(/citizenship-card-form/i));
    });

    expect(getByTestId('citizenship-card-form')).toBeInTheDocument();
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

  it('Should be disabled if isCompanyAdmin flag is false', async () => {
    const { container } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => container.querySelector('input'));
    });

    expect(container.querySelector('input')).toBeDisabled();
  });

  it('Should display validation error if citizenship Card name empty', async () => {
    const { getByText } = renderComponent(validationMocks);
    await act(async () => {
      await waitFor(() => getByText('Save'));
    });

    fireEvent.submit(getByText('Save'));

    await act(async () => {
      await waitFor(() => getByText(citizenshipCard.hint.number));
      expect(getByText(citizenshipCard.hint.number)).toBeInTheDocument();
    });
  });
});
