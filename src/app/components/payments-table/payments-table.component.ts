import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Payment } from '../../payments.service';
import { formatDate, formatMethod, formatMoney } from '../../formatters';

@Component({
  selector: 'app-payments-table',
  standalone: true,
  template: `
    <div class="table-wrapper">
      <table class="payments-table">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Customer</th>
            <th class="align-right">Amount</th>
            <th>Status</th>
            <th>Method</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          @for (payment of payments; track payment.id) {
            <tr
              tabindex="0"
              class="clickable-row"
              (click)="selectPayment.emit(payment)"
              (keydown.enter)="selectPayment.emit(payment)"
            >
              <td class="mono">{{ payment.reference }}</td>
              <td>{{ payment.customerName }}</td>
              <td class="align-right mono">
                {{ formatMoney(payment.amount, payment.currency) }}
              </td>
              <td>
                <span class="status-badge" [class]="'status-' + payment.status">
                  {{ payment.status }}
                </span>
              </td>
              <td>{{ formatMethod(payment.method) }}</td>
              <td>{{ formatDate(payment.createdAt) }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-wrapper {
      overflow-x: auto;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #fff;
    }
    .payments-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 14px;
    }
    th,
    td {
      padding: 12px 16px;
      border-bottom: 1px solid #e2e8f0;
    }
    th {
      background: #f8fafc;
      font-weight: 600;
      color: #475569;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    tbody tr:last-child td {
      border-bottom: none;
    }
    .clickable-row {
      cursor: pointer;
      transition: background-color 0.12s ease;
    }
    .clickable-row:hover,
    .clickable-row:focus {
      background-color: #f1f5f9;
      outline: none;
    }
    .align-right {
      text-align: right;
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
export class PaymentsTableComponent {
  @Input({ required: true }) payments: Payment[] = [];
  @Output() selectPayment = new EventEmitter<Payment>();

  protected readonly formatMoney = formatMoney;
  protected readonly formatDate = formatDate;
  protected readonly formatMethod = formatMethod;
}