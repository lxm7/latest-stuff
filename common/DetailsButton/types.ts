import { SyntheticEvent } from 'react';

/**
 * represents the props for the common ModalButton used
 * across the eprofile screen
 */
export type ModalButtonProps = {
  /**
   * the icon for the ModalButton
   * @type {string}
   */
  icon?: string;
  /**
   * the label for the ModalButton
   * @type {string}
   */
  label: string;
  /**
   * the value of the text input
   * @type {boolean}
   */
  disabled?: boolean;
  /**
   * onChange function which will control how the component
   * using the text input handles the data entered
   * @type {Function}
   */
  onClick(event: SyntheticEvent, data: Record<string, unknown>): void;
  /**
   * the loading state bool
   * @type {boolean}
   */
  loading?: string;
  /**
   * className to be passed in
   * @type {string}
   */
  className?: string;
  /**
   * id to be passed in
   * @type {string}
   */
  id?: string;
};
