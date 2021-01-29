import React, {
  useRef,
  useReducer,
  MouseEvent,
  useEffect,
  useState,
} from 'react';

import { StyledTitle, StyledSmallGrey } from 'components/eprofile/styles';
import { Loader } from 'semantic-ui-react';
import {
  SectionBlurRight,
  IconWrap,
  Heading,
  HSNoScrollbar,
  HeadingWrapper,
  AddMoreText,
  AddMoreIcon,
  StyledLoader,
} from './styles';

import { DocumentWrapperProps, State, Document } from './types';
import { dragReducer, isNotAtLimit } from './utils';

import DocumentItem from '../common/DocumentItem';
import AddDocumentItem from '../common/DocumentItem/Add';

/** initial state for the draggable area
 * @type {State}
 */
const initialState: State = {
  isDown: false,
  startX: 0,
  scrollLeft: 0,
};

/**
 * DocumentWrapper component for housing travel docs and itineraries
 * @type {DocumentWrapperProps}
 */
const DocumentWrapper: React.FC<DocumentWrapperProps> = ({
  copy,
  documents,
  loading,
  error,
  openModal,
}) => {
  const slideArea = useRef<HTMLDivElement>(null);
  const [, dispatch] = useReducer(dragReducer, initialState);
  const [documentList, setDocumentList] = useState<Document[]>();

  /** The same event is passed to multipe mouseevents for the draggable
   * area and we handover these events to our dragReducer
   *
   * @param {MouseEvent} e
   */
  const handleEvent = (e: MouseEvent) => {
    // We need to persist the event when using mouseevents in React
    e.persist();
    const { type, pageX } = e;
    // We dispatch the reducer with some event attributes and
    // our Dom ref `slideArea`
    dispatch({ type, pageX, element: slideArea });
  };

  /** Sets the state of document list with documents data */
  useEffect(() => {
    setDocumentList(documents);
  }, [documents]);

  /** Takes ID from deleted document card and removes from document list */
  const removeDeletedDocument = (id: string, isPaymentCard = false) => {
    return isPaymentCard
      ? setDocumentList(
          documents.filter((document) => document.card?.id !== id)
        )
      : setDocumentList(documents.filter((document) => document.id !== id));
  };

  return (
    <SectionBlurRight>
      <HeadingWrapper>
        <Heading>
          <IconWrap>
            <img src={copy.icon} alt={copy.altText} />
          </IconWrap>
          <div>
            <StyledTitle as="h2">{copy.wrapperTitle}</StyledTitle>
            <StyledSmallGrey>{`(Add up to ${copy.limit})`}</StyledSmallGrey>
          </div>
        </Heading>
        <AddMoreText>
          <AddMoreIcon>
            <img src={copy.addIcon} />
          </AddMoreIcon>
          Slide to add more
        </AddMoreText>
      </HeadingWrapper>

      <HSNoScrollbar
        data-testid="horizontal-scroller"
        ref={slideArea}
        onMouseMove={handleEvent}
        onMouseDown={handleEvent}
        onMouseUp={handleEvent}
        onMouseLeave={handleEvent}>
        <>
          {loading && (
            <StyledLoader>
              <Loader active inline="centered" size="large" />
            </StyledLoader>
          )}
          {error && (
            <p>
              We&apos;re unable to fetch any {copy.wrapperTitle} at this moment
            </p>
          )}
          {documentList?.map((item, i) => (
            <DocumentItem
              rowDetails={copy}
              documentDetails={item}
              key={i}
              cardNumber={i + 1}
              removeDeletedDocument={removeDeletedDocument}
            />
          ))}
          {!loading && isNotAtLimit(documents, +copy.limit) && (
            <AddDocumentItem rowDetails={copy} key={0} openModal={openModal} />
          )}
        </>
      </HSNoScrollbar>
    </SectionBlurRight>
  );
};

export default DocumentWrapper;
