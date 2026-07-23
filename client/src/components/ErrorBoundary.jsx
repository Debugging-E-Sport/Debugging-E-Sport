import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-arena-panel border border-red-500/30 rounded-xl p-6 text-center shadow-[0_0_30px_rgba(248,81,73,0.15)]">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-bug text-2xl text-red-400"></i>
          </div>
          <h2 className="font-mono text-lg font-bold text-white mb-2">Something went wrong</h2>
          <p className="font-mono text-sm text-arena-muted mb-4">
            An unexpected error occurred in this component.
          </p>
          {this.state.error && (
            <details className="font-mono text-xs text-red-400/80 bg-red-500/5 border border-red-500/20 rounded-lg p-3 mb-4 text-left">
              <summary className="cursor-pointer hover:text-red-300">Error details</summary>
              <pre className="mt-2 whitespace-pre-wrap overflow-x-auto">
                {this.state.error.toString()}
                {this.state.errorInfo && '\n\n' + this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button
            onClick={this.handleReset}
            className="font-mono text-sm text-white bg-arena-purple/20 border border-arena-purple/30 rounded-lg px-6 py-2.5 hover:bg-arena-purple/30 transition-all cursor-pointer"
          >
            <i className="fa-solid fa-rotate-right mr-2"></i>Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
