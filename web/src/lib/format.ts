/** Formatações de exibição. Funções puras para facilitar os testes. */

export const formatPlate = (plate: string) =>
  plate.toUpperCase().replace(/[^A-Z0-9]/g, '');

export function maskChassis(chassis: string) {
  if (chassis.length <= 7) return chassis;
  return `${chassis.slice(0, 3)}${'•'.repeat(7)}${chassis.slice(-4)}`;
}

export function initials(firstName: string, lastName = '') {
  const letters = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  return letters.toUpperCase() || '?';
}

export function formatShortDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
    .format(new Date(iso))
    .replace(/\./g, '')
    .replace(/ de /g, ' ');
}

export function formatRelativeDate(iso: string, now = new Date()) {
  const date = new Date(iso);
  const time = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);

  if (days === 0) return `Hoje, ${time}`;
  if (days === 1) return `Ontem, ${time}`;
  return formatShortDate(iso);
}

export function formatMonthYear(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
}

export function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}