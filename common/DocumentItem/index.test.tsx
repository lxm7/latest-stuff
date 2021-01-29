import React from 'react';
import { render, cleanup, act, fireEvent } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitFor } from '@testing-library/dom';
import {
  PaymentCardType,
  CardTypes,
} from 'components/travelBookings/common/CardDropdown';
import DocumentItem from '.';
import { DocumentItemProps } from './types';
import { DocumentType, DocumentName } from '../../DocumentWrapper/types';
import {
  DELETE_VISA_CARD,
  DELETE_PASSPORT_CITIZENSHIP_CARD,
  DELETE_PAYMENT_CARD,
} from '../../DocumentWrapper/queries';

const documentPropsPassport = {
  rowDetails: {
    icon: '/images/passport_eprofile.svg',
    altText: 'passport icon',
    wrapperTitle: 'Passport(s)',
    documentName: 'passport' as DocumentName,
    limit: '2',
    colorScheme: 'linear-gradient(117deg, #5b59e1 -20%, #f4376d 207%)',
    addIcon: 'addIcon.png',
    type: DocumentType.PASSPORT,
  },
  documentDetails: {
    id: '12344636',
    country: {
      formatted: 'United Kingdom',
      value: 'GB',
    },
    citizenship: {
      formatted: 'United Kingdom',
      value: 'GB',
    },
    expiry: '2021-10-11T00:00:00Z',
  },
  cardNumber: 1,
  removeDeletedDocument: jest.fn(),
};

const documentPropsVisa = {
  rowDetails: {
    icon: '/images/visa_eprofile.svg',
    addIcon: '/images/addCard.svg',
    altText: 'visa icon',
    wrapperTitle: 'Visa(s)',
    documentName: 'visa' as DocumentName,
    limit: '3',
    colorScheme: 'linear-gradient(117deg, #e1b459 -20%, #f4376d 207%)',
  },
  documentDetails: {
    id: '12344',
    type: {
      formatted: 'BE',
      value: 'be',
    },
    country: {
      formatted: 'United Kingdom',
      value: 'GB',
    },
    expiry: '2021-10-11T00:00:00Z',
  },
  cardNumber: 1,
  removeDeletedDocument: jest.fn(),
};

const documentPropsPaymentCard = {
  rowDetails: {
    documentName: 'payment card' as DocumentName,
    icon: '/images/paymentCard_eprofile.svg',
    addIcon: '/images/addCard.svg',
    limit: '10',
    altText: 'payment card icon',
    wrapperTitle: 'Payment card(s)',
    colorScheme: 'linear-gradient(117deg, #ff7676 -20%, #f54ea2 207%)',
  },
  documentDetails: {
    id: '12345',
    card: {
      id: '12345',
      brand: 'american express' as CardTypes,
      type: PaymentCardType.USER,
    },
  },
  cardNumber: 1,
  removeDeletedDocument: jest.fn(),
};

const deletePaymentMock = [
  {
    request: {
      query: DELETE_PAYMENT_CARD,
      variables: { id: '12345' },
    },
    // An Apollo convention for testing the mutation
    result: jest.fn(() => 'Mutation has been called'),
  },
];

const deleteVisaMock = [
  {
    request: {
      query: DELETE_VISA_CARD,
      variables: { id: '12344' },
    },
    // An Apollo convention for testing the mutation
    result: jest.fn(() => 'Mutation has been called'),
  },
];

const deletePassportMock = [
  {
    request: {
      query: DELETE_PASSPORT_CITIZENSHIP_CARD,
      variables: {
        id: '12344636',
        docType: documentPropsPassport.rowDetails.type,
      },
    },
    // An Apollo convention for testing the mutation
    result: jest.fn(() => 'Mutation has been called'),
  },
];

const renderComponent = (props: DocumentItemProps, mocks: object) =>
  render(
    <MockedProvider
      mocks={(mocks as unknown) as ReadonlyArray<MockedResponse>}
      addTypename={false}>
      <DocumentItem {...props} />
    </MockedProvider>
  );

afterEach(() => {
  cleanup();
});

describe('<DocumentItem />', () => {
  it('Should render without error', () => {
    const { getByText } = renderComponent(
      documentPropsPassport,
      deleteVisaMock
    );
    expect(getByText('Passport number')).toBeInTheDocument();
  });

  it('should fire delete mutation for passport when clicking the trash icon', async () => {
    const { getByTestId } = renderComponent(
      documentPropsPassport,
      deletePassportMock
    );
    await act(async () => {
      await waitFor(() => getByTestId('delete-button'));
    });

    fireEvent.click(getByTestId('delete-button'));

    await act(async () => {
      await waitFor(() =>
        expect(deletePassportMock[0].result).toHaveBeenCalled()
      );
    });
  });

  it('should fire delete mutation for visa when clicking the trash icon', async () => {
    const { getByTestId } = renderComponent(documentPropsVisa, deleteVisaMock);
    await act(async () => {
      await waitFor(() => getByTestId('delete-button'));
    });

    fireEvent.click(getByTestId('delete-button'));

    await act(async () => {
      await waitFor(() => expect(deleteVisaMock[0].result).toHaveBeenCalled());
    });
  });

  it('should fire delete mutation for payment card when clicking the trash icon', async () => {
    const { getByTestId } = renderComponent(
      documentPropsPaymentCard,
      deletePaymentMock
    );
    await act(async () => {
      await waitFor(() => getByTestId('delete-button'));
    });

    fireEvent.click(getByTestId('delete-button'));

    await act(async () => {
      await waitFor(() => expect(deleteVisaMock[0].result).toHaveBeenCalled());
    });
  });
});
