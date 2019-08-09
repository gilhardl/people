import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import * as fromUsers from './users.reducer';
import * as UsersSelectors from './users.selectors';
import * as UsersActions from './users.actions';

@Injectable()
export class UsersFacade {
  loaded$ = this.store.pipe(select(UsersSelectors.getUsersLoaded));
  allUsers$ = this.store.pipe(select(UsersSelectors.getAllUsers));
  selectedUsers$ = this.store.pipe(select(UsersSelectors.getSelected));

  constructor(private store: Store<fromUsers.UsersPartialState>) {}

  loadAll() {
    this.store.dispatch(UsersActions.loadUsers());
  }
}
