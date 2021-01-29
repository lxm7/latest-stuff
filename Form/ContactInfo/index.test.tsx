import React from 'react';
import {
  render,
  screen,
  act,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitFor } from '@testing-library/dom';

import { USER_CONTACT_INFO } from 'components/eprofile/queries';
import { contactInformation } from 'components/eprofile/langEn';
import ContactInfoForm from '.';
import { UPDATE_CONTACT_INFO } from './queries';

const phoneValues = {
  e164: '+447301234567',
  countryCode: 44,
  national: '07301 234567',
};

const address = {
  firstLine: '123 Test Street',
  secondLine: 'addrLine1',
  county: 'Greater Manchester',
  city: '',
  country: 'UK',
  postcode: 'M345RH',
};

const emptyAddress = {
  firstLine: '',
  secondLine: '',
  county: 'Greater Manchester',
  city: '',
  country: 'UK',
  postcode: 'M345RH',
};

const mocks = [
  {
    request: {
      query: USER_CONTACT_INFO,
    },
    result: {
      data: {
        user: {
          username: 'sibers@test.com',
          profile: {
            contactInformation: {
              address,
              mobile: { ...phoneValues },
              phone: { ...phoneValues },
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_CONTACT_INFO,
      variables: {
        input: {
          address,
          phone: '',
          mobile: '',
        },
      },
    },
    result: {
      data: {
        setUserContactInfo: '',
      },
    },
    newData: jest.fn(() => ({
      data: {
        setUserContactInfo: '',
      },
    })),
  },
];

const errorMocks = [
  {
    request: {
      query: USER_CONTACT_INFO,
    },
    result: {
      data: {
        user: {
          username: 'sibers@test.com',
          profile: {
            contactInformation: {
              address,
              mobile: { ...phoneValues },
              phone: { ...phoneValues },
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_CONTACT_INFO,
      variables: {
        input: {
          address,
          phone: '',
          mobile: '',
        },
      },
    },
    error: new Error('A network error has occured'),
  },
];

const validationMocks = [
  {
    request: {
      query: USER_CONTACT_INFO,
    },
    result: {
      data: {
        user: {
          username: 'sibers@test.com',
          profile: {
            contactInformation: {
              emptyAddress,
              mobile: { ...phoneValues },
              phone: { ...phoneValues },
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_CONTACT_INFO,
      variables: {
        input: {
          address,
          phone: '',
          mobile: '',
        },
      },
    },
    error: new Error('A network error has occured'),
  },
];

const renderComponent = (
  mocks: object,
  readOnly = false,
  confirmButton = false,
  isCompanyAdmin = false
) =>
  render(
    <MockedProvider
      mocks={(mocks as unknown) as ReadonlyArray<MockedResponse>}
      addTypename={false}>
      <ContactInfoForm
        readOnly={readOnly}
        confirmButton={confirmButton}
        isCompanyAdmin={isCompanyAdmin}
      />
    </MockedProvider>
  );

afterEach(() => {
  cleanup();
});

describe('<ContactInfoForm />', () => {
  it('Should render form without error', async () => {
    const { getByTestId } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => getByTestId(/contact-info-form/i));
    });

    expect(getByTestId('contact-info-form')).toBeInTheDocument();
  });

  it('Should display values retrieved from the query as defaultValues within the inputs', async () => {
    const { queryByDisplayValue } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => queryByDisplayValue('123 Test Street'));
    });

    const firstLineVal = screen.getByDisplayValue('123 Test Street');
    expect(firstLineVal).toBeInTheDocument();
  });

  it('should hide save button if readOnly', async () => {
    const { queryByText } = renderComponent(mocks, true);
    await act(async () => {
      await waitFor(() => queryByText('Save'));
    });

    expect(queryByText('Save')).not.toBeInTheDocument();
  });

  it('should show confirm if not a save button', async () => {
    const { queryByText } = renderComponent(mocks, false, true);
    await act(async () => {
      await waitFor(() => queryByText('Confirm'));
    });

    expect(queryByText('Confirm')).toBeInTheDocument();
  });

  it('should fire mutation when clicking the button', async () => {
    const { getByText } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => getByText('Save'));
    });

    fireEvent.submit(getByText('Save'));

    await act(async () => {
      await waitFor(() => expect(mocks[1].newData).toHaveBeenCalled());
    });
  });

  it('Should display a success message to the user after the mutation has executed', async () => {
    const { getByText } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => getByText('Save'));
    });

    fireEvent.submit(getByText('Save'));

    await act(async () => {
      await waitFor(() => getByText('Your changes have been saved!'));
      expect(getByText('Your changes have been saved!')).toBeInTheDocument();
    });
  });

  it('Should render an error message when an error is returned from the mutation', async () => {
    const { getByText } = renderComponent(errorMocks);
    await act(async () => {
      await waitFor(() => getByText('Save'));
    });

    fireEvent.submit(getByText('Save'));

    await act(async () => {
      await waitFor(() => getByText('A network error has occured'));
      expect(getByText('A network error has occured')).toBeInTheDocument();
    });
  });

  it('Should be disabled if isCompanyAdmin flag is false', async () => {
    const { container } = renderComponent(mocks, false, false, false);
    await act(async () => {
      await waitFor(() => container.querySelector('input'));
    });

    expect(container.querySelector('input')).toBeDisabled();
  });

  it('Should display validation error if first line of address is empty', async () => {
    const { getByText } = renderComponent(validationMocks);
    await act(async () => {
      await waitFor(() => getByText('Save'));
    });

    fireEvent.submit(getByText('Save'));

    await act(async () => {
      await waitFor(() => getByText(contactInformation.hint.addressLine1));
      expect(
        getByText(contactInformation.hint.addressLine1)
      ).toBeInTheDocument();
    });
  });
});
