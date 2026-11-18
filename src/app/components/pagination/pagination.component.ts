import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    <div class="pagination-bar">
      <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
      <div class="controls">
        <button
          type="button"
          class="btn"
          [disabled]="currentPage <= 1"
          (click)="pageChange.emit(currentPage - 1)"
        >
          Previous
        </button>
        <button
          type="button"
          class="btn"
          [disabled]="currentPage >= totalPages"
          (click)="pageChange.emit(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  `,
  styles: [`
    .pagination-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 16px;
      font-size: 14px;
      color: #475569;
    }
    .controls {
      display: flex;
      gap: 8px;
    }
    .btn {
      padding: 6px 14px;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #fff;
      color: #0f172a;
      cursor: pointer;
    }
    .btn:hover:not(:disabled) {
      background: #f8fafc;
    }
    .btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  `],
})
export class PaginationComponent {
  @Input({ required: true }) currentPage = 1;
  @Input({ required: true }) totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();
}