import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { Payment, PaymentsService } from './payments.service';
import {
  PaymentsFiltersComponent,
  StatusFilter,
} from './components/payments-filters/payments-filters.compnents';
import { PaymentsTableComponent } from './components/payments-table/payments-table.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { PaymentDetailsComponent } from './components/payments-details/payment-details.component';

interface FetchState {
  status: 'loading' | 'error' | 'success';
  payments: Payment[];
  errorMessage: string;
}

interface ViewModel {
  fetchStatus: 'loading' | 'error' | 'success';
  errorMessage: string;
  paginatedPayments: Payment[];
  totalFilteredCount: number;
  currentPage: number;
  totalPages: number;
  rawSearch: string;
  selectedStatus: StatusFilter;
  selectedPayment: Payment | null;
}

const PAGE_SIZE = 10;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AsyncPipe,
    PaymentsFiltersComponent,
    PaymentsTableComponent,
    PaginationComponent,
    PaymentDetailsComponent,
  ],
  template: `
    <main class="container">
      <header class="page-header">
        <h1>Payments</h1>
      </header>

      @if (vm$ | async; as vm) {
        <app-payments-filters
          [searchTerm]="vm.rawSearch"
          [selectedStatus]="vm.selectedStatus"
          (searchChange)="onSearchChange($event)"
          (statusChange)="onStatusChange($event)"
        />

        @switch (vm.fetchStatus) {
          @case ('loading') {
            <div class="state-box loading-state" role="status">
              <div class="spinner"></div>
              <p>Loading payments...</p>
            </div>
          }

          @case ('error') {
            <div class="state-box error-state" role="alert">
              <p class="state-title">Unable to load payments</p>
              <p class="state-subtitle">{{ vm.errorMessage }}</p>
              <button type="button" class="retry-btn" (click)="retryFetch()">
                Retry
              </button>
            </div>
          }

          @case ('success') {
            @if (vm.totalFilteredCount === 0) {
              <div class="state-box empty-state">
                <p class="state-title">No payments found</p>
                <p class="state-subtitle">
                  Try adjusting your search term or status filter.
                </p>
              </div>
            } @else {
              <app-payments-table
                [payments]="vm.paginatedPayments"
                (selectPayment)="onSelectPayment($event)"
              />

              <app-pagination
                [currentPage]="vm.currentPage"
                [totalPages]="vm.totalPages"
                (pageChange)="onPageChange($event)"
              />
            }
          }
        }

        <app-payment-details
          [payment]="vm.selectedPayment"
          (close)="onSelectPayment(null)"
        />
      }
    </main>
  `,
  styles: [`
    .container {
      max-width: 1040px;
      margin: 0 auto;
      padding: 32px 20px;
    }
    .page-header {
      margin-bottom: 24px;
    }
    .page-header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
    }
    .state-box {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 48px 24px;
      text-align: center;
      background: #fff;
    }
    .loading-state {
      color: #475569;
    }
    .spinner {
      width: 28px;
      height: 28px;
      border: 3px solid #e2e8f0;
      border-top-color: #2563eb;
      border-radius: 50%;
      margin: 0 auto 12px;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    .error-state {
      border-color: #fecaca;
      background: #fef2f2;
    }
    .error-state .state-title {
      color: #991b1b;
    }
    .empty-state {
      border-style: dashed;
      background: #f8fafc;
    }
    .state-title {
      margin: 0 0 6px;
      font-size: 16px;
      font-weight: 600;
      color: #0f172a;
    }
    .state-subtitle {
      margin: 0 0 16px;
      font-size: 14px;
      color: #64748b;
    }
    .retry-btn {
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      background: #dc2626;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .retry-btn:hover {
      background: #b91c1c;
    }
  `],
})
export class App {
  private paymentsService = inject(PaymentsService);

  private retryTrigger$ = new BehaviorSubject<void>(undefined);
  private rawSearch$ = new BehaviorSubject<string>('');
  private statusFilter$ = new BehaviorSubject<StatusFilter>('all');
  private currentPage$ = new BehaviorSubject<number>(1);
  private selectedPayment$ = new BehaviorSubject<Payment | null>(null);

  private debouncedSearch$ = this.rawSearch$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => this.currentPage$.next(1))
  );

  private fetchState$: Observable<FetchState> = this.retryTrigger$.pipe(
    switchMap(() =>
      this.paymentsService.getPayments().pipe(
        map((payments): FetchState => ({
          status: 'success',
          payments,
          errorMessage: '',
        })),
        catchError((err: unknown): Observable<FetchState> =>
          of({
            status: 'error',
            payments: [],
            errorMessage:
              err instanceof Error ? err.message : 'An unexpected error occurred.',
          })
        ),
        startWith<FetchState>({
          status: 'loading',
          payments: [],
          errorMessage: '',
        })
      )
    )
  );

  readonly vm$: Observable<ViewModel> = combineLatest([
    this.fetchState$,
    this.debouncedSearch$,
    this.rawSearch$,
    this.statusFilter$,
    this.currentPage$,
    this.selectedPayment$,
  ]).pipe(
    map(([fetchState, search, rawSearch, status, requestedPage, selectedPayment]) => {
      const normalizedSearch = search.trim().toLowerCase();

      const filtered = fetchState.payments.filter((payment) => {
        const matchesStatus = status === 'all' || payment.status === status;
        const matchesSearch =
          normalizedSearch === '' ||
          payment.customerName.toLowerCase().includes(normalizedSearch) ||
          payment.reference.toLowerCase().includes(normalizedSearch);

        return matchesStatus && matchesSearch;
      });

      const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      const safePage = Math.min(Math.max(1, requestedPage), totalPages);
      const startIndex = (safePage - 1) * PAGE_SIZE;
      const paginatedPayments = filtered.slice(startIndex, startIndex + PAGE_SIZE);

      return {
        fetchStatus: fetchState.status,
        errorMessage: fetchState.errorMessage,
        paginatedPayments,
        totalFilteredCount: filtered.length,
        currentPage: safePage,
        totalPages,
        rawSearch,
        selectedStatus: status,
        selectedPayment,
      };
    })
  );

  onSearchChange(value: string): void {
    this.rawSearch$.next(value);
  }

  onStatusChange(status: StatusFilter): void {
    this.statusFilter$.next(status);
    this.currentPage$.next(1);
  }

  onPageChange(page: number): void {
    this.currentPage$.next(page);
  }

  onSelectPayment(payment: Payment | null): void {
    this.selectedPayment$.next(payment);
  }

  retryFetch(): void {
    this.retryTrigger$.next();
  }
}