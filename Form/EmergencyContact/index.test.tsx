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

import { EMERGENCY_CONTACT_INFO } from 'components/eprofile/queries';
import { emergencyContact } from 'components/eprofile/langEn';
import EmergencyContactForm from '.';
import { UPDATE_EMERGENCY_CONTACT_INFO } from './queries';

const mocks = [
  {
    request: {
      query: EMERGENCY_CONTACT_INFO,
    },
    result: {
      data: {
        user: {
          profile: {
            associates: {
              emergencyContact: {
                name: 'Test User',
                telephone: {
                  e164: '+447301234567',
                  countryCode: 44,
                  national: '07301234567',
                },
              },
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_EMERGENCY_CONTACT_INFO,
      variables: {
        input: {
          emergencyContact: {
            ContactName: 'Test User',
            Phone: '',
          },
        },
      },
    },
    result: {
      data: {
        setAssociates: '',
      },
    },
    // An Apollo convention for testing the mutation
    newData: jest.fn(() => ({
      data: {
        setAssociates: '',
      },
    })),
  },
];

const errorMocks = [
  {
    request: {
      query: EMERGENCY_CONTACT_INFO,
    },
    result: {
      data: {
        user: {
          profile: {
            associates: {
              emergencyContact: {
                name: 'Test User',
                telephone: {
                  e164: '+447301234567',
                  countryCode: 44,
                  national: '07301234567',
                },
              },
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_EMERGENCY_CONTACT_INFO,
      variables: {
        input: {
          emergencyContact: {
            ContactName: 'Test User',
            Phone: '',
          },
        },
      },
    },
    error: new Error('A network error has occured'),
  },
];

const validationMocks = [
  {
    request: {
      query: EMERGENCY_CONTACT_INFO,
    },
    result: {
      data: {
        user: {
          profile: {
            associates: {
              emergencyContact: {
                name: '',
                telephone: {
                  e164: '+447301234567',
                  countryCode: 44,
                  national: '07301234567',
                },
              },
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_EMERGENCY_CONTACT_INFO,
      variables: {
        input: {
          emergencyContact: {
            ContactName: 'Test User',
            Phone: '',
          },
        },
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
      <EmergencyContactForm
        readOnly={false}
        confirmButton={false}
        isCompanyAdmin={isCompanyAdmin}
      />
    </MockedProvider>
  );

afterEach(() => {
  cleanup();
});

describe('<EmergencyContactForm />', () => {
  it('Should render form without error', async () => {
    const { getByTestId } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => getByTestId(/emergency-contact-form/i));
    });

    expect(getByTestId('emergency-contact-form')).toBeInTheDocument();
  });

  it('Should display values retrieved from the query as defaultValues within the inputs', async () => {
    const { queryByDisplayValue } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => queryByDisplayValue('Test User'));
    });

    const contactNameVal = screen.getByDisplayValue('Test User');
    expect(contactNameVal).toBeInTheDocument();
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
    const { container } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => container.querySelector('input'));
    });

    expect(container.querySelector('input')).toBeDisabled();
  });

  it('Should display validation error if emergency contact name empty', async () => {
    const { getByText } = renderComponent(validationMocks);
    await act(async () => {
      await waitFor(() => getByText('Save'));
    });

    fireEvent.submit(getByText('Save'));

    await act(async () => {
      await waitFor(() => getByText(emergencyContact.hint.name));
      expect(getByText(emergencyContact.hint.name)).toBeInTheDocument();
    });
  });
});
