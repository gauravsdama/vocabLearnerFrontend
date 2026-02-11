import React from "react";
import AppShell from "./AppShell";
import Button from "./Button";
import Card from "./Card";
import { logError } from "../utils/logger";

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    logError("WEB_UI_ERROR_BOUNDARY", "UI render error", {
      error: error instanceof Error ? error.message : String(error),
      component_stack: info.componentStack,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <AppShell centered maxWidth="narrow">
          <Card className="loading-card">
            <span className="ds-label">Something went wrong</span>
            <h1 className="ds-h2">We hit a snag.</h1>
            <p className="ds-body muted">Refresh the page to try again.</p>
            <div className="actions">
              <Button onClick={this.handleReload} size="lg">
                Reload
              </Button>
            </div>
          </Card>
        </AppShell>
      );
    }

    return this.props.children;
  }
}
