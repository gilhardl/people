import { createFeatureSelector } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import { ROUTER_FEATURE_KEY, RouterPartialState } from './router.reducer';

// Lookup the 'Router' feature state managed by NgRx
export const getRouterState = createFeatureSelector<
  RouterPartialState,
  fromRouter.RouterReducerState<any>
>(ROUTER_FEATURE_KEY);

export const {
  selectCurrentRoute, // select the current route snapshot
  selectQueryParams, // select the current route query params
  selectRouteParams, // select the current route params
  selectRouteData, // select the current route data
  selectUrl // select the current url
} = fromRouter.getSelectors(getRouterState);
