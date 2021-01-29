import React from 'react';
import { DateTime } from 'luxon';
import { FlagNameValues } from 'semantic-ui-react';

import { useMutation } from '@apollo/client';
import { config, assets, DATE_TIME_FORMAT } from 'components/eprofile/consts';
import { PaymentCardType } from 'components/travelBookings/common/CardDropdown';

import { capitalise } from 'components/eprofile/utils';
import {
  isDocument,
  isLoyalty,
} from 'components/eprofile/DocumentWrapper/utils';
import {
  DELETE_PASSPORT_CITIZENSHIP_CARD,
  DELETE_VISA_CARD,
  DELETE_LOYALTY_CARD,
  DELETE_PAYMENT_CARD,
} from 'components/eprofile/DocumentWrapper/queries';

import { BoldSpanText } from '../../../common/styles';

import { DocumentItemProps } from './types';
import {
  StyledItemWrapper,
  StyledItemHeader,
  StyledItemContent,
  StyledFlag,
  StyledIcon,
  IconsWrapper,
  ItemInnerWrapper,
} from './styles';

import { secondLineData, formatPaymentCardType } from './utils';

const { payment, visa } = config;
const { deleteIcon, editIcon } = assets;

const DocumentItem: React.FC<DocumentItemProps> = ({
  rowDetails: { colorScheme, documentName, type },
  documentDetails,
  cardNumber,
  removeDeletedDocument,
}) => {
  const { supplier, country, id, expiry, citizenship, card } = documentDetails;

  /** Mutations for deletion */
  const [deletePassportCitizenship] = useMutation(
    DELETE_PASSPORT_CITIZENSHIP_CARD
  );
  const [deleteVisaCard] = useMutation(DELETE_VISA_CARD);
  const [deleteLoyaltyCard] = useMutation(DELETE_LOYALTY_CARD);
  const [deletePaymentCard] = useMutation(DELETE_PAYMENT_CARD);

  /** Function to be called on click of delete icon to call relevant delete mutation  */
  const deleteCard = () => {
    if (isDocument(documentName))
      deletePassportCitizenship({ variables: { id, docType: type } });
    if (isLoyalty(documentName))
      deleteLoyaltyCard({
        variables: { input: { id, supplier: supplier?.value, type } },
      });
    if (documentName === visa.documentName) {
      deleteVisaCard({ variables: { id } });
    }
    if (documentName === payment.documentName) {
      deletePaymentCard({ variables: { id: card?.id } });
      return card && removeDeletedDocument(card.id, true);
    }
    removeDeletedDocument(id);
  };

  /** Variable to determine the text relating to membership or card numbers */
  let numberType = `${documentName}`;
  if (documentName === 'hotel' || documentName === 'flight program') {
    numberType = 'Membership';
  }

  const title = country || citizenship;

  return (
    <StyledItemWrapper
      color={colorScheme}
      data-testid={`document-card-${cardNumber + 1}`}>
      <ItemInnerWrapper>
        <StyledItemHeader as="h3">
          {supplier && supplier.formatted}
          {title && (
            <>
              <StyledFlag name={title?.value.toLowerCase() as FlagNameValues} />{' '}
              {title?.formatted}
            </>
          )}
          {card && formatPaymentCardType(card.type as PaymentCardType)}
        </StyledItemHeader>
        <div>
          <StyledItemContent>
            {card ? (
              <>
                <BoldSpanText>Card type</BoldSpanText>: {capitalise(card.brand)}
              </>
            ) : (
              <>
                <BoldSpanText>
                  {`${capitalise(numberType)} number `}
                </BoldSpanText>
                : {id}
              </>
            )}
          </StyledItemContent>
          <StyledItemContent>
            <BoldSpanText>
              {secondLineData(documentName, documentDetails).key}
            </BoldSpanText>
            : {secondLineData(documentName, documentDetails).value}
          </StyledItemContent>
          <StyledItemContent>
            {expiry && (
              <>
                <BoldSpanText>Date of expiry</BoldSpanText>:{' '}
                {DateTime.fromISO(expiry).toFormat(DATE_TIME_FORMAT)}
              </>
            )}
            {card?.expiry && (
              <>
                <BoldSpanText>Date of expiry</BoldSpanText>: {card.expiry}
              </>
            )}
          </StyledItemContent>
        </div>
      </ItemInnerWrapper>
      <IconsWrapper>
        {documentName !== payment.documentName ? (
          <StyledIcon src={editIcon} />
        ) : (
          <div />
        )}
        <StyledIcon
          data-testid="delete-button"
          onClick={deleteCard}
          src={deleteIcon}
        />
      </IconsWrapper>
    </StyledItemWrapper>
  );
};

export default DocumentItem;
