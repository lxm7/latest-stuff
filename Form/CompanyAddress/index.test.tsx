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

import { companyAddress } from 'components/eprofile/langEn';
import CompanyAddressForm from '.';
import { COMPANY_ADDRESS, UPDATE_COMPANY_ADDRESS } from './queries';

// Fixtures
const id = '639e561a-767e-422e-bd6c-d54459ea7f9f';

const address = {
  firstLine: 'Aria House',
  secondLine: 'Pottery Lane',
  city: '',
  county: 'Greater Manchester',
  country: 'GB',
  postcode: 'M12 4AB7',
};

const emptyAddress = {
  firstLine: '',
  secondLine: '',
  city: '',
  county: '',
  country: '',
  postcode: '',
};

const contactInformation = {
  mobile: {
    countryCode: 44,
    e164: '+447555555555',
    national: '07555 555555',
  },
  phone: {
    countryCode: 44,
    e164: '+447555111444',
    national: '07555 111444',
  },
};

// mocked query and mutation for getting company address information and updating it
const mocks = [
  {
    request: {
      query: COMPANY_ADDRESS,
    },
    result: {
      data: {
        company: {
          id,
          address,
          contactInformation,
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_COMPANY_ADDRESS,
      variables: {
        input: {
          address,
          contactInformation: {
            phone: '',
            mobile: '',
          },
        },
      },
    },
    result: {
      data: {
        updateCompanyDetails: {
          id,
          address,
          contactInformation,
        },
      },
    },
    // An Apollo convention for testing the mutation
    newData: jest.fn(() => ({
      data: {
        updateCompanyDetails: {
          id,
          address,
          contactInformation,
        },
      },
    })),
  },
];

const errorMocks = [
  {
    request: {
      query: COMPANY_ADDRESS,
    },
    result: {
      data: {
        company: {
          id,
          address,
          contactInformation,
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_COMPANY_ADDRESS,
      variables: {
        input: {
          address,
          contactInformation: {
            phone: '',
            mobile: '',
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
      query: COMPANY_ADDRESS,
    },
    result: {
      data: {
        company: {
          id,
          emptyAddress,
          contactInformation,
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_COMPANY_ADDRESS,
      variables: {
        input: {
          address,
          contactInformation: {
            phone: '',
            mobile: '',
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
      <CompanyAddressForm
        readOnly={false}
        confirmButton={false}
        isCompanyAdmin={isCompanyAdmin}
      />
    </MockedProvider>
  );

afterEach(() => {
  cleanup();
});

describe('<CompanyAddressForm />', () => {
  it('Should render form without error', async () => {
    const { getByTestId } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => getByTestId('company-address-form'));
    });
    expect(getByTestId('company-address-form')).toBeInTheDocument();
  });

  it('Should display text to the user to say they cannot edit the form', async () => {
    const { getByTestId } = renderComponent(mocks);
    await act(async () => {
      await waitFor(() => getByTestId('no-edit-subtext'));
    });
    expect(getByTestId('no-edit-subtext')).toBeInTheDocument();
  });

  it('Should display values retrieved from the query as defaultValues within the inputs', async () => {
    renderComponent(mocks);
    await act(async () => {
      waitFor(() => screen.queryByDisplayValue('Aria House'));
    });

    const firstLineVal = screen.queryByDisplayValue('Aria House');
    expect(firstLineVal).toBeInTheDocument();
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

  it('Should be disable if isCompanyAdmin flag is false', async () => {
    const { container } = renderComponent(mocks);
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
      await waitFor(() => getByText(companyAddress.hint.addressLine1));
      expect(getByText(companyAddress.hint.addressLine1)).toBeInTheDocument();
    });
  });
});
