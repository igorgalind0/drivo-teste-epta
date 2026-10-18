import { Icon } from './ui/icon';

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg bg-danger/12 px-3 py-2.5 text-callout text-danger"
    >
      <Icon name="error" size={18} className="mt-px" />
      <span>{message}</span>
    </div>
  );
}