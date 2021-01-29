import React from 'react';
import { render, act, fireEvent, cleanup } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitFor } from '@testing-library/dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import {
  CONFIRM_PAYMENT_CARD,
  CREATE_PAYMENT_CARD,
  GET_PAYMENT_CARDS,
} from 'components/eprofile/queries';
import { PaymentCardType } from 'components/travelBookings/common/CardDropdown';
import { paymentCards } from 'components/eprofile/langEn';
import PaymentCardForm from '.';
import { paymentCardsWithUserType } from './fixture';

/** stripe promise gives access to Stripe when passed into elements
 * accepts test access key -- this is a test key */
const stripePromise = loadStripe('pk_test_JJ1eMdKN0Hp4UFJ6kWXWO4ix00jtXzq5XG');

const emptyMocks = [
  {
    request: {
      query: GET_PAYMENT_CARDS,
    },
    result: {
      data: {
        ...paymentCardsWithUserType,
      },
    },
  },
];

const validationMocks = [
  {
    request: {
      query: GET_PAYMENT_CARDS,
    },
    result: {
      data: {
        id: '',
        lastFour: '',
        type: '',
      },
    },
  },
];

const completedMocks = [
  {
    request: {
      query: GET_PAYMENT_CARDS,
    },
    result: {
      data: {
        id: '64557457456',
        expiry: '08/24',
        lastFour: '1234',
        brand: 'Visa',
        description: '**** **** **** 1234',
        type: PaymentCardType.USER,
      },
    },
  },
  {
    request: {
      query: CREATE_PAYMENT_CARD,
      variables: {
        type: PaymentCardType.USER,
      },
    },
    result: {
      data: {
        createPaymentCard: 'd1100d70-8775-421e-b50c-ba83683b5c1f',
      },
    },
    // An Apollo convention for testing the mutation
    newData: jest.fn(() => ({
      data: {
        createPaymentCard: 'd1100d70-8775-421e-b50c-ba83683b5c1f',
      },
    })),
  },
  {
    request: {
      query: CONFIRM_PAYMENT_CARD,
      variables: {
        id: '64557457456',
      },
    },
    result: {
      data: {
        id: '64557457456',
        expiry: '08/24',
        lastFour: '1234',
        brand: 'Visa',
        description: '**** **** **** 1234',
        type: PaymentCardType.USER,
      },
    },
    // An Apollo convention for testing the mutation
    newData: jest.fn(() => ({
      data: {
        id: '64557457456',
        expiry: '08/24',
        lastFour: '1234',
        brand: 'Visa',
        description: '**** **** **** 1234',
        type: PaymentCardType.USER,
      },
    })),
  },
];

const renderComponent = (mocks: object, isCompanyAdmin = false) =>
  render(
    <Elements stripe={stripePromise}>
      <MockedProvider
        mocks={(mocks as unknown) as ReadonlyArray<MockedResponse>}
        addTypename={false}>
        <PaymentCardForm
          readOnly={false}
          confirmButton={false}
          isCompanyAdmin={isCompanyAdmin}
        />
      </MockedProvider>
    </Elements>
  );

afterEach(() => {
  cleanup();
});

describe('<PaymentCardForm />', () => {
  it('Should render form without error', async () => {
    const { getByTestId } = renderComponent(emptyMocks);
    await act(async () => {
      await waitFor(() => getByTestId(/payment-card-form/i));
    });

    expect(getByTestId('payment-card-form')).toBeInTheDocument();
  });

  it('Should display an empty form for adding a new PaymentCard', async () => {
    const { queryAllByDisplayValue } = renderComponent(emptyMocks);
    let formInputs: HTMLInputElement[];
    await act(async () => {
      await waitFor(
        // eslint-disable-next-line
        () =>
          (((formInputs as unknown) as HTMLElement[]) = queryAllByDisplayValue(
            ''
          ))
      );
      expect(formInputs[0].value).toContain('');
      expect(formInputs[1].value).toContain('');
    });
  });

  it('Should display validation error if payment card name is empty', async () => {
    const { getByText, queryByText } = renderComponent(validationMocks);
    await act(async () => {
      await waitFor(() => getByText('Save'));
    });

    fireEvent.submit(getByText('Save'));

    await act(async () => {
      await waitFor(() => queryByText(paymentCards.hint.nameOnCard));
      expect(queryByText(paymentCards.hint.nameOnCard)).toBeInTheDocument();
    });
  });

  it('Should display validation error on stripe elements if empty', async () => {
    const render = renderComponent(completedMocks);
    const input = render.getByLabelText('Name on card');
    const { getByText, queryByText } = render;

    fireEvent.change(input, { target: { value: 'Kevin Cain' } });

    await act(async () => {
      await waitFor(() => getByText('Save'));
    });

    fireEvent.submit(getByText('Save'));

    await act(async () => {
      await waitFor(() => queryByText(paymentCards.hint.cardnumber));
      expect(queryByText(paymentCards.hint.cardnumber)).toBeInTheDocument();
    });
  });

  // it('Should call createPaymentCard on form submission', async () => {
  //   const { getByText } = renderComponent(mocks);
  //   await act(async () => {
  //     await waitFor(() => getByText('Save'));
  //   });

  //   fireEvent.submit(getByText('Save'));

  //   await act(async () => {
  //     await waitFor(() => expect(mocks[1].newData).toHaveBeenCalled());
  //   });
  // });

  // it('Should call confirmPaymentCard on form submission', async () => {
  //   const { getByText } = renderComponent(mocks);
  //   await act(async () => {
  //     await waitFor(() => getByText('Save'));
  //   });

  //   fireEvent.submit(getByText('Save'));

  //   await act(async () => {
  //     await waitFor(() => expect(mocks[2].newData).toHaveBeenCalled());
  //   });
  // });
});
