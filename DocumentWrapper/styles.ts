import styled from 'styled-components';

export const Heading = styled.div`
  display: flex;
  align-items: center;
`;

export const IconWrap = styled.div`
  width: auto;
  height: 65px;
  margin-right: 13px;
  img {
    max-height: 100%;
    width: auto;
  }
`;

export const Document = styled.div`
  border-radius: 19px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.32);
  background-color: #ddd;
  width: 400px;
  height: 175px;
  margin-right: 20px;
`;

export const SectionBlurRight = styled.div`
  margin: 30px 0 30px 60px;
`;

/*  https://uxdesign.cc/creating-horizontal-scrolling-containers-the-right-way-css-grid-c256f64fc585 */
export const HSContainer = styled.div`
  overflow-x: scroll;
  height: 185px;
  display: grid;
  grid-gap: 5%;
  grid-template-columns: repeat(20, calc(95% - 5%));
  grid-template-rows: minmax(175px, 1fr);
  margin: 30px 0 70px;
  &::after {
    display: none;
  }
  @media only screen and (min-width: 680px) {
    grid-template-columns: repeat(20, calc(50% - 8%));
    &::after {
      display: block;
      content: '';
      box-shadow: inset -60px 0px 0px 0px rgb(232 232 232 / 60%);
      position: absolute;
      right: 0;
      height: 175px;
      width: 60px;
    }
  }
  @media only screen and (min-width: 1200px) {
    grid-template-columns: repeat(20, calc(30% - 3%));
  }
  @media only screen and (min-width: 1600px) {
    grid-template-columns: repeat(20, calc(25% - 5.75%));
  }
  @media only screen and (min-width: 2000px) {
    grid-template-columns: repeat(20, calc(20% - 5%));
  }
`;

// We can hide the scrollbar for the HSContainer as we have made this area draggable
export const HSNoScrollbar = styled(HSContainer)`
  scrollbar-width: none;
  padding-bottom: 0;

  &::-webkit-scrollbar {
    display: none;
  }
  /* set height to match container when no visible scroll bar */
  &::after {
    height: 200px;
  }
`;

export const HSItem = styled.div`
  background: #fff;
  border-radius: 8px;
  &::last-of-type {
    margin-right: 60px;
  }
`;

export const AddMoreText = styled.div`
  font-weight: bold;
  font-size: 17px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const AddMoreIcon = styled.div`
  height: 28px;
  width: 28px;
  margin-bottom: 5px;
  img {
    max-width: 100%;
  }
`;

export const HeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 60px;
  align-items: flex-end;
`;

export const StyledLoader = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
