import { Button } from './ui/button';
import { Icon } from './ui/icon';

/** Estado de erro genérico com botão de tentar de novo. */
export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-surface px-6 py-16 text-center"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-danger/15 text-danger">
        <Icon name="cloud_off" size={22} />
      </span>
      <p className="text-headline">Não foi possível carregar</p>
      <p className="max-w-sm text-callout text-text-secondary">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-2">
          Tentar novamente
        </Button>
      )}
    </div>
  );
}