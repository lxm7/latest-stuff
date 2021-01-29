import { Button } from 'semantic-ui-react';
import styled from 'styled-components';

export const StyledModalButton = styled(Button)`
  && {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 19px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.32);
    background-color: #ffffff;
    width: 100%;
    max-width: 350px;
    padding: 1.4em;
  }
`;

export const StyledImg = styled.img`
  height: 58px;
  width: auto;
  margin-bottom: 0.75em;
`;

export const StyledText = styled.div`
  height: 100%;
  font-weight: bold;
  font-size: 18px;
  line-height: 1.3em;
  font-family: Helvetica;
  color: #2b2b2b;
`;
