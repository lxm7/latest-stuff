import React from 'react';
import { ApolloError } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from '@testing-library/react';
import { DocumentConfig, DocumentProperties } from './types';
import DocumentWrapper from '.';
import { config } from '../consts';
import * as utils from './utils';
import { getCopyFromLang } from '../utils';
import { passportDetails, visaDetails } from '../langEn';

const { passport, visa } = config;

const documentList = [
  {
    id: '23456',
    country: {
      formatted: 'United Kingdom',
      value: 'GB',
    },
    expiry: '2021-10-11T00:00:00Z',
    citizenship: {
      formatted: 'United Kingdom',
      value: 'GB',
    },
  },
  {
    id: '222222222',
    country: {
      formatted: 'Spain',
      value: 'ES',
    },
    expiry: '2022-10-11T00:00:00Z',
    citizenship: {
      formatted: 'United Kingdom',
      value: 'GB',
    },
  },
];

const passportType = { ...getCopyFromLang(passportDetails), ...passport };
const visaType = { ...getCopyFromLang(visaDetails), ...visa };

const renderComponent = (
  configType: DocumentConfig & DocumentProperties,
  error: ApolloError | string | undefined,
  documents = documentList,
  loading = false
) => {
  return render(
    <MockedProvider mocks={[]} addTypename={false}>
      <DocumentWrapper
        copy={configType}
        documents={documents}
        loading={loading}
        error={error}
        openModal={() => undefined}
      />
    </MockedProvider>
  );
};

describe('<DocumentWrapper />', () => {
  it('renders correct type on screen with passport', () => {
    const { getByText } = renderComponent(passportType, undefined);
    expect(getByText('Passport(s)')).toBeInTheDocument();
    expect(getByText('(Add up to 2)')).toBeInTheDocument();
  });

  it('renders correct type on screen with visa', () => {
    const { getByText } = renderComponent(visaType, undefined);
    expect(getByText('Visa(s)')).toBeInTheDocument();
    expect(getByText('(Add up to 3)')).toBeInTheDocument();
  });

  it("renders scrollable div area and we're able to fire mouse events inside it", () => {
    const { getByTestId } = renderComponent(visaType, undefined);
    fireEvent.mouseDown(screen.getByTestId(/horizontal-scroller/i));
    fireEvent.mouseMove(screen.getByTestId(/horizontal-scroller/i));
    expect(getByTestId(/horizontal-scroller/i)).toBeInTheDocument();
  });

  it('still renders the scrollable div area and the + card if user has no documents', async () => {
    const { getByTestId } = renderComponent(passportType, undefined, []);
    await act(async () => {
      await waitFor(() => getByTestId(/plus-card/i));
    });
    expect(getByTestId(/horizontal-scroller/i)).toBeInTheDocument();
    expect(getByTestId(/plus-card/i)).toBeInTheDocument();
  });

  it('renders all documents from query', async () => {
    const { getByTestId } = renderComponent(passportType, undefined);
    const listLength = documentList.length;
    await act(async () => {
      await waitFor(() => getByTestId(`document-card-${listLength}`));
    });
    expect(getByTestId(`document-card-${listLength}`)).toBeInTheDocument();
  });

  it("does not render + card if we're at the limit", async () => {
    const { queryByTestId } = renderComponent(passportType, undefined);
    utils.isNotAtLimit(documentList, 2);
    await act(async () => {
      await waitFor(() => queryByTestId('plus-card'));
    });
    expect(queryByTestId('plus-card')).not.toBeInTheDocument();
  });
});
