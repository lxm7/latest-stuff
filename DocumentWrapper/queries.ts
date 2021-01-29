import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';

/** Mutation to delete visa card from the list.
 * Takes an ID which is the visa number.
 */
export const DELETE_VISA_CARD: DocumentNode = gql`
  mutation deleteVisa($id: ID!) {
    deleteVisa(id: $id)
  }
`;

/** Mutation to  delete passport or citizenship card.
 * Takes an ID and DocType. ID is passport or citizenship card number.
 * DocType is either PASSPORT or CITIZENSHIP_CARD.
 */
export const DELETE_PASSPORT_CITIZENSHIP_CARD: DocumentNode = gql`
  mutation deleteDocumentation($id: ID!, $docType: DocumentationType!) {
    deleteDocumentation(id: $id, docType: $docType)
  }
`;

/** Mutation to delete loyalty program card.
 * Takes LoyaltyProgramInput which consists of ID which is the membership number,
 * supplier which is the airline/hotel code and type which is AIR, HOTEL or CAR.
 */
export const DELETE_LOYALTY_CARD: DocumentNode = gql`
  mutation deleteLoyaltyProgram($input: LoyaltyProgramInput!) {
    deleteLoyaltyProgram(input: $input)
  }
`;

/** Mutation to delete payment card
 * Takes the ID of the payment card to delete
 */
export const DELETE_PAYMENT_CARD: DocumentNode = gql`
  mutation deletePaymentCard($id: ID!) {
    deletePaymentCard(id: $id)
  }
`;
