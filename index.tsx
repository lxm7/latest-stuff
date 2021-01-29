import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Grid } from 'semantic-ui-react';

// components
import DetailsButton from 'components/eprofile/common/DetailsButton';
import EProfileModal from 'components/eprofile/common/Modal';
import DocumentWrapper from 'components/eprofile/DocumentWrapper';
import { USER } from 'components/common/Queries';
import { DocumentType } from 'components/eprofile/DocumentWrapper/types';
import ProgressBar from 'components/eprofile/common/ProgressBar';

import {
  companyAdminRole,
  assets,
  config,
  defaultProfilePic,
} from 'components/eprofile/consts';
import mappedFormComponents from 'components/eprofile/Form';
import {
  StyledBanner,
  StyledLogo,
  StyledProfilePic,
  StyledButton,
  StyledGridWrapper,
  StyledNameInfo,
  StyledTitle,
  StyledSubTitle,
  StyledSmallGrey,
  StackedButtons,
  FlexInlineSection,
  StyledProgressSection,
  StyledRobot,
  StyledDivider,
  GreyWrapper,
  ButtonsContainer,
} from './styles';

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
} from './langEn';

import { GET_VISA_DOCUMENT } from './Form/Visa/queries';
import {
  GET_USER_DOCUMENT,
  GET_LOYALTY_PROGRAMS,
  GET_PAYMENT_CARDS,
  USER_CONTACT_INFO,
  EMERGENCY_CONTACT_INFO,
} from './queries';
import {
  getCopyFromLang,
  checkContactFormCompleted,
  checkEmergencyContactFormCompleted,
} from './utils';

/**
 * The parent component for the e-profile page
 */
export const EProfile = (): JSX.Element => {
  const [open, setOpen] = useState(false);

  /** reassign the name for the data retuned
   * in the user query otherwise it will overwrite
   * the first query above
   */
  const { data: userData } = useQuery(USER);
  const { data: userContactInfoData } = useQuery(USER_CONTACT_INFO);
  const { data: emergencyContactInfoData } = useQuery(EMERGENCY_CONTACT_INFO);
  const {
    data: passportList,
    error: passportError,
    loading: passportLoading,
  } = useQuery(GET_USER_DOCUMENT, {
    variables: { docType: DocumentType.PASSPORT },
  });
  const {
    data: citizenCardList,
    error: citizenCardError,
    loading: citizenCardLoading,
  } = useQuery(GET_USER_DOCUMENT, {
    variables: { docType: DocumentType.CITIZENSHIP_CARD },
  });
  const { data: visaList, error: visaError, loading: visaLoading } = useQuery(
    GET_VISA_DOCUMENT
  );
  const {
    data: hotelList,
    error: hotelError,
    loading: hotelLoading,
  } = useQuery(GET_LOYALTY_PROGRAMS, {
    variables: { type: DocumentType.HOTEL },
  });
  const {
    data: flightList,
    error: flightError,
    loading: flightLoading,
  } = useQuery(GET_LOYALTY_PROGRAMS, { variables: { type: DocumentType.AIR } });
  const {
    data: paymentCardList,
    error: paymentCardError,
    loading: paymentCardLoading,
  } = useQuery(GET_PAYMENT_CARDS);

  const isCompanyAdmin = userData?.user?.role?.value === companyAdminRole;

  const [modalType, setModalType] = useState('');

  const onClickToOpen = (type: string) => {
    setOpen(true);
    setModalType(type);
  };

  const onClickToClose = () => setOpen(false);

  const { passport, visa, citizenCard, flight, hotel, payment } = config;

  return (
    <>
      <StyledBanner>
        <StyledLogo
          centered
          src={assets.taptripLogo}
          alt={general.taptripLogoAlt}
        />
      </StyledBanner>
      <FlexInlineSection>
        <StyledNameInfo>
          <StyledProfilePic
            src={assets.profilePic}
            alt={general.profilePicAlt}
            circular
          />
          <StyledTitle as="h2">
            {userData?.user?.firstName} {userData?.user?.lastName}
          </StyledTitle>
          <StyledSubTitle>{userData?.user?.jobRole}</StyledSubTitle>
          <StyledSmallGrey>
            {userData?.user?.profile?.contactInformation?.address.country}
          </StyledSmallGrey>
        </StyledNameInfo>
        <ButtonsContainer>
          <StyledButton basic color="violet">
            {general.setup}
          </StyledButton>
          <StyledGridWrapper>
            <Grid columns={4} stackable>
              <Grid.Column>
                <DetailsButton
                  label={companyAddress.title}
                  icon={assets.companyAddress}
                  onClick={() => onClickToOpen(companyAddress.title)}
                />
              </Grid.Column>
              <Grid.Column>
                <DetailsButton
                  label={businessInformation.title}
                  icon={assets.businessInformation}
                  onClick={() => onClickToOpen(businessInformation.title)}
                />
              </Grid.Column>
              <Grid.Column>
                <DetailsButton
                  label={contactInformation.title}
                  icon={assets.contactInformation}
                  onClick={() => onClickToOpen(contactInformation.title)}
                />
              </Grid.Column>
              <Grid.Column>
                <StackedButtons>
                  <DetailsButton
                    label={assistantInformation.title}
                    onClick={() => onClickToOpen(assistantInformation.title)}
                  />
                  <DetailsButton
                    label={emergencyContact.title}
                    onClick={() => onClickToOpen(emergencyContact.title)}
                  />
                </StackedButtons>
              </Grid.Column>
            </Grid>
          </StyledGridWrapper>
        </ButtonsContainer>
      </FlexInlineSection>

      <GreyWrapper>
        <StyledProgressSection>
          <ProgressBar
            profilePic={userData?.user?.avatar !== defaultProfilePic}
            passport={passportList?.user?.profile?.documentation?.length > 0}
            paymentCard={paymentCardList?.user?.cards?.cards?.length > 0}
            contactInfo={checkContactFormCompleted(userContactInfoData?.user)}
            emergencyContactInfo={checkEmergencyContactFormCompleted(
              emergencyContactInfoData?.user?.profile
            )}
          />
          <StyledRobot
            src={assets.progressIcon}
            alt={general.progressIconAlt}
          />
        </StyledProgressSection>
        <StyledDivider />

        <DocumentWrapper
          copy={{ ...getCopyFromLang(passportDetails), ...passport }}
          documents={passportList?.user?.profile?.documentation}
          error={passportError}
          loading={passportLoading}
          openModal={() => onClickToOpen(passportDetails.title)}
        />
        <DocumentWrapper
          copy={{ ...getCopyFromLang(visaDetails), ...visa }}
          documents={visaList?.user?.profile?.visas}
          error={visaError}
          loading={visaLoading}
          openModal={() => onClickToOpen(visaDetails.title)}
        />
        <DocumentWrapper
          copy={{ ...getCopyFromLang(citizenshipCard), ...citizenCard }}
          documents={citizenCardList?.user?.profile?.documentation}
          error={citizenCardError}
          loading={citizenCardLoading}
          openModal={() => onClickToOpen(citizenshipCard.title)}
        />
        <StyledDivider />
        <DocumentWrapper
          copy={{ ...getCopyFromLang(flightLoyaltyDetails), ...flight }}
          documents={flightList?.user?.profile?.preferences?.loyaltyPrograms}
          error={flightError}
          loading={flightLoading}
          openModal={() => onClickToOpen(flightLoyaltyDetails.title)}
        />
        <DocumentWrapper
          copy={{ ...getCopyFromLang(hotelLoyaltyDetails), ...hotel }}
          documents={hotelList?.user?.profile?.preferences?.loyaltyPrograms}
          error={hotelError}
          loading={hotelLoading}
          openModal={() => onClickToOpen(hotelLoyaltyDetails.title)}
        />
        <DocumentWrapper
          copy={{ ...getCopyFromLang(paymentCards), ...payment }}
          documents={paymentCardList?.user?.cards?.cards}
          error={paymentCardError}
          loading={paymentCardLoading}
          openModal={() => onClickToOpen(paymentCards.title)}
        />
      </GreyWrapper>

      {/* We get each formComponent from the formName object key
          FormName has to be Capitalised for React to understand
          it needs to render this as a component
      */}
      {Object.keys(mappedFormComponents).map((formName) => {
        const { FormName, icon, saveSubText } = mappedFormComponents[formName];
        return (
          <EProfileModal
            key={formName}
            title={formName}
            icon={icon}
            open={open && modalType === formName}
            onClose={onClickToClose}
            saveSubText={saveSubText}>
            <FormName
              readOnly={false}
              confirmButton={false}
              isCompanyAdmin={isCompanyAdmin}
              readOnlyUserText={general.noEditingRightsText}
            />
          </EProfileModal>
        );
      })}
    </>
  );
};
