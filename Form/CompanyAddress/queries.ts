import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';

/** query to get company address information for pre-populating form */
export const COMPANY_ADDRESS: DocumentNode = gql`
  query {
    company {
      id
      address {
        firstLine
        secondLine
        county
        country
        postcode
      }
      contactInformation {
        mobile {
          countryCode
          e164
          national
        }
        phone {
          countryCode
          e164
          national
        }
      }
    }
  }
`;

/** mutation to update the company address */
export const UPDATE_COMPANY_ADDRESS: DocumentNode = gql`
  mutation updateCompanyAddress($input: CompanyInput!) {
    updateCompanyDetails(input: $input) {
      id
      address {
        firstLine
        secondLine
        county
        country
        postcode
      }
      contactInformation {
        mobile {
          countryCode
          e164
          national
        }
        phone {
          countryCode
          e164
          national
        }
      }
    }
  }
`;
