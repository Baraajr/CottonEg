import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

import Button from './Button';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-surface px-6 py-10 text-center shadow-sm sm:px-12 sm:py-14">
        <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-background">
          <FiAlertTriangle size={28} className="text-muted-foreground" />
        </div>

        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Unexpected error
        </p>

        <h1 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl">
          Something went wrong
        </h1>

        <p className="mx-auto mt-4 max-w-md wrap-break-word text-sm leading-6 text-muted-foreground">
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>

        <div className="mt-8 flex justify-center">
          <Button onClick={resetErrorBoundary}>
            <span className="flex items-center gap-2">
              <FiRefreshCw size={15} />
              Try again
            </span>
          </Button>
        </div>

        <div className="mx-auto mt-10 h-px w-12 bg-border" />

        <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          CottonEg
        </p>
      </div>
    </main>
  );
}

export default ErrorFallback;
