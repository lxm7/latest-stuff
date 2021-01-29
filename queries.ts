import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';

/** This fetches any data relating to visas or passports depending on
 * the type passed in of PASSPORT to CITIZENSHIP_CARD
 */
export const GET_USER_DOCUMENT: DocumentNode = gql`
  query getUserDocument($docType: DocumentationType) {
    user {
      id
      firstName
      lastName
      profile {
        dateOfBirth
        gender {
          value
          formatted
        }
        documentation(docType: $docType) {
          id
          expiry
          issueDate
          type
          citizenship {
            value
            formatted
          }
          country {
            formatted
            value
          }
        }
      }
    }
  }
`;

/** This updates any data relating to visas or passports.
 */
export const UPDATE_USER_DOCUMENT: DocumentNode = gql`
  mutation updateDocumentation($input: DocumentationInput!) {
    updateDocumentation(input: $input)
  }
`;

/** This mutation updates user details and returns the name and id to populate the cache */
export const UPDATE_USER_DETAILS: DocumentNode = gql`
  mutation updateUserDetails($id: ID!, $input: UpdateUserInput!) {
    updateUserDetails(id: $id, input: $input) {
      id
      jobRole
      firstName
      lastName
    }
  }
`;

/** Fetches data related to loyalty programs */
export const GET_LOYALTY_PROGRAMS: DocumentNode = gql`
  query getLoyaltyPrograms($type: LoyaltyType!) {
    user {
      profile {
        preferences {
          loyaltyPrograms(type: $type) {
            supplier {
              value
              formatted
            }
            id
            type
          }
        }
      }
    }
  }
`;

/** Mutation to update loyalty program details */
export const UPDATE_LOYALTY_PROGRAM: DocumentNode = gql`
  mutation updateLoyaltyProgram($input: LoyaltyProgramInput!) {
    updateLoyaltyProgram(input: $input)
  }
`;

/** Query to get list of payment cards */
export const GET_PAYMENT_CARDS: DocumentNode = gql`
  query {
    user {
      cards {
        cards {
          card {
            id
            expiry
            lastFour
            brand
            description
            type
          }
        }
      }
    }
  }
`;

/** This fetches any data about the user contact info */
export const USER_CONTACT_INFO: DocumentNode = gql`
  query {
    user {
      username
      profile {
        contactInformation {
          address {
            firstLine
            secondLine
            county
            country
            postcode
          }
          mobile {
            e164
            countryCode
            national
          }
          phone {
            e164
            countryCode
            national
          }
        }
      }
    }
  }
`;

/** This fetches any data about the emegency contact info */
export const EMERGENCY_CONTACT_INFO: DocumentNode = gql`
  query {
    user {
      profile {
        associates {
          emergencyContact {
            name
            telephone {
              countryCode
              e164
              national
            }
          }
        }
      }
    }
  }
`;

/** Mutation to return a setup intent when creating a new card.
 * Takes CardType and returns setup intent ID / client secret to use with Stripe.
 */
export const CREATE_PAYMENT_CARD: DocumentNode = gql`
  mutation createPaymentCard($type: CardType!) {
    createPaymentCard(type: $type)
  }
`;

/** Mutation to confirm the generation of a payment card.
 * Takes setup intent ID from stripe and returns the added card object
 */
export const CONFIRM_PAYMENT_CARD: DocumentNode = gql`
  mutation confirmPaymentCard($id: ID!) {
    confirmPaymentCard(id: $id) {
      id
      expiry
      lastFour
      brand
      description
      type
    }
  }
`;
