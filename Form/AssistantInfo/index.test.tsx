import React from 'react';
import {
  render,
  screen,
  act,
  cleanup,
  fireEvent,
} from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitFor } from '@testing-library/dom';

import AssistantInfoForm from '.';
import { USER_ASSISTANT_INFO, UPDATE_ASSISTANT_INFO } from './queries';

const mocks = [
  {
    request: {
      query: USER_ASSISTANT_INFO,
    },
    result: {
      data: {
        user: {
          profile: {
            associates: {
              assistant: {
                name: 'Alex',
                email: 'alex@gmail.com',
                telephone: {
                  e164: '',
                  national: '',
                  countryCode: '',
                },
                mobile: {
                  countryCode: 44,
                  e164: '+447555555555',
                  national: '07555 555555',
                },
              },
            },
          },
        },
      },
      errors: [
        {
          message:
            'input: user.profile.associates.assistant.mobile The phone number supplied was empty.',
        },
      ],
    },
  },
  {
    request: {
      query: UPDATE_ASSISTANT_INFO,
      variables: {
        input: {
          assistant: {
            name: 'Alex',
            email: 'alex@gmail.com',
            phone: '',
            mobile: '',
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
      query: USER_ASSISTANT_INFO,
    },
    result: {
      data: {
        user: {
          profile: {
            associates: {
              assistant: {
                name: 'Alex',
                email: 'alex@gmail.com',
                telephone: {
                  e164: '',
                  national: '',
                  countryCode: '',
                },
                mobile: {
                  countryCode: 44,
                  e164: '+447555555555',
                  national: '07555 555555',
                },
              },
            },
          },
        },
      },
      errors: [
        {
          message:
            'input: user.profile.associates.assistant.mobile The phone number supplied was empty.',
        },
      ],
    },
  },
  {
    request: {
      query: UPDATE_ASSISTANT_INFO,
      variables: {
        input: {
          assistant: {
            name: 'Alex',
            email: 'alex@gmail.com',
            phone: '',
            mobile: '',
          },
        },
      },
    },
    error: new Error('A network error has occured'),
  },
];

const validationMock = [
  {
    request: {
      query: USER_ASSISTANT_INFO,
    },
    result: {
      data: {
        user: {
          profile: {
            associates: {
              assistant: {
                name: '',
                email: 'alex@gmail.com',
                telephone: {
                  e164: '',
                  national: '',
                  countryCode: '',
                },
                mobile: {
                  countryCode: 44,
                  e164: '+447555555555',
                  national: '07555 555555',
                },
              },
            },
          },
        },
      },
      errors: [
        {
          message:
            'input: user.profile.associates.assistant.mobile The phone number supplied was empty.',
        },
      ],
    },
  },
  {
    request: {
      query: UPDATE_ASSISTANT_INFO,
      variables: {
        input: {
          assistant: {
            name: 'Alex',
            email: 'alex@gmail.com',
            phone: '',
            mobile: '',
          },
        },
      },
    },
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
      <AssistantInfoForm
        readOnly={readOnly}
        confirmButton={confirmButton}
        isCompanyAdmin={isCompanyAdmin}
      />
    </MockedProvider>
  );

afterEach(() => {
  cleanup();
});

describe('<AssistantInfoForm />', () => {
  it('Should render form without error', async () => {
    const { getByTestId } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => getByTestId(/assistant-info-form/i));
    });

    expect(getByTestId('assistant-info-form')).toBeInTheDocument();
  });

  it('Should display values retrieved from the query even when other fields errored', async () => {
    const { queryByDisplayValue } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => queryByDisplayValue('Alex'));
    });

    const firstLineVal = screen.getByDisplayValue('Alex');
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

  it('Should be disable if isCompanyAdmin flag is false', async () => {
    const { container } = renderComponent(mocks, false, false, false);
    await act(async () => {
      await waitFor(() => container.querySelector('input'));
    });

    expect(container.querySelector('input')).toBeDisabled();
  });

  it('Should display validation error when assistant name is not completed ', async () => {
    const { getByText } = renderComponent(validationMock);
    await act(async () => {
      await waitFor(() => getByText('Save'));
    });

    fireEvent.submit(getByText('Save'));

    await act(async () => {
      await waitFor(() => getByText('Please enter assistant name.'));
      expect(getByText('Please enter assistant name.')).toBeInTheDocument();
    });
  });
});
