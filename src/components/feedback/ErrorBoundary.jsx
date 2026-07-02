import { Component } from 'react';

/**
 * Class component error boundary with friendly UI and reload button.
 * Catches render errors and displays a fallback UI.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-red" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#191A23] dark:text-white mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-500 dark:text-text-muted mb-6">
              An unexpected error occurred. Please try reloading the page.
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-2.5 bg-lime text-dark font-semibold text-sm rounded-xl hover:bg-lime-hover transition-all shadow-[4px_4px_0px_#000]"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
