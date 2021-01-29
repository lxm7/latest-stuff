import React from 'react';
import { StyledAddItemWrapper, StyledAddItemText } from '../styles';

import { AddDocumentItemProps } from '../types';

const plusIcon = '/images/addCard.svg';

const AddDocumentItem: React.FC<AddDocumentItemProps> = ({
  rowDetails: { documentName, colorScheme },
  openModal,
}) => {
  return (
    <StyledAddItemWrapper
      color={colorScheme}
      data-testid="plus-card"
      onClick={openModal}>
      <img src={plusIcon} alt={`Plus icon to add a new ${documentName}`} />
      <StyledAddItemText>Add {documentName}</StyledAddItemText>
    </StyledAddItemWrapper>
  );
};

export default AddDocumentItem;
