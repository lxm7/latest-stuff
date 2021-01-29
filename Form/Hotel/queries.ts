import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';

/** Fetches hotel suppliers for loyalty program dropdown */
export const GET_HOTEL_OPTIONS: DocumentNode = gql`
  query hotelCodes {
    options {
      membershipSuppliers {
        hotel {
          value
          formatted
        }
      }
    }
  }
`;
