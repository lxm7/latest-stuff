import { Progress } from 'semantic-ui-react';
import styled from 'styled-components';

export const ProgressWrapper = styled.div`
  width: 70%;
  margin-bottom: 0;
`;

export const StyledProgress = styled(Progress)`
  &&& {
    border-radius: 22px;
    height: 100%; // needed to fix bug in semantic Progress
    margin: 0;
    overflow: visible;
    font-size: 17px;
  }
  &&& > .bar {
    background-image: linear-gradient(
      91deg,
      rgb(244, 55, 109) 4%,
      rgb(91, 89, 225) 93%
    );
    border-radius: 22px;
    > .progress {
      background: none;
      color: white;
    }
  }
`;
