import { Component, signal } from '@angular/core';
import { PaymentsComponent } from './payments/payments';


@Component({
  standalone: true,
  imports: [PaymentsComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('payments-task');
}
