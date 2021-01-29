import styled from 'styled-components';

export const StyledErrorMessage = styled.p`
  font-size: 14px;
  color: #e81212;
  margin-top: 5px;
`;

/**
 * This styling is specific to react-select
 * We can pass in custom styles to the dropdown
 */
export const customDropdownStyles = {
  control: (provided: object) => ({
    ...provided,
    border: '1px solid #e81212',
  }),
};
