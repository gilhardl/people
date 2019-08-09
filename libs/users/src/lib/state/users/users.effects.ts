import { Injectable } from '@angular/core';
import { createEffect, Actions } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { UsersPartialState } from './users.reducer';
import * as UsersActions from './users.actions';

@Injectable()
export class UsersEffects {
  loadUsers$ = createEffect(() =>
    this.dataPersistence.fetch(UsersActions.loadUsers, {
      run: (
        action: ReturnType<typeof UsersActions.loadUsers>,
        state: UsersPartialState
      ) => {
        // Your custom service 'load' logic goes here. For now just return a success action...
        return UsersActions.loadUsersSuccess({ users: [] });
      },

      onError: (action: ReturnType<typeof UsersActions.loadUsers>, error) => {
        console.error('Error', error);
        return UsersActions.loadUsersFailure({ error });
      }
    })
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<UsersPartialState>
  ) {}
}
