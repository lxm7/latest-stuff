import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';

/** This fetches any data about the user assistant info */
export const USER_ASSISTANT_INFO: DocumentNode = gql`
  query {
    user {
      profile {
        associates {
          assistant {
            name
            email
            telephone {
              e164
              national
              countryCode
            }
            mobile {
              e164
              national
              countryCode
            }
          }
        }
      }
    }
  }
`;

/** This is the mutation to update assistant info */
export const UPDATE_ASSISTANT_INFO: DocumentNode = gql`
  mutation setAssociates($input: AssociatesInput!) {
    setAssociates(input: $input)
  }
`;
