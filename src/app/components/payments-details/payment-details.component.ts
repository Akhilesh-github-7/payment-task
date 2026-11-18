import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Payment } from '../../payments.service';
import { formatDate, formatMethod, formatMoney } from '../../formatters';

@Component({
  selector: 'app-payment-details',
  standalone: true,
  template: `
    @if (payment) {
      <div class="backdrop" (click)="close.emit()"></div>
      <aside
        class="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div class="drawer-header">
          <h2 id="drawer-title">{{ payment.reference }}</h2>
          <button
            type="button"
            class="close-btn"
            aria-label="Close details"
            (click)="close.emit()"
          >
            ✕
          </button>
        </div>

        <dl class="details-list">
          <div class="detail-row">
            <dt>Status</dt>
            <dd>
              <span class="status-badge" [class]="'status-' + payment.status">
                {{ payment.status }}
              </span>
            </dd>
          </div>

          <div class="detail-row">
            <dt>Customer</dt>
            <dd>{{ payment.customerName }}</dd>
          </div>

          <div class="detail-row">
            <dt>Customer Email</dt>
            <dd>{{ payment.customerEmail }}</dd>
          </div>

          <div class="detail-row">
            <dt>Description</dt>
            <dd>{{ payment.description }}</dd>
          </div>

          <div class="detail-row">
            <dt>Method</dt>
            <dd>{{ formatMethod(payment.method) }}</dd>
          </div>

          <div class="detail-row">
            <dt>Created</dt>
            <dd>{{ formatDate(payment.createdAt) }}</dd>
          </div>

          <hr class="divider" />

          <div class="detail-row">
            <dt>Amount</dt>
            <dd class="mono">{{ formatMoney(payment.amount, payment.currency) }}</dd>
          </div>

          <div class="detail-row">
            <dt>Fee</dt>
            <dd class="mono">{{ formatMoney(payment.fee, payment.currency) }}</dd>
          </div>

          <div class="detail-row net-row">
            <dt>Net Amount</dt>
            <dd class="mono">
              {{ formatMoney(payment.amount - payment.fee, payment.currency) }}
            </dd>
          </div>
        </dl>
      </aside>
    }
  `,
  styles: [`
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.4);
      z-index: 40;
    }
    .drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      max-width: 400px;
      background: #fff;
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
      z-index: 50;
      padding: 24px;
      overflow-y: auto;
      box-sizing: border-box;
    }
    .drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }
    .drawer-header h2 {
      margin: 0;
      font-size: 18px;
      color: #0f172a;
    }
    .close-btn {
      background: transparent;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      width: 32px;
      height: 32px;
      cursor: pointer;
      font-size: 14px;
      color: #475569;
    }
    .close-btn:hover {
      background: #f1f5f9;
    }
    .details-list {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 16px;
      font-size: 14px;
    }
    dt {
      color: #64748b;
      font-weight: 500;
    }
    dd {
      margin: 0;
      color: #0f172a;
      font-weight: 500;
      text-align: right;
    }
    .divider {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 4px 0;
    }
    .net-row dt,
    .net-row dd {
      font-weight: 700;
      font-size: 15px;
    }
    .mono {
      font-variant-numeric: tabular-nums;
    }
    .status-badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;
    }
    .status-completed {
      background-color: #dcfce7;
      color: #166534;
    }
    .status-pending {
      background-color: #fef3c7;
      color: #92400e;
    }
    .status-failed {
      background-color: #fee2e2;
      color: #991b1b;
    }
    .status-refunded {
      background-color: #f1f5f9;
      color: #334155;
    }
  `],
})
export class PaymentDetailsComponent {
  @Input({ required: true }) payment: Payment | null = null;
  @Output() close = new EventEmitter<void>();

  protected readonly formatMoney = formatMoney;
  protected readonly formatDate = formatDate;
  protected readonly formatMethod = formatMethod;

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.payment) {
      this.close.emit();
    }
  }
}