import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';

/** Fetches hotel suppliers for loyalty program dropdown */
export const GET_AIRLINE_OPTIONS: DocumentNode = gql`
  query airlines {
    options {
      membershipSuppliers {
        flight {
          value
          formatted
        }
      }
    }
  }
`;
