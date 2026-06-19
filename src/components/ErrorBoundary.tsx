import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Uncaught error in component tree:", error);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-slate-800 dark:text-slate-100">
          <h1 className="text-3xl font-bold">Something went wrong</h1>
          <button
            type="button"
            onClick={this.handleReset}
            className="text-lg font-semibold underline"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
