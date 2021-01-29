import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';

/** This fetches any data about the user ans the company name for the business info form */
export const BUSINESS_INFO: DocumentNode = gql`
  query {
    company {
      name
      id
      businessNumber
      vat
    }
    user {
      id
      firstName
      lastName
      title {
        value
        formatted
      }
      jobRole
      profile {
        gender {
          value
          formatted
        }
        dateOfBirth
      }
    }
  }
`;

/** This mutation updates the company name and returns the name to populate the cache
 * (as we dont have an id to let Apollo do this automatically for us here) */
export const UPDATE_COMPANY_DETAILS: DocumentNode = gql`
  mutation updateCompanyDetails($input: CompanyInput!) {
    updateCompanyDetails(input: $input) {
      id
      name
      vat
      businessNumber
    }
  }
`;
