import type { ReactNode } from "react";

/**
 * Props for the ErrorBoundary component.
 */
export interface ErrorBoundaryProps {
  /**
   * The child components to be rendered.
   */
  children: ReactNode;
  relevantCode?: { fileName: string; code: string }[];
  sliceName?: string; // optional slice info
  additionalSlices?: any[]; // optional extra slices
}

/**
 * State for the ErrorBoundary component.
 */
export interface ErrorBoundaryState {
  /**
   * Indicates whether an error has been caught.
   */
  hasError: boolean;

  /**
   * The error object that was caught.
   */
  error: unknown;
}
