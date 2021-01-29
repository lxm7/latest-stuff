import React from 'react';

import { StyledModalButton, StyledImg, StyledText } from './styles';
import { ModalButtonProps } from './types';

/**
 * ModalButton component for Eprofile screen
 * @type {ButtonProps}
 */
const ModalButton: React.FC<ModalButtonProps> = ({
  icon,
  label,
  onClick,
  disabled,
  loading,
  id,
  className,
}) => (
  <StyledModalButton
    data-testid="modal-button"
    onClick={onClick}
    disabled={disabled}
    loading={loading}
    id={id}
    className={className}>
    {icon && <StyledImg src={icon} alt={label} />}
    <StyledText>{label}</StyledText>
  </StyledModalButton>
);

export default ModalButton;
