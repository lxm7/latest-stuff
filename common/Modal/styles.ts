import styled from 'styled-components';
import { Modal, Header, Button } from 'semantic-ui-react';

export const StyledModal = styled(Modal)`
  border-radius: 19px !important;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5) !important;
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  margin: 60px 6em;
`;

export const StyledTitle = styled(Header)`
  font-family: 'Helvetica';
  color: #2b2b2b;
  margin-top: 19px;
  margin-bottom: 6px;
  font-size: 30px;
  font-weight: 700 !important;
`;

export const StyledHeader = styled.div`
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StyledModalContent = styled(Modal.Content)`
  margin: 20px 0;
  width: 100%;
`;

export const StyledStoryChild = styled.div`
  color: rgba(43, 43, 43, 0.64);
  font-family: Helvetica;
  font-size: 20px;
`;

export const ModalIconWrapper = styled.div`
  height: 100px;
  input {
    height: 100%;
  }
`;

export const ModalIcon = styled.img`
  height: 100%;
`;

export const StyledButton = styled(Button)`
  &&&&& {
    background: #4c4cdc;
    color: #ffffff;
    font-family: 'Helvetica-Bold', sans-serif;
    font-size: 18px;
    min-height: 50px;
    border-radius: 25px;
    width: 272px;
    cursor: pointer;
    /* margin-top: 2em; */
    margin-right: 0;
  }
`;
