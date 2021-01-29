import styled from 'styled-components';
import { Header, Flag, Image } from 'semantic-ui-react';

export const StyledItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 19px;
  background: ${(props) => props.color};
  height: 185px;
  padding: 10px 10px;
`;

export const StyledAddItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  border-radius: 19px;
  background: ${(props) => props.color};
  cursor: pointer;
  img {
    margin-bottom: 10px;
  }
`;

export const StyledAddItemText = styled.p`
  color: #fff;
  font-weight: bold;
  font-family: Helvetica, sans-serif;
  font-size: 18px;
`;

export const StyledItemHeader = styled(Header)`
  color: #fff;
  font-weight: bold;
  font-family: Helvetica;
  font-size: 21px;
  /* margin-bottom: 10px; */
`;

export const StyledItemContent = styled.p`
  color: rgba(255, 255, 255, 0.64);
  font-size: 18px;
  margin: 0;
`;

export const ItemInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding-left: 15px;
`;

export const StyledFlag = styled(Flag)`
  /* :before {
    height: 20px !important;
    width: 30px !important;
  } */
`;

export const StyledIcon = styled(Image)`
  height: 45px;
  width: 45px;

  :hover {
    cursor: pointer;
  }
`;

export const IconsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;
