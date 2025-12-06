import { Component } from "react";
import { ErrorHandler } from "./ErrorHandler";
import type {
  ErrorBoundaryProps,
  ErrorBoundaryState,
} from "../types";

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    console.error("Caught error in ErrorBoundary:", error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    const {
      additionalSlices,
      relevantCode,
      sliceName,
    } = this.props;

    if (hasError) {
      return (
        <ErrorHandler
          error={error}
          additionalSlices={additionalSlices}
          relevantCode={relevantCode}
          sliceName={sliceName}
        />
      );
    }

    return this.props.children;
  }
}
