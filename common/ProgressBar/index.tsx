import React, { useState, useEffect } from 'react';
import { ProgressWrapper, StyledProgress } from './styles';
import { ProgressBarProps } from './types';

const ProgressBar: React.FC<ProgressBarProps> = ({
  profilePic,
  passport,
  paymentCard,
  contactInfo,
  emergencyContactInfo,
}) => {
  const [percent, setPercent] = useState(0);
  const [message, setMessage] = useState('');

  /** Updates state with new percentage and message when there are changes to props */
  useEffect(() => {
    let percentageComplete = 0;
    let nextStepMessage = '';

    if (profilePic) percentageComplete += 20;
    else nextStepMessage = 'Add a profile picture';

    if (paymentCard) percentageComplete += 20;
    else nextStepMessage = 'Add a payment card';

    if (passport) percentageComplete += 20;
    else nextStepMessage = 'Add a passport';

    if (emergencyContactInfo) percentageComplete += 20;
    else nextStepMessage = 'Add emergency contact information';

    if (contactInfo) percentageComplete += 20;
    else nextStepMessage = 'Add your contact information';

    setPercent(percentageComplete);
    setMessage(nextStepMessage);
  }, [profilePic, passport, paymentCard, contactInfo, emergencyContactInfo]);

  return (
    <>
      <ProgressWrapper data-testid="progress-bar">
        <StyledProgress
          percent={percent}
          progress
          label={`Next step: ${message}`}
        />
      </ProgressWrapper>
    </>
  );
};

export default ProgressBar;
