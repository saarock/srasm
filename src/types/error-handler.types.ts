/**
 * Props for the ErrorHandler component.
 */
export interface ErrorHandlerProps {
  /**
   * The error object to be displayed and analyzed.
   */
  error: unknown;


  relevantCode?: { fileName: string; code: string }[];
  sliceName?: string; // optional slice info
  additionalSlices?: any[]; // optional extra slices
}
