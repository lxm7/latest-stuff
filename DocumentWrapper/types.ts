import { ApolloError } from '@apollo/client';
import { CardObject } from 'components/travelBookings/common/CardDropdown';
import { FlagNameValues } from 'semantic-ui-react';
import { OptionFromServer } from '../../common/types/SelectOption';

/**
 * Document Copy, 1 per Document wrapper
 */
export type DocumentConfig = {
  icon: string;
  addIcon: string;
  documentName: DocumentName;
  limit: string;
  colorScheme: string;
  type?: DocumentType;
};

export type DocumentProperties = {
  altText: string;
  wrapperTitle: string;
};

/** String options for the documentName */
export type DocumentName =
  | 'passport'
  | 'visa'
  | 'citizenship card'
  | 'flight program'
  | 'hotel'
  | 'car rental program'
  | 'payment card';

/** Enum for type of document used in mutations */
export enum DocumentType {
  PASSPORT = 'PASSPORT',
  CITIZENSHIP_CARD = 'CITIZENSHIP_CARD',
  CAR = 'CAR',
  HOTEL = 'HOTEL',
  AIR = 'AIR',
}

/**
 * Document details (passport, citizenship)
 */
export type Document = {
  /** Document number i.e. passport number, visa number or citizenship card number */
  id: string;
  /** Date of expiry of the document or program */
  expiry?: string;
  /** Type of visa i.e. B1, with value + formatted */
  type?: OptionFromServer;
  /** Country of issue of the documentation - for passports */
  country?: Country;
  /** The document's citizenship */
  citizenship?: Country;
  /** Date of issue of the document or program */
  issueDate?: string;
  /** Name of the loyalty program provider */
  supplier?: OptionFromServer;
  /** Payment card details returned from query */
  card?: CardObject;
};

/**
 * DocumentWrapperProps
 */
export type DocumentWrapperProps = {
  copy: DocumentConfig & DocumentProperties;
  documents: Document[];
  loading: boolean;
  error: ApolloError | string | undefined;
  openModal: () => void | undefined;
};

/**
 * Document Wrapper draggable state
 */
export type State = {
  isDown: boolean;
  startX: number;
  scrollLeft: number;
};

/** Country details received from server + associated flag type */
export type Country = {
  value: string | FlagNameValues;
  formatted: string;
};
