import { Spinner } from './ui/spinner';

export function FullScreenLoader() {
  return (
    <div className="flex min-h-dvh items-center justify-center text-text-secondary">
      <Spinner className="size-6" />
    </div>
  );
}