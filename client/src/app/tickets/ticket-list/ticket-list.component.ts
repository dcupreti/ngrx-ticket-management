import { Component } from '@angular/core';

import { Ticket } from '../../models/ticket';
import { FilterTicketsAction } from '../../state/tickets/tickets.actions';
import { TicketsQuery } from '../../state/tickets/tickets.reducers';
import { fadeInItem, fadeInList } from '../../utils/grid_animations';

import { Store } from '@ngrx/store';
import { BackendService } from '../../services/backend.service';
import { ApplicationState } from '../../state/app.state';

@Component({
  selector: 'ticket-list',
  styleUrls: ['./ticket-list.component.css'],
  animations: [fadeInList('listChange'), fadeInItem('listItem')],
  template: `      
    <mat-nav-list [@listChange]="numTickets">
      <h2 matSubheader> {{showAll ? 'All': 'Pending' }} Tickets </h2>
      <mat-slide-toggle 
          [checked]="showAll" 
          (change)="toggleShowAll($event.checked)">
        Show All
      </mat-slide-toggle>
      
      <ticket-search 
        [criteria]="searchCriteria" 
        (search)="updateSearchBy($event)">
      </ticket-search>
      
      <a *ngFor="let ticket of (tickets$ | async); trackBy: trackByFn"
         mat-list-item 
         @listItem
         title="{{ticket.title}}"
         [routerLink]="['/ticket', ticket.id]" >
        <img mat-list-avatar class="circle"
             [src]="ticket.imageURL" 
             alt="Picture of {{ticket.assigneeId}}" >  
        <p mat-line 
           [ngClass]="{'completed': ticket.completed}">
          {{ticket.title | truncate: 30}}
        </p>
      </a>
      
    </mat-nav-list>
    <p class="copyright">Copyright 2017, All Rights Reserved - Nrwl, Inc.</p>
   `
})
export class TicketListComponent {
  showAll = true;
  searchCriteria = '';
  numTickets = 0;
  tickets$ = this.store.select(TicketsQuery.getTickets);

  constructor(
    private store: Store<ApplicationState>,
    private backend: BackendService
  ) {
    this.tickets$.subscribe(tickets => {
      this.numTickets = tickets.length;
    });
  }

  trackByFn(ticket: Ticket) {
    return ticket.id;
  }
  toggleShowAll(showAll: boolean) {
    this.showAll = showAll;
    this.updateFilters();
  }
  updateSearchBy(criteria: string) {
    this.searchCriteria = criteria;
    this.updateFilters();
  }

  private updateFilters() {
    const filterBy = this.searchCriteria;
    this.store.dispatch(
      new FilterTicketsAction({
        filterBy,
        showAll: this.showAll
      })
    );
  }
}
