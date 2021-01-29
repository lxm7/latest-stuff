/**
 * Props for the e-profile modal
 */
export type EProfileModalProps = {
  /** The icon that will be displayed at the top of the modal */
  icon: string;
  /** The top title that will be displayed in the modal, i.e. Company Address */
  title: string;
  /** Whether the subtext underneath the save button needs to be displayed.
   * The subtext reads "By saving this document I confirm that all details are
   * exactly as they appear on the membership document". If true,
   * subtext will appear in the modal.
   */
  saveSubText?: string | boolean;
  /** Whether the Required (*) text will be displayed
   * underneath the modal title. If true, the text will be displayed.
   */
  requiredText?: boolean;
  /**
   * React children that will be accessible via props.
   */
  children: React.ReactNode;
  /**
   * onClose function passed to a modal allows the modal to be opened and closed
   * more than once.
   */
  onClose: () => void;
  /** indicates whether a modal is open */
  open: boolean;
};
