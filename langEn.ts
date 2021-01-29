/** This can be in prep for when we eventually introduce react-intl */

// General
export const general = {
  loyaltyProgramSaveText:
    '*By saving this document I confirm that all details are exactly at they appear on the membership document.*',
  saveText:
    '*By saving this document I confirm that all details are exactly at they appear on my document(s).*',
  noEditingRightsText: `You do not have the necessary permissions to edit this form. 
    Please contact your Company Admin.`,
  errorMessage: 'We found some issues with the form submission:',
  successMessage: 'Your changes have been saved!',
  inputGenericPlaceholder: 'Type here...',
  selectGenericPlaceholder: 'Select...',
  taptripLogoAlt: 'TapTrip Main White Logo',
  progressIconAlt: 'Friendly Purple Robot Icon',
  profilePicAlt: 'Person Profile Picture',
  setup: 'Set up profile',
};

// Business Information Form Fields
export const businessInformation = {
  title: 'Personal information',
  companyName: 'Company name',
  userTitle: 'Title',
  gender: 'Gender',
  firstName: 'First name',
  lastName: 'Last name',
  dateOfBirth: 'Date of birth',
  jobPosition: 'Job title',
  travellerType: 'Traveller type',
  vat: 'VAT number or Tax code',
  businessNumber: 'Company number',
  notice: `*Please ensure your name is entered as it appears on your passport,
  including any middle names. This is a requirement for airline tickets,
  your profile name must match your passport.*`,
  hint: {
    companyName: 'Please enter a company name.',
    jobTitle: 'Please enter a job title.',
  },
};

// Company Address Form Fields
export const companyAddress = {
  title: 'Company address',
  addressLine1: 'Address line 1',
  addressLine2: 'Address line 2',
  city: 'City',
  county: 'County',
  country: 'Country',
  telephone: 'Telephone',
  mobile: 'Mobile',
  postcode: 'Postal / Zip code',
  notice: `*Please ensure your name is entered as it appears on your passport,
  including any middle names. This is a requirement for airline tickets,
  your profile name must match your passport.*`,
  hint: {
    addressLine1: 'Please enter first line of address.',
    county: 'Please enter a county.',
    postcode: 'Please enter a postcode.',
    country: 'Please enter a country.',
    number: ' Please enter a mobile number.',
    dialcode: 'Please select a dialling code.',
  },
};

// Contact Information Form Fields
export const contactInformation = {
  title: 'Contact information',
  addressLine1: 'Address line 1',
  addressLine2: 'Address line 2',
  city: 'City',
  county: 'County',
  country: 'Country',
  telephone: 'Telephone',
  mobile: 'Mobile',
  emailAddress: 'Email address',
  postcode: 'Postal / Zip code',
  hint: {
    addressLine1: 'Please enter first line of address.',
    county: 'Please enter a county.',
    postcode: 'Please enter a postcode.',
    country: 'Please enter a country.',
    number: ' Please enter a mobile number.',
    dialcode: 'Please select a dialling code.',
    email: 'Please enter an email address.',
  },
};

// Assistant Info
export const assistantInformation = {
  title: 'Assistant information',
  name: 'Assistant name',
  telephone: 'Assistant telephone',
  mobile: 'Assistant mobile',
  email: 'Assistant email',
  hint: {
    name: 'Please enter assistant name.',
  },
};

// Emnergency Form
export const emergencyContact = {
  title: 'Emergency contact',
  emailAddress: 'Email address',
  telephone: 'Telephone',
  name: 'Emergency contact name',
  hint: {
    name: 'Please enter emergency contact full name.',
  },
};

// Passport Info
export const passportDetails = {
  title: 'Add your passport',
  number: 'Passport number',
  countryIssued: 'Country of issue',
  issue: 'Date of issue',
  expiry: 'Date of expiry',
  dateOfBirth: 'Date of birth',
  gender: 'Gender',
  firstName: 'First name',
  lastName: 'Last name',
  nationality: 'Nationality',
  altText: 'passport icon',
  wrapperTitle: 'Passport(s)',
  documentName: 'passport',
  hint: {
    number: 'Please enter passport number.',
    country: 'Please select a country.',
    nationality: 'Please select your nationality.',
    gender: 'Please select a gender.',
    firstName: 'Please enter your first name.',
    lastName: 'Please enter your last name.',
  },
};

// Visa form
export const visaDetails = {
  title: 'Add your visa',
  number: 'Visa number',
  expiry: 'Visa date of expiry',
  type: 'Visa type',
  country: 'Country',
  altText: 'visa icon',
  wrapperTitle: 'Visa(s)',
  documentName: 'visa',
  hint: {
    number: 'Please enter visa number.',
    country: 'Please enter a country.',
    type: 'Please enter a visa type.',
  },
};

// Citizenship card
export const citizenshipCard = {
  title: 'Add your citizenship',
  number: 'Citizenship card number',
  country: 'Country',
  issue: 'Citizenship date of issue',
  expiry: 'Citizenship date of expiry',
  altText: 'Citizen card icon',
  wrapperTitle: 'Citizenship card',
  documentName: 'citizenship card',
  hint: {
    country: 'Please enter a country.',
    number: 'Please enter your citizenship card number.',
  },
};

// flight loyalty details
export const flightLoyaltyDetails = {
  title: 'Add a flight loyalty program',
  number: 'Membership number',
  supplier: 'Airline',
  altText: 'flight icon',
  wrapperTitle: 'Flight program(s)',
  documentName: 'flight program',
  hint: {
    number: 'Please enter membership number.',
    supplier: 'Please select an airline.',
  },
};

// Hotel Loyalty Details
export const hotelLoyaltyDetails = {
  title: 'Add your hotel loyalty program',
  number: 'Membership number',
  supplier: 'Hotel',
  altText: 'hotel icon',
  wrapperTitle: 'Hotel(s)',
  documentName: 'hotel',
  hint: {
    number: 'Enter membership number.',
    supplier: 'Please select a hotel.',
  },
};

// Car rental details
export const carRentals = {
  altText: 'car icon',
  wrapperTitle: 'Car rental program(s)',
  documentName: 'car rental program',
};

// Payment card details
export const paymentCards = {
  title: 'Add your payment card',
  altText: 'paymentCards icon',
  wrapperTitle: 'Payment card(s)',
  documentName: 'payment card',
  type: 'Type of payment',
  nameOnCard: 'Name on card',
  hint: {
    type: 'Please select the type of payment card.',
    nameOnCard: 'Please enter name as displayed on card.',
    cardnumber: 'Please enter your card number.',
    expiry: 'Please enter your card expiry date.',
  },
  cardNumber: 'Card number',
  expiry: 'Date of expiry',
};
