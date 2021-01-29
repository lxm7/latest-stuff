/** This file are string values that wont need to be translated / used
 * as part of the software / asssets, etc
 */
import {
  DocumentType,
  DocumentConfig,
} from 'components/eprofile/DocumentWrapper/types';
import { PaymentCardType } from 'components/travelBookings/common/CardDropdown';

export const defaultProfilePic =
  'https://s3-eu-west-1.amazonaws.com/taptrip-www/assets/profile-placeholder.jpg';
const rightArrowIconSrc = '/images/arrowRight.svg';

export const companyAdminRole = 'COMPANY_ADMIN';

export const config: { [key: string]: DocumentConfig } = {
  passport: {
    documentName: 'passport',
    icon: '/images/passport_eprofile.svg',
    addIcon: rightArrowIconSrc,
    limit: '2',
    colorScheme: 'linear-gradient(117deg, #5b59e1 -20%, #f4376d 207%)',
    type: DocumentType.PASSPORT,
  },
  visa: {
    documentName: 'visa',
    icon: '/images/visa_eprofile.svg',
    addIcon: rightArrowIconSrc,
    limit: '3',
    colorScheme: 'linear-gradient(117deg, #e1b459 -20%, #f4376d 207%)',
  },
  citizenCard: {
    documentName: 'citizenship card',
    icon: '/images/citizenship_eprofile.svg',
    addIcon: rightArrowIconSrc,
    limit: '1',
    colorScheme: 'linear-gradient(117deg, #318dea -20%, #3ce680 207%)',
    type: DocumentType.CITIZENSHIP_CARD,
  },
  flight: {
    documentName: 'flight program',
    icon: '/images/flight_eprofile.svg',
    addIcon: rightArrowIconSrc,
    limit: '10',
    colorScheme: 'linear-gradient(117deg, #57ca85 -20%, #194f68 207%)',
    type: DocumentType.AIR,
  },
  hotel: {
    documentName: 'hotel',
    icon: '/images/hotel_eprofile.svg',
    addIcon: rightArrowIconSrc,
    limit: '10',
    colorScheme: 'linear-gradient(117deg, #1bcedf -20%, #5b247a 207%)',
    type: DocumentType.HOTEL,
  },
  car: {
    documentName: 'car rental program',
    icon: '/images/carRental_eprofile.svg',
    addIcon: rightArrowIconSrc,
    limit: '10',
    colorScheme: 'linear-gradient(117deg, #7117ea -20%, #ea6060 207%)',
    type: DocumentType.CAR,
  },
  payment: {
    documentName: 'payment card',
    icon: '/images/paymentCard_eprofile.svg',
    addIcon: rightArrowIconSrc,
    limit: '3',
    colorScheme: 'linear-gradient(117deg, #ff7676 -20%, #f54ea2 207%)',
  },
};

export const assets = {
  businessInformation: '/images/businessInformation_eProfilePage.svg',
  companyAddress: '/images/companyAddress_eProfilePage.svg',
  contactInformation: '/images/contactInformation_eProfilePage.svg',
  assistantInformation: '/images/assistantInformation_eProfilePage.svg',
  emergencyContact: '/images/emergencyContact_eProfilePage.svg',
  taptripLogo: '/images/taptrip-logo-banner.svg',
  progressIcon: '/images/robot.png',
  profilePic: '/images/smilingMan.png',
  deleteIcon: '/images/deleteCard.svg',
  editIcon: '/images/editCard.svg',
};

export const inputPath = {
  company: 'company',
  businessInformation: 'user',
  companyAddress: 'company.address',
  userProfile: 'user.profile',
  emergencyContact: 'user.profile.associates.emergencyContact',
  contactInformation: 'user.profile.contactInformation',
  assistantInformation: 'user.profile.associates.assistant',
  visa: 'user.profile.visas',
  documentation: 'user.profile.documentation',
  loyaltyPrograms: 'user.profile.preferences.loyaltyPrograms',
  paymentCard: 'user.cards.cards.card',
};

// Options
export const titles = [
  {
    value: 'MR',
    label: 'Mr',
  },
  {
    value: 'MRS',
    label: 'Mrs',
  },
  {
    value: 'MISS',
    label: 'Miss',
  },
  {
    value: 'DR',
    label: 'Dr',
  },
  {
    value: 'MISS',
    label: 'Miss',
  },
];

/**  Options for gender */
export const gender = [
  {
    value: 'MALE',
    label: 'Male',
  },
  {
    value: 'FEMALE',
    label: 'Female',
  },
  {
    value: 'OTHER',
    label: 'Other',
  },
];

/**  Options for travellerType */
export const travellerType = [
  {
    value: 'business',
    label: 'business',
  },
  {
    value: 'leisure',
    label: 'leisure',
  },
  {
    value: 'pleasure',
    label: 'pleasure',
  },
];

/**  Options for paymentTypes (HOTEL, COMPANY, etc) */
export const paymentType = [
  {
    value: PaymentCardType.HOTEL,
    label: 'Hotel',
  },
  {
    value: PaymentCardType.COMPANY,
    label: 'Company',
  },
  {
    value: PaymentCardType.USER,
    label: 'User',
  },
];

/** Const to dictate the format of the issue/expiry dates on cards */
export const DATE_TIME_FORMAT = 'MMM d, yyyy';
