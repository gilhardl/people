import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import { RouterPartialState } from './router.reducer';
import * as RouterSelectors from './router.selectors';

@Injectable()
export class RouterFacade {
  currentRoute$ = this.store.pipe(select(RouterSelectors.selectCurrentRoute));
  selectQueryParams$ = this.store.pipe(
    select(RouterSelectors.selectQueryParams)
  );
  selectRouteParams$ = this.store.pipe(
    select(RouterSelectors.selectRouteParams)
  );
  selectRouteData$ = this.store.pipe(select(RouterSelectors.selectRouteData));
  selectUrl$ = this.store.pipe(select(RouterSelectors.selectUrl));

  constructor(private store: Store<RouterPartialState>) {}
}
