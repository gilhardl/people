import * as fromRouter from '@ngrx/router-store';

export const ROUTER_FEATURE_KEY = 'router';

export interface RouterPartialState {
  readonly [ROUTER_FEATURE_KEY]: fromRouter.RouterReducerState<any>;
}
