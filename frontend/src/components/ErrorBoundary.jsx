import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log error to monitoring service if available
    console.error('Unhandled React Error Boundary caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-center sm:px-6 lg:px-8'>
          <div className='flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5 mb-6'>
            <AlertTriangle className='h-10 w-10' aria-hidden='true' />
          </div>

          <span className='text-sm font-semibold tracking-wider uppercase text-destructive mb-2'>
            Application Error
          </span>
          <h1 className='text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl'>
            Something went wrong
          </h1>
          <p className='mt-4 max-w-md text-base text-muted-foreground'>
            We encountered an unexpected error while rendering this page. You can
            try reloading the page or returning to the homepage.
          </p>

          <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
            <button
              type='button'
              onClick={this.handleReload}
              className={cn(
                buttonVariants({ variant: 'default' }),
                'gap-2 rounded-xl cursor-pointer',
              )}
            >
              <RefreshCw className='h-4 w-4' />
              Reload Page
            </button>

            <button
              type='button'
              onClick={this.handleGoHome}
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'gap-2 rounded-xl cursor-pointer',
              )}
            >
              <Home className='h-4 w-4' />
              Return to Homepage
            </button>
          </div>

          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <div className='mt-8 w-full max-w-2xl text-left'>
              <details className='rounded-lg border border-border bg-muted/60 p-4 text-xs font-mono text-foreground'>
                <summary className='cursor-pointer font-semibold text-muted-foreground hover:text-foreground'>
                  Technical Error Details (Development Only)
                </summary>
                <div className='mt-3 whitespace-pre-wrap break-words text-destructive font-medium'>
                  {this.state.error.toString()}
                </div>
                {this.state.errorInfo?.componentStack && (
                  <pre className='mt-2 overflow-x-auto text-[11px] text-muted-foreground'>
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
