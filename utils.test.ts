import { Countries } from 'components/common/Countries';
import { loadCountryOptions } from 'components/common/SelectDropdown/utils';
import {
  concatString,
  splitCamelCase,
  loadTitleOptions,
  loadGenderOptions,
  loadTravellerTypeOptions,
  stripTypeNameFromObjectRoot,
  sanitiseDropdownsInForm,
  isDisabled,
  capitalise,
  addLabelToDropdownOptions,
  checkContactFormCompleted,
} from './utils';
import { titles, gender, travellerType } from './consts';

const input1Level = {
  firstName: 'Tom',
  lastName: 'Young',
  title: 'MR',
  __typename: 'User',
};

const input1LevelWithoutTypeName = {
  firstName: 'Tom',
  lastName: 'Young',
  title: 'MR',
};

const inputArg = {
  __typename: 'User',
  id: 'c1c573a1-2979-4e67-99e5-a7aeceb8efc4',
  firstName: 'Tom',
  lastName: 'Young',
  title: {
    __typename: 'Honorific',
    value: 'MR',
    formatted: 'Mr',
  },
  jobRole: 'Engineer',
  profile: {
    __typename: 'UserProfile',
    gender: {
      __typename: 'Gender',
      value: 'M',
      formatted: 'Male',
    },
    dateOfBirth: null,
  },
};

const sanitisedInputArg = {
  id: 'c1c573a1-2979-4e67-99e5-a7aeceb8efc4',
  firstName: 'Tom',
  lastName: 'Young',
  title: 'MR',
  jobRole: 'Engineer',
  profile: {
    gender: 'M',
    dateOfBirth: null,
  },
};

const contactInfoInput = {
  username: 'user',
  profile: {
    contactInformation: {
      address: {
        firstLine: '123',
        secondLine: 'Street Road',
        city: 'Manchester',
        county: 'Greater Manchester',
        country: 'GB',
        postcode: 'M1 234',
      },
      mobile: {
        e164: '00441234234',
        countryCode: 44,
        national: '1234567',
      },
      phone: {
        e164: '00441234234',
        countryCode: 44,
        national: '1234567',
      },
    },
  },
};

const contactInfoInputIncomplete = {
  username: 'user',
  profile: {
    contactInformation: {
      address: {
        firstLine: '',
        secondLine: 'Street Road',
        city: 'Manchester',
        county: 'Greater Manchester',
        country: 'GB',
        postcode: 'M1 234',
      },
      mobile: {
        e164: '',
        countryCode: 44,
        national: '1234567',
      },
      phone: {
        e164: '00441234234',
        countryCode: 44,
        national: '1234567',
      },
    },
  },
};

describe('eprofile utils', () => {
  describe('concatString', () => {
    it('returns expected value', () => {
      const result = concatString('String with spaces');
      expect(result).toBe('Stringwithspaces');
    });
  });

  describe('splitCamelCase', () => {
    it('returns expected value', () => {
      const result = splitCamelCase('StringCamelCase');
      expect(result).toBe('String Camel Case');
    });
  });

  describe('loadTitleOptions', () => {
    it('returns expected value', () => {
      const result = loadTitleOptions();
      return expect(result).resolves.toEqual({
        options: titles,
        hasMore: false,
      });
    });
  });

  describe('loadGenderOptions', () => {
    it('returns expected value', () => {
      const result = loadGenderOptions();
      return expect(result).resolves.toEqual({
        options: gender,
        hasMore: false,
      });
    });
  });

  describe('loadTravellerTypeOptions', () => {
    it('returns expected value', () => {
      const result = loadTravellerTypeOptions();
      return expect(result).resolves.toEqual({
        options: travellerType,
        hasMore: false,
      });
    });
  });

  describe('loadCountryOptions', () => {
    it('returns expected value', () => {
      const result = loadCountryOptions('');
      return expect(result).resolves.toEqual({
        options: Countries,
        loadMore: false,
      });
    });

    it('returns expected value when search value entered', () => {
      const result = loadCountryOptions('united kingdom');
      return expect(result).resolves.toStrictEqual({
        options: [
          {
            flag: 'gb',
            key: 'GB',
            text: 'United Kingdom',
            value: 'GB',
          },
        ],
        loadMore: false,
      });
    });
  });

  describe('stripTypeNameFromObjectRoot', () => {
    it('returns expected value', () => {
      const result = stripTypeNameFromObjectRoot(input1Level);
      expect(result).toStrictEqual(input1LevelWithoutTypeName);
    });
  });

  describe('sanitiseDropdownsInForm', () => {
    it('returns expected value', () => {
      const result = sanitiseDropdownsInForm(inputArg);
      expect(result).toStrictEqual(sanitisedInputArg);
    });
  });

  describe('isDisabled', () => {
    it('returns false if only all 3 params are false', () => {
      const isNotCompanyAdmin = isDisabled(false, false, false);
      const isNotCompanyAdminAndIsLoading = isDisabled(false, false, true);
      const isCompanyAdmin = isDisabled(true, false, false);
      const isCompanyAdminAndLoading = isDisabled(true, false, true);
      const isCompanyAdminAndIsLoading = isDisabled(true, false, true);
      const isCompanyAdminAndIsSaving = isDisabled(true, true, false);

      expect(isNotCompanyAdmin).toBe(false);
      expect(isNotCompanyAdminAndIsLoading).toBe(true);
      expect(isCompanyAdmin).toBe(true);
      expect(isCompanyAdminAndLoading).toBe(true);
      expect(isCompanyAdminAndIsLoading).toBe(true);
      expect(isCompanyAdminAndIsSaving).toBe(true);
    });
  });
});

describe('capitalise', () => {
  it('should capitalise the first letter of a string', () => {
    expect(capitalise('hello')).toBe('Hello');
    expect(capitalise('hello world')).toBe('Hello world');
  });
});

describe('addLabelToDropdownOptions', () => {
  it('should add a label key to each element of an array of options from server', () => {
    const optionsFromServer = [
      { value: 'HA', formatted: 'Hotel America' },
      { value: 'HI', formatted: 'Hilton' },
    ];
    const output = [
      { value: 'HA', formatted: 'Hotel America', label: 'Hotel America' },
      { value: 'HI', formatted: 'Hilton', label: 'Hilton' },
    ];
    expect(addLabelToDropdownOptions(optionsFromServer)).toStrictEqual(output);
  });
});

describe('checkContactFormCompleted', () => {
  it('should return true if all required address fields are filled', () => {
    expect(checkContactFormCompleted(contactInfoInput)).toBe(true);
  });
  it('should return false when all fields are not completed', () => {
    expect(checkContactFormCompleted(contactInfoInputIncomplete)).toBe(false);
  });
});
