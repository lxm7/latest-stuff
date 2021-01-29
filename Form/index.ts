/**
  This allows us to dynamically render our modal forms just from supplying the
  const string name it uses as its lookup. We map them here to their correpsonding
  form components to render in the map further down
*/

import BusinessInfoForm from 'components/eprofile/Form/BusinessInfo';
import CompanyAddressForm from 'components/eprofile/Form/CompanyAddress';
import ContactInfoForm from 'components/eprofile/Form/ContactInfo';
import AssistantInfoForm from 'components/eprofile/Form/AssistantInfo';
import EmergencyContactForm from 'components/eprofile/Form/EmergencyContact';
import VisaForm from 'components/eprofile/Form/Visa';
import CitizenshipCardForm from 'components/eprofile/Form/CitizenshipCard';
import PassportInfoForm from 'components/eprofile/Form/PassportInfo';
import HotelForm from 'components/eprofile/Form/Hotel';
import FlightForm from 'components/eprofile/Form/Flight';
import PaymentCardForm from 'components/eprofile/Form/PaymentCard';

import { assets, config } from 'components/eprofile/consts';
import {
  businessInformation,
  companyAddress,
  contactInformation,
  emergencyContact,
  assistantInformation,
  visaDetails,
  citizenshipCard,
  passportDetails,
  general,
  flightLoyaltyDetails,
  hotelLoyaltyDetails,
  paymentCards,
} from 'components/eprofile/langEn';

const mappedFormComponents = {
  [`${businessInformation.title}`]: {
    icon: assets.businessInformation,
    FormName: BusinessInfoForm,
    saveSubText: false,
  },
  [`${companyAddress.title}`]: {
    icon: assets.companyAddress,
    FormName: CompanyAddressForm,
    saveSubText: false,
  },
  [`${contactInformation.title}`]: {
    icon: assets.contactInformation,
    FormName: ContactInfoForm,
    saveSubText: false,
  },
  [`${assistantInformation.title}`]: {
    icon: assets.assistantInformation,
    FormName: AssistantInfoForm,
    saveSubText: false,
  },
  [`${emergencyContact.title}`]: {
    icon: assets.emergencyContact,
    FormName: EmergencyContactForm,
    saveSubText: false,
  },
  [`${visaDetails.title}`]: {
    icon: config.visa.icon,
    FormName: VisaForm,
    saveSubText: general.saveText,
  },
  [`${citizenshipCard.title}`]: {
    icon: config.citizenCard.icon,
    FormName: CitizenshipCardForm,
    saveSubText: general.saveText,
  },
  [`${passportDetails.title}`]: {
    icon: config.passport.icon,
    FormName: PassportInfoForm,
    saveSubText: general.saveText,
  },
  [`${hotelLoyaltyDetails.title}`]: {
    icon: config.hotel.icon,
    FormName: HotelForm,
    saveSubText: general.loyaltyProgramSaveText,
  },
  [`${flightLoyaltyDetails.title}`]: {
    icon: config.flight.icon,
    FormName: FlightForm,
    saveSubText: general.loyaltyProgramSaveText,
  },
  [`${paymentCards.title}`]: {
    icon: config.payment.icon,
    FormName: PaymentCardForm,
    saveSubText: general.saveText,
  },
};

export default mappedFormComponents;
