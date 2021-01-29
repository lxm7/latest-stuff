import { RefObject } from 'react';
import {
  Document,
  State,
  DocumentName,
  Country,
} from 'components/eprofile/DocumentWrapper/types';
import { OptionFromServer } from 'components/common/types';

/** This reducer will fire each time a mouseevent is passed in from the
 * ArticlWrapper to create a horizontally draggable area. We split
 * out the event into {type, pageX} along with a ref to our {element}
 *
 * @param {State} state
 * @param { type: string, pageX: number, element: RefObject<HTMLDivElement> }
 * @returns {State}
 */
export const dragReducer = (
  state: State,
  {
    type,
    pageX,
    element,
  }: { type: string; pageX: number; element: RefObject<HTMLDivElement> }
) => {
  const sliderArea = element.current as HTMLDivElement;

  switch (type) {
    case 'mousedown':
      return {
        ...state,
        isDown: true,
        startX: pageX - sliderArea.offsetLeft,
        scrollLeft: sliderArea.scrollLeft,
      };
    case 'mouseleave':
    case 'mouseup':
      return { ...state, isDown: false };
    case 'mousemove':
      if (!state.isDown) return state;
      const x = pageX - sliderArea.offsetLeft;
      const walk = x - state.startX; // * 2 for faster scroll
      sliderArea.scrollLeft = state.scrollLeft - walk;
      return state;
    default:
      return state;
  }
};

/** We pass the length of document list and the preset limit for a given
 * slider row. if null, or empty list OR no of docs is less than limit return true
 *
 * @param {any} noOfDocuments
 * @param {number} limit
 * @returns {boolean}
 */
export const isNotAtLimit = (noOfDocuments: Document[], limit: number) =>
  !noOfDocuments || noOfDocuments.length === 0 || noOfDocuments.length < limit;

/** Checks if the name passed is a document for mutation */
export const isDocument = (documentName: DocumentName) =>
  documentName === 'passport' || documentName === 'citizenship card';

/** Checks is the name passed is a loyalty program for mutation */
export const isLoyalty = (documentName: DocumentName) =>
  documentName === 'hotel' ||
  documentName === 'flight program' ||
  documentName === 'car rental program';

/** Checks if value exists, if so returns value or returns a dash for user experience */
export const valueOrNone = (
  documentProperty: string | number | OptionFromServer | Country | undefined
) => (documentProperty !== undefined ? documentProperty : '-');
