import Button from './Button';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-grey-50 px-6 py-12">
      <div className="w-full max-w-2xl rounded-2xl border border-grey-100 bg-grey-0 p-8 text-center shadow-sm sm:p-12">
        <div className="mb-6 text-6xl">🧐</div>

        <h1 className="mb-3 text-3xl font-bold tracking-tight text-grey-800 sm:text-4xl">
          Something went wrong
        </h1>

        <p className="mx-auto mb-8 max-w-lg font-sono text-base leading-7 text-grey-500">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>

        <Button onClick={resetErrorBoundary}>Try again</Button>
      </div>
    </main>
  );
}

export default ErrorFallback;
