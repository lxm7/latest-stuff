import React from 'react';
import { render } from '@testing-library/react';
import ModalButton from '.';

const onClick = jest.fn();

const renderComponent = (icon: string) =>
  render(<ModalButton label="Company Address" onClick={onClick} icon={icon} />);

describe('<ModalButton />', () => {
  it('Should render without error and display ModalButton', () => {
    const { getByTestId } = renderComponent('');
    expect(getByTestId('modal-button')).toBeInTheDocument();
  });

  it('Should render an icon if supplied', () => {
    const { getByAltText } = renderComponent('icon');
    expect(getByAltText('Company Address')).toBeInTheDocument();
  });
});
