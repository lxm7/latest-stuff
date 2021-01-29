import React from 'react';
import { render } from '@testing-library/react';
import AddDocumentItem from '.';
import { AddDocumentItemProps } from '../types';
import { DocumentName } from '../../../DocumentWrapper/types';

const RenderComponent = (props: AddDocumentItemProps) => {
  return render(<AddDocumentItem {...props} />);
};

const documentProps = {
  rowDetails: {
    icon: '/images/passport_eprofile.svg',
    altText: 'passport icon',
    wrapperTitle: 'Passport(s)',
    documentName: 'passport' as DocumentName,
    limit: '2',
    colorScheme: 'linear-gradient(117deg, #5b59e1 -20%, #f4376d 207%)',
    addIcon: 'addIcon.png',
  },
  openModal: () => undefined,
};

describe('<DocumentItem />', () => {
  it('Should render without error', () => {
    const { getByText } = RenderComponent(documentProps);
    expect(getByText('Add passport')).toBeInTheDocument();
  });
});
