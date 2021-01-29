import React from 'react';
import { render } from '@testing-library/react';
import DatePicker from '.';
import { DatePickerProps, FieldSetType } from './types';
import { fieldArgs } from './defaults';
import { getDays } from './utils';

/**
 * We need to mock react-hook-form and pass a React
 * component to Contoller so we can essentially stub it out
 * and render our actual Datepicker
 */
jest.mock('react-hook-form', () => ({
  Controller: () => <div />,
}));

/** Default props for the test scenario */
const defaultProps = {
  fields: { ...fieldArgs },
  type: 'dob' as FieldSetType,
  name: 'Date of Birth',
  register: jest.fn(),
  defaultValue: '',
};

/** Additional props for the test scenario */
const labelProps = {
  ...defaultProps,
  dropdownGroupLabel: 'Date of Birth',
  name: 'Date of Birth',
  register: jest.fn(),
  defaultValue: '',
};

const renderComponent = (props: DatePickerProps) =>
  render(<DatePicker {...props} />);

describe('<DatePicker />', () => {
  it('Should render default three-field date picker without error', () => {
    const { getByTestId } = renderComponent(
      (defaultProps as unknown) as DatePickerProps
    );
    expect(getByTestId('date-picker')).toBeInTheDocument();
  });

  it('Should render the default date picker with the group label of Date of Birth', () => {
    const { getByText } = renderComponent(
      (labelProps as unknown) as DatePickerProps
    );
    expect(getByText('Date of Birth')).toBeInTheDocument();
  });
});

describe('getDays utils function', () => {
  it('When passed 1 daysInMonth, returns an array with one object', () => {
    const input = getDays(1);
    const expected = [{ key: 1, value: '1', label: '1', field: 'day' }];
    expect(input).toEqual(expected);
  });

  it('When passed no daysInMonth, returns an array with 31 entries ', () => {
    const input = getDays();
    expect(input).toHaveLength(31);
  });
});
