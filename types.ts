import {
  OptionFromServer,
  SelectDropdownOption,
} from 'components/common/types';
import { CountryOption } from 'components/common/Countries';
import { DatePickerState } from 'components/eprofile/common/DatePicker/types';
import { CardObject } from 'components/travelBookings/common/CardDropdown';
/**
 * Form Prop Types
 */
export type GeneralFormProps = {
  readOnly?: boolean;
  confirmButton?: boolean;
  isCompanyAdmin?: boolean;
  readOnlyUserText?: string;
};

/**
 * State which encapsulates all the possible variable
 * types that can be passed in through the datepicker
 *  */
export type DatePickerValueState = string | null;

export type BusinessInfoFormProps = GeneralFormProps;
export type AssistantInfoFormProps = GeneralFormProps;
export type ContactInfoFormProps = GeneralFormProps;
export type CompanyAddressFormProps = GeneralFormProps;
export type EmergencyContactFormProps = GeneralFormProps;
export type VisaFormProps = GeneralFormProps;
export type CitizenshipCardFormProps = GeneralFormProps;
export type PassportInfoFormProps = GeneralFormProps;
export type LoyaltyProgramProps = GeneralFormProps;
export type PaymentCardFormProps = GeneralFormProps;

/**
 * Business Info Types
 */
export type BusinessInfoFormData = {
  company: {
    name: string;
    vat: string;
    businessNumber: string;
  };
  user: {
    id: string;
    firstName: string;
    jobRole: string;
    lastName: string;
    profile: {
      gender: OptionFromServer;
      dateOfBirth: string;
    };
    title: string;
  };
};

/**
 * Contact Info Types
 */
export type ContactInfoFormData = {
  user: {
    profile: {
      contactInformation: {
        address: CompanyAddress;
      };
    };
  };
  contactInformation: ContactNumbers;
};

export type ContactNumbers = {
  mobile: string;
  phone: string;
  fax?: string;
};

/** Data returned from the USER_CONTACT_INFO query */
export type ContactInfoQueryData = {
  username: string;
  profile: UserProfile;
};

/** Data returned from profile in USER_CONTACT_INFO query */
export type UserProfile = {
  contactInformation: {
    address: CompanyAddress;
    mobile: TelephoneNumber;
    phone: TelephoneNumber;
  };
};

/** Type for telephone number return from contact information */
export type TelephoneNumber = {
  e164: string;
  countryCode: number;
  national: string;
};

/** The shape of the data returned from the form */
export type EmergencyContactFormData = {
  user: {
    profile: {
      associates: {
        emergencyContact: {
          name: string;
          telephone: string;
        };
      };
    };
  };
};

/** Emergency contact info data returned from user -> profile on EMERGENCY_CONTACT_INFO query */
export type EmergencyContactQueryData = {
  associates: {
    emergencyContact: {
      name: string;
      telephone: TelephoneNumber;
    };
  };
};

/**
 * Passport Info Types
 */
export type PassportInfoFormData = {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profile: {
      dateOfBirth: string;
      gender: OptionFromServer;
      documentation: {
        id: string;
        country: OptionFromServer;
        expiry: DatePickerState;
        issueDate: DatePickerState;
        citizenship: OptionFromServer;
      };
    };
  };
};

/**
 * Company Address Types
 */
export type CompanyAddressFormData = {
  company: {
    address: CompanyAddress;
    contactInformation: ContactInformationFormState;
  };
};

/** Data returned from citizenship card form */
export type CitizenshipCardFormData = {
  user: {
    profile: {
      documentation: {
        id: string;
        country: CountryOption;
        expiry: DatePickerState;
        issueDate: DatePickerState;
      };
    };
  };
};

/** Data returned from payment card form */
export type PaymentCardFormData = {
  user: {
    cards: {
      cards: {
        card: {
          nameOnCard: string;
          type: Partial<SelectDropdownOption>;
        };
      };
    };
  };
};

/** Values returned from the form.
 * Note: this form data is sanitised before mutation
 */
type ContactInformationFormState = {
  countryCodeFax: object;
  countryCodeMobile: object;
  countryCodePhone: object;
  nationalNumberFax: string;
  nationalNumberMobile: string;
  nationalNumberPhone: string;
};

/** Form Address values for the Company Address Form */
type CompanyAddress = {
  firstLine: string;
  secondLine: string;
  city: string;
  county: string;
  country: string;
  postcode: string;
};

/** Type for the successMessage state */
export type SuccessMessageState = boolean;

/**
 * Assistant info form data
 */
export type AssistantInfoFormData = {
  user: {
    profile: {
      associates: {
        assistant: {
          name: string;
          email: string;
          telephone: {
            e164: string;
            national: string;
            countryCode: string;
          };
          mobile: {
            e164: string;
            national: string;
            countryCode: string;
          };
        };
      };
    };
  };
};

/** Visa information form data */
export type VisaFormData = {
  user: {
    profile: {
      visas: {
        id: string;
        expiry: string;
        country: OptionFromServer;
        type: OptionFromServer;
      };
    };
  };
};

/** Loyalty program form data */
export type LoyaltyProgramFormData = {
  user: {
    profile: {
      preferences: {
        loyaltyPrograms: {
          id: string;
          supplier: {
            value: {
              value: string;
            };
          };
        };
      };
    };
  };
};

/** Payment Cards Query Data */
export type PaymentCardsQueryData = {
  user: {
    cards: {
      cards: { card: CardObject }[];
    };
  };
};
