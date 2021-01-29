import React from 'react';
import { StyledRequiredText, SubText } from 'components/eprofile/styles';
import { requiredStar } from 'components/common/Consts';
import {
  StyledModal,
  FlexContainer,
  StyledTitle,
  StyledHeader,
  StyledModalContent,
  ModalIconWrapper,
  ModalIcon,
} from './styles';
import { EProfileModalProps } from './types';

/**
 * Common reusable modal component for the eProfile
 */
const EProfileModal = ({
  icon,
  title,
  saveSubText = false,
  requiredText = true,
  open = false,
  children,
  onClose,
}: EProfileModalProps): JSX.Element => {
  return (
    <StyledModal
      data-testid="eprofile-modal"
      centered
      size="small"
      onClose={onClose}
      closeIcon
      dimmer="inverted"
      open={open}>
      <FlexContainer>
        <StyledHeader>
          <ModalIconWrapper>
            <ModalIcon src={icon} alt={title} />
          </ModalIconWrapper>
          <StyledTitle as="h1">{title}</StyledTitle>
          {/* if requiredText bool is true, then display the required text. */}
          {requiredText && (
            <StyledRequiredText>{requiredStar} = Required</StyledRequiredText>
          )}
        </StyledHeader>
        <StyledModalContent>{children}</StyledModalContent>
        {saveSubText && (
          <SubText data-testid="modal-save-sub-text">{saveSubText}</SubText>
        )}
      </FlexContainer>
    </StyledModal>
  );
};

export default EProfileModal;
