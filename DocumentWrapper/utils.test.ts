import { RefObject } from 'react';
import {
  dragReducer,
  isNotAtLimit,
  isDocument,
  isLoyalty,
  valueOrNone,
} from './utils';

/**  We can interact with the 'real' useRef for ease by mocking its library
 * (React) and spread the rest of the useRef probs too. Now we
 * can access and change the pieces we're interested in
 */
jest.mock('react', () => {
  const originReact = jest.requireActual('react');
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: {
      ...originReact.useRef,
      mUseRef,
    },
  };
});

/** Make the properties of the ref we use dynamic */
const mRef = (offsetLeft = 300, scrollLeft = 100) => ({
  current: {
    offsetLeft,
    scrollLeft,
  },
});

/** Make the state we use dynamic too as we sequentially will
 * feed results from the last
 */
const state = (startX = 0, scrollLeft = 0, isDown = false) => ({
  isDown,
  startX,
  scrollLeft,
});

const listOfDocs3 = [{ id: '1234' }, { id: '123' }, { id: '12' }];

describe('utils', () => {
  describe('dragReducer', () => {
    it('outputs the state expected when sequentially calling the reducer ', () => {
      const element1 = mRef();
      const state1 = state();
      const result1 = dragReducer(state1, {
        type: 'mousedown',
        pageX: 420,
        element: element1 as RefObject<HTMLDivElement>,
      });

      expect(result1).toStrictEqual({
        isDown: true,
        scrollLeft: 100,
        startX: 120,
      });

      // Follow on from the above
      const element2 = mRef(100, result1.scrollLeft);
      const state2 = state(result1.startX, 300, true);
      const result2 = dragReducer(state2, {
        type: 'mousemove',
        pageX: state2.startX,
        element: element2 as RefObject<HTMLDivElement>,
      });

      expect(result2).toStrictEqual({
        isDown: true,
        scrollLeft: 300,
        startX: 120,
      });

      // div element stays put once user has entered mouseup state
      const element3 = mRef(100, result2.scrollLeft);
      const state3 = state(result2.startX, 300, false);
      const result3 = dragReducer(state2, {
        type: 'mouseup',
        pageX: state3.startX,
        element: element3 as RefObject<HTMLDivElement>,
      });

      expect(result3).toStrictEqual({
        isDown: false,
        scrollLeft: 300,
        startX: 120,
      });

      // default switch case returns state as it was last
      const element4 = mRef(100, result3.scrollLeft);
      const state4 = state(result3.startX, 300, false);
      const result4 = dragReducer(state3, {
        type: 'unrecognised',
        pageX: state4.startX,
        element: element4 as RefObject<HTMLDivElement>,
      });

      expect(result4).toStrictEqual({
        isDown: false,
        scrollLeft: 300,
        startX: 120,
      });
    });
  });

  describe('isNotAtLimit', () => {
    it('returns true or false accordingly', () => {
      const limitSet = 2;
      const result1 = isNotAtLimit(listOfDocs3, limitSet);
      const result2 = isNotAtLimit([], limitSet);

      expect(result1).toBe(false);
      expect(result2).toBe(true);
    });
  });
});

describe('isDocument', () => {
  it('should return true if the document name passed in is passport or citizenship card', () => {
    expect(isDocument('passport')).toBe(true);
    expect(isDocument('citizenship card')).toBe(true);
  });
  it('should return false if the document name passed in is not passport or citizenship card', () => {
    expect(isDocument('hotel')).toBe(false);
  });
});

describe('isLoyalty', () => {
  it('should return true if document name passed in is a loyalty program', () => {
    expect(isLoyalty('hotel')).toBe(true);
    expect(isLoyalty('flight program')).toBe(true);
    expect(isLoyalty('car rental program')).toBe(true);
  });
  it("should return false if document name passed in isn't a loyalty program", () => {
    expect(isLoyalty('passport')).toBe(false);
  });
});

describe('valueOrNone', () => {
  it('should return a dash if the value passed in is undefined', () => {
    expect(valueOrNone(undefined)).toBe('-');
  });
  it('should return a passed value if it is not undefined', () => {
    expect(valueOrNone(45)).toBe(45);
    expect(valueOrNone('hello')).toBe('hello');
  });
});
