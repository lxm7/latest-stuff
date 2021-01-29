import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import EProfileModal from '.';
import { EProfileModalProps } from './types';

const onClose = jest.fn();

/** Default props for the test scenario */
const defaultProps = {
  title: 'Default Modal',
  icon: '/images/businessInformation.svg',
  onClose,
  children: <div>Child</div>,
  open: true,
  saveSubText: true,
};

const renderComponent = (props: EProfileModalProps) =>
  render(<EProfileModal {...props} />);

describe('<EProfileModal />', () => {
  it('Should render default modal without error', () => {
    const { getByTestId } = renderComponent(defaultProps);
    expect(getByTestId('eprofile-modal')).toBeInTheDocument();
  });

  it('Should render a modal with all the props passed in - i.e. saveSubtext', async () => {
    const { getByTestId } = renderComponent(defaultProps);
    await act(async () => {
      await waitFor(() => getByTestId('modal-save-sub-text'));
    });

    expect(getByTestId('modal-save-sub-text')).toBeInTheDocument();
  });
});
