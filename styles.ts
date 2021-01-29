import styled from 'styled-components';
import { Image, Button, Header, Divider } from 'semantic-ui-react';

/**
 * Styled header banner
 */
export const StyledBanner = styled.div`
  width: 100%;
  height: 245px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  &::after {
    content: '';
    background-image: linear-gradient(97deg, #f4376d 4%, #5b59e1 93%),
      linear-gradient(to bottom, #979797, #979797);
    opacity: 0.4;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 0;
  }
`;

/**
 * Styled TapTrip logo
 */
export const StyledLogo = styled(Image)`
  width: 315px;
  height: 130px;
  object-fit: contain;
  mix-blend-mode: multiply;
  z-index: 1;
`;

/**
 * Styled Profile Pic
 */
export const StyledProfilePic = styled(Image)`
  position: absolute !important;
  top: -220px;
  max-width: 200px !important;
  height: 200px;
  border: 7px solid white;
`;

/**
 * Styled 'set up profile' button
 */
export const StyledButton = styled(Button)`
  width: 180px;
  height: 50px;
  font-weight: bold !important;
  border-radius: 37.5px !important;
  font-size: 18px !important;
  font-family: Helvetica, sans-serif !important;
`;

/**
 * Styled container for right-hand side of information section
 * containing numerous buttons
 */
export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  margin-left: 3% !important;
`;

/**
 * Section container comprising profile pic + name information
 */
export const Section = styled.section`
  margin: 30px 60px;
`;

/**
 * Section container comprising profile pic + name information
 */
export const FlexInlineSection = styled(Section)`
  margin: 30px 60px;
  display: flex !important;
  @media (max-width: 768px) {
    flex-wrap: wrap !important;
  }
`;

/**
 * Container for name, job title + location
 */
export const StyledNameInfo = styled.div`
  position: relative !important;
  text-align: center;
  margin-top: 100px !important;
  height: 100% !important;
  width: 240px !important;
  @media (max-width: 768px) {
    width: 100% !important;
  }
`;

/**
 * Styling for the person's name
 */
export const StyledTitle = styled(Header)`
  font-size: 30px;
  font-weight: bold;
`;

/**
 * Styling for the person's job title
 */
export const StyledSubTitle = styled.p`
  margin-top: 10px;
  color: rgba(43, 43, 43, 0.64);
  font-size: 18px;
`;

/**
 * Styling for the person's location
 */
export const StyledSmallGrey = styled.p`
  margin-top: 2px;
  color: rgba(43, 43, 43, 0.64);
  font-size: 14px;
`;

export const StyledRequiredText = styled.span`
  font-family: Helvetica;
  font-size: 20px;
  color: rgba(43, 43, 43, 0.64);
  font-weight: normal;
`;

/**
 * Grid containing the large buttons in the information section
 */
export const StyledGridWrapper = styled.div`
  margin: 30px 0 30px 30px;
  @media (max-width: 768px) {
    margin: 0;
  }
`;

export const StyledSubText = styled.p`
  margin: 20px 70px 0 70px !important;
  color: #4a4a4a;
  font-family: Helvetica;
  text-align: center;
`;

/**
 * Container for the two half-height buttons in the information section
 */
export const StackedButtons = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

/**
 * Grey background section
 */
export const GreyWrapper = styled.div`
  padding-top: 60px;
  padding-bottom: 60px;
  background-color: #e9e9e9;
  height: 100%;
`;

/**
 * Progress bar section container
 */
export const StyledProgressSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-bottom: 60px;
`;

/**
 * Robot image styling
 */
export const StyledRobot = styled(Image)`
  width: 120px;
  height: 90px;
  margin-left: 20px;
`;

/**
 * grey divider with appropriate left and right margins
 */
export const StyledDivider = styled(Divider)`
  margin: 0 7% 0 7% !important;
`;

export const StyledP = styled.p`
  margin: 0 0 10px !important;
`;

export const SubText = styled.p`
  max-width: 350px;
  margin: auto;
`;
