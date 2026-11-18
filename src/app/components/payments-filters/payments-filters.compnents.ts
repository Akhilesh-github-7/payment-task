import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentStatus } from '../../payments.service';

export type StatusFilter = 'all' | PaymentStatus;

@Component({
  selector: 'app-payments-filters',
  standalone: true,
  template: `
    <div class="filters-bar">
      <div class="field">
        <label for="search-input" class="sr-only">Search payments</label>
        <input
          id="search-input"
          type="text"
          class="input"
          placeholder="Search customer or reference..."
          [value]="searchTerm"
          (input)="onSearchInput($event)"
        />
      </div>

      <div class="field">
        <label for="status-select" class="sr-only">Filter by status</label>
        <select
          id="status-select"
          class="select"
          [value]="selectedStatus"
          (change)="onStatusChange($event)"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>
    </div>
  `,
  styles: [`
    .filters-bar {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .field {
      flex: 1 1 240px;
    }
    .field:last-child {
      flex: 0 0 180px;
    }
    .input,
    .select {
      width: 100%;
      padding: 8px 12px;
      font-size: 14px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #fff;
      color: #0f172a;
      box-sizing: border-box;
    }
    .input:focus,
    .select:focus {
      outline: 2px solid #2563eb;
      outline-offset: -1px;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
    }
  `],
})
export class PaymentsFiltersComponent {
  @Input({ required: true }) searchTerm = '';
  @Input({ required: true }) selectedStatus: StatusFilter = 'all';

  @Output() searchChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<StatusFilter>();

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }

  onStatusChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as StatusFilter;
    this.statusChange.emit(value);
  }
}