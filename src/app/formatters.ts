import { PaymentMethod } from './payments.service';

const METHOD_LABELS: Record<PaymentMethod, string> = {
  ach: 'ACH',
  wire: 'Wire',
  card: 'Card',
  check: 'Check',
};

export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoDate));
}

export function formatMethod(method: PaymentMethod): string {
  return METHOD_LABELS[method];
}