import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';

/** Mutation to update contact information for a user */
export const UPDATE_CONTACT_INFO: DocumentNode = gql`
  mutation setUserContactInfo($input: ContactInformationInput!) {
    setUserContactInfo(input: $input)
  }
`;
