import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';

/** This fetches any data relating to visas
 *  We need to change the default type of PASSPORT to CITIZENSHIP_CARD
 */
export const GET_VISA_DOCUMENT: DocumentNode = gql`
  query {
    user {
      profile {
        visas {
          id
          expiry
          type {
            formatted
            value
          }
          country {
            value
            formatted
          }
        }
      }
    }
  }
`;

export const GET_VISA_OPTIONS: DocumentNode = gql`
  query visaTypes {
    options {
      visaTypes {
        value
        formatted
      }
    }
  }
`;

/** This updates any data relating to visas.
 */
export const UPDATE_VISA_DOCUMENT: DocumentNode = gql`
  mutation updateVisa($input: VisaInput!) {
    updateVisa(input: $input)
  }
`;
