import {
  DocumentProperties,
  DocumentConfig,
  Document,
} from 'components/eprofile/DocumentWrapper/types';

export type AddDocumentItemProps = {
  rowDetails: DocumentProperties & DocumentConfig;
  openModal: () => void | undefined;
};

/** Details for type of document row i.e. color scheme, title and icon */
export type DocumentItemProps = {
  rowDetails: DocumentProperties & DocumentConfig;
  documentDetails: Document;
  cardNumber: number;
  removeDeletedDocument: (id: string, isPaymentCard?: boolean) => void;
};
