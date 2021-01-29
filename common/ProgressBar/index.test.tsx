import React from 'react';
import { render } from '@testing-library/react';
import ProgressBar from '.';
import { ProgressBarProps } from './types';

const progressBarProps = {
  profilePic: true,
  passport: true,
  paymentCard: true,
  contactInfo: false,
  emergencyContactInfo: false,
};

const renderComponent = (props: ProgressBarProps) => {
  return render(<ProgressBar {...props} />);
};

describe('<ProgressBar />', () => {
  it('Should render without error', () => {
    const { getByTestId } = renderComponent(progressBarProps);
    expect(getByTestId('progress-bar')).toBeInTheDocument();
  });

  it('Should display percentage complete', () => {
    const { getByText } = renderComponent(progressBarProps);
    expect(getByText('60%')).toBeInTheDocument();
  });

  it('Should display messsage to indicate incomplete forms', () => {
    const { getByText } = renderComponent(progressBarProps);
    expect(
      getByText('Next step: Add your contact information')
    ).toBeInTheDocument();
  });
});
