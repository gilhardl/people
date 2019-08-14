import { Injectable } from '@angular/core';
import { createEffect, Actions } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { RouterPartialState } from './router.reducer';
import * as RouterActions from './router.actions';

@Injectable()
export class RouterEffects {
  loadRouter$ = createEffect(() =>
    this.dataPersistence.fetch(RouterActions.loadRouter, {
      run: (
        action: ReturnType<typeof RouterActions.loadRouter>,
        state: RouterPartialState
      ) => {
        // Your custom service 'load' logic goes here. For now just return a success action...
        return RouterActions.loadRouterSuccess({ router: [] });
      },

      onError: (action: ReturnType<typeof RouterActions.loadRouter>, error) => {
        console.error('Error', error);
        return RouterActions.loadRouterFailure({ error });
      }
    })
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<RouterPartialState>
  ) {}
}
