import _ from 'lodash';
import {
  ContactInfoQueryData,
  EmergencyContactQueryData,
} from 'components/eprofile/types';
import { titles, gender, travellerType, paymentType } from './consts';
import {
  Option,
  SelectDropdownOption,
  OptionFromServer,
} from '../common/types';

/**
 * Joins together any string with spaces
 * @param {String} str
 * @returns {String}
 */
export const concatString = (str: string) => str.replace(/\s/g, '');

/**
 * Splits a camelCase or PascalCase word into individual words separated by spaces.
 * @param {Object} word
 * @returns {String}
 */
export const splitCamelCase = (word: string) => {
  const output = [];
  let i;
  let l;
  const capRe = /[A-Z]/;
  if (typeof word !== 'string') {
    throw new Error('The "word" parameter must be a string.');
  }
  for (i = 0, l = word.length; i < l; i += 1) {
    if (i === 0) {
      output.push(word[i].toUpperCase());
    } else {
      if (i > 0 && capRe.test(word[i])) {
        output.push(' ');
      }
      output.push(word[i]);
    }
  }
  return output.join('');
};

/** Adds a label key to each element of an array of options from server. */
export const addLabelToDropdownOptions = (
  options: OptionFromServer[]
): SelectDropdownOption[] => {
  return options.map((dropdownOption) => {
    return { ...dropdownOption, label: dropdownOption.formatted };
  });
};

/** Below are load options for the select dropdown titles */
export const loadTitleOptions = async () => {
  return {
    options: titles,
    hasMore: false,
  };
};

/** Below are load options for the select dropdown gender */
export const loadGenderOptions = async () => {
  return {
    options: gender,
    hasMore: false,
  };
};

/** Below are load options for the select dropdown travellerType */
export const loadTravellerTypeOptions = async () => {
  return {
    options: travellerType,
    hasMore: false,
  };
};

/** Below are load options for the select dropdown payment type */
export const loadPaymentType = async () => {
  return {
    options: paymentType,
    loadMore: false,
  };
};

/**
 * This strips out the __typename property at the root level of a given object
 * @param {Object} objectLevel
 * @returns {Object}
 */
export const stripTypeNameFromObjectRoot = (objectLevel: object) =>
  _.omit(objectLevel, ['__typename']);

/**
 * In preparation for sending to server, this recursively looks down the
 * object tree and sets the values from dropdowns to a string. text input values
 * are already strings so we return these as they are at the end
 *
 * @param {Option} objectLevel
 * @returns {Object}
 */
// eslint-disable-next-line
export const sanitiseDropdownsInForm = (objectLevel: object): any => {
  return Object.entries(stripTypeNameFromObjectRoot(objectLevel)).reduce(
    (acc, curr) => {
      const key = curr[0];
      const value = curr[1] as Option;
      if (_.isObject(value)) {
        if (value.value) {
          return { ...acc, ...{ [key]: value.value } };
        }
        return { ...acc, ...{ [key]: sanitiseDropdownsInForm(value) } };
      }

      return { ...acc, ...{ [key]: value } };
    },
    {}
  );
};

/**
 * Checks all scenerios in  a form as to whether an element should be disabled.
 *
 * @param {Boolean} isCompanyAdmin
 * @param {Boolean} isSaving
 * @param {Boolean} loading
 * @returns {Boolean}
 */
export const isDisabled = (
  isCompanyAdmin: boolean,
  isSaving: boolean,
  loading: boolean
) => isCompanyAdmin || isSaving || loading;

/** Capitalises the first letter of a string */
export const capitalise = (word: string) => {
  const split = word.split('');
  split[0] = split[0].toUpperCase();
  return split.join('');
};

/** extracts title and altText from language block for our DocumentWrapper */
// eslint-disable-next-line
export const getCopyFromLang = (object: any) =>
  (({ wrapperTitle, altText }) => ({ wrapperTitle, altText }))(object);

/** Checks if required fields on contact info form have been completed,
 * returns a boolean
 */
export const checkContactFormCompleted = (
  data: ContactInfoQueryData
): boolean => {
  if (!data?.profile?.contactInformation) return false;
  const { address, mobile } = data?.profile?.contactInformation;
  return !!(
    address.firstLine &&
    address.county &&
    address.country &&
    address.postcode &&
    mobile.e164
  );
};

/** Checks if required fields on emergency contact info form have been completed.
 * Returns a boolean
 */
export const checkEmergencyContactFormCompleted = (
  data: EmergencyContactQueryData
): boolean => {
  if (!data) return false;
  const { name, telephone } = data?.associates?.emergencyContact;
  return !!(name && telephone.e164);
};
