interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-4 text-sm font-medium text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200"
    >
      <span className="mr-2">⚠️</span>
      {message}
    </div>
  );
}
