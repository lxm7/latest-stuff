import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';

export const UPDATE_EMERGENCY_CONTACT_INFO: DocumentNode = gql`
  mutation setAssociates($input: AssociatesInput!) {
    setAssociates(input: $input)
  }
`;
